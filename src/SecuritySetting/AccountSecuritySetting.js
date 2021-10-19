import React, {Component} from 'react';
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
  Dimensions,
  AsyncStorage,
} from 'react-native';
import styles from '../Constants/Styles';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import * as CONSTANT from '../Constants/Constant';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class AccountSecuritySetting extends Component {
  state = {
    switchfeaturedValue: false,
    sendSwitchFeaturedValue: '',
    ProjectLocationKnown: [],
    isLoading: true,
    LanguageData: [],
    UserLanguageData: [],
  };
  componentDidMount() {
    this.fetchSetting();
  }
  fetchSetting = async () => {
    const Uid = await AsyncStorage.getItem('projectUid');
    return fetch(CONSTANT.BaseUrl + 'profile/get_setting?user_id='+ Uid, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        let settingData = responseJson;
        if (settingData.block_val == 'on') {
          this.setState({
            switchfeaturedValue: true,
          });
        } else if (settingData.block_val == 'off') {
          this.setState({
            switchfeaturedValue: false,
          });
        }
        this.setState({
          settingData,
          isLoading: false,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  BlockAaccount = async () => {
    axios
      .post(CONSTANT.BaseUrl + 'profile/update_block_setting', {
        user_id: 12,
        block_setting: this.state.sendSwitchFeaturedValue,
      })
      .then(async response => {
        if (response.status === 200) {
          alert(response.data.message);
        } else if (response.status === 203) {
          alert(response.data.message);
        }
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  };
  togglefeaturedSwitch = value => {
    this.setState({switchfeaturedValue: value});
    if (value == true) {
      this.state.sendSwitchFeaturedValue = 'on';
    } else {
      this.state.sendSwitchFeaturedValue = 'off';
    }
  };

  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.Accountsecuritycontainer}>
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView style={styles.AccountsecurityScrollArea}>
          <View style={styles.AccountsecurityScrollStyle}>
            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.SecuritySettingAccount}
            </Text>
            {/* <Text style={styles.AccountsecurityScrollDetailText}>
              {CONSTANT.SecuritySettingDetail}
            </Text> */}
            <View style={styles.AccountsecurityScrollDisableArea}>
              <Text style={styles.AccountsecurityScrollDisableText}>
                {CONSTANT.SecuritySettingDisableAccount}
              </Text>
              <Switch
                style={styles.AccountsecurityScrollSwitch}
                onValueChange={this.togglefeaturedSwitch}
                value={this.state.switchfeaturedValue}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={this.BlockAaccount}
            style={styles.MainButtonArea}>
            <Text style={styles.ButtonText}>
              {CONSTANT.SecuritySettingAccountBtn}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(AccountSecuritySetting);
