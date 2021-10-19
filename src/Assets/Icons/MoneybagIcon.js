import React from "react";
import Svg, { Path } from "react-native-svg";

const MoneybagIcon = (props) => {
  return (
    <Svg height="22" width="22" viewBox="0 0 512 512">
      <Path
        fill={props.iconColor}
        fillRule="evenodd"
        d="M256 151.969c-109.843 0-195.017 120.962-195.017 225.019C60.983 498.009 172.292 512 256 512s195.017-13.99 195.017-135.012c0-104.057-85.174-225.019-195.017-225.019zm15.411 252.311c-.135.049-.275.026-.41.073v17.638c0 8.292-6.71 15.001-15.001 15.001s-15.001-6.71-15.001-15.001v-17.742c-9.889-3.336-19.362-9.667-27.453-19.307-5.332-6.344-4.512-15.807 1.846-21.14 6.329-5.332 15.792-4.526 21.125 1.831 29.578 35.328 49.544-18.649 19.484-18.649-24.816 0-45.004-20.188-45.004-45.004 0-17.951 10.277-35.068 30.003-42.089v-17.917c0-8.292 6.71-15.001 15.001-15.001 8.292 0 15.001 6.71 15.001 15.001v17.966c7.767 2.617 15.34 6.774 22.092 13.311 5.948 5.771 6.124 15.265.352 21.213-5.771 5.963-15.265 6.123-21.213.352-27.596-26.658-46.235 22.165-16.231 22.165 24.816 0 45.004 20.188 45.004 45.004-.002 18.841-11.898 35.85-29.595 42.295zM341.554 12.086c-55.376-16.114-115.733-16.114-171.109 0-9.292 2.689-13.728 13.478-8.731 22.004l22.69 40.62c39.454-15.699 97.974-18.043 143.186.007l22.694-40.627c4.997-8.526.561-19.314-8.73-22.004zM325.652 107.406c-28.068-19.774-110.404-20.599-139.478.092-12.465 8.799-19.101 22.623-18.972 37.064 28.806-15.26 62.582-22.595 88.798-22.595 31.931 0 61.842 8.314 88.8 22.595.124-13.913-6.059-27.926-19.148-37.156z"
      />
    </Svg>
  );
};

export default MoneybagIcon;