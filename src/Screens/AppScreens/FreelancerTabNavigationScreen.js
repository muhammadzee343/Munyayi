import React from "react";
import { createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import FreeelancerProjectStatusScreen from "./FreeelancerProjectStatusScreen";
import FreelancerAboutScreen from "./FreelancerAboutScreen";
import FreelancerSkillsScreen from "./FreelancerSkillsScreen";

const TabNavigator = createMaterialTopTabNavigator({
  About: FreelancerAboutScreen,
  Status: FreeelancerProjectStatusScreen,
  Skills: FreelancerSkillsScreen,
});

export default createAppContainer(TabNavigator);
