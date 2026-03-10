"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Anomalocaris() {
  const groupRef = useRef<THREE.Group>(null!);
  const segmentsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.2;

    segmentsRef.current.forEach((seg, i) => {
      if (seg) {
        const delay = i * 0.35;
        // 胴体のしなやかな波打ち
        seg.rotation.z = Math.sin(t * 1.5 - delay) * 0.05;
        // ヒレの羽ばたき
        seg.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.name === "flap") {
            child.rotation.x = Math.sin(t * 2.5 - delay) * 0.45;
          }
        });
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 13の節：画像のような重なりと質感を再現 */}
      {[...Array(13)].map((_, i) => (
        <group key={i} position={[0, 0, (i - 6) * -0.42]} ref={(el) => { segmentsRef.current[i] = el; }}>
          <mesh scale={[1.3 - i*0.06, 0.7 - i*0.03, 0.55]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
              color={i < 4 ? "#d2691e" : "#8b4513"} // 前方は明るく、後ろは濃い茶色
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>

          {/* 画像のような先端の尖った側葉（ヒレ） */}
          {[0.8, -0.8].map((x, j) => (
            <mesh 
              key={j} 
              name="flap"
              position={[x * (1 - i*0.04), -0.1, 0]} 
              rotation={[0, x > 0 ? -0.3 : 0.3, x > 0 ? 0.2 : -0.2]}
            >
              <coneGeometry args={[0.22, 1.4, 4]} rotation={[0, 0, x > 0 ? Math.PI/2 : -Math.PI/2]} />
              <meshStandardMaterial color="#d2b48c" transparent opacity={0.85} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}

      {/* --- 画像準拠：特徴的な頭部 --- */}
      <group position={[0, 0.1, 2.3]}>
        {/* 飛び出した大きな複眼 */}
        {[0.9, -0.9].map((x, i) => (
          <group key={i} position={[x, 0.3, 0]}>
            <mesh rotation={[0.2, 0, x > 0 ? 0.7 : -0.7]} position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.5]} />
              <meshStandardMaterial color="#CD853F" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshPhongMaterial color="#111" shininess={120} />
            </mesh>
          </group>
        ))}

        {/* 画像のような多節でトゲの鋭い前脚 */}
        {[0.35, -0.35].map((x, i) => (
          <group key={i} position={[x, -0.2, 0.2]} rotation={[0.6, x > 0 ? 0.3 : -0.3, 0]}>
            {[...Array(4)].map((_, k) => (
              <group key={k} position={[0, -k*0.3, k*0.25]} rotation={[0.2 * k, 0, 0]}>
                <mesh>
                  <capsuleGeometry args={[0.1 - k*0.01, 0.4, 8, 16]} />
                  <meshStandardMaterial color="#8b4513" />
                </mesh>
                {/* 鋭いトゲ */}
                {[...Array(3)].map((_, m) => (
                  <mesh key={m} position={[0, 0, 0.1]} rotation={[1.5, 0, 0]}>
                    <coneGeometry args={[0.02, 0.25]} />
                    <meshStandardMaterial color="#331111" />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* 尾扇：画像のような色彩と形状 */}
      <group position={[0, 0.1, -3.8]}>
        {[-0.6, -0.2, 0.2, 0.6].map((rot, i) => (
          <mesh key={i} rotation={[0, 0, rot]} position={[0, i*0.05, -i*0.1]}>
            <planeGeometry args={[1.5, 0.8]} />
            <meshStandardMaterial 
              color={i === 0 || i === 3 ? "#4b0082" : "#b22222"} // 外側を紫、内側を赤に
              transparent opacity={0.8} side={THREE.DoubleSide} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
