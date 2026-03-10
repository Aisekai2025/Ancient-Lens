import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Anomalocaris() {
  const group = useRef<THREE.Group>(null!)
  const flaps = useRef<THREE.Mesh[]>([])

  // 毎フレームの更新（アニメーション）
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // 全体の上下の揺らぎ
    group.current.position.y = Math.sin(t * 0.5) * 0.2
    
    // 側葉（フラップ）の波打ち：前から後ろへ位相をずらす
    flaps.current.forEach((mesh, i) => {
      if (mesh) {
        // サイン波で側葉を回転させる
        mesh.rotation.z = Math.sin(t * 3 + i * 0.5) * 0.4
      }
    })
  })

  return (
    <group ref={group}>
      {/* 胴体 */}
      <mesh>
        <capsuleGeometry args={[0.3, 2, 4, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* 側葉の生成（左右13対） */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, (i - 6) * 0.3, 0]}>
          {/* 左側の葉 */}
          <mesh ref={(el) => (flaps.current[i * 2] = el!)} position={[-0.4, 0, 0]}>
            <planeGeometry args={[0.6, 0.2]} />
            <meshStandardMaterial color="#a0522d" side={THREE.DoubleSide} />
          </mesh>
          {/* 右側の葉 */}
          <mesh ref={(el) => (flaps.current[i * 2 + 1] = el!)} position={[0.4, 0, 0]}>
            <planeGeometry args={[0.6, 0.2]} />
            <meshStandardMaterial color="#a0522d" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* 複眼 */}
      <mesh position={[-0.4, 1.2, 0.2]}><sphereGeometry args={[0.15]} /><meshStandardMaterial color="black" /></mesh>
      <mesh position={[0.4, 1.2, 0.2]}><sphereGeometry args={[0.15]} /><meshStandardMaterial color="black" /></mesh>
    </group>
  )
}
