import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import Anomalocaris from '../components/Anomalocaris'

export default function Aquarium() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#001529' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* 古生代の海っぽさを出す演出 */}
        <fog attach="fog" args={['#001529', 5, 15]} />
        
        <Anomalocaris />
        
        {/* ズームイン・アウト・回転を可能にする */}
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  )
}
