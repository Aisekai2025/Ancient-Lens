"use client";
import React, { useRef } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber'; // ThreeElementsを追加
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const sideFlaps = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    
    sideFlaps.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.z = Math.sin(t * 3 + i * 0.5) * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <capsuleGeometry args={[0.5, 2, 4, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 6) * 0.3]}>
          <mesh ref={(el) => { sideFlaps.current[i] = el; }} position={[0.6, 0, 0]}>
            <planeGeometry args={[0.8, 0.3]} />
            <meshStandardMaterial color="#a0522d" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh ref={(el) => { sideFlaps.current[i + 13] = el; }} position={[-0.6, 0, 0]}>
            <planeGeometry args={[0.8, 0.3]} />
            <meshStandardMaterial color="#a0522d" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
