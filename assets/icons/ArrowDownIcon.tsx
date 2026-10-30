import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const ArrowDownIcon = (props: CustomSvgProps) => (
  <Svg
    width={props.size ?? props.width ?? 24}
    height={props.size ?? props.height ?? 24}
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
  </Svg>
);

export default ArrowDownIcon;