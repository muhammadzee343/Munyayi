import React from "react";
import { createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import AboutScreen from "./AboutScreen";
import LocationScreen from "./AppScreens/Location";
import PersonalDetail from "./AppScreens/PersonalDetail";
import StartUsScreen from "./AppScreens/StartUs";
import ProjectStatusScreen from "./ProjectStatus";

const TabNavigator = createMaterialTopTabNavigator({
  Personal: PersonalDetail,
  Location: LocationScreen,
  StartUs: StartUsScreen,
});

export default createAppContainer(TabNavigator);
