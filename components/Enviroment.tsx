"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Environment() {
  const particlesRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // マリンスノー（浮遊物）をゆっくり回転させて生命感を出す
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
      particlesRef.current.position.y = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <>
      {/* 海底：カンブリア紀の泥の堆積を再現 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[100, 100, 32, 32]} />
        <meshStandardMaterial 
          color="#8b7355" 
          roughness={1} 
          metalness={0} 
        />
      </mesh>

      {/* マリンスノー（浮遊粒子）：1000個のパーティクル */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(3000).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.3} />
      </points>

      {/* 環境光とフォグ：海中の奥行きを演出 */}
      <fog attach="fog" args={['#001529', 5, 20]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#add8e6" castShadow />
      
      {/* 水面からの差し込む光をシミュレート */}
      <directionalLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />
    </>
  );
}
