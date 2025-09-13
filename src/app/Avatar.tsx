"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { GLTFLoader, GLTFParser } from "three/examples/jsm/loaders/GLTFLoader";
import { MotionFn, idleBreath, blinking, lookAround } from "./motions";
import type { VRMPose } from "@pixiv/three-vrm"; // ← 型だけ

declare global {
  interface Window {
    setAvatarMotion: (motions: MotionFn[]) => void;
  }
}

export default function Avatar() {
  const group = useRef<THREE.Group>(new THREE.Group());
  const vrmRef = useRef<VRM | null>(null);
  const currentMotion = useRef<MotionFn[]>([idleBreath, blinking, lookAround]);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser: GLTFParser) => new VRMLoaderPlugin(parser));

    loader.load("/models/AvatarSample_M.vrm", (gltf) => {
      const vrm = gltf.userData.vrm as VRM;

      // ---- 腕を下げるポーズを適用（Z 軸まわりに ±約80〜90°）----
      const eL = new THREE.Euler(0, 0, -Math.PI * 0.85); // 左腕：-153°
      const eR = new THREE.Euler(0, 0,  Math.PI * 0.85); // 右腕：+153°
      const qL = new THREE.Quaternion().setFromEuler(eL);
      const qR = new THREE.Quaternion().setFromEuler(eR);

      const armsDownPose: VRMPose = {
        leftUpperArm:  { rotation: [qL.x, qL.y, qL.z, qL.w] },
        rightUpperArm: { rotation: [qR.x, qR.y, qR.z, qR.w] },
        // さらに自然にしたければ前腕も少し内側へ
        // leftLowerArm:  { rotation: [qL2.x, qL2.y, qL2.z, qL2.w] },
        // rightLowerArm: { rotation: [qR2.x, qR2.y, qR2.z, qR2.w] },
      };
      vrm.humanoid?.setNormalizedPose(armsDownPose); // ★ 公式の適用API

      // 配置
      vrm.scene.position.set(0, -1.4, 0);
      vrm.scene.scale.set(1.5, 1.5, 1.5);

      group.current.add(vrm.scene);
      vrmRef.current = vrm;
    });

    window.setAvatarMotion = (motions: MotionFn[]) => {
      currentMotion.current = motions;
    };
  }, []);

  useFrame(({ clock }) => {
    if (!vrmRef.current) return;

    // 表情系は毎フレーム更新
    vrmRef.current.expressionManager?.update();

    const t = clock.elapsedTime;
    currentMotion.current.forEach((fn) => fn(vrmRef.current!, t));
  });

  return <primitive object={group.current} />;
}
