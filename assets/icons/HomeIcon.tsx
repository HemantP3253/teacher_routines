import { CustomSvgProps } from "@/interfaces/interfaces";
import Svg, { Path } from "react-native-svg";

const HomeIcon = (props: CustomSvgProps) => (
  <Svg width={24} height={24} viewBox="0 -960 960 960" {...props}>
    {props.fillItem ? (
      <Path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
    ) : (
      <Path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
    )}
  </Svg>
);

export default HomeIcon;
