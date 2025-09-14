import { VRM } from "@pixiv/three-vrm";

export type MotionFn = (vrm: VRM, t: number) => void;

// ===== 自作モーション =====
export const idleBreath: MotionFn = (() => {
  let baseY: number | null = null; // 初期位置を記憶

  return (vrm, t) => {
    const chest = vrm.humanoid?.getNormalizedBoneNode("chest");
    if (!chest) return;

    if (baseY === null) baseY = chest.position.y;

    chest.position.y = baseY + Math.sin(t * 1.5) * 0.02;
  };
})();


export const blinking: MotionFn = (vrm, t) => {
  const blink = Math.sin(t * 4) > 0.95 ? 1.0 : 0.0;
  vrm.expressionManager?.setValue("blink", blink);
};

export const lookAround: MotionFn = (vrm, t) => {
  const head = vrm.humanoid?.getNormalizedBoneNode("head");
  if (head) head.rotation.y = Math.sin(t * 0.5) * 0.2;
};

export const nodding: MotionFn = (vrm, t) => {
  const head = vrm.humanoid?.getNormalizedBoneNode("head");
  if (head) head.rotation.x = Math.sin(t * 2) * 0.1;
};

export const handWave: MotionFn = (vrm, t) => {
  const arm = vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
  if (arm) arm.rotation.z = -Math.PI / 4 + Math.sin(t * 5) * 0.2;
};

export const shrug: MotionFn = (vrm, t) => {
  const L = vrm.humanoid?.getNormalizedBoneNode("leftShoulder");
  const R = vrm.humanoid?.getNormalizedBoneNode("rightShoulder");
  if (L) L.position.y = Math.sin(t * 2) * 0.05;
  if (R) R.position.y = Math.sin(t * 2) * 0.05;
};

// ===== ランニング（マーカー関数） =====
// 実際のFBX再生制御は Avatar.tsx で行う。
export const running: MotionFn = (vrm) => {
  // 足の向き補正（VRoidはMixamoと180°違うことがある）
  const leftLeg = vrm.humanoid?.getNormalizedBoneNode("leftUpperLeg");
  const rightLeg = vrm.humanoid?.getNormalizedBoneNode("rightUpperLeg");

  if (leftLeg) {
    leftLeg.rotation.y += Math.PI; // 180度補正
  }
  if (rightLeg) {
    rightLeg.rotation.y += Math.PI; // 180度補正
  }
};
