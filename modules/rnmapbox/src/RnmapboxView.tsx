import { requireNativeView } from 'expo';
import * as React from 'react';

import { RnmapboxViewProps } from './Rnmapbox.types';

const NativeView: React.ComponentType<RnmapboxViewProps> =
  requireNativeView('Rnmapbox');

export default function RnmapboxView(props: RnmapboxViewProps) {
  return <NativeView {...props} />;
}
