// src/components/3d/entities/herramientas/index.js
// This file serves as an index for all 3D tool entities in the 'herramientas' subfolder
// It re-exports all components for easy import elsewhere in the application
// Each component should be a React component representing a 3D model of a tool
// Example usage: import { AlicatesPICOhd } from './entities/herramientas'; then use <AlicatesPICOhd /> in your JSX
// Note: Each component file should export a React component, preferably with a name ending in "3D" for clarity
// For example, if you have a file 'AlicatesPICOhd.jsx' that exports a component, it should be imported and re-exported here
// This file can be manually maintained or generated using a script to automate the export statements based on the files present in the 'herramientas' folder
// Example of a component file (e.g. AlicatesPICOhd.jsx):
export { Alicates3D } from './Alicates3D';
export { Tijeras3D } from './Tijeras3D';
export { DestornilladorTorx3D } from './DestornilladorTorx3D';
export { DestornilladorPlano3D } from './DestornilladorPlano3D';
export { DestornilladorPhilips3D } from './DestornilladorPhilips3D';
export { LlaveInglesa3D } from './LlaveInglesa3D';
export { LlaveAllen3D } from './LlaveAllen3D';
export { Multimetro3D } from './Multimetro3D';
export { AlicatesPicoDeLoro3D } from './AlicatesPicoDeLoro3D';
import Model from './AlicatesPICOhd';
export const AlicatesPICOhd = Model;