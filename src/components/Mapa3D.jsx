// components/Mapa3D.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

const Aula3D = ({ recursos, onRecursoClick }) => {
    return (
        <Canvas camera={{ position: [15, 10, 15] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {/* Suelo del aula */}
            <gridHelper args={[20, 20]} />
            
            {/* Recursos como cubos interactivos */}
            {recursos.map(recurso => (
                <Box
                    key={recurso.id}
                    position={[recurso.x, recurso.y, recurso.z]}
                    onClick={() => onRecursoClick(recurso.id)}
                >
                    <meshStandardMaterial 
                        color={recurso.enMovimiento ? "red" : "blue"}
                        emissive={recurso.enMovimiento ? "orange" : "black"}
                    />
                </Box>
            ))}
            
            <OrbitControls />
        </Canvas>
    );
};