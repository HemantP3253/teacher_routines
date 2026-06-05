import Svg, { Path, SvgProps } from "react-native-svg";

const SuccessIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 -960 960 960" {...props}>
    <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Svg>
);

export default SuccessIcon;
