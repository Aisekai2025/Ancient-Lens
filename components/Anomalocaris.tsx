"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const leftFlaps = useRef<(THREE.Mesh | null)[]>([]);
  const rightFlaps = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // 全体のゆったりした旋回と上下動
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.15;
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;

    // 側葉（ヒレ）の「波状（ウェーブ）」遊泳
    for (let i = 0; i < 13; i++) {
      const delay = i * 0.4; // 前から後ろへ波を伝えるディレイ
      const wave = Math.sin(t * 3 - delay) * 0.3; // 上下の振れ幅

      if (leftFlaps.current[i]) {
        // 横に広げた状態をベースに、上下にくねらせる
        leftFlaps.current[i]!.rotation.z = -0.2 + wave; // 基本角度に波を合成
        leftFlaps.current[i]!.rotation.y = Math.cos(t * 3 - delay) * 0.1; // 前後へのわずかなしなり
      }
      if (rightFlaps.current[i]) {
        rightFlaps.current[i]!.rotation.z = 0.2 - wave;
        rightFlaps.current[i]!.rotation.y = -Math.cos(t * 3 - delay) * 0.1;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* 胴体：節（セグメント）をなだらかに連結 */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 6) * -0.42]}>
          <mesh scale={[1.3 - i * 0.06, 0.7 - i * 0.03, 0.5]}>
            <sphereGeometry args={[0.5, 32, 16]} />
            <meshStandardMaterial color="#8b4513" roughness={0.3} />
          </mesh>

          {/* 側葉（ヒレ）：横に大きく広げる */}
          {/* 右側 */}
          <mesh
            ref={(el) => { rightFlaps.current[i] = el; }}
            position={[0.6 - i * 0.02, -0.05, 0]}
            rotation={[0.1, -0.4, 0]} // 少し斜め後ろに流す
          >
            <planeGeometry args={[1.2, 0.5]} />
            <meshStandardMaterial color="#d2b48c" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          {/* 左側 */}
          <mesh
            ref={(el) => { leftFlaps.current[i] = el; }}
            position={[-0.6 + i * 0.02, -0.05, 0]}
            rotation={[0.1, 0.4, 0]}
          >
            <planeGeometry args={[1.2, 0.5]} />
            <meshStandardMaterial color="#d2b48c" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* --- 頭部と前脚（画像準拠の精密造形） --- */}
      <group position={[0, 0, 2.2]}>
        {/* 複眼 */}
        {[0.85, -0.85].map((x, i) => (
          <group key={i} position={[x, 0.3, 0]}>
            <mesh rotation={[0.3, 0, x > 0 ? 0.8 : -0.8]} position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} /><meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} /><meshPhongMaterial color="#111" shininess={100} />
            </mesh>
          </group>
        ))}

        {/* 前脚：画像のように前方に突き出し、内側にカーブ */}
        {[0.35, -0.35].map((x, i) => (
          <group key={i} position={[x, -0.2, 0]} rotation={[0.4, x > 0 ? 0.2 : -0.2, 0]}>
            {[...Array(5)].map((_, k) => (
              <group key={k} position={[0, -k * 0.25, k * 0.2]} rotation={[0.3, 0, 0]}>
                <mesh><capsuleGeometry args={[0.09 - k * 0.01, 0.35]} /><meshStandardMaterial color="#8b4513" /></mesh>
                {[...Array(3)].map((_, m) => (
                  <mesh key={m} position={[0, 0, 0.1]} rotation={[1.5, 0, 0]}>
                    <coneGeometry args={[0.02, 0.2]} /><meshStandardMaterial color="#222" />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* 尾扇：画像のように水平に近い扇型に広げる */}
      <group position={[0, 0.1, -3.8]}>
        {[-0.8, -0.3, 0.3, 0.8].map((rot, i) => (
          <mesh key={i} rotation={[0.2, 0, rot]} position={[0, 0, -i * 0.1]}>
            <planeGeometry args={[1.5, 0.7]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#4b0082" : "#b22222"} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
