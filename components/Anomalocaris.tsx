"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const leftFlaps = useRef<(THREE.Mesh | null)[]>([]);
  const rightFlaps = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // 画像のようなダイナミックな遊泳姿勢
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.05; // わずかなピッチング

    // 側葉（ヒレ）の「波状ウェーブ」：水平に広げてなびかせる
    for (let i = 0; i < 11; i++) {
      const delay = i * 0.3; 
      const wave = Math.sin(t * 2.5 - delay) * 0.25;

      // 右ヒレ：横に広げた状態をベースに上下運動
      if (rightFlaps.current[i]) {
        rightFlaps.current[i]!.rotation.z = 0.3 - wave; 
        rightFlaps.current[i]!.rotation.y = -0.4 + Math.cos(t * 2 - delay) * 0.1;
      }
      // 左ヒレ
      if (leftFlaps.current[i]) {
        leftFlaps.current[i]!.rotation.z = -0.3 + wave;
        leftFlaps.current[i]!.rotation.y = 0.4 - Math.cos(t * 2 - delay) * 0.1;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* 胴体：画像のような赤褐色の有機的なグラデーション */}
      {[...Array(11)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 5) * -0.5]}>
          <mesh scale={[1.4 - i * 0.08, 0.7 - i * 0.04, 0.6]}>
            <sphereGeometry args={[0.5, 32, 16]} />
            <meshStandardMaterial 
              color={new THREE.Color().setHSL(0.05, 0.6, 0.4 - i * 0.02)} 
              roughness={0.4} 
            />
          </mesh>

          {/* 側葉（ヒレ）：画像のように扇状に重なり合う */}
          <mesh
            ref={(el) => { rightFlaps.current[i] = el; }}
            position={[0.7 - i * 0.05, -0.1, 0]}
          >
            <planeGeometry args={[1.5 - i * 0.05, 0.6]} />
            <meshStandardMaterial color="#D2B48C" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          <mesh
            ref={(el) => { leftFlaps.current[i] = el; }}
            position={[-0.7 + i * 0.05, -0.1, 0]}
          >
            <planeGeometry args={[1.5 - i * 0.05, 0.6]} />
            <meshStandardMaterial color="#D2B48C" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* 頭部パーツ：複眼と獲物を追う前脚 */}
      <group position={[0, 0.1, 2.5]}>
        {/* 飛び出した大きな複眼 */}
        {[0.9, -0.9].map((x, i) => (
          <group key={i} position={[x, 0.4, 0]}>
            <mesh rotation={[0.3, 0, x > 0 ? 0.8 : -0.8]} position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5]} /><meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.22, 32, 32]} /><meshPhongMaterial color="#111" shininess={100} />
            </mesh>
          </group>
        ))}

        {/* 前脚：画像のように多節でトゲが内側を向く */}
        {[0.4, -0.4].map((x, i) => (
          <group key={i} position={[x, -0.3, 0]} rotation={[0.5, x > 0 ? 0.3 : -0.3, 0]}>
            {[...Array(6)].map((_, k) => (
              <group key={k} position={[0, -k * 0.3, k * 0.2]} rotation={[0.25, 0, 0]}>
                <mesh><capsuleGeometry args={[0.1 - k * 0.01, 0.4]} /><meshStandardMaterial color="#8b4513" /></mesh>
                {/* 鋭い捕食用トゲ */}
                {[...Array(2)].map((_, m) => (
                  <mesh key={m} position={[0, -0.1, 0.1]} rotation={[1.5, 0, 0]}>
                    <coneGeometry args={[0.02, 0.3]} /><meshStandardMaterial color="#222" />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* 尾扇：画像のような紫・黄色の鮮やかなグラデーション */}
      <group position={[0, 0.2, -4.0]}>
        {[-1.0, -0.4, 0.4, 1.0].map((rot, i) => (
          <mesh key={i} rotation={[0.3, 0, rot]} position={[0, 0, -i * 0.1]}>
            <planeGeometry args={[1.6, 1.0]} />
            <meshStandardMaterial 
              color={i === 0 || i === 3 ? "#4B0082" : "#DAA520"} 
              transparent opacity={0.8} side={THREE.DoubleSide} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
