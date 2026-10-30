import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const SuccessIcon = (props: CustomSvgProps) => (
  <Svg
    width={props.size ?? props.width ?? 24}
    height={props.size ?? props.height ?? 24}
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Svg>
);

export default SuccessIcon;