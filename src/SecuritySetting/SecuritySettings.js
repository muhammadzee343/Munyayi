import React, { Component } from "react";
import { View, StyleSheet, StatusBar, ScrollView,Switch, Text, TouchableOpacity, TextInput, Image, FlatList,ActivityIndicator, PanResponder, Alert, Dimensions } from "react-native";
import { withNavigation, DrawerActions } from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
//import CustomHeader from '../Header/CustomHeader';
import SimpleHeader from "../Header/SimpleHeader";
import * as CONSTANT from '../Constants/Constant';

import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import AccountSecuritySetting from './AccountSecuritySetting';
import ManageEmailNotification from './ManageEmailNotification';
import BillingAddress from './BillingAddress';
import axios from "axios";
import styles from '../Constants/Styles';
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class SecuritySettings extends Component {
    state={
      switchfeaturedValue: false,
      sendSwitchFeaturedValue: "",
    }
    
  render() {

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <SimpleHeader HeaderText={CONSTANT.SecuritySettingHeaderText} />
        <ScrollableTabView 
          tabBarTextStyle={styles.tabBarTextStyle} 
          tabBarUnderlineStyle={styles.tabBarUnderlineStyl} 
          tabBarActiveTextColor="#3d4461" 
          style={styles.tabBarStyle} 
          showsHorizontalScrollIndicator={false}
        >
          <AccountSecuritySetting tabLabel={CONSTANT.SecuritySettingTabSecurity} />
          <BillingAddress tabLabel={CONSTANT.SecuritySettingTabBilling} />
          <ChangePassword  tabLabel={CONSTANT.SecuritySettingTabPassword} />
          <ManageEmailNotification tabLabel={CONSTANT.SecuritySettingTabEmail} />
          <DeleteAccount tabLabel={CONSTANT.SecuritySettingTabDelete} />
        </ScrollableTabView>
      </View>
    );
  }
}
export default withNavigation(SecuritySettings);
