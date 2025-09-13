import { VRM } from "@pixiv/three-vrm";

export type MotionFn = (vrm: VRM, t: number) => void;

// 呼吸（胸を上下に揺らす）
export const idleBreath: MotionFn = (vrm, t) => {
  const chest = vrm.humanoid?.getNormalizedBoneNode("chest");
  if (chest) chest.position.y = Math.sin(t * 1.5) * 0.02;
};

// 瞬き
export const blinking: MotionFn = (vrm, t) => {
  const blink = Math.sin(t * 4) > 0.95 ? 1.0 : 0.0;
  vrm.expressionManager?.setValue("blink", blink);
};

// 視線移動
export const lookAround: MotionFn = (vrm, t) => {
  const head = vrm.humanoid?.getNormalizedBoneNode("head");
  if (head) head.rotation.y = Math.sin(t * 0.5) * 0.2;
};

// うなずき
export const nodding: MotionFn = (vrm, t) => {
  const head = vrm.humanoid?.getNormalizedBoneNode("head");
  if (head) head.rotation.x = Math.sin(t * 2) * 0.1;
};

// 手を振る
export const handWave: MotionFn = (vrm, t) => {
  const arm = vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
  if (arm) arm.rotation.z = -Math.PI / 4 + Math.sin(t * 5) * 0.2;
};

// 肩をすくめる
export const shrug: MotionFn = (vrm, t) => {
  const shoulderL = vrm.humanoid?.getNormalizedBoneNode("leftShoulder");
  const shoulderR = vrm.humanoid?.getNormalizedBoneNode("rightShoulder");
  if (shoulderL) shoulderL.position.y = Math.sin(t * 2) * 0.05;
  if (shoulderR) shoulderR.position.y = Math.sin(t * 2) * 0.05;
};
