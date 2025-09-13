# 将来的な技術選択に関するメモ

## ✅ PoC段階（3日で動かす）

* **選択肢**: Web技術（Next.js + three.js + three-vrm）
* **理由**:

  * ブラウザでそのまま動作（インストール不要）
  * Vercelに即デプロイ可能
  * OpenAI会話APIやWeb Speech APIとの統合が容易
  * モデル制御（口パク・瞬き）はシンプルに実装可能

## 🚀 将来的な拡張方向性

* **Unityベース**へ移行検討

  * 表情・モーションを高度に制御可能
  * VR/ARデバイスとの連携が容易
  * ゲーム的要素や本格的なインタラクション追加に向く
* **注意点**:

  * Webで配布するにはWebGLビルドが必要
  * VercelなどWebホスティング環境との親和性は低い

## ✨ 方針まとめ

* 短期PoCはWeb技術一択
* 中長期（MVP〜プロダクト化）はUnity検討余地あり

# PoC メモ - 感情分析とアバターモーション連携

## 目的

* 会話のテキスト内容を感情分析し、その結果に応じて **表情** と **モーション** を切り替える。
* PoCレベルでは「ポジティブ / ネガティブ / ニュートラル」の3分類を導入。

---

## 1. 感情分析

* Chatの返答テキストを入力とし、OpenAI API等を利用して感情分類する。
* 出力ラベルは以下の3種：

  * `"positive"`
  * `"negative"`
  * `"neutral"`

```ts
async function analyzeSentiment(text: string): Promise<"positive"|"neutral"|"negative"> {
  const res = await fetch("/api/sentiment", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return (await res.json()).sentiment;
}
```

---

## 2. 表情制御

* VRM の `expressionManager` を利用して表情を変更。
* 利用可能な表情例：`happy`, `sad`, `angry`, `surprised`, `neutral`

```ts
function setEmotion(vrm: VRM, sentiment: "positive"|"neutral"|"negative") {
  if (!vrm.expressionManager) return;

  vrm.expressionManager.reset();

  switch (sentiment) {
    case "positive":
      vrm.expressionManager.setValue("happy", 1.0);
      break;
    case "negative":
      vrm.expressionManager.setValue("sad", 1.0);
      break;
    default:
      vrm.expressionManager.setValue("neutral", 1.0);
      break;
  }
}
```

---

## 3. モーション制御

* `useFrame` でボーンを操作し、自然な仕草を再現。
* `motions.ts` に複数のモーション関数を定義。

```ts
export const idleBreath: MotionFn = (vrm, t) => {
  vrm.scene.position.y = -1.4 + Math.sin(t * 1.5) * 0.02;
};

export const nodding: MotionFn = (vrm, t) => {
  const head = vrm.humanoid?.getBoneNode("head");
  if (head) head.rotation.x = Math.sin(t * 2) * 0.1;
};

export const handRaise: MotionFn = (vrm, t) => {
  const arm = vrm.humanoid?.getBoneNode("rightUpperArm");
  if (arm) arm.rotation.z = -Math.PI / 2 + Math.sin(t * 2) * 0.1;
};

// 瞬き
export const blinking: MotionFn = (vrm, t) => {
  const blink = Math.sin(t * 4) > 0.95 ? 1.0 : 0.0;
  vrm.expressionManager?.setValue("blink", blink);
};

// 視線移動（左右）
export const lookAround: MotionFn = (vrm, t) => {
  const head = vrm.humanoid?.getBoneNode("head");
  if (head) head.rotation.y = Math.sin(t * 0.5) * 0.2;
};
```

---

## 4. 感情 × モーション マッピング

* 感情分類の結果に応じて表情＋モーションを切り替える。

| 感情       | 表情 (Expression) | モーション例         |
| -------- | --------------- | -------------- |
| Positive | `happy`         | ガッツポーズ / 手を振る  |
| Negative | `sad`           | うなずき / 首かしげ    |
| Neutral  | `neutral`       | 呼吸 / 瞬き / 視線移動 |

---

## 5. 会話イベントとの連携

* Chatの返答受信後：

  1. `analyzeSentiment(replyText)` を実行
  2. `setEmotion(vrm, sentiment)` で表情変更
  3. `setMotion(motionFn)` で仕草変更
  4. 数秒後、`idleBreath + blinking + lookAround` に戻す

