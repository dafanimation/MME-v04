// ============================================================
// ARCHIVO: src/components/3d/entities/CajaHerramientas3D.jsx
// VERSIÓN: 5.1 - CORREGIDO (sintaxis válida)
// ============================================================
// DESCRIPCIÓN: Modelo 3D de caja de herramientas con tapa y herramientas dentro
// FUNCIONALIDAD: Representa una caja de herramientas que puede abrirse y mostrar herramientas dentro. Interactiva con hover y click.
// ============================================================
// IMPORTACIONES
// React y hooks
// Componentes de geometría y materiales de drei
// Configuración de la caja
// ============================================================
// COMPONENTES AUXILIARES
// Prisma: Crea un prisma rectangular con caras personalizables
// PerfilUnion: Crea perfiles de unión para reforzar la caja
// ============================================================
// COMPONENTE PRINCIPAL: CajaHerramientas3D
// Props:
// - id: Identificador único de la caja
// - position: Posición en el espacio 3D
// - isAbierta: Estado de apertura de la caja (afecta a la posición y rotación de la tapa)
// - isSelected: Si la caja está seleccionada (afecta al color)
// - herramientas: Lista de herramientas dentro de la caja (para mostrar en el tooltip)
// - onHerramientaClick: Función callback al hacer click en una herramienta dentro de la caja
// - onClick: Función callback al hacer click en la caja (para selección, etc.)
// ============================================================
// NOTAS DE IMPLEMENTACIÓN:
// - La caja se compone de un prisma inferior (base) y un prisma superior (tapa) que rota para abrirse.
// - Se utilizan planos para las caras de la caja, con materiales transparentes para dar un efecto de "caja de plástico".
// - Las herramientas dentro de la caja se representan como cajas pequeñas, y su posición cambia si la caja está abierta o cerrada.
// - Se muestra un tooltip con información al hacer hover o si la caja está seleccionada.
// ============================================================
// Revisiones:
// - 5.1: Corregida sintaxis para asegurar que el código es válido y funcional.
// - 5.0: Refactorización completa para mejorar la estructura, legibilidad y funcionalidad del componente.
// ============================================================
// IMPORTACIONES
import React, { useState } from 'react';
import { Box, Edges, Text, Html, Plane } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// CONFIGURACIÓN DE LA CAJA
// ============================================
const CAJA = {
  ancho: 0.9,
  alto: 0.2,
  fondo: 0.4,
  
  baseInferior: {
    ancho: 0.8,
    fondo: 0.35,
  },
  
  colorPared: '#3060b8',
  transparencia: 0.6,
  
  perfilUnion: {
    color: '#ff3333',
    grosor: 0.04,
  },
  perfilVertice: {
    color: '#afafaf',
    grosor: 0.02,
  },
  
  asa: {
    ancho: 0.25,
    alto: 0.04,
    fondo: 0.08,
    color: '#cc3333',
  },
  
  anguloApertura: Math.PI / -2,
};

