import React from "react";
import Svg, { Path } from "react-native-svg";

const DollarsIcon = (props) => {
  return (
    <Svg height="15" width="15" viewBox="0 0 512 512">
      <Path
        fill={props.iconColor}
        fillRule="evenodd"
        d="M512 256c0 141.387-114.613 256-256 256S0 397.387 0 256 114.613 0 256 0s256 114.613 256 256zm0 0"
        // fill="#ffcb5a"
      />
      <Path
        fill={props.iconColor}
        fillRule="evenodd"
        d="M437.023 437.023c-99.808 99.809-262.222 99.809-362.03 0-99.81-99.808-99.81-262.222 0-362.03zm0 0"
        // fill="#fba61f"
      />
      <Path
        fill={props.iconColor}
        fillRule="evenodd"
        d="M256 176h64v-32h-48V96h-32v50.273c-27.52 7.153-48 32-48 61.727 0 35.297 28.703 64 64 64 17.648 0 32 14.352 32 32s-14.352 32-32 32h-64v32h48v48h32v-50.273c27.52-7.153 48-32 48-61.727 0-35.297-28.703-64-64-64-17.648 0-32-14.352-32-32s14.352-32 32-32zm0 0"
        fill="#fff"
      />
    </Svg>
  );
};

export default DollarsIcon;
