import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const ArrowUpIcon = (props: CustomSvgProps) => (
  <Svg
    width={props.size ?? props.width ?? 24}
    height={props.size ?? props.height ?? 24}
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
  </Svg>
);
export default ArrowUpIcon;