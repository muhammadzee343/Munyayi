import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
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
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import AntIcon from "react-native-vector-icons/AntDesign";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class ProfileVideos extends Component {

  state={
    isLoading: true,
    ProfileVideosData: [],
    ProfileVideosDataNew: [],
    ProfileVideosRefresh: false,
    NewProfileVideosData:[],
    url: '',
    urlEdit:'',
  }

  componentDidMount() {
    this.FetchProfileVideos();
  }

  FetchProfileVideos = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_profile_tab_settings?user_id=" + Uid
    );
		const json = await response.json();
    this.setState({ ProfileVideosData: json.videos, isLoading: false });

    for (const [key, value] of Object.entries(this.state.ProfileVideosData)) {
      console.log(`${key}: ${value}`);
      this.state.NewProfileVideosData.push({
        link: `${value}`,
      });
    }
    this.setState({ProfileVideosRefresh: true,})
  };

  addProfileVideosData = () => {
    if (
      this.state.url == "" 
    ) {
      Alert.alert(CONSTANT.OopsText, CONSTANT.PleaseEnterDataProperly);
    } else {
      const {
        ProfileVideosData,
        url,
        NewProfileVideosData,
        ProfileVideosDataNew
      } = this.state;
      //console.log('profile', this.state.NewProfileVideosData)

      NewProfileVideosData.push({
        link: url,
      });
      this.setState({
        ProfileVideosRefresh: true,
        url: '',
      });
      console.log('After add arrey', NewProfileVideosData)
    }
    this.state.ProfileVideosData.push(this.state.url);
  };

  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const {
      ProfileVideosData,
    } = this.state;
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "profile/update_tabe_settings?user_id=" + Uid + "&edit_type=" + "videos",{
        videos:ProfileVideosData,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.FetchProfileVideos();
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

  ProfileVideosEditForm = index => {
    this.state.ProfileVideosData[index] = this.state.urlEdit
    this.state.NewProfileVideosData[index] = {link: this.state.urlEdit}
    this.setState({ProfileVideosRefresh: true})
  }

  ProfileVideosDeleteForm = index => {
    this.state.NewProfileVideosData.splice(index, 1);
    this.state.ProfileVideosData.splice(index, 1);
    this.setState({
      ProfileVideosRefresh: true
    });
  };
    
  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView>
          <View>
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
                  <Text style={styles.MainHeadingTextStyle}>
                    {CONSTANT.ProfileProfileVideos}
                  </Text>
                </View>

                <View style={styles.PersonalDetailSectionArea}>
                  <View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder={CONSTANT.ProfileVideoURL}
                      onChangeText={url =>
                        this.setState({ url })
                      }
                      style={styles.TextInputLayoutStyle}
                      value={this.state.url}
                    />
                    <TouchableOpacity
                      onPress={this.addProfileVideosData}
                      style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                      <Text style={styles.ButtonText}>
                        {CONSTANT.ProfileAdd}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* {this.state.NewProfileVideosData ? ( */}
                    <FlatList
                      data={this.state.NewProfileVideosData}
                      extraData={this.state.ProfileVideosRefresh}
                      renderItem={({ item, index }) => (
                        <View
                          style={[styles.PersonalDetailCollapseHeaderArea, {borderWidth:0}]}
                        >
                          <TextInput
                            multiline={true}
                            defaultValue={item.link} 
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#7F7F7F"
                            placeholder={CONSTANT.ProfileVideoURL}
                            onEndEditing={() => this.ProfileVideosEditForm(index)}
                            onChangeText={urlEdit =>
                              this.setState({ urlEdit })
                            }
                            style={[styles.TextInputLayoutStyle, {width:'85%', borderTopRightRadius:0, borderBottomRightRadius:0}]}
                          />
                          {/* <TouchableOpacity
                            onPress={() => this.ProfileVideosEditForm(index)}
                            style={styles.PersonalDetailEditBTN}
                          >
                            <AntIcon
                              name="check"
                              color={"#fff"}
                              size={20}
                            />
                          </TouchableOpacity> */}
                          <TouchableOpacity
                            onPress={() => this.ProfileVideosDeleteForm(index)}
                            style={styles.PersonalDetailDeleteBTN}
                          >
                            <AntIcon
                              name="delete"
                              color={"#fff"}
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  {/* ) : null} */}
                </View>
              </View>
            </View>
          <TouchableOpacity
						onPress={this.UpdateProfileData}
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

export default ProfileVideos;
