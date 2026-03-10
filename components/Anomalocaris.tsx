"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const sideFlaps = useRef<(THREE.Mesh | null)[]>([]);
  const armRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // 獲物を探すような、ゆったりした旋回
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;

    // ヒレの複雑な波打ち（画像のようなしなやかさ）
    sideFlaps.current.forEach((mesh, i) => {
      if (mesh) {
        const phase = i % 13;
        mesh.rotation.x = Math.sin(t * 3 - phase * 0.6) * 0.45;
        // わずかに扇ぐ動きを追加
        mesh.rotation.z = (i < 13 ? 0.2 : -0.2) + Math.cos(t * 3 - phase * 0.6) * 0.1;
      }
    });

    // 前脚の「捕食モーション」（三葉虫を掴む動き）
    if (armRef.current) {
      armRef.current.rotation.x = 0.5 + Math.sin(t * 1.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 13の節：背中側に少し厚みを持たせる */}
      {[...Array(13)].map((_, i) => (
        <mesh key={i} position={[0, 0, (i - 6) * -0.38]} scale={[1.1 - i*0.04, 0.6 - i*0.02, 0.45]}>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.4} metalness={0.2} />
        </mesh>
      ))}

      {/* 放射状の口器 (パイ・マウス) */}
      <group position={[0, -0.4, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.2, 0.05, 16, 32]} />
          <meshStandardMaterial color="#331111" />
        </mesh>
        {/* 口の中の鋭い歯を簡易表現 */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]} position={[0.15, 0, 0]}>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial color="#552222" />
          </mesh>
        ))}
      </group>

      {/* 巨大な複眼 */}
      <group position={[0, 0.3, 1.8]}>
        {[0.8, -0.8].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, x > 0 ? 0.5 : -0.5]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#111" roughness={0} metalness={1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 獲物を捕らえる前脚 (多関節) */}
      <group ref={armRef} position={[0, -0.2, 2.0]}>
        {[0.25, -0.25].map((x, i) => (
          <group key={i} position={[x, 0, 0]} rotation={[0, x > 0 ? 0.2 : -0.2, 0]}>
            {/* 根元 */}
            <mesh position={[0, -0.2, 0.3]} rotation={[0.5, 0, 0]}>
              <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
              <meshStandardMaterial color="#A0522D" />
            </mesh>
            {/* 先端の曲がり */}
            <mesh position={[0, -0.6, 0.8]} rotation={[1.2, 0, 0]}>
              <capsuleGeometry args={[0.06, 0.6, 4, 8]} />
              <meshStandardMaterial color="#D2691E" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 側葉：画像のような先端が細い形状 */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 5) * -0.45]}>
          <mesh ref={(el) => { sideFlaps.current[i] = el; }} position={[0.8, -0.1, 0]}>
            <coneGeometry args={[0.25, 1.4, 32]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#CD853F" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={(el) => { sideFlaps.current[i + 13] = el; }} position={[-0.8, -0.1, 0]}>
            <coneGeometry args={[0.25, 1.4, 32]} rotation={[0, 0, -Math.PI / 2]} />
            <meshStandardMaterial color="#CD853F" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* 尾扇：3枚の大きなヒレ */}
      <group position={[0, 0, -3.2]}>
        {[0.6, 0, -0.6].map((rot, i) => (
          <mesh key={i} rotation={[0, 0, rot]} position={[0, 0.1 * i, -0.2 * i]}>
            <planeGeometry args={[1.5, 0.8]} />
            <meshStandardMaterial color="#8B0000" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
