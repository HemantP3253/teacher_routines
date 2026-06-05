import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CheckSmallIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="#FFF" viewBox="0 -960 960 960" {...props}>
    <Path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
  </Svg>
);
export default CheckSmallIcon;
