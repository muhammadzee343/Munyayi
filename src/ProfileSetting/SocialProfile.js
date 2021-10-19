import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, AsyncStorage, Alert, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../Constants/Styles';
import * as CONSTANT from '../Constants/Constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntIcon from "react-native-vector-icons/AntDesign";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import axios from "axios";

class SocialProfile extends Component {

	state = {
    socialData: [],
    newSocialData: {},
    socialRefresh:false,
		isLoading: true,
		placeholder:'',
    isUpdatingLoader:false,
    editLink:'',
  };

	componentDidMount() {
    this.fetchSocialProfileData();
  }
	fetchSocialProfileData = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_social_profile_setting?id=" + Uid
    );
		const json = await response.json();
		//Alert.alert("Id" , JSON.stringify(json.list));
    this.setState({ socialData: json.list, isLoading: false });
    console.log('initial arrey from server', this.state.socialData)
  };

  EditData = (index, item) => {
    const {socialData} = this.state;
    this.state.socialData[index] = {
      classes:item.classes,
      color:item.color,
      icon:item.icon,
      social_url:this.state.editLink,
      placeholder:item.placeholder,
    }
    this.setState({socialRefresh: true});
    console.log('arrey after edit', this.state.socialData)
    // this.state.newSocialData = {
    //   facebook: this.state.socialData[0].social_url,
    //   twitter: this.state.socialData[1].social_url,
    //   linkedin: this.state.socialData[2].social_url,
    //   skype: this.state.socialData[3].social_url,
    //   pinterest: this.state.socialData[4].social_url,
    //   tumblr: this.state.socialData[5].social_url,
    //   instagram: this.state.socialData[6].social_url,
    //   flickr: this.state.socialData[7].social_url,
    //   medium: this.state.socialData[8].social_url,
    //   tripadvisor: this.state.socialData[9].social_url,
    //   wikipedia: this.state.socialData[10].social_url,
    //   vimeo: this.state.socialData[11].social_url,
    //   youtube: this.state.socialData[12].social_url,
    //   whatsapp: this.state.socialData[13].social_url,
    //   vkontakte: this.state.socialData[14].social_url,
    //   odnoklassniki: this.state.socialData[15].social_url,
    // };
    for(let i= 0; i< this.state.socialData.length; i++){
      this.state.newSocialData[this.state.socialData[i].icon.slice(6)]= this.state.socialData[i].social_url
    }
    console.log('final arrey', this.state.newSocialData)

    
  };

	UpdateSocialProfile = async () => {
    this.setState({isLoading: true});
    const {
      newSocialData,
    } = this.state;
    console.log(
      newSocialData 
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
    .post(CONSTANT.BaseUrl + "profile/update_social_profile_setting?id=" + Uid,{
				basics: newSocialData,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchSocialProfileData();
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
		const {
      storedType,
			isLoading,
			isUpdatingLoader
    } = this.state;
    return (
      <View style={styles.container}>
				{isLoading && storedType !== '' ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
				{/* {isUpdatingLoader == true ? (
          <View
            style={[
              styles.ActivityIndicatorAreaStyle,
              {backgroundColor: 'rgba(0, 0, 0,0.1)'},
            ]}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null} */}
				<ScrollView>
          <View style={styles.PersonalDetailSectionsStyle}>
            <View
              style={{
                height: 50,
                justifyContent: 'center',
                paddingHorizontal:10,
                marginVertical:10,
                backgroundColor: "#fcfcfc",
                borderLeftWidth: 5,
                borderLeftColor: CONSTANT.primaryColor,
                marginHorizontal:10
              }}
            >
              <Text style={styles.MainHeadingTextStyle}>{CONSTANT.SocialProfile}</Text>
            </View>
            <FlatList
              style={styles.section}
              showsVerticalScrollIndicator={false}
              data={this.state.socialData}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={{borderColor:'#ddd', borderWidth:1, borderRadius:5, height:50, flexDirection:'row', alignItems:'center', marginBottom:10, backgroundColor:'#fff'}}>
                  <View style={{width:50, height:'100%', justifyContent: 'center', alignItems:'center', borderRightColor:'#ddd', borderRightWidth:1}}>
                    <FontAwesome name={item.icon.slice(6)} size={20} color={item.color} />
                  </View>
                  <TextInput
                    defaultValue={item.social_url} 
                    underlineColorAndroid="transparent"
                    style={styles.SocialProfileTextInputStyle}
                    name="username"
                    placeholder={ item.placeholder }
                    placeholderTextColor="#807f7f"
                    onChangeText={editLink => this.setState({ editLink })}
                    onEndEditing={ () => this.EditData(index , item)}
                  />
                </View>
              )}
            />
          </View>
					<TouchableOpacity
						onPress={this.UpdateSocialProfile}
						style={styles.MainButtonArea}>
						<Text style={styles.ButtonText}>
              {CONSTANT.ProfileSave}
						</Text>
					</TouchableOpacity>
				</ScrollView>
      </View>
    );
  }
}

export default SocialProfile;
