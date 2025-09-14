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
  running,
  type MotionFn,
} from "./motions";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

declare global {
  interface Window {
    setAvatarMotion: (motions: MotionFn[]) => void;
  }
}

type GLTFWithVRM = GLTF & { userData: { vrm?: VRM } };

export default function Avatar() {
  const group = useRef<THREE.Group>(new THREE.Group());
  const vrmRef = useRef<VRM | null>(null);

  // Idle専用モーション（呼吸含む）
  const currentMotion = useRef<MotionFn[]>([idleBreath, blinking, lookAround]);

  // ランニング(FBX)用
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const runningClipRef = useRef<THREE.AnimationClip | null>(null);
  const runningActionRef = useRef<THREE.AnimationAction | null>(null);
  const wantRunRef = useRef(false);
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

  // FBX → VRM のトラック置換
  function remapClipBonesToVRM(
    clip: THREE.AnimationClip,
    vrm: VRM
  ): THREE.AnimationClip {
    const tracks: THREE.KeyframeTrack[] = [];
    const isFinger = (name: string) => /Thumb|Index|Middle|Ring|Pinky/.test(name);

    for (const orig of clip.tracks) {
      const name = orig.name;

      if (name.startsWith("mixamorigHips.position")) continue;
      if (isFinger(name)) continue;
      if (name.includes("Toe")) continue;

      let replaced = false;
      for (const mixamoKey in boneMap) {
        if (!name.startsWith(mixamoKey)) continue;
        const vrmBone = boneMap[mixamoKey];
        const node = vrm.humanoid?.getNormalizedBoneNode(vrmBone);
        if (!node) break;

        const prop = name.substring(mixamoKey.length + 1);
        const trackClone = orig.clone();
        trackClone.name = `${node.name}.${prop}`;

        // クォータニオン符号修正
        if (trackClone instanceof THREE.QuaternionKeyframeTrack) {
          const v = trackClone.values;
          for (let i = 4; i < v.length; i += 4) {
            const dot =
              v[i - 4] * v[i] +
              v[i - 3] * v[i + 1] +
              v[i - 2] * v[i + 2] +
              v[i - 1] * v[i + 3];
            if (dot < 0) {
              v[i] = -v[i];
              v[i + 1] = -v[i + 1];
              v[i + 2] = -v[i + 2];
              v[i + 3] = -v[i + 3];
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
    if (!mixerRef.current) mixerRef.current = new THREE.AnimationMixer(vrm.scene);
    if (!runningClipRef.current) {
      wantRunRef.current = true;
      return;
    }
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

  // VRM 読み込み
  useEffect(() => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.register((parser: GLTFParser) => new VRMLoaderPlugin(parser));

    gltfLoader.load("/models/AvatarSample_M.vrm", (gltfRaw) => {
      const gltf = gltfRaw as GLTFWithVRM;
      const vrm = gltf.userData.vrm;
      if (!vrm) return;

      // 腕下げポーズ
      const eL = new THREE.Euler(0, 0, -Math.PI / 2);
      const eR = new THREE.Euler(0, 0, Math.PI / 2);
      const qL = new THREE.Quaternion().setFromEuler(eL);
      const qR = new THREE.Quaternion().setFromEuler(eR);
      const armsDownPose: VRMPose = {
        leftUpperArm: { rotation: [qL.x, qL.y, qL.z, qL.w] },
        rightUpperArm: { rotation: [qR.x, qR.y, qR.z, qR.w] },
      };
      vrm.humanoid?.setNormalizedPose(armsDownPose);

      vrm.scene.position.set(0, -1.4, 0);
      vrm.scene.scale.set(1.5, 1.5, 1.5);

      group.current.add(vrm.scene);
      vrmRef.current = vrm;

      // FBX 読み込み
      const fbxLoader = new FBXLoader();
      fbxLoader.load("/motions/running.fbx", (obj) => {
        if (obj.animations.length > 0 && vrmRef.current) {
          const raw = obj.animations[0];
          const remapped = remapClipBonesToVRM(raw, vrmRef.current);
          runningClipRef.current = remapped;
          if (wantRunRef.current) {
            startRunning();
            wantRunRef.current = false;
          }
        }
      });

      // 初期は Idle（呼吸含む）
      window.setAvatarMotion([idleBreath, blinking, lookAround]);
    });

    // グローバル切替
    window.setAvatarMotion = (motions: MotionFn[]) => {
      const willRun = motions.includes(running);
      const wasRunning = isRunningRef.current;
      currentMotion.current = motions.filter((fn) => fn !== running);

      if (willRun && !wasRunning) startRunning();
      if (!willRun && wasRunning) stopRunning();
    };

    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, []);

  // フレーム更新
  useFrame((_, delta) => {
    const vrm = vrmRef.current;
    if (!vrm) return;
    const t = performance.now() / 1000;

    currentMotion.current.forEach((fn) => fn(vrm, t));
    if (isRunningRef.current && mixerRef.current) mixerRef.current.update(delta);

    vrm.update(delta);
    vrm.expressionManager?.update();
  });

  return <primitive object={group.current} />;
}
