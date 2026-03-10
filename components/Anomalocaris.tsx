"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const sideFlaps = useRef<(THREE.Mesh | null)[]>([]);
  const eyesRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // 全体のゆったりした遊泳
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;

    // 側葉（ヒレ）の「波打ち」をよりリアルに
    sideFlaps.current.forEach((mesh, i) => {
      if (mesh) {
        // 位相をずらして、前から後ろへ波が伝わるように
        const phase = i % 13;
        mesh.rotation.x = Math.sin(t * 2.5 - phase * 0.4) * 0.4;
      }
    });

    // 目のわずかな動き
    if (eyesRef.current) {
      eyesRef.current.rotation.y = Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 胴体：少し平たくして節（ふし）を表現 */}
      <mesh scale={[1.2, 0.6, 2.5]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#8b4513" roughness={0.3} />
      </mesh>

      {/* 目（複眼）：アノマロカリス特有の飛び出した目 */}
      <group ref={eyesRef} position={[0, 0.2, 1.2]}>
        <mesh position={[0.6, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#222" emissive="#111" />
        </mesh>
        <mesh position={[-0.6, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#222" emissive="#111" />
        </mesh>
      </group>

      {/* 触手：前方の大きな2本の腕 */}
      <group position={[0, -0.2, 1.3]}>
        <mesh rotation={[0.5, 0.2, 0]} position={[0.2, 0, 0.3]}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="#a0522d" />
        </mesh>
        <mesh rotation={[0.5, -0.2, 0]} position={[-0.2, 0, 0.3]}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="#a0522d" />
        </mesh>
      </group>

      {/* 側葉 (左右13対) */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 6) * -0.4]}>
          {/* 右のヒレ */}
          <mesh ref={(el) => { sideFlaps.current[i] = el; }} position={[0.6, 0, 0]} rotation={[0, 0, 0.2]}>
            <planeGeometry args={[1.0, 0.4]} />
            <meshStandardMaterial color="#cd853f" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
          {/* 左のヒレ */}
          <mesh ref={(el) => { sideFlaps.current[i + 13] = el; }} position={[-0.6, 0, 0]} rotation={[0, 0, -0.2]}>
            <planeGeometry args={[1.0, 0.4]} />
            <meshStandardMaterial color="#cd853f" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
