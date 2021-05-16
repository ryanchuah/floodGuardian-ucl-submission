import * as React from 'react';
import Svg, {Circle} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={35} height={35} viewBox="0 0 35 35" fill="none" {...props}>
      <Circle cx={17.5} cy={17.5} r={15.5} stroke="#FFE600" strokeWidth={4} />
    </Svg>
  );
}

export default SvgComponent;
