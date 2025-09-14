"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  VRM,
  VRMLoaderPlugin,
  type VRMPose,
  type VRMHumanBoneName,
} from "@pixiv/three-vrm";
import {
  GLTFLoader,
  GLTFParser,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader";
import {
  idleBreath,
  blinking,
  lookAround,
  running, // ← マーカー
  type MotionFn,
} from "./motions";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

declare global {
  interface Window {
    setAvatarMotion: (motions: MotionFn[]) => void;
  }
}

// GLTF に VRM が入ることを明示する型
type GLTFWithVRM = GLTF & { userData: { vrm?: VRM } };

export default function Avatar() {
  const group = useRef<THREE.Group>(new THREE.Group());
  const vrmRef = useRef<VRM | null>(null);

  // 自作(Idle系)モーションの現在セット
  const currentMotion = useRef<MotionFn[]>([idleBreath, blinking, lookAround]);

  // ランニング(FBX)用の再生管理
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const runningClipRef = useRef<THREE.AnimationClip | null>(null);
  const runningActionRef = useRef<THREE.AnimationAction | null>(null);
  const wantRunRef = useRef(false); // 先押し対策
  const isRunningRef = useRef(false);

  // Mixamo -> VRM のボーン対応
  const boneMap: Record<string, VRMHumanBoneName> = {
    mixamorigHips: "hips",
    mixamorigSpine: "spine",
    mixamorigSpine1: "chest",
    mixamorigSpine2: "upperChest",
    mixamorigNeck: "neck",
    mixamorigHead: "head",

    mixamorigLeftShoulder: "leftShoulder",
    mixamorigLeftArm: "leftUpperArm",
    mixamorigLeftForeArm: "leftLowerArm",
    mixamorigLeftHand: "leftHand",

    mixamorigRightShoulder: "rightShoulder",
    mixamorigRightArm: "rightUpperArm",
    mixamorigRightForeArm: "rightLowerArm",
    mixamorigRightHand: "rightHand",

    mixamorigLeftUpLeg: "leftUpperLeg",
    mixamorigLeftLeg: "leftLowerLeg",
    mixamorigLeftFoot: "leftFoot",
    mixamorigLeftToeBase: "leftToes",

    mixamorigRightUpLeg: "rightUpperLeg",
    mixamorigRightLeg: "rightLowerLeg",
    mixamorigRightFoot: "rightFoot",
    mixamorigRightToeBase: "rightToes",
  };

  const ignorePattern = /(Thumb|Index|Middle|Ring|Pinky)/;

  // FBXのトラック名を VRM 実ボーンに置換
  // FBXのトラック名を VRM 実ボーンに置換（Hipsは position だけ無視）＋符号連続性修正
function remapClipBonesToVRM(
  clip: THREE.AnimationClip,
  vrm: VRM
): THREE.AnimationClip {
  const tracks: THREE.KeyframeTrack[] = [];

  const isFinger = (name: string) => /Thumb|Index|Middle|Ring|Pinky/.test(name);

  for (const orig of clip.tracks) {
    const name = orig.name;

    // Hips の移動は二重適用になるので捨てる（※回転は残す）
    if (name.startsWith("mixamorigHips.position")) continue;
    // if (name.startsWith("mixamorigHips.quaternion")) continue; // ← 残す！

    // 指とつま先は不安定になりやすいので外す（必要ならToeは戻してOK）
    if (isFinger(name)) continue;
    if (name.includes("Toe")) continue;

    let replaced = false;

    for (const mixamoKey in boneMap) {
      if (!Object.prototype.hasOwnProperty.call(boneMap, mixamoKey)) continue;
      if (!name.startsWith(mixamoKey)) continue;

      const vrmBone = boneMap[mixamoKey];
      const node = vrm.humanoid?.getNormalizedBoneNode(vrmBone);
      if (!node) break;

      const prop = name.substring(mixamoKey.length + 1); // ".quaternion" など
      const trackClone = orig.clone();
      trackClone.name = `${node.name}.${prop}`;

      // === クォータニオンの符号連続性（半球）を揃える ===
      if (trackClone instanceof THREE.QuaternionKeyframeTrack) {
        const v = trackClone.values;
        for (let i = 4; i < v.length; i += 4) {
          const px = v[i - 4], py = v[i - 3], pz = v[i - 2], pw = v[i - 1];
          const cx = v[i],     cy = v[i + 1], cz = v[i + 2], cw = v[i + 3];
          const dot = px * cx + py * cy + pz * cz + pw * cw;
          if (dot < 0) {
            v[i] = -cx; v[i + 1] = -cy; v[i + 2] = -cz; v[i + 3] = -cw;
          }
        }
      }

      tracks.push(trackClone);
      replaced = true;
      break;
    }

    if (!replaced) continue;
  }

  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}


  function startRunning() {
    const vrm = vrmRef.current;
    if (!vrm) return;

    if (!mixerRef.current) {
      mixerRef.current = new THREE.AnimationMixer(vrm.scene);
    }

    if (!runningClipRef.current) {
      // クリップ未準備：完了時に開始する
      wantRunRef.current = true;
      return;
    }

    // 既存アクション停止後に開始
    if (runningActionRef.current) {
      runningActionRef.current.stop();
      runningActionRef.current = null;
    }

    const action = mixerRef.current.clipAction(runningClipRef.current);
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.fadeIn(0.15).play();

    runningActionRef.current = action;
    isRunningRef.current = true;
  }

  function stopRunning() {
    if (runningActionRef.current) {
      runningActionRef.current.fadeOut(0.15);
      runningActionRef.current.stop();
      runningActionRef.current = null;
    }
    isRunningRef.current = false;
  }

  // ===== VRM 読み込み =====
  useEffect(() => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.register((parser: GLTFParser) => new VRMLoaderPlugin(parser));

    gltfLoader.load("/models/AvatarSample_M.vrm", (gltfRaw) => {
      const gltf = gltfRaw as GLTFWithVRM;
      const vrm = gltf.userData.vrm;
      if (!vrm) return; // 安全策

      // ---- 腕を下げるポーズを適用 ----
const eL = new THREE.Euler(0, 0, -Math.PI / 2);
const eR = new THREE.Euler(0, 0,  Math.PI / 2);
const qL = new THREE.Quaternion().setFromEuler(eL);
const qR = new THREE.Quaternion().setFromEuler(eR);

const armsDownPose: VRMPose = {
  leftUpperArm:  { rotation: [qL.x, qL.y, qL.z, qL.w] },
  rightUpperArm: { rotation: [qR.x, qR.y, qR.z, qR.w] },
};
vrm.humanoid?.setNormalizedPose(armsDownPose);


      vrm.scene.position.set(0, -1.4, 0);
      vrm.scene.scale.set(1.5, 1.5, 1.5);

      group.current.add(vrm.scene);
      vrmRef.current = vrm;

      // VRM が入ったあとに FBX 読み込み（リマップで VRM が必要）
      const fbxLoader = new FBXLoader();
      fbxLoader.load("/motions/running.fbx", (obj) => {
        if (obj.animations.length > 0 && vrmRef.current) {
          const raw = obj.animations[0];
          const remapped = remapClipBonesToVRM(raw, vrmRef.current);
          runningClipRef.current = remapped;

          // 先に RUN 要求が来ていた場合はここで開始
          if (wantRunRef.current) {
            startRunning();
            wantRunRef.current = false;
          }
        }
      });

      // デフォルトは Idle
      window.setAvatarMotion([idleBreath, blinking, lookAround]);
    });

    // グローバル切替：running（マーカー）を含むかで開始/停止
    window.setAvatarMotion = (motions: MotionFn[]) => {
      const willRun = motions.includes(running);
      const wasRunning = isRunningRef.current;

      // running は FBX 再生で扱うので、自作モーション配列からは除外
      currentMotion.current = motions.filter((fn) => fn !== running);

      if (willRun && !wasRunning) startRunning();
      if (!willRun && wasRunning) stopRunning();
    };

    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, []);

  // 毎フレーム更新
  useFrame((_, delta) => {
    const vrm = vrmRef.current;
    if (!vrm) return;

    // 自作モーション
    const t = performance.now() / 1000;
    currentMotion.current.forEach((fn) => fn(vrm, t));

    // ランニング（FBX）
    if (isRunningRef.current && mixerRef.current) {
      mixerRef.current.update(delta);
    }

    vrm.update(delta);
    vrm.expressionManager?.update();
  });

  return <primitive object={group.current} />;
}
