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
import MultiSelect from "react-native-multiple-select";
import * as CONSTANT from '../Constants/Constant';
import axios from 'axios';
import RNRestart from 'react-native-restart';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class BillingAddress extends Component {
	state = {
		isLoading: true,
		firstName: '',
		lastName: '',
		companyName: '',
		address: '',
		country: '',
		countrySelected: '',
		city: '',
		zipCode: '',
		phone: '',
		email: '',
		billingData: [],
		fetchBilling: [],
		countrySelected: [],
		newCountry: ''
	};

	componentDidMount = () => {
		this.fetchLatestPostedJobs();
		this.BillingCountrySpinner();
	}

	fetchLatestPostedJobs = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
		const response = await fetch(
		  CONSTANT.BaseUrl + "profile/get_billing_settings?user_id=" + Uid
		);
		const json = await response.json();
		if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
		  this.setState({ fetchBilling: [] }); // empty data set 
		} else {
		  this.setState({ fetchBilling: json , isLoading: false});
		  console.log(this.state.fetchBilling.country)

			this.state.countrySelected.push(this.state.fetchBilling.country)
		}
	  };
	
	BillingCountrySpinner = async () => {
		//taxonomies/get_list?list=woo_countries
    return fetch(
      CONSTANT.BaseUrl + 'taxonomies/get_list?list=woo_countries',
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
        let country = responseJson;
        this.setState({
          country,
        });
				for(let v = 0; v < this.state.country.length; v++ ){
					if(this.state.fetchBilling.country == this.state.country[v].value){
						console.log('name', this.state.country[v].title)
						this.setState({ newCountry: this.state.country[v].title});
					}
				} 
				console.log(this.state.newCountry)
      })
      .catch(error => {
        console.error(error);
      });
	};
	
	UpdateAccountSettings = async () => {
		this.setState({ isLoading: true });
		const {
			billingData,
			firstName,
			lastName,
			companyName,
			address,
			countrySelected,
			city,
			zipCode,
			phone,
			email,
    } = this.state;
		billingData.push({
			billing_first_name: firstName != '' ? firstName : this.state.fetchBilling.first_name,
			billing_last_name: lastName != '' ? lastName : this.state.fetchBilling.last_name,
			billing_company: companyName != '' ? companyName : this.state.fetchBilling.company,
			billing_address_1: address != '' ? address : this.state.fetchBilling.address_1,
			billing_country: countrySelected.toString() != '' ? countrySelected.toString() : this.state.newCountry,
			billing_city: city != '' ? city : this.state.fetchBilling.city,
			billing_postcode: zipCode != '' ? zipCode : this.state.fetchBilling.postcode,
			billing_phone: phone != '' ? phone : this.state.fetchBilling.phone,
			billing_email: email != '' ? email : this.state.fetchBilling.email,
		})
    console.log(
			'billingData', billingData
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "user/update_billing?user_id=" + Uid,{
        billing: billingData[billingData.length - 1],
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };

  render() {
		const {isLoading, fetchBilling} = this.state;
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
				<ScrollView 
					showsVerticalScrollIndicator={false}
					style={styles.changePasswordScrollArea}>
					<View style={styles.changePasswordScrollStyle}>
						<View style={{marginBottom:10}}>
							<Text style={styles.MainHeadingTextStyle}>
								{CONSTANT.SecuritySettingBilling}
							</Text>
						</View>
						<TextInput
							onChangeText={firstName => this.setState({firstName})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.first_name != '' ? fetchBilling.first_name : CONSTANT.SecuritySettingBillingFirstName}
							style={styles.TextInputLayoutStyle}/>
							<TextInput
							onChangeText={lastName => this.setState({lastName})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.last_name != '' ? fetchBilling.last_name : CONSTANT.SecuritySettingBillingLastName}
							style={styles.TextInputLayoutStyle}/>
							<TextInput
							onChangeText={companyName => this.setState({companyName})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.company != '' ? fetchBilling.company : CONSTANT.SecuritySettingBillingCompanyName}
							style={styles.TextInputLayoutStyle}/>
							<TextInput
							onChangeText={address => this.setState({address})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.address_1 != '' ? fetchBilling.address_1 : CONSTANT.SecuritySettingBillingAddress}
							style={styles.TextInputLayoutStyle}/>
							<View style={styles.MultiSelectArea}>
								<MultiSelect
									ref={component => {
										this.multiSelect = component;
									}}
									onSelectedItemsChange={value =>
										this.setState({countrySelected: value})
									}
									uniqueKey="value"
									items={this.state.country}
									selectedItems={this.state.countrySelected}
									borderBottomWidth={0}
									single={true}
									searchInputPlaceholderText={CONSTANT.SecuritySettingBillingCountry}
									selectText={CONSTANT.SecuritySettingBillingCountry}
									styleMainWrapper={styles.MultiSelectstyleMainWrapper}
									styleDropdownMenuSubsection={
										styles.MultiSelectstyleDropdownMenuSubsection
									}
									onChangeInput={text => console.log(text)}
									displayKey="title"
									submitButtonText={CONSTANT.Submit}
								/>
							</View>
							<TextInput
							onChangeText={city => this.setState({city})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.city != '' ? fetchBilling.city : CONSTANT.SecuritySettingBillingCity}
							style={styles.TextInputLayoutStyle}/>
							<TextInput
							onChangeText={zipCode => this.setState({zipCode})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.postcode != '' ? fetchBilling.postcode : CONSTANT.SecuritySettingBillingZipcode}
							style={styles.TextInputLayoutStyle}/>
							<TextInput
							onChangeText={phone => this.setState({phone})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.phone != '' ? fetchBilling.phone : CONSTANT.SecuritySettingBillingPhone}
							style={styles.TextInputLayoutStyle}/>
							<TextInput
							onChangeText={email => this.setState({email})}
							underlineColorAndroid="transparent"
							placeholderTextColor="#7F7F7F"
							placeholder={fetchBilling.email != '' ? fetchBilling.email : CONSTANT.SecuritySettingBillingEmail}
							style={styles.TextInputLayoutStyle}/>
					</View>
					<TouchableOpacity
						onPress={this.UpdateAccountSettings}
						style={styles.MainButtonArea}>
						<Text style={styles.ButtonText}>
							{CONSTANT.SecuritySettingBillingBtn}
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}

export default BillingAddress;
