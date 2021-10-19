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
// import { AsyncStorage } from '@react-native-community/async-storage';
import styles from '../Constants/Styles';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import * as CONSTANT from '../Constants/Constant';
import RNRestart from 'react-native-restart';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class DeleteAccount extends Component {
  state = {
    switchfeaturedValue: false,
    sendSwitchFeaturedValue: '',
    ReasonKnown: [],
    password: '',
    retypePass: '',
    Desc: '',
    isLoading:false,
  };

  componentDidMount() {
    this.DeleteReasonSpinner();
  }

  DeleteReasonSpinner = async () => {
    this.setState({
      isLoading: true
    })
    return fetch(CONSTANT.BaseUrl + 'profile/get_remove_reasons', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        let Reason = responseJson;
        this.setState({
          Reason,
          isLoading: false
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          isLoading: false
        });
      });
  };
  DeleteAccount = async () => {
    this.setState({
      isLoading: true
    })
    const {password, retypePass, Desc} = this.state;
    const {params} = this.props.navigation.state;
    if (password == '' && retypePass == '') {
      //alert("Please enter Email address");
      this.setState({email: CONSTANT.SecuritySettingPlsAddCmpltData});
    } else {
      // this.openProgressbar();
      axios
        .post(CONSTANT.BaseUrl + 'profile/delete_account', {
          user_id: 13,
          password: password,
          retype: retypePass,
          reason: this.state.ReasonKnown[0],
          description: Desc,
        })
        .then(async response => {
          if (response.status === 200) {
            alert(response.data.message);
            AsyncStorage.getAllKeys()
              .then(keys => AsyncStorage.multiRemove(keys))
              .then(() => console.log('success data deleted'));
            this.clearAsyncStorage();
            RNRestart.Restart();
            this.setState({
              isLoading: false,
            })
          } else if (response.status === 203) {
            alert(response.data.message);
            this.setState({
              isLoading: false,
            })
          }
        })
        .catch(error => {
          alert(error);
          console.log(error);
        });
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.deleteAccountcontainer}>
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView style={styles.deleteAccountScrollArea}>
          <View
            style={styles.deleteAccountScrollStyle}>
            <Text
              style={styles.MainHeadingTextStyle}>
              {CONSTANT.SecuritySettingDeleteAccount}
            </Text>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder={CONSTANT.SecuritySettingEnterPassword}
              style={styles.TextInputLayoutStyle}
              onChangeText={password => this.setState({password})}></TextInput>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder={CONSTANT.SecuritySettingRetypePassword}
              style={styles.TextInputLayoutStyle}
              onChangeText={retypePass =>
                this.setState({retypePass})
              }></TextInput>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                //style={styles.deleteAccountMultiStyle}
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({ReasonKnown: value})
                }
                hideTags
                uniqueKey="key"
                items={this.state.Reason}
                selectedItems={this.state.ReasonKnown}
                borderBottomWidth={0}
                single={true}
                selectText={CONSTANT.SecuritySettingPickReason}
                searchInputPlaceholderText={CONSTANT.SecuritySettingReason}
                onChangeInput={text => console.log(text)}
                displayKey="val"
                //styleDropdownMenu={styles.deleteAccountMultiDropdownStyle}
                //searchInputStyle={styles.deleteAccountMultiSearchInput}
                submitButtonColor="#CCC"
                //altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                submitButtonText={CONSTANT.Submit}
              />
            </View>
            <TextInput
              multiline={true}
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder={CONSTANT.SecuritySettingDescription}
              style={styles.TextInputLayoutStyleForDetail}
              onChangeText={Desc => this.setState({Desc})}></TextInput>
          </View>
          <TouchableOpacity
            onPress={this.DeleteAccount}
            style={styles.MainButtonArea}>
            <Text
              style={styles.ButtonText}>
              {CONSTANT.SecuritySettingDeleteBtn}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(DeleteAccount);
