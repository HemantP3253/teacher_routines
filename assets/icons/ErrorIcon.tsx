import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const ErrorIcon = (props: CustomSvgProps) => (
  <Svg
    width={props.size ?? props.width ?? 24}
    height={props.size ?? props.height ?? 24}
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M440-400v-360h80v360h-80Zm0 200v-80h80v80h-80Z" />
  </Svg>
);
export default ErrorIcon;