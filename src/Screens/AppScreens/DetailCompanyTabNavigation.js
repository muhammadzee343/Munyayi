import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import {
  createMaterialTopTabNavigator,
  createTabNavigator,
} from "react-navigation-tabs";
import * as CONSTANT from "../../Constants/Constant";

export class AbouCompnayTabNavigationtScreen extends PureComponent {
  state = {
    data: [],
    isLoading: true,
    iconColor: CONSTANT.primaryColor,
    text: CONSTANT.DetailCompanyScreenSaveCompany,
  };
  render() {
    const { params } = this.props.navigation.state;
    // console.log("params.profile_id in detail", params.profile_id);
    return (
      <View>
        {/* {" "} */}
        {/* <Text>{props.companyData[0].employer_des}</Text>, */}
        <Text>THis is About employee screen</Text>
      </View>
    );
  }
}
export class JobOpeningTabNavigationtScreen extends PureComponent {
  state = {
    data: [],
    isLoading: true,
    iconColor: CONSTANT.primaryColor,
    text: CONSTANT.DetailCompanyScreenSaveCompany,
  };
  render() {
    // console.log("params.companyData", props.navigation.state);
    return (
      <View>
        <Text>THis is job opening screen</Text>
      </View>
    );
  }
}
const TabNavigator = createMaterialTopTabNavigator({
  About: AbouCompnayTabNavigationtScreen,
  JobOpening: JobOpeningTabNavigationtScreen,
});

export default createAppContainer(TabNavigator);
