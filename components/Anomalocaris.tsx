"use client"; // ← これを追加！

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!)
  const sideFlaps = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // 全体のゆらぎ
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2
    
    // 側葉（ヒレ）の波打つ動き
    sideFlaps.current.forEach((mesh, i) => {
      if (mesh) {
        // 前から後ろへ波が伝わるように位相をずらす
        mesh.rotation.z = Math.sin(t * 3 + i * 0.5) * 0.3
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* 胴体 */}
      <mesh>
        <capsuleGeometry args={[0.5, 2, 4, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* 側葉 (左右13対) */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 6) * 0.3]}>
          {/* 右のヒレ */}
          <mesh 
            ref={(el) => { sideFlaps.current[i] = el }} 
            position={[0.6, 0, 0]}
          >
            <planeGeometry args={[0.8, 0.3]} />
            <meshStandardMaterial color="#a0522d" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          {/* 左のヒレ */}
          <mesh 
            ref={(el) => { sideFlaps.current[i + 13] = el }} 
            position={[-0.6, 0, 0]}
          >
            <planeGeometry args={[0.8, 0.3]} />
            <meshStandardMaterial color="#a0522d" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
