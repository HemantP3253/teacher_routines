import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const CloseIcon = (props: CustomSvgProps) => (
  <Svg
    width={props.size ?? props.width ?? 24}
    height={props.size ?? props.height ?? 24}
    fill="#FFF"
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </Svg>
);
export default CloseIcon;