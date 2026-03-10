"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const sideFlaps = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.2;

    // ヒレのしなやかな波打ち
    sideFlaps.current.forEach((mesh, i) => {
      if (mesh) {
        const phase = i % 13;
        mesh.rotation.x = Math.sin(t * 2.5 - phase * 0.5) * 0.4;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 胴体：甲殻の質感を高める */}
      {[...Array(13)].map((_, i) => (
        <mesh key={i} position={[0, 0, (i - 6) * -0.4]} scale={[1.2 - i*0.05, 0.7 - i*0.03, 0.5]}>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshStandardMaterial color="#8b4513" roughness={0.2} metalness={0.1} />
        </mesh>
      ))}

      {/* --- アカデミック再現：精密パイ・マウス --- */}
      <group position={[0, -0.45, 1.7]} rotation={[Math.PI / 2.2, 0, 0]}>
        {/* 口の土台（筋肉組織） */}
        <mesh>
          <torusGeometry args={[0.35, 0.08, 16, 50]} />
          <meshStandardMaterial color="#4a1a1a" />
        </mesh>

        {/* 32枚の重なり合う硬質プレート */}
        {[...Array(32)].map((_, i) => {
          const angle = (i / 32) * Math.PI * 2;
          const isLarge = i % 4 === 0; // 4枚に1枚、大きなプレートがある学説を再現
          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0.25, 0, 0.02]}>
                <boxGeometry args={[isLarge ? 0.25 : 0.15, 0.08, 0.02]} />
                <meshStandardMaterial 
                  color={isLarge ? "#5d2e2e" : "#3d1e1e"} 
                  roughness={0.1} 
                />
              </mesh>
              {/* プレート先端の「返し」の歯 */}
              <mesh position={[isLarge ? 0.1 : 0.05, 0, 0.05]} rotation={[0, -0.5, 0]}>
                <coneGeometry args={[0.015, 0.1, 4]} />
                <meshStandardMaterial color="#222" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 複眼：高精細化（光を反射するレンズ感） */}
      <group position={[0, 0.4, 2.1]}>
        {[0.8, -0.8].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh rotation={[0.2, 0, x > 0 ? 0.6 : -0.6]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshPhongMaterial 
                color="#111" 
                shininess={100} 
                specular={new THREE.Color("#fff")} 
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 捕食用の前脚：トゲの密度アップ */}
      {[0.3, -0.3].map((x, j) => (
        <group key={j} position={[x, -0.1, 2.3]} rotation={[0.8, x > 0 ? 0.2 : -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.04, 1.4]} />
            <meshStandardMaterial color="#a0522d" />
          </mesh>
          {[...Array(12)].map((_, k) => (
            <mesh key={k} position={[0, (k-6)*0.18, 0.08]} rotation={[1.6, 0, 0]}>
              <coneGeometry args={[0.025, 0.25, 8]} />
              <meshStandardMaterial color="#4a2a1a" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 側葉と尾扇は前回の「しなやかな動き」を継承 */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 5) * -0.45]}>
          <mesh ref={(el) => { sideFlaps.current[i] = el; }} position={[0.9, -0.1, 0]}>
            <coneGeometry args={[0.25, 1.5, 32]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#cd853f" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={(el) => { sideFlaps.current[i + 13] = el; }} position={[-0.9, -0.1, 0]}>
            <coneGeometry args={[0.25, 1.5, 32]} rotation={[0, 0, -Math.PI / 2]} />
            <meshStandardMaterial color="#cd853f" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
