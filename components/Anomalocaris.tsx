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

    sideFlaps.current.forEach((mesh, i) => {
      if (mesh) {
        // 画像のような波打つ推進を再現
        const phase = i % 13;
        mesh.rotation.x = Math.sin(t * 3 - phase * 0.5) * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 13の節で構成される胴体 */}
      {[...Array(13)].map((_, i) => (
        <mesh key={i} position={[0, 0, (i - 6) * -0.35]} scale={[1.2 - i*0.05, 0.7 - i*0.03, 0.5]}>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshStandardMaterial color="#b22222" roughness={0.2} metalness={0.1} />
        </mesh>
      ))}

      {/* 飛び出した複眼 */}
      <group position={[0, 0.2, 2.0]}>
        <mesh position={[0.7, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.7, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* 刺のある前脚 */}
      {[0.3, -0.3].map((x, j) => (
        <group key={j} position={[x, -0.2, 2.2]} rotation={[0.8, x > 0 ? 0.2 : -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.05, 1.2]} />
            <meshStandardMaterial color="#d2691e" />
          </mesh>
          {/* 前脚のトゲ */}
          {[...Array(5)].map((_, k) => (
            <mesh key={k} position={[0, (k-2)*0.2, 0.1]} rotation={[1.5, 0, 0]}>
              <coneGeometry args={[0.02, 0.2]} />
              <meshStandardMaterial color="#f4a460" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 側葉 (左右13対) - 画像のように少し尖らせる */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 5) * -0.4]}>
          <mesh ref={(el) => { sideFlaps.current[i] = el; }} position={[0.7, 0, 0]} rotation={[0, -0.2, 0.3]}>
            <coneGeometry args={[0.3, 1.2, 4]} rotation={[0, 0, Math.PI/2]} />
            <meshStandardMaterial color="#e9967a" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh ref={(el) => { sideFlaps.current[i + 13] = el; }} position={[-0.7, 0, 0]} rotation={[0, 0.2, -0.3]}>
            <coneGeometry args={[0.3, 1.2, 4]} rotation={[0, 0, -Math.PI/2]} />
            <meshStandardMaterial color="#e9967a" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* 尾扇 (V字の尾びれ) */}
      <group position={[0, 0, -3.0]}>
        <mesh rotation={[0, 0.5, 0]} position={[0.4, 0, 0]}>
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial color="#b22222" side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
        <mesh rotation={[0, -0.5, 0]} position={[-0.4, 0, 0]}>
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial color="#b22222" side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  );
}
