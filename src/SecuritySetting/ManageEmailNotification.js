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
import axios from 'axios';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class ManageEmailNotification extends Component {
  state = {
    switchfeaturedValue: false,
    sendSwitchFeaturedValue: '',
    isLoading: true,
    changeEmail: ''
  };
  componentDidMount() {
    this.fetchEmail();
  }
  fetchEmail = async () => {
    const Uid = await AsyncStorage.getItem('projectUid');
    return fetch(
      CONSTANT.BaseUrl + 'profile/get_profile_basic?user_id=' + Uid ,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          EmailData: responseJson.user_email,
          isLoading: false
        })
      })
      .catch(error => {
        console.error(error);
      });
  };

  UpdateEmail = async () => {
    console.log(this.state.changeEmail, this.state.EmailData)
    if(this.state.changeEmail == ''){
      alert('Please change email first')
    }else{
      this.setState({
        isLoading: true
      })
      const Uid = await AsyncStorage.getItem('projectUid');
      axios
      .post(CONSTANT.BaseUrl + 'profile/update_profile_email?user_id=' + Uid, {
        useremail: this.state.changeEmail
      })
      .then(async response => {
        if (response.status === 200) {
          alert(response.data.message);
          console.log('in 200', response.data.message)
          this.setState({
            isLoading: false,
          })
          this.fetchEmail();
        } else if (response.status === 203) {
          alert(response.data.message);
          console.log('in 203', response.data.message)
          this.setState({
            isLoading: false,
          })
        }
      })
      .catch(error => {
        console.log('in error', error);
        this.setState({
          isLoading: false,
        })
      });
    }
  };

  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.emailcontainer}>
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView style={styles.emailScrollArea}>
          <View style={styles.emailScrollStyle}>
            <View style={{marginBottom:10}}>
              <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.SecuritySettingEmailNotification}
              </Text>
              <Text style={[styles.ParagraphTextStyle, {marginBottom:10}]}>
                On update the email address, please note this email will be changed for your both accounts, if you have switched the profiles
              </Text>
              <Text style={styles.ParagraphTextStyle}>
                All the emails will be sent to the below email address
              </Text>
            </View>
            {this.state.EmailData && (
              <View style={styles.emailTextArea}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  style={styles.emailTextStyle}
                  onChangeText={changeEmail => this.setState({changeEmail})}
                  >
                  {this.state.EmailData}
                </TextInput>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={this.UpdateEmail}
            style={styles.MainButtonArea}>
            <Text
              style={styles.ButtonText}>
              {CONSTANT.SecuritySettingEmailBtn}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(ManageEmailNotification);
