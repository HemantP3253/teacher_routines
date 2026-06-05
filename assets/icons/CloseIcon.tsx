import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CloseIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="#FFF" viewBox="0 -960 960 960" {...props}>
    <Path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </Svg>
);
export default CloseIcon;
