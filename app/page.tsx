"use client";
import React from 'react'; // Reactを明示的にインポート
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Anomalocaris from '../components/Anomalocaris';

export default function Aquarium() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#001529' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Anomalocaris />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
