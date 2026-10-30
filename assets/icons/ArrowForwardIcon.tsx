import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const ArrowForwardIcon = (props: CustomSvgProps) => (
  <Svg
    width={props.size ?? props.width ?? 24}
    height={props.size ?? props.height ?? 24}
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
  </Svg>
);
export default ArrowForwardIcon;