import { NativeModule, requireNativeModule } from 'expo';

import { RnmapboxModuleEvents } from './Rnmapbox.types';

declare class RnmapboxModule extends NativeModule<RnmapboxModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<RnmapboxModule>('Rnmapbox');
