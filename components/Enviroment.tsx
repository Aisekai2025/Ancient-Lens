"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, Float } from '@react-three/drei';

export default function Environment() {
  const particlesRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // マリンスノー（浮遊物）をゆらゆら動かす
    particlesRef.current.rotation.y = t * 0.02;
    particlesRef.current.position.y = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <>
      {/* 海底：砂紋をシミュレートした大きなプレーン */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial 
          color="#c2b280" 
          roughness={1} 
          metalness={0}
          flatShading
        />
      </mesh>

      {/* マリンスノー：プランクトンや有機物のカス */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(3000).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#fff" transparent opacity={0.4} />
      </points>

      {/* 環境光：深海らしい青い霧 */}
      <fog attach="fog" args={['#001529', 5, 25]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#add8e6" />
    </>
  );
}
