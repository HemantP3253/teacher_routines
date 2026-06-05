import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const ArrowDownIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 -960 960 960" {...props}>
    <Path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
  </Svg>
);

export default ArrowDownIcon;
