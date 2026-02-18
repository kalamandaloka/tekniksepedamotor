import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, Grid } from '@react-three/drei'
import { Suspense } from 'react'

const FarmModel = () => {
  // This is a placeholder for the actual 3D model.
  // In a real scenario, we would use <useGLTF url="/model.glb" />
  return (
    <group>
      {/* Base Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>

      {/* Water Pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0ea5e9" opacity={0.8} transparent roughness={0.1} />
      </mesh>

      {/* Some structures/buildings placeholders */}
      <mesh position={[-2, 0.5, -2]} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      <mesh position={[2, 0.5, 2]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      
       <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[1, 0.2, 16, 100]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  )
}

const Experience = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [8, 5, 8], fov: 45 }}
      className="absolute top-0 left-0 w-full h-full -z-10"
    >
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
          <FarmModel />
        </Stage>
        <Grid 
            renderOrder={-1} 
            position={[0, -0.5, 0]} 
            infiniteGrid 
            cellSize={0.6} 
            sectionSize={3} 
            fadeDistance={30} 
            sectionColor="#64748b" 
            cellColor="#475569" 
        />
        <OrbitControls 
            autoRotate 
            autoRotateSpeed={0.5} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2} 
        />
      </Suspense>
    </Canvas>
  )
}

export default Experience
