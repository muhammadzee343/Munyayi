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
  Linking,
} from 'react-native';
import styles from '../Constants/Styles';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import * as CONSTANT from '../Constants/Constant';
import AntIcon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class Payout extends Component {
  state = {
    PayoutSettingsData: '',
    PayPalClicked: false,
    bacsClicked: false,
    payoneerClicked: false,
    Paypalemail: '',
    Accountname:'',
    number:'',
    Bankname:'',
    Routingnumber:'',
    iban:'',
    bic:'',
    spinner:false,
    paypalRes:'',
    bacsres:'',
  };
  componentDidMount() {
    this.fetchPayoutSettings();
    this.OnLoadPageTypeTrue();
  }
  fetchPayoutSettings = async () => {
    this.setState({
      spinner: true
    })
    const id = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + 'profile/get_payout_setting?user_id=' + id,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({PayoutSettingsData: [], spinner: false}); // empty data set
    } else {
      this.setState({PayoutSettingsData: json, spinner: false});
      console.log('payouts', this.state.PayoutSettingsData.options)
      
      // var text = this.state.PayoutSettingsData.saved_settings.paypal_email;
      // var result = text.slice(0, 4)+'****';
      // this.setState({
      //   paypalRes :result
      // })

      // var text_basc = this.state.PayoutSettingsData.saved_settings.bank_account_number;
      // var result_basc = text_basc.slice(0, 4)+'****';
      // this.setState({
      //   bacsres :result_basc
      // })
    }
  };
  OnLoadPageTypeTrue = () => {
    // if(this.state.PayoutSettingsData.saved_settings.type == 'paypal'){
    //   this.setState({
    //     PayPalClicked: true,
    //   });
    // }else{null}
    
    if(this.state.PayoutSettingsData != ''){
      Alert.alert('type', JSON.stringify(this.state.PayoutSettingsData.saved_settings.type));
    }
    
    // {this.state.PayoutSettingsData != '' && this.state.PayoutSettingsData.saved_settings.type == 'paypal' && (
    //   this.setState({ PayPalClicked: true})
    // )}
    // Alert.alert('click', JSON.stringify(this.state.PayPalClicked))
  };
  PayPalPress = () => {
    this.setState({
      PayPalClicked: true,
      bacsClicked: false,
      payoneerClicked: false,
    });
  };
  BacsPress = () => {
    this.setState({
      PayPalClicked: false,
      bacsClicked: true,
      payoneerClicked: false,
    });
  };
  PayoneerPress = () => {
    this.setState({
      PayPalClicked: false,
      bacsClicked: false,
      payoneerClicked: true,
    });
  };
  handlePaypalClick = () => {
    Linking.canOpenURL('https://www.paypal.com/').then(supported => {
      if (supported) {
        Linking.openURL('https://www.paypal.com/');
      } else {
        console.log("Don't know how to open URI: " + 'https://www.paypal.com/');
      }
    });
  };
  handlePaypalCreateAccountClick = () => {
    Linking.canOpenURL('https://www.paypal.com/gb/welcome/signup/#/mobile_conf',).then(supported => {
      if (supported) {
        Linking.openURL(
          'https://www.paypal.com/gb/welcome/signup/#/mobile_conf',
        );
      } else {
        console.log(
          "Don't know how to open URI: " +
            'https://www.paypal.com/gb/welcome/signup/#/mobile_conf',
        );
      }
    });
  };
  handlePayoneerCreateAccountClick = () => {
    Linking.canOpenURL('https://www.payoneer.com/accounts/',).then(supported => {
      if (supported) {
        Linking.openURL(
          'https://www.payoneer.com/accounts/',
        );
      } else {
        console.log(
          "Don't know how to open URI: " +
            'https://www.payoneer.com/accounts/',
        );
      }
    });
  };
  ChangeBacs =async() => {
    this.setState({
      spinner: true
    })
    const {Accountname,
    number,
    Bankname,
    Routingnumber,
    iban,
    bic, } = this.state;
    var payout_settings = {};
    payout_settings["type"] = "bacs";
    payout_settings["bank_account_name"] = Accountname;
    payout_settings["bank_account_number"] = number;
    payout_settings["bank_name"] = Bankname;
    payout_settings["bank_routing_number"] = Routingnumber;
    payout_settings["bank_iban"] = iban;
    payout_settings["bank_bic_swift"] = bic;
    const Uid = await AsyncStorage.getItem('projectUid');
    //if (code) {
      axios
        .post(CONSTANT.BaseUrl + 'profile/update_payout_setting', {
          user_id: Uid,
          payout_data:payout_settings
        })
        .then(async response => {
          if (response.status === 200) {
            Alert.alert(CONSTANT.Success, JSON.stringify(response.data.message));
            this.setState({spinner:false})
            this.fetchPayoutSettings();
          } else if (response.status === 203) {
            Alert.alert(CONSTANT.OopsText, JSON.stringify(response));
            this.setState({spinner:false})
          }
        })
        .catch(error => {
          Alert.alert(error);
          console.log(error);
        });
    // } 
    // else {
    //   Alert.alert(CONSTANT.Error, CONSTANT.PleaseEnterCode);
    // }
  };
  ChangePayPal = async () => {
    this.setState({
      spinner: true
    })
    const {Paypalemail } = this.state;
    var payout_settings = {};
    payout_settings["type"] = "paypal";
    payout_settings["paypal_email"] = Paypalemail;
    const Uid = await AsyncStorage.getItem('projectUid');
    //if (code) {
      axios
        .post(CONSTANT.BaseUrl + 'profile/update_payout_setting', {
          user_id: Uid,
          payout_data:payout_settings
        })
        .then(async response => {
          if (response.status === 200) {
            Alert.alert(CONSTANT.Success, JSON.stringify(response.data.message));
            this.setState({spinner:false})
            this.fetchPayoutSettings();
          } else if (response.status === 203) {
            Alert.alert(CONSTANT.OopsText, JSON.stringify(response.data.message));
            this.setState({spinner:false})
            
          }
        })
        .catch(error => {
          Alert.alert(error);
          console.log(error);
        });
    // } 
    // else {
    //   Alert.alert(CONSTANT.Error, CONSTANT.PleaseEnterCode);
    // }
  };
  render() {
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        {spinner ? (
            <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView>
          <Text style={{color: '#323232', margin: 10, fontSize: 13}}>
            {CONSTANT.PayoutMainText}
          </Text>

          {this.state.PayoutSettingsData != '' && (
          <TouchableOpacity
            onPress={() => this.BacsPress()}
            style={{
              borderColor: '#767676',
              borderRadius: 4,
              borderWidth: 0.6,
              padding: 10,
              flexDirection: 'row',
              marginVertical: 10,
              marginHorizontal: 10,
              alignItems: 'center',
            }}>
              <View>
                {this.state.PayoutSettingsData.saved_settings.type == 'bacs' ? (
                  <AntIcon
                    name="checkcircle"
                    color={'green'}
                    size={17}
                    style={styles.AdvanceSearchIcon}
                  />
                ) : (
                  <AntIcon
                    name="checkcircleo"
                    color={'#767676'}
                    size={17}
                    style={styles.AdvanceSearchIcon}
                  />
                )}
              </View>

            <View style={styles.bannerImgArea}>
              {this.state.PayoutSettingsData != '' && (
                <Image
                  resizeMode={'contain'}
                  source={{
                    uri: this.state.PayoutSettingsData.payout_settings.bacs
                      .img_url,
                  }}
                  style={{width: 150, height: 100, marginLeft: 15}}></Image>
              )}
            </View>
          </TouchableOpacity>
          )}
          {this.state.PayoutSettingsData != '' &&
            this.state.bacsClicked == true && (
              <View>
              <Text style={{fontSize: 15, margin: 10}}>
                {CONSTANT.PayoutPleaseAddAll}
              </Text>
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                  marginBottom: 5,
                }}
                underlineColorAndroid="transparent"
                placeholder={(this.state.PayoutSettingsData.saved_settings.bank_account_name == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutBankAccountName : this.state.PayoutSettingsData.saved_settings.bank_account_name}
                placeholderTextColor="#807f7f"
                onChangeText={Accountname => this.setState({Accountname})}
              />
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                  marginBottom: 5,
                }}
                underlineColorAndroid="transparent"
                placeholder={(this.state.PayoutSettingsData.saved_settings.bank_account_number == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutBankAccountNumber : this.state.PayoutSettingsData.saved_settings.bank_account_number}
                placeholderTextColor="#807f7f"
                onChangeText={number => this.setState({number})}
              />
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                  marginBottom: 5,
                }}
                underlineColorAndroid="transparent"
                placeholder={(this.state.PayoutSettingsData.saved_settings.bank_name == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutBankName : this.state.PayoutSettingsData.saved_settings.bank_name}
                placeholderTextColor="#807f7f"
                onChangeText={Bankname => this.setState({Bankname})}
              />
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                  marginBottom: 5,
                }}
                underlineColorAndroid="transparent"
                placeholder={(this.state.PayoutSettingsData.saved_settings.bank_routing_number == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutBankRoutingNumber: this.state.PayoutSettingsData.saved_settings.bank_routing_number}
                placeholderTextColor="#807f7f"
                onChangeText={Routingnumber => this.setState({Routingnumber})}
          
              />
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                  marginBottom: 5,
                }}
                underlineColorAndroid="transparent"
                placeholder={(this.state.PayoutSettingsData.saved_settings.bank_iban == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutBankIBAN : this.state.PayoutSettingsData.saved_settings.bank_iban}
                placeholderTextColor="#807f7f"
                onChangeText={iban => this.setState({iban})}
                
              />
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                  marginBottom: 5,
                }}
                underlineColorAndroid="transparent"
                placeholder={(this.state.PayoutSettingsData.saved_settings.bank_bic_swift == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutBankBICSWIFT : this.state.PayoutSettingsData.saved_settings.bank_bic_swift}
                placeholderTextColor="#807f7f"
                onChangeText={bic => this.setState({bic})}
              
              />
              <TouchableOpacity
              onPress={()=> this.ChangeBacs()}
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: CONSTANT.primaryColor,
                  borderRadius: 4,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: 200,
                  marginTop: 10,
                }}>
                <Text style={styles.LoginBTNText}>{CONSTANT.Submit}</Text>
              </TouchableOpacity>
            </View>
            )}

          {this.state.PayoutSettingsData != '' && (
          <TouchableOpacity
            onPress={() => this.PayPalPress()}
            style={{
              borderColor: '#767676',
              borderRadius: 4,
              borderWidth: 0.6,
              padding: 10,
              flexDirection: 'row',
              marginVertical: 10,
              marginHorizontal: 10,
              alignItems: 'center',
            }}>
            
              <View>
                {this.state.PayoutSettingsData.saved_settings.type == 'paypal' ? (
                  <AntIcon
                    name="checkcircle"
                    color={'green'}
                    size={17}
                    style={styles.AdvanceSearchIcon}
                  />
                ) : (
                  <AntIcon
                    name="checkcircleo"
                    color={'#767676'}
                    size={17}
                    style={styles.AdvanceSearchIcon}
                  />
                )}
              </View>

            <View style={styles.bannerImgArea}>
              {this.state.PayoutSettingsData != '' && (
                <Image
                  resizeMode={'contain'}
                  source={{
                    uri: this.state.PayoutSettingsData.payout_settings.paypal
                      .img_url,
                  }}
                  style={{width: 150, height: 100, marginLeft: 15}}></Image>
              )}
            </View>
          </TouchableOpacity>
          )}
          {this.state.PayoutSettingsData != '' &&
            this.state.PayPalClicked == true &&(
              <View>
              <Text style={{fontSize: 15, margin: 10}}>
                {CONSTANT.PayoutAddPaypalID}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  onPress={() => this.handlePaypalClick()}
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    margin: 10,
                    color: 'skyblue',
                  }}>
                  {CONSTANT.PayoutPaypal}
                </Text>
                <Text style={{fontSize: 15, fontWeight: '700', margin: 10}}>
                  |
                </Text>
                <Text
                  onPress={() => this.handlePaypalCreateAccountClick()}
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    margin: 10,
                    color: 'skyblue',
                  }}>
                  {CONSTANT.PayoutCreateAccount}
                </Text>
              </View>
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                }}
                underlineColorAndroid="transparent"
                name="Email"
                placeholder={(this.state.PayoutSettingsData.saved_settings.paypal_email == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutAddPayPalEmail : this.state.PayoutSettingsData.saved_settings.paypal_email}
                placeholderTextColor="#807f7f"
                onChangeText={Paypalemail => this.setState({Paypalemail})}
              />
              <TouchableOpacity
                onPress={() => this.ChangePayPal()}
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: CONSTANT.primaryColor,
                  borderRadius: 4,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: 200,
                  marginTop: 10,
                }}>
                <Text style={styles.LoginBTNText}>{CONSTANT.Submit}</Text>
              </TouchableOpacity>
            </View>
            )}

          {this.state.PayoutSettingsData != '' && (
            <TouchableOpacity
              onPress={() => this.PayoneerPress()}
              style={{
                borderColor: '#767676',
                borderRadius: 4,
                borderWidth: 0.6,
                padding: 10,
                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 10,
                alignItems: 'center',
              }}>
                <View>
                  {this.state.PayoutSettingsData.saved_settings.type == 'payoneer' ? (
                    <AntIcon
                      name="checkcircle"
                      color={'green'}
                      size={17}
                      style={styles.AdvanceSearchIcon}
                    />
                  ) : (
                    <AntIcon
                      name="checkcircleo"
                      color={'#767676'}
                      size={17}
                      style={styles.AdvanceSearchIcon}
                    />
                  )}
                </View>

              <View style={styles.bannerImgArea}>
                {this.state.PayoutSettingsData != '' && (
                  <Image
                    resizeMode={'contain'}
                    source={{
                      uri: this.state.PayoutSettingsData.payout_settings.payoneer
                        .img_url,
                    }}
                    style={{width: 150, height: 100, marginLeft: 15}}></Image>
                )}
              </View>
            </TouchableOpacity>
          )}
          {this.state.PayoutSettingsData != '' &&
            this.state.payoneerClicked == true &&(
              <View>
              <Text style={{fontSize: 15, margin: 10}}>
               {CONSTANT.PayoutAddPaypalID}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  onPress={() => this.handlePaypalClick()}
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    margin: 10,
                    color: 'skyblue',
                  }}>
                  {CONSTANT.PayoutPayoneer}
                </Text>
                <Text style={{fontSize: 15, fontWeight: '700', margin: 10}}>
                  |
                </Text>
                <Text
                  onPress={() => this.handlePayoneerCreateAccountClick()}
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    margin: 10,
                    color: 'skyblue',
                  }}>
                 {CONSTANT.PayoutCreateAccount}
                </Text>
              </View>
              <TextInput
                style={{
                  fontSize: 15,
                  padding: 5,
                  height: 40,
                  color: '#323232',
                  fontFamily: CONSTANT.PoppinsRegular,
                  borderColor: '#767676',
                  borderRadius: 4,
                  borderWidth: 0.6,
                  marginHorizontal: 10,
                }}
                underlineColorAndroid="transparent"
                name="Email"
                placeholder={(this.state.PayoutSettingsData.saved_settings.payoneer_email == '' || this.state.PayoutSettingsData.options != 'yes') ? CONSTANT.PayoutAddPayoneerEmail : this.state.PayoutSettingsData.saved_settings.payoneer_email}
                placeholderTextColor="#807f7f"
                onChangeText={Paypalemail => this.setState({Paypalemail})}
              />
              <TouchableOpacity
                onPress={() => this.ChangePayPal()}
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: CONSTANT.primaryColor,
                  borderRadius: 4,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: 200,
                  marginTop: 10,
                }}>
                <Text style={styles.LoginBTNText}>{CONSTANT.Submit}</Text>
              </TouchableOpacity>
            </View>
            )}
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(Payout);
