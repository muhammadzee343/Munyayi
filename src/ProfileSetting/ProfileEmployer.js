import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  TextInput,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  NativeModules,
  FlatList
} from 'react-native';
import CustomHeader from '../Header/CustomHeader';
//import MapView from 'react-native-maps';
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import axios from 'axios';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from "react-native-document-picker";
import MultiSelect from 'react-native-multiple-select';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
import PTRView from 'react-native-pull-to-refresh';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import MapView, {Marker} from 'react-native-maps';
import { Value } from 'react-native-reanimated';
const options = {
  title: 'Workreap App',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
};
class ProfileEmployer extends Component {
  state = {
    image: null,
    images: null,
    profileimage: {},
    bannerimage: null,
    bannerImage: null,
    isLoading: true,
    isUpdatingLoader: false,
    Uid: '',
    banner: '',
    profileImage: '',
    FirstName: '',
    LastName: '',
    DisplayName: '',
    location: '',
    latitude: '',
    longitude: '',
    Tagline: '',
    address: '',
    noEmployees: '',
    rate: '',
    gender: '',
    department: '',
    type: '',
    photo: null,
    employeeContent: false,
    CatPickerValueHolder: [],
    LocKnown: [],
    EmployeePickerValueHolder: [],
		EmployeeKnown: '',
		departmentKnown: '',
    storedType: '',
    markerData: {
      latitude: '31.5203696',
      longitude: '74.35874729999999',
    },
    NoOfemployee : null,
    skillsData:[],
    newSkillData: [],
    addValue: '',
    editValue: '',
    SkillsKnown: '',
    skillRefresh: false,
    themeSettingsDisplayType: '',
    themeSettingsFreelancerTypeMultiselect: '',
    themeSettingsMaxFreelancerType: '',
    themeSettingsMaxLanguage: '',
    themeSettingsMaxEnglishLevel: '',
    themeSettingsMaxGallery: '',
    skills_data: [],
    experience_data: [],
    createSkill: false,
    addNewValue: '',
    EnglishLevel: '',
    images: null,
    ProfileGallery: [],
    galleryArrey: [],
    gallery_base64_string: "",
    galleryimage: null,
    GalleryRefresh: false,
    englishKnown:[],
    LangKnown:[],
    freelancerLevelKnown:[],
    basics: [],
    settings: [],
    newSkillDataPost: [],
    customSkillDataPost: [],
    maxPrice: '',
    phoneNumber: '',
    languageData: [],
    LangKnownNew: [],
    profileImageUrl: "",
		bannerImageUrl: "",
    profileAttachment: [],
    bannerAttach: '',
    profileAttach: '',
    bannerAttachment: {},
		newEmpData: '',
		newdepData: ''
  };
  componentDidMount() {
    this.fetchProfileData();
    this.ProjectCategoriesSpinner();
		this.NoEmployeeSpinner();
		this.departmentSpinner();
    this.ApplicationThemeSettings();
    this.getPofileImageData();
  }
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'user/get_theme_settings');
    const json = await response.json();
    this.setState({themeSettingsDisplayType: json.freelancers_settings.skills_display_type});
    this.setState({themeSettingsAllowSkills: json.freelancers_settings.allow_custom_skills});
    this.setState({themeSettingsMaxPrice: json.freelancers_settings.freelancer_price_option});
    this.setState({themeSettingsFreelancerTypeMultiselect: json.freelancers_settings.freelancertype_multiselect});
    this.setState({themeSettingsMaxFreelancerType: json.freelancers_settings.frc_remove_freelancer_type});
    this.setState({themeSettingsMaxLanguage: json.freelancers_settings.frc_remove_languages});
    this.setState({themeSettingsMaxEnglishLevel: json.freelancers_settings.frc_english_level});
    this.setState({themeSettingsMaxGallery: json.freelancers_settings.portfolio.enable.others});
    console.log(this.state.themeSettingsDisplayType)
  }
  ProjectCategoriesSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + 'taxonomies/get_taxonomy?taxonomy=locations',
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
        let location_data = responseJson;
        this.setState({
          location_data,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  getPofileImageData = async()=> {
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
          profileImageUrl: responseJson.profile_img,
          bannerImageUrl: responseJson.banner_img,
          profileAttach: responseJson.attachment_id,
          bannerAttach: responseJson.banner_attachment_id,
        })
        {this.state.bannerAttach != '' ?
          this.state.bannerAttachment = {attachment_id: this.state.bannerAttach} : null
        }
        console.log('bannerAttachment', this.state.bannerAttachment)
        {this.state.profileAttach != '' &&
          this.state.profileAttachment.push({
            attachment_id: this.state.profileAttach,
            url: this.state.bannerImageUrl
          })
        }
        console.log('profileAttachment', this.state.profileAttachment)
      })
      .catch(error => {
        console.error(error);
      });
  }
  employeeHideAndShow = () => {
    this.setState(previousState => ({employeeContent: !previousState.employeeContent}));
  };
  NoEmployeeSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + 'taxonomies/get_list?list=no_of_employes', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        let NoEmployee_data = responseJson;
        this.setState({
          NoEmployee_data,
        });
      })
      .catch(error => {
        console.error(error);
      });
	};
	departmentSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + 'taxonomies/get_taxonomy?taxonomy=department', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        let department_data = responseJson;
        this.setState({
          department_data,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  fetchProfileData = async () => {
    const Uid = await AsyncStorage.getItem('projectUid');
    console.log('Uid', Uid)
    const banner = await AsyncStorage.getItem('profileBanner');
    const type = await AsyncStorage.getItem('user_type');
    const profileImage = await AsyncStorage.getItem('profile_img');
    if (Uid !== null) {
      this.setState({Uid});
    } else {
      //do stuff here
    }
    if (banner !== null) {
      this.setState({banner});
    } else {
      //do stuff here
    }
    if (profileImage !== null) {
      this.setState({profileImage});
    } else {
      //do stuff here
    }
    if (type !== null) {
      this.setState({type});
    } else {
      //do stuff here
    }
    axios
      .get(CONSTANT.BaseUrl + 'profile/get_employer_profle?user_id=' + Uid)
      .then(async response => {
        if (response.data.type === 'success') {
					this.setState({FirstName: response.data.first_name});
					this.setState({LastName: response.data.last_name});
					this.setState({Tagline: response.data.tag_line});
					this.setState({address: response.data.address});
					this.setState({longitude: response.data.longitude});
					this.setState({latitude: response.data.latitude});
          this.setState({DisplayName: response.data.display_name});
          this.setState({rate: response.data.per_hour_rate});
          this.setState({maxPrice: response.data.max_price});
          this.setState({phoneNumber: response.data.phone_number});
					this.setState({location: response.data.location});
					this.setState({noEmployees: response.data.employees});
					this.setState({department: response.data.department});
          this.setState({isLoading: false});
          console.log('employee', JSON.stringify(response.data.no_of_employees));
          console.log('department', response.data.department);
          console.log('location', response.data.location);
          console.log('per hour rate', JSON.stringify(response.data.per_hour_rate));

          this.state.LocKnown.push(this.state.location)
					console.log('locKnown', this.state.LocKnown)
					
					for(let s = 0; s < this.state.NoEmployee_data.length; s++ ){
						if(this.state.NoEmployee_data[s].value == this.state.noEmployees){
							//alert(this.state.NoEmployee_data[s].title)
							this.setState({newEmpData: this.state.NoEmployee_data[s].title})
              console.log('newEmpData', this.state.newEmpData)
						}
					}
					for(let d = 0; d < this.state.department_data.length; d++ ){
						if(this.state.department_data[d].id == this.state.department){
							//alert(this.state.department_data[d].name)
							this.setState({newdepData: this.state.department_data[d].name})
						}
					}

        } else if (response.data.type === '') {
          alert('Incorrect Detail');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  UpdateProfile = () => {
    this.setState({isUpdatingLoader: true});
    const {
      Uid,
      FirstName,
      LastName,
      DisplayName,
      phoneNumber,
      Tagline,
      LocKnown,
      address,
      longitude,
      latitude,
      EmployeeKnown,
      departmentKnown,
      profileimage,
      bannerImage,
      profileAttachment,
      bannerAttachment
    } = this.state;
    console.log(
      Uid,
      FirstName,
      LastName,
      DisplayName,
      phoneNumber,
      Tagline,
      LocKnown,
      address,
      longitude,
      latitude,
      EmployeeKnown,
      departmentKnown,
      profileimage,
      bannerImage,
      profileAttachment,
      bannerAttachment
    )

    this.state.basics.push({
      first_name: FirstName,
      last_name: LastName,
      display_name: DisplayName,
      user_phone_number: phoneNumber,
      tag_line: Tagline,
      country: LocKnown != '' ? LocKnown[0].toString() : this.state.location,
      address: address,
      longitude: longitude,
      latitude: latitude,
      banner_base64: bannerImage,
      avatar_base64: profileimage,
      banner: bannerAttachment,
      avatar: profileAttachment
    })
  
    axios
      .post(CONSTANT.BaseUrl + 'dashboard/update_employer_profile', {
        user_id: Uid,
        basics: this.state.basics[this.state.basics.length - 1],
        department: departmentKnown != '' ? departmentKnown.toString() : this.state.department,
        employees: EmployeeKnown != '' ? EmployeeKnown.toString() : this.state.noEmployees,
        })
      .then(async response => {
        if (response.status === 200) {
          this.setState({ isUpdatingLoader: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          console.log("response", response)
          this.fetchProfileData();
        } else if (response.status === 203) {
          this.setState({ isUpdatingLoader: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  pickSingleProfileBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      includeExif: true,
    })
      .then(image => {
        this.setState({
          image: {
            uri: `data:${image.mime};base64,` + image.data,
            width: image.width,
            height: image.height,
          },
          images: null,
        });
        console.log('image', this.state.image)
        this.setState({
          profileimage: {
            name: Platform.OS === 'ios' ? image.filename : image.path.slice(81),
            type: image.mime,
            base64_string: image.data,
          },
        });
        console.log('profileimage', this.state.profileimage)
        // const {Uid} = this.state;
        // axios
        //   .post(CONSTANT.BaseUrl + 'media/upload_avatar', {
        //     id: Uid,
        //     profile_base64: {
        //       name: 'IMG-20190704-WA0004.jpg',
        //       type: image.mime,
        //       base64_string: image.data,
        //     },
        //   })
        //   .then(async response => {
        //     console.log(response);
        //     alert(response.data.message);
        //   })
        //   .catch(error => {
        //     console.log(error);
        //     alert('Profile Pic Uploading Error');
        //   });
      })
      .catch(e => console.log(e));
  }
  pickSingleBannerBase64(cropit) {
    ImagePicker.openPicker({
      width: 1200,
      height: 800,
      cropping: true,
      includeBase64: true,
      includeExif: true,
    })
      .then(bannerimage => {
        this.setState({
          bannerimage: {
            uri: `data:${bannerimage.mime};base64,` + bannerimage.data,
            width: bannerimage.width,
            height: bannerimage.height,
          },
          images: null,
        });
        console.log('bannerimage', this.state.bannerimage)
        this.setState({
          bannerImage: {
            name: Platform.OS === 'ios' ? bannerimage.filename : bannerimage.path.slice(81),
            type: bannerimage.mime,
            base64_string: bannerimage.data,
          },
        });
        console.log('bannerImage', this.state.bannerImage)
        // const {Uid} = this.state;
        // axios
        //   .post(CONSTANT.BaseUrl + 'media/upload_banner', {
        //     id: Uid,
        //     profile_base64: {
        //       name: 'IMG-20190704-WA0004.jpg',
        //       type: bannerimage.mime,
        //       base64_string: bannerimage.data,
        //     },
        //   })
        //   .then(async response => {
        //     console.log(response);
        //     alert(response.data.message);
        //   })
        //   .catch(error => {
        //     console.log(error);
        //     alert('Banner Uploading Error');
        //   });
      })
      .catch(e => console.log(e));
  }

  render() {
    const {
      banner,
      employeeContent,
      type,
      profileImage,
      FirstName,
      LastName,
      DisplayName,
      Tagline,
      address,
      latitude,
      longitude,
      location,
      noEmployees,
      department,
      rate,
      maxPrice,
      phoneNumber,
      gender,
      image,
      bannerimage,
      isLoading,
      isUpdatingLoader,
    } = this.state;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {isUpdatingLoader == true ? (
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
        ) : null}
          <PTRView onRefresh={this._refresh}>
            <ScrollView
              scrollEventThrottle={16}
              contentContainerStyle={{flexGrow: 1}}>
              <View>
                <View style={styles.profileWt_main}>
                  <View style={{backgroundColor: '#000'}}>
                    {bannerimage == null ? (
                      <Image
                      resizeMode={'cover'}
                        style={{height: 250, width:'100%', opacity: 0.64}}
                        source={ this.state.bannerImageUrl != null ? {uri:`${this.state.bannerImageUrl}`} : null}
                      />
                    ) : (
                      <Image
                      resizeMode={'cover'}
                        style={{height: 250, width:'100%', opacity: 0.64}}
                        source={bannerimage != null ? bannerimage : null}
                      />
                    )}
                  </View>
                  <View style={{position: 'absolute', top: '50%', left: '50%'}}>
                    {image == null ? (
                      <Image
                        source={ this.state.profileImageUrl != null ? {uri:`${this.state.profileImageUrl}`} : null}
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: 110 / 2,
                          marginTop: -55,
                          marginLeft: -55,
                          borderColor: '#fff',
                          borderWidth: 3,
                        }}
                      />
                    ) : (
                      <Image
                        source={image != null ? image : null}
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: 110 / 2,
                          marginTop: -55,
                          marginLeft: -55,
                          borderColor: '#fff',
                          borderWidth: 3,
                        }}
                      />
                    )}
                    <View
                      style={{
                        marginTop: -80,
                        marginLeft: -160,
                        backgroundColor: '#00cc8d',
                        alignSelf: 'center',
                        overflow: 'visible',
                        borderRadius: 50,
                        borderWidth: 1,
                        padding: 5,
                        borderColor: '#fff',
                      }}>
                      <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={() => this.pickSingleProfileBase64(false)}>
                        <AntIcon name="plus" color={'#fff'} size={14} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 150,
                      alignSelf: 'center',
                      height: 45,
                      borderRadius: 110 / 2,
                      marginTop: -24,
                      borderColor: '#fff',
                      borderWidth: 2,
                      backgroundColor: '#00cc8d',
                    }}
                    onPress={() => this.pickSingleBannerBase64(false)}>
                    <AntIcon name="plus" color={'#fff'} size={16} />
                    <Text
                      style={[
                        styles.ParagraphTextStyle,
                        {color: CONSTANT.TextColorLight, paddingLeft: 10},
                      ]}>
                      {CONSTANT.ProfileSettignBanner}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.section}>
                  <Text style={styles.MainHeadingTextStyle}>
                    {CONSTANT.ProfileSettignDetail}
                  </Text>
                </View>
                {type !== 'employer' ? (
                  <View>
                    <View style={styles.profileBorderBottom} />
                    <View style={[styles.profileInfoArea, styles.section]}>
                      <Text style={styles.OtherTextStyle}>
                        {CONSTANT.ProfileSettignGender}
                      </Text>
                      <TextInput
                        style={[
                          styles.TextInputLayoutStyle,
                          styles.profileTextInputCustom,
                        ]}
                        underlineColorAndroid="transparent"
                        editable={true}
                        placeholder="--"
                        onChangeText={gender =>
                          this.setState({gender})
                        }>{`${entities.decode(gender)}`}</TextInput>
                    </View>
                  </View>
                ) : null}
                <View style={styles.profileBorderBottom} />
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignFname}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={FirstName =>
                      this.setState({FirstName})
                    }>{`${entities.decode(FirstName)}`}</TextInput>
                </View>
                <View style={styles.profileBorderBottom} />
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignLname}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={LastName =>
                      this.setState({LastName})
                    }>{`${entities.decode(LastName)}`}</TextInput>
                </View>
                <View style={styles.profileBorderBottom} />
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignDname}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={DisplayName =>
                      this.setState({DisplayName})
                    }>{`${entities.decode(DisplayName)}`}</TextInput>
                </View>
                {type !== 'employer' ? (
                  <View>
                    <View style={styles.profileBorderBottom} />
                    <View style={[styles.profileInfoArea, styles.section]}>
                      <Text style={styles.OtherTextStyle}>
                        {CONSTANT.ProfileSettignRate}
                      </Text>
                      <TextInput
                        style={[
                          styles.TextInputLayoutStyle,
                          styles.profileTextInputCustom,
                        ]}
                        underlineColorAndroid="transparent"
                        editable={true}
                        placeholder="--"
                        onChangeText={rate =>
                          this.setState({rate})
                        }>{`${entities.decode(rate)}`}</TextInput>
                    </View>
                    { this.state.themeSettingsMaxPrice == 'enable' &&
                      <>
                        <View style={styles.profileBorderBottom} />
                        <View style={[styles.profileInfoArea, styles.section]}>
                          <Text style={styles.OtherTextStyle}>
                            {CONSTANT.ProfileSettignMaxRate}
                          </Text>
                          <TextInput
                            style={[
                              styles.TextInputLayoutStyle,
                              styles.profileTextInputCustom,
                            ]}
                            underlineColorAndroid="transparent"
                            editable={true}
                            placeholder="--"
                            onChangeText={maxPrice =>
                              this.setState({maxPrice})
                            }>{`${entities.decode(maxPrice)}`}</TextInput>
                        </View>
                      </>
                    }
                  </View>
                ) : null}
                <View style={styles.profileBorderBottom} />
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignPhoneNumber}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={phoneNumber =>
                      this.setState({phoneNumber})
                    }>{`${entities.decode(phoneNumber)}`}</TextInput>
                </View>
                <View style={styles.profileBorderBottom} />
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignTagline}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={Tagline =>
                      this.setState({Tagline})
                    }>{`${entities.decode(Tagline)}`}</TextInput>
                </View>



                <View style={styles.profileBorderBottom} />
                <View style={styles.section}>
                  <Text style={styles.MainHeadingTextStyle}>
                    {CONSTANT.ProfileSettignLocation}
                  </Text>
                </View>
                <View style={styles.profileBorderBottom} />
                {
                  <View style={styles.MultiSelectArea}>
                    <MultiSelect
                      ref={component => {
                        this.multiSelect = component;
                      }}
                      onSelectedItemsChange={value =>
                        this.setState({LocKnown: value})
                      }
                      uniqueKey="slug"
                      items={this.state.location_data}
                      selectedItems={this.state.LocKnown}
                      borderBottomWidth={0}
                      single={true}
                      searchInputPlaceholderText="Search Location..."
                      selectText={location ? location : 'pick location'}
                      styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                      styleDropdownMenuSubsection={
                        styles.MultiSelectstyleDropdownMenuSubsection
                      }
                      onChangeInput={text => console.log(text)}
                      displayKey="name"
                      submitButtonText="Submit"
                    />
                  </View>
                }
                <View style={styles.profileBorderBottom} />
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignAddress}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={address =>
                      this.setState({address})
                    }>{`${entities.decode(address)}`}</TextInput>
                </View>
                <View style={styles.profileBorderBottom} />
                {latitude != '' && longitude != '' &&
                  <View style={[styles.section, {backgroundColor:'#ffffff', paddingVertical:10}]}>
                    <MapView 
                      // region={this.state.region}
                      // onRegionChange={this.onRegionChange()}
                      style={{height:200}}
                      initialRegion={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        latitudeDelta: 0.09, 
                        longitudeDelta: 0.04,
                      }}
                    >
                      <Marker 
                        draggable 
                        onDragEnd={(e) => this.setState({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })}
                        coordinate={{latitude: parseFloat(latitude), longitude: parseFloat(longitude)}}
                        title={address} 
                      />
                      {/* <Marker
                        draggable
                        coordinate={this.state.markerData}
                        title="Home"
                        onDragEnd={e => {
                          console.log('dragEnd', e.nativeEvent.coordinate.latitude , e.nativeEvent.coordinate.longitude);
                        }}
                      /> */}

                    </MapView>
                  </View>
                }
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignLatitude}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={latitude =>
                      this.setState({latitude})
                    }>{latitude}</TextInput>
                </View>
                <View style={styles.profileBorderBottom} />
                <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignLognitude}
                  </Text>
                  <TextInput
                    style={[
                      styles.TextInputLayoutStyle,
                      styles.profileTextInputCustom,
                    ]}
                    underlineColorAndroid="transparent"
                    editable={true}
                    placeholder="--"
                    onChangeText={longitude =>
                      this.setState({longitude})
                    }>{longitude}</TextInput>
                </View>

                
                <View style={styles.profileBorderBottom} />
                {noEmployees != "" ? (
                  <View style={styles.section}>
                    <Text style={styles.MainHeadingTextStyle}>
                      {CONSTANT.ProfileSettignCompanyDetails}
                    </Text>
                  </View>
                ) : null}
								<View style={styles.MultiSelectArea}>
									<MultiSelect
										ref={component => {
											this.multiSelect = component;
										}}
										onSelectedItemsChange={value =>
											this.setState({EmployeeKnown: value})
										}
										uniqueKey="value"
										items={this.state.NoEmployee_data}
										selectedItems={this.state.EmployeeKnown}
										borderBottomWidth={0}
										single={true}
										searchInputPlaceholderText={
											CONSTANT.ProfileSettignPickEmployees
										}
										selectText={this.state.newEmpData != '' ? this.state.newEmpData : CONSTANT.ProfileSettignPickEmployees}
										styleMainWrapper={styles.MultiSelectstyleMainWrapper}
										styleDropdownMenuSubsection={
											styles.MultiSelectstyleDropdownMenuSubsection
										}
										onChangeInput={text => console.log(text)}
										displayKey="title"
										submitButtonText="Submit"
									/>
								</View>
								<View style={styles.MultiSelectArea}>
									<MultiSelect
										ref={component => {
											this.multiSelect = component;
										}}
										onSelectedItemsChange={value =>
											this.setState({departmentKnown: value})
										}
										uniqueKey="id"
										items={this.state.department_data}
										selectedItems={this.state.departmentKnown}
										borderBottomWidth={0}
										single={true}
										searchInputPlaceholderText={
											CONSTANT.ProfileSettignDepartment
										}
										selectText={this.state.newdepData != '' ? this.state.newdepData : CONSTANT.ProfileSettignDepartment}
										styleMainWrapper={styles.MultiSelectstyleMainWrapper}
										styleDropdownMenuSubsection={
											styles.MultiSelectstyleDropdownMenuSubsection
										}
										onChangeInput={text => console.log(text)}
										displayKey="name"
										submitButtonText="Submit"
									/>
								</View>
                <TouchableOpacity
                  onPress={this.UpdateProfile}
                  style={styles.MainButtonArea}>
                  <Text style={styles.ButtonText}>
                    {CONSTANT.ProfileSettignSave}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </PTRView>
      </View>
    );
  }
}
export default ProfileEmployer;
