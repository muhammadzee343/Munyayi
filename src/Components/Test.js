import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Test(props) {
  return (
    <View>
      <Text>{props.companyData}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