// ============================================
// COMPONENTE: Prisma
// ============================================
const Prisma = ({ 
  ancho, alto, fondo, position = [0, 0, 0], color, rotation = [0, 0, 0],
  mostrarCaraSuperior = true, mostrarCaraInferior = true,
}) => {
  const halfW = ancho / 2;
  const halfH = alto / 2;
  const halfD = fondo / 2;
  
  return (
    <group position={position} rotation={rotation}>
      {/* Cara Frontal */}
      <Plane args={[ancho, alto]} position={[0, 0, halfD]}>
        <meshStandardMaterial color={color} transparent opacity={CAJA.transparencia} side={THREE.DoubleSide} />
      </Plane>
      
      {/* Cara Trasera */}
      <Plane args={[ancho, alto]} position={[0, 0, -halfD]}>
        <meshStandardMaterial color={color} transparent opacity={CAJA.transparencia} side={THREE.DoubleSide} />
      </Plane>
      
      {/* Cara Izquierda */}
      <Plane args={[fondo, alto]} position={[-halfW, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color={color} transparent opacity={CAJA.transparencia} side={THREE.DoubleSide} />
      </Plane>
      
      {/* Cara Derecha */}
      <Plane args={[fondo, alto]} position={[halfW, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color={color} transparent opacity={CAJA.transparencia} side={THREE.DoubleSide} />
      </Plane>
      
      {/* Cara Superior */}
      {mostrarCaraSuperior && (
        <Plane args={[ancho, fondo]} position={[0, halfH, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} transparent opacity={CAJA.transparencia} side={THREE.DoubleSide} />
        </Plane>
      )}
      
      {/* Cara Inferior */}
      {mostrarCaraInferior && (
        <Plane args={[ancho, fondo]} position={[0, -halfH, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} transparent opacity={CAJA.transparencia} side={THREE.DoubleSide} />
        </Plane>
      )}
    </group>
  );
};

// ============================================
// COMPONENTE: Perfil de unión
// ============================================
const PerfilUnion = ({ ancho, fondo, position = [0, 0, 0] }) => {
  const { color, grosor } = CAJA.perfilUnion;
  const halfW = ancho / 2;
  const halfD = fondo / 2;
  
  return (
    <group position={position}>
      <Box args={[ancho, grosor, grosor]} position={[0, 0, halfD]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Box>
      <Box args={[ancho, grosor, grosor]} position={[0, 0, -halfD]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Box>
      <Box args={[grosor, grosor, fondo]} position={[-halfW, 0, 0]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Box>
      <Box args={[grosor, grosor, fondo]} position={[halfW, 0, 0]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Box>
    </group>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export const CajaHerramientas3D = ({
  id = 1,
  position = { x: 0, y: 0, z: 0 },
  isAbierta = false,
  isSelected = false,
  herramientas = [],
  onHerramientaClick,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const { ancho, alto, fondo, baseInferior } = CAJA;
  
  const alturaTotal = alto * 2;
  const centroY = 0.2;
  
  const rotacionTapa = isAbierta ? [CAJA.anguloApertura,0, 0] : [0, 0, 0];
// DESPUÉS (bisagra trasera)
const tapaOffsetY = isAbierta ? alto * 0.6 : 0;
const tapaOffsetZ = isAbierta ? -0.2 : 0;  // o un pequeño valor si quieres desplazarla
  
  const colorActual = (isSelected || hovered) ? '#ffaa44' : CAJA.colorPared;
  
  // Herramientas para mostrar (simplificado)
  const herramientasMostrar = herramientas.slice(0, 6);
  const posicionesHerramientas = [
    { x: -0.25, z: -0.12 }, { x: 0, z: -0.12 }, { x: 0.25, z: -0.12 },
    { x: -0.25, z: 0 }, { x: 0, z: 0 }, { x: 0.25, z: 0 },
  ];
  
  return (
    <group
      position={[position.x, position.y + centroY, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id, e);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* PRISMA INFERIOR (BASE) */}
      <Prisma
        ancho={ancho}
        alto={alto}
        fondo={fondo}
        position={[0, -alto / 2, 0]}
        color={colorActual}
        mostrarCaraSuperior={true}
        mostrarCaraInferior={true}
      />
      
      {/* BASE INFERIOR (refuerzo) */}
      <Prisma
        ancho={baseInferior.ancho}
        alto={alto * 0.5}
        fondo={baseInferior.fondo}
        position={[0, -alto * 0.75, 0]}
        color={colorActual}
        mostrarCaraSuperior={true}
        mostrarCaraInferior={true}
      />
      
      {/* PRISMA SUPERIOR (TAPA) - CON ROTACIÓN */}
      <group position={[0, tapaOffsetY, tapaOffsetZ]} rotation={rotacionTapa}>
        <Prisma
          ancho={ancho}
          alto={alto}
          fondo={fondo}
          position={[0, alto / 2, 0]}
          color={colorActual}
          mostrarCaraSuperior={true}
          mostrarCaraInferior={false}
        />
        
        {/* ASA */}
        <Box args={[CAJA.asa.ancho, CAJA.asa.alto, CAJA.asa.fondo]} 
              position={[0, alto + 0.03, fondo / 8 - 0.05]}>
          <meshStandardMaterial color={CAJA.asa.color} metalness={0.2} roughness={0.5} />
        </Box>
        
        {/* Etiqueta */}
        <Text position={[0, alto - 0.08, fondo / 2 + 0.02]} fontSize={0.08} color="#ffffff" anchorX="center">
          HERRAMIENTAS
        </Text>
      </group>
      
      {/* PERFIL DE UNIÓN */}
      <PerfilUnion ancho={ancho} fondo={fondo} position={[0, 0, 0]} />

      
      {/* HERRAMIENTAS DENTRO */}
      {!isAbierta && herramientasMostrar.map((herramienta, idx) => {
        const pos = posicionesHerramientas[idx % posicionesHerramientas.length];
        return (
          <Box
            key={herramienta.id || idx}
            args={[0.18, 0.06, 0.08]}
            position={[pos.x, -0.1, pos.z]}
            onClick={(e) => {
              e.stopPropagation();
              onHerramientaClick?.(herramienta, idx);
            }}
          >
            <meshStandardMaterial color="#ccaa88" metalness={0.4} roughness={0.3} />
            <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
          </Box>
        );
      })}
      
      {/* HERRAMIENTAS ALREDEDOR (cuando abierta) */}
      {isAbierta && herramientasMostrar.map((herramienta, idx) => {
        const angulo = (idx / herramientasMostrar.length) * Math.PI * 2;
        const radio = 0.7;
        const x = Math.cos(angulo) * radio;
        const z = Math.sin(angulo) * radio;
        return (
          <Box
            key={herramienta.id || idx}
            args={[0.18, 0.06, 0.08]}
            position={[x, 0.05, z]}
            rotation={[0, angulo, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onHerramientaClick?.(herramienta, idx);
            }}
          >
            <meshStandardMaterial color="#ccaa88" metalness={0.4} roughness={0.3} />
            <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
          </Box>
        );
      })}
      
      {/* TOOLTIP */}
      {(hovered || isSelected) && (
        <Html position={[0, alturaTotal + 0.3, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            color: '#ffaa44',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '10px',
            border: '1px solid #ffaa44',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>
            📦 Caja de herramientas #{id}
            {isAbierta && <span style={{ color: '#88ff88' }}> · Abierta</span>}
            {!isAbierta && <span style={{ color: '#ffaa44' }}> · Cerrada</span>}
            <div>🔧 {herramientas.length} herramientas</div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default CajaHerramientas3D;
