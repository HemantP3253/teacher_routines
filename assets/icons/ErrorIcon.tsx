import Svg, { Path, SvgProps } from "react-native-svg";

const ErrorIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 -960 960 960" {...props}>
    <Path d="M440-400v-360h80v360h-80Zm0 200v-80h80v80h-80Z" />
  </Svg>
);
export default ErrorIcon;
