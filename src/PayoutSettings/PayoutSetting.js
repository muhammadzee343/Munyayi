import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  PanResponder,
  Alert,
  Dimensions
} from "react-native";
import styles from '../Constants/Styles';
import { withNavigation, DrawerActions } from "react-navigation";
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SimpleHeader from '../Header/SimpleHeader';
import * as CONSTANT from "../Constants/Constant";
import Payout from "./Payout";
import YourPayouts from "./YourPayouts";
import axios from "axios";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class PayoutSetting extends Component {
  state = {};

  render() {
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.PayoutSettingheaderText}/>
        <ScrollableTabView
          tabBarTextStyle={styles.AppointmentSettingsTabBarTextStyle}
          tabBarUnderlineStyle={styles.profileTabsUnderlineStyle}
          tabBarActiveTextColor={CONSTANT.primaryColor}
          style={styles.AppointmentSettingsScrollableTabBar}
          showsHorizontalScrollIndicator={false}
        >
          <Payout tabLabel={CONSTANT.PayoutSettingPayoutSettings} />
          <YourPayouts tabLabel={CONSTANT.PayoutSettingYourPayouts} />
        </ScrollableTabView>
      </View>
    );
  }
}
export default withNavigation(PayoutSetting);
