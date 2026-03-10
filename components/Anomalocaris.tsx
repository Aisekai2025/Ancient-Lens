"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const segmentsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // 全体のゆったりした揺れ
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;

    // 節（セグメント）ごとの連動
    segmentsRef.current.forEach((seg, i) => {
      if (seg) {
        // フィギュアが連動して動くような、位相をずらした「くねり」
        const delay = i * 0.4;
        // 胴体の上下動
        seg.position.y = Math.sin(t * 2 - delay) * 0.05;
        // 左右のヒレの羽ばたき
        const flapRight = seg.children[1] as THREE.Mesh; // 右ヒレ
        const flapLeft = seg.children[2] as THREE.Mesh;  // 左ヒレ
        if (flapRight && flapLeft) {
          const wave = Math.sin(t * 3 - delay) * 0.4;
          flapRight.rotation.x = wave;
          flapLeft.rotation.x = wave;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 13個の独立した可動セグメント */}
      {[...Array(13)].map((_, i) => (
        <group 
          key={i} 
          position={[0, 0, (i - 6) * -0.45]}
          ref={(el) => { segmentsRef.current[i] = el; }}
        >
          {/* 胴体の節（カプセル状のパーツ） */}
          <mesh scale={[1.2 - i*0.05, 0.6 - i*0.03, 0.5]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#8B4513" : "#A0522D"} // 節ごとに色を変えて分割感を出す
              roughness={0.2}
            />
          </mesh>

          {/* 右のヒレ：アニア風に少し厚みと形状を整える */}
          <mesh position={[0.7 - i*0.02, -0.1, 0]} rotation={[0, -0.2, 0.2]}>
            <coneGeometry args={[0.2, 1.2, 4]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#CD853F" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>

          {/* 左のヒレ */}
          <mesh position={[-0.7 + i*0.02, -0.1, 0]} rotation={[0, 0.2, -0.2]}>
            <coneGeometry args={[0.2, 1.2, 4]} rotation={[0, 0, -Math.PI / 2]} />
            <meshStandardMaterial color="#CD853F" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* --- 頭部パーツ群 --- */}
      <group position={[0, 0, 1.8]}>
        {/* 精密パイ・マウス（お腹側） */}
        <group position={[0, -0.4, 0]} rotation={[Math.PI / 2.1, 0, 0]}>
          <mesh><torusGeometry args={[0.3, 0.06]} /><meshStandardMaterial color="#331111" /></mesh>
          {[...Array(32)].map((_, j) => (
            <mesh key={j} rotation={[0, 0, (j/32)*Math.PI*2]} position={[0.2, 0, 0]}>
              <boxGeometry args={[0.15, 0.05, 0.01]} /><meshStandardMaterial color="#5d2e2e" />
            </mesh>
          ))}
        </group>

        {/* 飛び出した複眼 */}
        {[0.8, -0.8].map((x, i) => (
          <group key={i} position={[x, 0.3, 0]}>
            <mesh rotation={[0.2, 0, x > 0 ? 0.6 : -0.6]} position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} /><meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} /><meshPhongMaterial color="#111" shininess={100} />
            </mesh>
          </group>
        ))}

        {/* 捕食用前脚 */}
        {[0.3, -0.3].map((x, i) => (
          <group key={i} position={[x, -0.1, 0.3]} rotation={[0.8, x > 0 ? 0.2 : -0.2, 0]}>
            <mesh><cylinderGeometry args={[0.08, 0.04, 1.2]} /><meshStandardMaterial color="#A0522D" /></mesh>
            {[...Array(8)].map((_, k) => (
              <mesh key={k} position={[0, (k-4)*0.15, 0.08]} rotation={[1.6, 0, 0]}>
                <coneGeometry args={[0.02, 0.2]} /><meshStandardMaterial color="#4A2A1A" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 尾扇 */}
      <group position={[0, 0, -3.5]}>
        {[0.5, 0, -0.5].map((rot, i) => (
          <mesh key={i} rotation={[0, 0, rot]} position={[0, 0.1*i, -0.2*i]}>
            <planeGeometry args={[1.2, 0.8]} /><meshStandardMaterial color="#8B0000" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
