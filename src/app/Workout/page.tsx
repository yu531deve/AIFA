"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Avatar from "../Avatar";
import Image from "next/image";

export default function Workout() {
  return (
    <main className="relative w-screen h-screen flex flex-col">
      {/* 上 6割: 運動動画 */}
<div className="w-full h-1/2 bg-black relative">
  <video
    src="/videos/779540612.497792.mp4"
    className="w-full h-full object-contain bg-black"
    controls
    autoPlay
    loop
  />
</div>



      {/* 下 4割: 自分の映像 → 今回は画像に差し替え */}
      <div className="w-full h-1/2 bg-gray-900 relative">
        <Image
          src="/self.png"
          alt="Workout placeholder"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* PiP: 右下にアバター */}
      <div className="absolute bottom-2 right-2 w-48 h-48 bg-white/10 rounded-lg overflow-hidden shadow-lg">
        <Canvas camera={{ position: [0, 0.2, 1.4] }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, 5, 5]} intensity={0.8} />
          <Avatar />
          <OrbitControls
            target={[0, 0.21, 0]}
            minDistance={1.0}
            maxDistance={1.2}
            enablePan={false}
          />
        </Canvas>
      </div>
    </main>
  );
}
