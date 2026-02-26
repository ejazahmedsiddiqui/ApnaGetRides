import * as React from 'react';

import { RnmapboxViewProps } from './Rnmapbox.types';

export default function RnmapboxView(props: RnmapboxViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
