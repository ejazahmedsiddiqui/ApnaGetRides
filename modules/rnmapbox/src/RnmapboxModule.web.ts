import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './Rnmapbox.types';

type RnmapboxModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class RnmapboxModule extends NativeModule<RnmapboxModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(RnmapboxModule, 'RnmapboxModule');
