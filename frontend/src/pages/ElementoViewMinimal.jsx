// src/pages/ElementoViewMinimal.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'

const ElementoViewMinimal = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050510' }}>
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 8, 5]} intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={0.5} />
        
        {/* Cubo de prueba */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#00ff88" />
        </mesh>
        
        <gridHelper args={[6, 20]} position={[0, -0.5, 0]} />
      </Canvas>
    </div>
  )
}

export default ElementoViewMinimal