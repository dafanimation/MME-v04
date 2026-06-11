// src/components/3d/entities/DVI3D.jsx
import React, { useState, useEffect } from 'react';
import { Box, Html, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../core/config';

// SVG del conector DVI
const dviSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#b6b6b6">
  <g><g><path d="M59.733,238.933c-9.387,0-17.067,7.68-17.067,17.067s7.68,17.067,17.067,17.067S76.8,265.387,76.8,256 S69.12,238.933,59.733,238.933z"/></g></g>
  <g><g><path d="M153.6,213.333v66.56l5.973,18.773h192.853l5.973-18.773v-66.56H153.6z M298.667,221.867h17.067v17.067h-17.067V221.867z M187.733,290.133h-17.067v-17.067h17.067V290.133z M187.733,264.533h-17.067v-17.067h17.067V264.533z M187.733,238.933h-17.067 v-17.067h17.067V238.933z M213.333,290.133h-17.067v-17.067h17.067V290.133z M213.333,264.533h-17.067v-17.067h17.067V264.533z M213.333,238.933h-17.067v-17.067h17.067V238.933z M238.933,290.133h-17.067v-17.067h17.067V290.133z M238.933,264.533h-17.067 v-17.067h17.067V264.533z M238.933,238.933h-17.067v-17.067h17.067V238.933z M264.533,290.133h-17.067v-17.067h17.067V290.133z M264.533,264.533h-17.067v-17.067h17.067V264.533z M264.533,238.933h-17.067v-17.067h17.067V238.933z M315.733,290.133h-17.067 v-17.067h17.067V290.133z M341.333,290.133h-17.067v-17.067h17.067V290.133z M341.333,264.533h-42.667v-17.067h42.667V264.533z M341.333,238.933h-17.067v-17.067h17.067V238.933z"/></g></g>
  <g><g><path d="M486.4,187.733h-76.8v-25.6c0-9.387-7.68-17.067-17.067-17.067H119.467c-9.387,0-17.067,7.68-17.067,17.067v25.6H25.6 c-14.507,0-25.6,11.093-25.6,25.6v85.333c0,14.507,11.093,25.6,25.6,25.6h76.8v25.6c0,9.387,7.68,17.067,17.067,17.067h273.067 c9.387,0,17.067-7.68,17.067-17.067v-25.6h76.8c14.507,0,25.6-11.093,25.6-25.6v-85.333 C512,198.827,500.907,187.733,486.4,187.733z M59.733,290.133C40.96,290.133,25.6,274.773,25.6,256s15.36-34.133,34.133-34.133 S93.867,237.227,93.867,256S78.507,290.133,59.733,290.133z M375.467,281.6c0,0.853,0,1.707-0.853,2.56l-8.533,25.6 c-0.853,3.413-4.267,5.973-7.68,5.973H153.6c-3.413,0-6.827-2.56-7.68-5.973l-8.533-25.6c0-0.853-0.853-1.707-0.853-2.56v-68.267 c0-9.387,7.68-17.067,17.067-17.067h204.8c9.387,0,17.067,7.68,17.067,17.067V281.6z M452.267,290.133 c-18.773,0-34.133-15.36-34.133-34.133s15.36-34.133,34.133-34.133c18.773,0,34.133,15.36,34.133,34.133 S471.04,290.133,452.267,290.133z"/></g></g>
  <g><g><path d="M452.267,238.933c-9.387,0-17.067,7.68-17.067,17.067s7.68,17.067,17.067,17.067c9.387,0,17.067-7.68,17.067-17.067 S461.653,238.933,452.267,238.933z"/></g></g>
</svg>`;

export const DVI3D = ({
  position = { x: 0, y: 0, z: 0 },
  rotation = [0, 0, 0],
  onClick,
  isSelected = false,
  yOffset = 0,
  tipo = 'DVI-D',
  version = 'Dual Link',
  marca = 'Startech',
}) => {
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  const [textureError, setTextureError] = useState(false);
  const BASE_Y_OFFSET = 0.08;

  const color = isSelected ? COLORS.selected : (hovered ? '#dd8833' : '#aa6633');

  useEffect(() => {
    const svgBlob = new Blob([dviSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setTexture(tex);
      URL.revokeObjectURL(url);
    };
    img.onerror = (err) => {
      console.error('Error cargando SVG de DVI:', err);
      setTextureError(true);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    return () => {
      if (texture) texture.dispose();
    };
  }, []);

  return (
    <group
      position={[position.x, position.y + yOffset + BASE_Y_OFFSET, position.z]}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >

      <group position={[0, 0.06, 0]}>
        {!textureError && texture ? (
          <Plane args={[0.85, 0.85]} position={[0, 0, 0]}>
            <meshStandardMaterial map={texture} transparent side={2} />
          </Plane>
        ) : (
          <Html position={[0, 0, 0]} center>
            <div style={{ fontSize: '50px', filter: 'drop-shadow(0 0 5px #ffaa44)' }}>🔌</div>
          </Html>
        )}
        <Html position={[0, -0.45, 0]} center>
          <div style={{ fontSize: '9px', color: '#ccc', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
            {tipo}
          </div>
        </Html>
      </group>

      {(hovered || isSelected) && (
        <Html position={[0, 0.55, 0]} center>
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
            🔌 {marca} {tipo}<br/>
            {version}
          </div>
        </Html>
      )}
    </group>
  );
};

export default DVI3D;