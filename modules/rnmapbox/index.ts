// Reexport the native module. On web, it will be resolved to RnmapboxModule.web.ts
// and on native platforms to RnmapboxModule.ts
export { default } from './src/RnmapboxModule';
export { default as RnmapboxView } from './src/RnmapboxView';
export * from  './src/Rnmapbox.types';
