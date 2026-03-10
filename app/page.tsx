"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment as SkyEnv } from '@react-three/drei';
import Anomalocaris from '../components/Anomalocaris';
import Environment from '@/components/Environment'; 

export default function Aquarium() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#001529' }}>
      <Canvas camera={{ position: [5, 2, 8], fov: 50 }}>
        {/* 背景と照明 */}
        <Environment />
        
        {/* 主役のアノマロカリス */}
        <Anomalocaris />
        
        {/* 自由な視点操作 */}
        <OrbitControls 
          enableDamping 
          maxDistance={15} 
          minDistance={2}
          makeDefault 
        />
      </Canvas>
    </div>
  );
}
