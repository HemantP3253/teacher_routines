import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const CheckSmallIcon = (props: CustomSvgProps) => (
  <Svg
    width={props.size ?? props.width ?? 24}
    height={props.size ?? props.height ?? 24}
    fill="#FFF"
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
  </Svg>
);
export default CheckSmallIcon;