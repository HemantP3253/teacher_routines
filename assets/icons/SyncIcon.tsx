import { CustomSvgProps } from "@/types/common";
import Svg, { Path } from "react-native-svg";

const SyncIcon = (props: CustomSvgProps) => (
  <Svg
    height={props.size ?? props.height ?? 24}
    width={props.size ?? props.width ?? 24}
    {...props}
  >
    <Path d="M4 20v-2h2.75l-.4-.35q-1.3-1.15-1.83-2.62T4 12.05q0-2.78 1.66-4.94T10 4.25v2.1Q8.2 7 7.1 8.56T6 12.05q0 1.13.43 2.19t1.32 1.96l.25.25V14h2v6H4Zm10-.25v-2.1q1.8-.65 2.9-2.21t1.1-3.49q0-1.13-.43-2.19T16.25 7.8L16 7.55V10h-2V4h6v2h-2.75l.4.35q1.22 1.23 1.79 2.66t.56 2.94q0 2.78-1.66 4.94T14 19.75Z" />
  </Svg>
);
export default SyncIcon;
