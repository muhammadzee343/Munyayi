import React from "react";
import { StyleSheet, Text } from "react-native";
import Ripple from "react-native-material-ripple";

const StartTypeCustomButton = (props) => {
  console.log("start type in start as", props.startType);
  return (
    <Ripple
      rippleColor="gray"
      rippleDuration={1000}
      rippleOpacity={0.87}
      style={
        props.startType === "freelancer" || props.startType === ""
          ? [
              // primary button style
              styles.primaryButtonStyle,
              { width: props.width ? props.width : "80%" },
            ]
          : [
              // primary button style
              styles.secondryButtonStyle,
              { width: props.width ? props.width : "80%" },
            ]
      }
      onPress={props.onPress}
    >
      {props.iconName ? props.iconName : null}
      <Text style={[styles.buttonStyle]}>{props.title}</Text>
    </Ripple>
  );
};

const styles = StyleSheet.create({
  primaryButtonStyle: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#29AAE1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    marginLeft: 10,
  },
  secondryButtonStyle: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00C6AE",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
  },
  invertButtonStyle: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFBD12",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: "#000",
    borderBottomWidth: 2.5,
    borderStartWidth: 1,
    borderEndWidth: 1,
    borderTopWidth: 1,
    flexDirection: "row",
  },
  defaultButtonStyle: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18191F",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
  },
  buttonStyle: {
    alignSelf: "center",
    textTransform: "uppercase",
    fontSize: 17,
    color: "#fff",
    marginLeft: 10,
  },
});

export default StartTypeCustomButton;
