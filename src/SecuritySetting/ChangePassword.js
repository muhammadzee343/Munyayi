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
  AsyncStorage
} from 'react-native';
import styles from '../Constants/Styles';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import * as CONSTANT from '../Constants/Constant';
import axios from 'axios';
import RNRestart from 'react-native-restart';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class ChangePassword extends Component {
  state = {
    switchfeaturedValue: false,
    sendSwitchFeaturedValue: '',
    oldPassword: '',
    newPassword: '',
    isLoading: false,
  };
  change_Password = async () => {
    this.setState({
      isLoading: true,
    })
    const {oldPassword, newPassword} = this.state;
    const {params} = this.props.navigation.state;
    const Uid = await AsyncStorage.getItem('projectUid');
    if (oldPassword == '' && newPassword == '') {
      //alert("Please enter Email address");
      this.setState({email: CONSTANT.SecuritySettingPlsAddCmpltData});
    } else {
      // this.openProgressbar();
      axios
        .post(CONSTANT.BaseUrl + 'profile/update_password', {
          user_id: Uid,
          password: oldPassword,
          retype: newPassword,
        })
        .then(async response => {
          if (response.status === 200) {
            this.logout();
            Alert.alert(CONSTANT.Success , JSON.stringify(response.data.message));
            this.setState({
              isLoading : false,
            })
            
          } else if (response.status === 203) {
            Alert.alert(CONSTANT.OopsText , JSON.stringify(response.data.message));
            this.setState({
              isLoading : false,
            })
          }
        })
        .catch(error => {
          alert(error);
          console.log(error);
        });
    }
  };
  logout = async () => {
    const {id, storedValue, storedType, profileImg, type} = this.state;
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + 'user/do_logout', {
        user_id: Uid,
      })
      .then(async response => {
        console.log('data', id, JSON.stringify(response));
        if (response.status == 200) {
          AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => console.log('success data deleted'));
          this.clearAsyncStorage();
          RNRestart.Restart();
        } else if (response.status == 203) {
          alert(CONSTANT.AppIncorrectDetail);
        }
      })
      .catch(error => {
        alert(CONSTANT.AppIncorrectDetail);
      });
  };
  clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
  render() {
    const {oldPassword, newPassword ,isLoading} = this.state;
    return (
      <View style={styles.changePasswordcontainer}>
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView style={styles.changePasswordScrollArea}>
          <View style={styles.changePasswordScrollStyle}>
            <View style={{marginBottom:10}}>
              <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.SecuritySettingChangePassword}
              </Text>
              <Text style={styles.ParagraphTextStyle}>
                If you will change the password, please note this will be updated for your both accounts, if you have switched the profiles
              </Text>
            </View>
            <TextInput
              onChangeText={oldPassword => this.setState({oldPassword})}
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder={CONSTANT.SecuritySettingLastPassword}
              style={styles.TextInputLayoutStyle}></TextInput>
            <TextInput
              onChangeText={newPassword => this.setState({newPassword})}
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder={CONSTANT.SecuritySettingNewPassword}
              style={styles.TextInputLayoutStyle}></TextInput>
          </View>
          <TouchableOpacity
            onPress={this.change_Password}
            style={styles.MainButtonArea}>
            <Text style={styles.ButtonText}>
              {CONSTANT.SecuritySettingPasswordBtn}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(ChangePassword);
