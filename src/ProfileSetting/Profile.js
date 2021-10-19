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
class Profile extends Component {
  state = {
    image: null,
    images: null,
    bannerimage: null,
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
    content: false,
    employeeContent: false,
    CatPickerValueHolder: [],
    LocKnown: [],
    EmployeePickerValueHolder: [],
    EmployeeKnown: '',
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
    skills_data: [],
    experience_data: [],
    createSkill: false,
    addNewValue: '',
    EnglishLevel: '',
    images: null,
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
    resumeimage: {},
    resumeName: '',
    resumeSize: '',
    profileimage: {},
    bannerImage: {},
    genderOptionSelected: [],
    themeSettingsGenderOptions: [],
    new_themeSettingsGenderOptions: []
  };
  componentDidMount() {
    this.getUserData();
    this.fetchProfileData();
    this.ProjectCategoriesSpinner();
    this.NoEmployeeSpinner();
    this.FreelancerLevelSpinner();
    this.englishLevelSpinner();
    this.ProjectLanguageSpinner();
    this.ProjectSkillsSpinner();
    this.ProjectExpSpinner();
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
    this.setState({themeSettingsGenderSetting: json.gender_settings.gadget});
    this.setState({themeSettingsGenderOptions: json.gender_settings.yes.gender_options});
    console.log(this.state.themeSettingsDisplayType)

    console.log('old gender option', this.state.themeSettingsGenderOptions)
    for (const [key, value] of Object.entries(this.state.themeSettingsGenderOptions)) {
      console.log('value', `${value}`);
      this.state.new_themeSettingsGenderOptions.push({
        name: `${value}`,
        slug: value.toLowerCase()
      });
      console.log('new gender option', this.state.new_themeSettingsGenderOptions)
    }
  }
  getUserData = async () => {
    try {
      const storedType = await AsyncStorage.getItem('user_type');
      if (storedType !== null) {
        this.setState({storedType});
      } else {
      }
    } catch (error) {
      console.log(error);
    }
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
        })
      })
      .catch(error => {
        console.error(error);
      });
  }
  componentHideAndShow = () => {
    this.setState(previousState => ({content: !previousState.content}));
  };
  employeeHideAndShow = () => {
    this.setState(previousState => ({employeeContent: !previousState.employeeContent}));
  };
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
  FreelancerLevelSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=freelancer_level",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let freelancer = responseJson;

        this.setState({
          freelancer
        });
        console.log('freelancer type', this.state.freelancer)
      })
      .catch(error => {
        console.error(error);
      });
  };
  englishLevelSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=english_levels",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let EnglishLevel = responseJson;
        this.setState({
          EnglishLevel
        });
       
      })
      .catch(error => {
        console.error(error);
      });
  };
  ProjectLanguageSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=languages",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let Language_data = responseJson;
        this.setState({
          Language_data
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  ProjectSkillsSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=skills",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let skills_data = responseJson;
        this.setState({
          skills_data
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  ProjectExpSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=experience",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let experience_data = responseJson;
        this.setState({
          experience_data
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
      .get(CONSTANT.BaseUrl + 'profile/setting?id=' + Uid)
      .then(async response => {
        if (response.data.type === 'success') {
          await AsyncStorage.setItem('fname', response.data.first_name);
          await AsyncStorage.setItem('lname', response.data.last_name);
          await AsyncStorage.setItem('tagline', response.data.tag_line);
          await AsyncStorage.setItem('Address', response.data.address);
          await AsyncStorage.setItem('Latitude', response.data.latitude);
          await AsyncStorage.setItem('Longitude', response.data.longitude);
          await AsyncStorage.setItem('Location', response.data.location);
          await AsyncStorage.setItem('Noemployees', JSON.stringify(response.data.hasOwnProperty('no_of_employees') ? no_of_employees : ""));
          await AsyncStorage.setItem('Department', response.data.hasOwnProperty('department') ? department : "");
          await AsyncStorage.setItem('Rate', JSON.stringify(response.data.per_hour_rate));
          await AsyncStorage.setItem('Gender', response.data.gender);
          this.setState({DisplayName: response.data.display_name});
          this.setState({rate: response.data.per_hour_rate});
          this.setState({maxPrice: response.data.max_price});
          this.setState({phoneNumber: response.data.phone_number});
          this.setState({location: response.data.location});
          this.setState({skillsData: response.data.skills});
          //this.setState({newSkillData: [], newSkillDataPost: []});
          this.setState({englishLevelData: response.data.english_level});
          this.setState({languageData: response.data.languages});
          this.setState({freelancerData: response.data.freelancer_types});
          this.setState({FAQ_Data: response.data.faqs});
          this.setState({Resume_Name: response.data.resume_doc.document_name});
          this.setState({Resume_Size: response.data.resume_doc.file_size});
          this.setState({Resume_Ext: response.data.resume_doc.filetype.ext});
          this.setState({gender: response.data.gender});
          this.setState({isLoading: false});
          this.getUser();
          console.log('employee', JSON.stringify(response.data.no_of_employees));
          console.log('department', response.data.department);
          console.log('location', response.data.location);
          console.log('per hour rate', JSON.stringify(response.data.per_hour_rate));

          console.log('skills_data', JSON.stringify(this.state.skills_data));
          console.log('skillsData', JSON.stringify(this.state.skillsData));
          for(let s = 0; s < this.state.skillsData.length; s++ ){
            for(let n = 0; n < this.state.skills_data.length; n++ ){
              if(this.state.skillsData[s].id == this.state.skills_data[n].id){
                console.log('name', this.state.skills_data[n].name)
                this.state.newSkillData.push({
                  skill: this.state.skills_data[n].name,
                  val: this.state.skillsData[s].val,
                  id: this.state.skills_data[n].id,
                })
                this.state.newSkillDataPost.push({
                  skill: this.state.skills_data[n].id,
                  value: this.state.skillsData[s].val,
                })
              }
            }
          }   
          this.state.LocKnown.push(this.state.location)
          console.log('locKnown', this.state.LocKnown)
          this.state.englishKnown.push(this.state.englishLevelData)
          console.log('gender', this.state.gender)
          this.state.genderOptionSelected.push(this.state.gender)
          // this.state.LangKnown.push(this.state.languageData.split(', '))
          console.log('lang', this.state.languageData)
          console.log("jdbvisbvosnvpjvp " , this.state.languageData.split(', '))

          if(this.state.languageData.length >=1){
            var match = this.state.languageData.split(', ')
            console.log(match)
            for (var a in match){
              var variable = match[a]
              console.log(variable)
              this.state.LangKnown.push(variable)
            }
          }

          console.log('freelancerData', this.state.freelancerData)
          var freelancer = this.state.freelancerData
          for (var f in freelancer){
            var variableF = freelancer[f]
            this.state.freelancerLevelKnown.push(variableF) 
          }


          console.table('new', JSON.stringify(this.state.newSkillData))
        } else if (response.data.type === '') {
          alert('Incorrect Detail');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  _refresh = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };
  getUser = async () => {
    try {
      const FirstName = await AsyncStorage.getItem('fname');
      const LastName = await AsyncStorage.getItem('lname');
      const Tagline = await AsyncStorage.getItem('tagline');
      const address = await AsyncStorage.getItem('Address');
      const latitude = await AsyncStorage.getItem('Latitude');
      const longitude = await AsyncStorage.getItem('Longitude');
      const location = await AsyncStorage.getItem('Location');
      const noEmployees = await AsyncStorage.getItem('Noemployees');
      const department = await AsyncStorage.getItem('Department');
      //const rate = await AsyncStorage.getItem('Rate');
      const gender = await AsyncStorage.getItem('Gender');
      if (FirstName !== null) {
        this.setState({FirstName});
      } else {
        //do stuff here
      }
      if (LastName !== null) {
        this.setState({LastName});
      } else {
        //do stuff here
      }
      if (Tagline !== null) {
        this.setState({Tagline});
      } else {
        //do stuff here
      }
      if (address !== null) {
        this.setState({address});
      } else {
        //do stuff here
      }
      if (latitude !== null) {
        this.setState({latitude});
      } else {
        //do stuff here
      }
      if (longitude !== null) {
        this.setState({longitude});
      } else {
        //do stuff here
      }
      if (location !== null) {
        this.setState({location});
      } else {
        //do stuff here
      }
      if (noEmployees !== null ) {
        this.setState({noEmployees});
      } else {
        //do stuff here
      }
      if (department !== null) {
        this.setState({department});
      } else {
        //do stuff here
      }
      // if (rate !== null) {
      //   this.setState({rate});
      // } else {
      //   //do stuff here
      // }
      if (gender !== null) {
        this.setState({gender});
      } else {
        //do stuff here
      }
    } catch (error) {}
  };
  static navigationOptions = {
    title: 'Home',
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: '#2F95D6',
      borderBottomColor: '#ffffff',
      borderBottomWidth: 3,
    },
    headerTitleStyle: {
      fontSize: 18,
    },
  };
  UpdateProfile = () => {
    this.setState({isUpdatingLoader: true});
    for(let i=0; i<this.state.LangKnown.length; i++){
      for(let j=0; j<this.state.Language_data.length; j++){
        if(this.state.LangKnown[i] === this.state.Language_data[j].slug){
          console.log(this.state.Language_data[j].id)
          this.state.LangKnownNew.push(this.state.Language_data[j].id)
        }
      }
    }
    const {
      Uid,
      FirstName,
      LastName,
      DisplayName,
      type,
      longitude,
      latitude,
      rate,
      maxPrice,
      phoneNumber,
      LocKnown,
      EmployeeKnown,
      address,
      Tagline,
      genderOptionSelected,
      LangKnownNew,
      englishKnown,
      freelancerLevelKnown,
      newSkillDataPost,
      customSkillDataPost,
      resumeimage,
      profileimage,
      bannerImage
    } = this.state;

    console.log(
      Uid,
      FirstName,
      LastName,
      DisplayName,
      type,
      longitude,
      latitude,
      rate,
      maxPrice,
      phoneNumber,
      LocKnown.toString(),
      EmployeeKnown,
      address,
      Tagline,
      genderOptionSelected.toString(),
      LangKnownNew,
      englishKnown.toString(),
      freelancerLevelKnown,
      newSkillDataPost,
      customSkillDataPost,
      resumeimage,
      profileimage,
      bannerImage
    )

    this.state.basics.push({
      user_id: Uid,
      first_name: FirstName,
      last_name: LastName,
      display_name: DisplayName,
      user_type: type,
      longitude: longitude,
      latitude: latitude,
      per_hour_rate: rate,
      max_price: maxPrice,
      user_phone_number: phoneNumber,
      country: LocKnown.toString(),
      no_of_employees: EmployeeKnown[0],
      address: address,
      tag_line: Tagline,
      gender: genderOptionSelected.toString(),

      resume_base64: resumeimage,
      
    })
    this.state.settings.push({
      languages: LangKnownNew,
      freelancer_type: freelancerLevelKnown,
      skills: newSkillDataPost,
      custom_skills: customSkillDataPost,
      english_level: englishKnown.toString(),
    })
    
    axios
      .post(CONSTANT.BaseUrl + 'profile/update_freelancer_profile', {
        basics: this.state.basics[this.state.basics.length - 1],
        settings: this.state.settings[this.state.settings.length - 1],
        banner_base64: bannerImage,
        profile_base64: profileimage,
        })
      .then(async response => {
        console.log('outside if else response', response)
        if (response.status === 200) {
          this.setState({ isUpdatingLoader: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchProfileData();
        } else if (response.status === 203) {
          this.setState({ isUpdatingLoader: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
        console.log('in catch', error);
        this.setState({ isUpdatingLoader: false });
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
        this.setState({
          profileimage: {
            name: Platform.OS === 'ios' ? image.filename : image.path.slice(81),
            type: image.mime,
            base64_string: image.data,
          },
        });
        console.log('profileimage', this.state.profileimage)
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
        console.log('bannerimage', bannerimage)
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
  AddSkillsBtn = () => {
    if(this.state.SkillsKnown == '' && this.state.addValue == ''){
      alert('Please add data first')
    }else{
      for(let s = 0; s < this.state.skills_data.length; s++ ){
        if(this.state.skills_data[s].slug == this.state.SkillsKnown){
          console.log('name', this.state.skills_data[s].name)
          this.state.newSkillData.push({
            skill: this.state.skills_data[s].name,
            val: JSON.parse(this.state.addValue)
          })
          this.state.newSkillDataPost.push({
            skill: this.state.skills_data[s].id,
            value: JSON.parse(this.state.addValue)
          })
        }
      }
      console.log(this.state.newSkillData)
      this.setState({
        SkillsKnown: '',
        addValue: '',
        skillRefresh: true
      })
    }
  }
  createNewSkills = () => {
    if(this.state.SkillsKnown == '' && this.state.addNewValue == ''){
      alert('Please add data first')
    }else{
      this.state.newSkillData.push({
        skill: this.state.SkillsKnown,
        val: JSON.parse(this.state.addNewValue)
      })
      this.state.customSkillDataPost.push({
        skill: this.state.SkillsKnown,
        value: JSON.parse(this.state.addNewValue)
      })
      console.log(this.state.newSkillData)
      this.setState({
        SkillsKnown: '',
        addNewValue: '',
        skillRefresh: true,
        createSkill: false
      })
    }
  }
  AddSkillsYearsBtn = () => {
    if(this.state.SkillsKnown == '' && this.state.addValue == ''){
      alert('Please add data first')
    }else{
      for(let s = 0; s < this.state.skills_data.length; s++ ){
        for(let v = 0; v < this.state.experience_data.length; v++ ){
          if(this.state.skills_data[s].slug == this.state.SkillsKnown && this.state.experience_data[v].value == this.state.addValue){
            console.log('name', this.state.skills_data[s].name)
            this.state.newSkillData.push({
              skill: this.state.skills_data[s].name,
              val: JSON.parse(this.state.experience_data[v].title.split(' ')[0])
            })
            this.state.newSkillDataPost.push({
              skill: this.state.skills_data[s].id,
              value: JSON.parse(this.state.experience_data[v].title.split(' ')[0])
            })
          }
        }  
      }
      console.log(this.state.newSkillData)
      this.setState({
        SkillsKnown: '',
        addValue: '',
        skillRefresh: true
      })
    }
  }
  createNewSkillsYears = () => {
    if(this.state.SkillsKnown == '' && this.state.addNewValue == ''){
      alert('Please add data first')
    }else{
      for(let v = 0; v < this.state.experience_data.length; v++ ){
        if(this.state.experience_data[v].value == this.state.addNewValue){
          this.state.newSkillData.push({
            skill: this.state.SkillsKnown,
            val: JSON.parse(this.state.experience_data[v].title.split(' ')[0])
          })
          this.state.customSkillDataPost.push({
            skill: this.state.SkillsKnown,
            value: JSON.parse(this.state.experience_data[v].title.split(' ')[0])
          })
        }
      }
      console.log(this.state.newSkillData)
      this.setState({
        SkillsKnown: '',
        addNewValue: '',
        skillRefresh: true,
        createSkill: false
      })
    }
  }

  EditSkillsBtn = (index, skill, val, id) => {
    // alert(skill)
    // alert(val)
    this.state.newSkillData[index] = {
      skill: skill,
      val: this.state.editValue != '' ? JSON.parse(this.state.editValue) : val
    }
    this.state.newSkillDataPost[index] = {
      skill: id,
      value: this.state.editValue != '' ? JSON.parse(this.state.editValue) : val
    }
    this.setState({
      skillRefresh: true
    })
    console.log(this.state.newSkillData)
  }

  DeleteSkillsBtn = (index) => {
    this.state.newSkillData.splice(index, 1);
    this.state.newSkillDataPost.splice(index, 1);
    this.setState({
      skillRefresh: true
    })
    console.log(this.state.newSkillData)
  }
  createSkillsBtn = () => {
    this.setState({createSkill: true})
  }

  pickMultiple() {
    try {
      DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images]
      })
        .then(images => {
          this.setState({
            images: images,
          });
          console.log(this.state.images)
        })
        .catch(e => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }
  // pickResume() {
  //   try {
  //     DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles]
  //     })
  //       .then(images => {
  //         this.setState({
  //           images: images,
  //         });
  //         console.log(this.state.images)
  //       })
  //       .catch(e => alert(e));
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //     } else {
  //       throw err;
  //     }
  //   }
  // }

  HandleResumeDeleteForm = () => {
    alert('hello')
    this.setState({
      resumeName: '',
      Resume_Name: '',
    });
    console.log(this.state.resumeName, this.state.Resume_Name)
  };

  pickSingleResumeBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      includeExif: true,
    })
      .then(resumeimage => {
        this.setState({
          resumeimage: {
            name: Platform.OS === 'ios' ? resumeimage.filename : resumeimage.path.slice(81),
            type: resumeimage.mime,
            base64_string: resumeimage.data,
          },
          resumeName: Platform.OS === 'ios' ? resumeimage.filename : resumeimage.path.slice(76),
          resumeSize: resumeimage.size
        });
        console.log(this.state.resumeName, this.state.resumeSize)
        console.log('resumeimage', resumeimage)
        // const {Uid} = this.state;
        // axios
        //   .post(CONSTANT.BaseUrl + 'media/upload_banner', {
        //     id: Uid,
        //     profile_base64: {
        //       name: 'IMG-20190704-WA0004.jpg',
        //       type: resumeimage.mime,
        //       base64_string: resumeimage.data,
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
      content,
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
      storedType,
      isLoading,
      isUpdatingLoader,
    } = this.state;
    return (
      //<KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <CustomHeader /> */}
        {isLoading && storedType !== '' ? (
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
                  <View style={{backgroundColor: '#000', width:'100%'}}>
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
                {(type !== 'employer' && this.state.themeSettingsGenderSetting == 'yes') &&
                  <View style={[styles.profileInfoArea, {paddingBottom:-10}]}>
                    <Text style={[styles.OtherTextStyle, styles.section, {height:20}]}>
                      {CONSTANT.SearchPickGender}
                    </Text>
                    <View>
                      <MultiSelect
                        ref={component => {
                          this.multiSelect = component;
                        }}
                        onSelectedItemsChange={value =>
                          this.setState({ genderOptionSelected: value })
                        }
                        single={true}
                        uniqueKey="slug"
                        items={this.state.new_themeSettingsGenderOptions}
                        selectedItems={this.state.genderOptionSelected}
                        borderBottomWidth={0}
                        searchInputPlaceholderText={CONSTANT.SearchPickGender}
                        selectText={CONSTANT.SearchPickGender}
                        styleInputGroup={{
                          marginRight:10
                        }}
                        styleMainWrapper={{marginBottom:-10}}
                        styleDropdownMenuSubsection={{
                          paddingRight: -7,
                          paddingLeft: 10,
                        }}
                        onChangeInput={text => console.log(text)}
                        displayKey="name"
                        submitButtonText={CONSTANT.Submit}
                      />
                    </View>
                  </View>
                }
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

                { this.state.themeSettingsMaxLanguage == 'no' &&
                  <>
                    <View style={styles.profileBorderBottom} />
                    <View style={styles.section}>
                      <Text style={styles.MainHeadingTextStyle}>
                        {CONSTANT.ProfileSettignSelectLanguages}
                      </Text>
                    </View>
                    <View style={styles.profileBorderBottom} />
                    <View
                      style={[styles.MultiSelectArea, {marginBottom:0}]}
                    >
                      <MultiSelect
                        style={{ marginTop: 4 }}
                        ref={component => {
                          this.multiSelect = component;
                        }}
                        onSelectedItemsChange={value =>
                          this.setState({ LangKnown: value })
                        }
                        uniqueKey="slug"
                        items={this.state.Language_data}
                        selectedItems={this.state.LangKnown}
                        borderBottomWidth={0}
                        searchInputPlaceholderText={CONSTANT.SearchPickLanguage}
                        selectText={CONSTANT.SearchPickLanguage}
                        styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                        styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                        onChangeInput={text => console.log(text)}
                        displayKey="name"
                        submitButtonText={CONSTANT.Submit}
                      />
                    </View>
                  </>
                }

                {this.state.themeSettingsMaxEnglishLevel == 'no' &&
                  <>
                    <View style={styles.profileBorderBottom} />
                    <View style={styles.section}>
                      <Text style={styles.MainHeadingTextStyle}>
                        {CONSTANT.ProfileSettignEnglishLevel}
                      </Text>
                    </View>
                    <View style={styles.profileBorderBottom} />
                    <View
                      style={[styles.MultiSelectArea, {marginBottom:0}]}
                    >
                      <MultiSelect
                        ref={component => {
                          this.multiSelect = component;
                        }}
                        onSelectedItemsChange={value =>
                          this.setState({ englishKnown: value })
                        }
                        uniqueKey="value"
                        items={this.state.EnglishLevel}
                        selectedItems={this.state.englishKnown}
                        borderBottomWidth={0}
                        single={true}
                        searchInputPlaceholderText={CONSTANT.SearchPickEnglishLevel}
                        selectText={"Data"}
                        styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                        styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                        onChangeInput={text => console.log(text)}
                        displayKey="title"
                        submitButtonText={CONSTANT.Submit}
                      />
                    </View>
                  </>
                }

                {this.state.themeSettingsMaxFreelancerType == 'no' &&
                  <>
                    <View style={styles.profileBorderBottom} />
                    <View style={styles.section}>
                      <Text style={styles.MainHeadingTextStyle}>
                        {CONSTANT.ProfileSettignFreelancerType}
                      </Text>
                    </View>
                    <View style={styles.profileBorderBottom} />
                    <View
                      style={[styles.MultiSelectArea, {marginBottom:0}]}>
                      <MultiSelect
                        ref={component => {
                          this.multiSelect = component;
                        }}
                        onSelectedItemsChange={value =>
                          this.setState({ freelancerLevelKnown: value })
                        }
                        uniqueKey="value"
                        items={this.state.freelancer}
                        selectedItems={this.state.freelancerLevelKnown}
                        borderBottomWidth={0}
                        single={this.state.themeSettingsFreelancerTypeMultiselect == 'enable' ? false : true}
                        searchInputPlaceholderText={CONSTANT.SearchPickFreelancerLevel}
                        selectText={CONSTANT.SearchPickFreelancerLevel}
                        styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                        styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                        onChangeInput={text => console.log(text)}
                        displayKey="title"
                        submitButtonText={CONSTANT.Submit}
                      />
                    </View>
                  </>
                }



                <View style={styles.profileBorderBottom} />
                <View style={styles.section}>
                  <Text style={styles.MainHeadingTextStyle}>
                    {CONSTANT.ProfileSettignLocation}
                  </Text>
                </View>
                <View style={styles.profileBorderBottom} />
                {/* <View style={[styles.profileInfoArea, styles.section]}>
                  <Text style={styles.OtherTextStyle}>
                    {CONSTANT.ProfileSettignCountry}
                  </Text>
                  <Text
                    onPress={this.componentHideAndShow}
                    style={styles.NameTextStyle}
                    underlineColorAndroid="transparent">{`${entities.decode(
                    location,
                  )}`}</Text>
                </View> */}
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
                <View style={styles.section}>
                  <Text style={styles.MainHeadingTextStyle}>
                    {CONSTANT.ProfileSettignMySkills}
                  </Text>
                </View>
                <View style={styles.profileBorderBottom} />
                <View
                  style={[styles.MultiSelectArea,{marginBottom:0}]}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ SkillsKnown: value })
                    }
                    uniqueKey="slug"
                    items={this.state.skills_data}
                    selectedItems={this.state.SkillsKnown}
                    borderBottomWidth={0}
                    single={true}
                    searchInputPlaceholderText={CONSTANT.SearchPickSkills}
                    selectText={CONSTANT.SearchPickSkills}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
                { this.state.themeSettingsDisplayType != 'year' &&
                  <View style={[styles.profileInfoArea, styles.section]}>
                    <Text style={styles.OtherTextStyle}>
                      {CONSTANT.ProfileSettignAddValue}
                    </Text>
                    <TextInput
                      style={[
                        styles.TextInputLayoutStyle,
                        styles.profileTextInputCustom,
                      ]}
                      underlineColorAndroid="transparent"
                      editable={true}
                      placeholder="--"
                      onChangeText={addValue =>
                        this.setState({addValue})
                      }
                      value={this.state.addValue}
                    >
                    </TextInput>
                  </View>
                }
                { this.state.themeSettingsDisplayType == 'year' &&
                  <View
                    style={[styles.MultiSelectArea,{marginBottom:0}]}
                  >
                    <MultiSelect
                      ref={component => {
                        this.multiSelect = component;
                      }}
                      onSelectedItemsChange={value =>
                        this.setState({ addValue: value })
                      }
                      uniqueKey="value"
                      items={this.state.experience_data}
                      selectedItems={this.state.addValue}
                      borderBottomWidth={0}
                      single={true}
                      searchInputPlaceholderText={CONSTANT.SearchPickExperience}
                      selectText={CONSTANT.SearchPickExperience}
                      styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                      styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                      onChangeInput={text => console.log(text)}
                      displayKey="title"
                      submitButtonText={CONSTANT.Submit}
                    />
                  </View>
                }
                <TouchableOpacity
                  onPress= {this.state.themeSettingsDisplayType != 'year' ? this.AddSkillsBtn : this.AddSkillsYearsBtn}
                  style={[styles.MainButtonArea, {alignSelf:'flex-start', marginLeft: 5}]}>
                  <Text style={styles.ButtonText}>
                    {CONSTANT.ProfileSettignAddSkills}
                  </Text>
                </TouchableOpacity>
                { this.state.themeSettingsAllowSkills == 'yes' &&
                  <View style={{padding:10}}>
                    <View style={{flexDirection: 'row', marginBottom:10}}>
                      <Text style={{fontSize: 14}}>Don’t see your option listed? </Text>
                      <TouchableOpacity
                        onPress= {this.createSkillsBtn}
                      >
                        <Text style={{fontSize: 14, fontWeight:'500', color: CONSTANT.primaryColor}}>Create one.</Text>
                      </TouchableOpacity>
                    </View>
                    { this.state.createSkill === true &&
                      <View>
                        <View style={[styles.profileInfoArea, styles.section]}>
                          <Text style={styles.OtherTextStyle}>
                            {CONSTANT.ProfileSettignEnterSkill}
                          </Text>
                          <TextInput
                            style={[
                              styles.TextInputLayoutStyle,
                              styles.profileTextInputCustom,
                            ]}
                            underlineColorAndroid="transparent"
                            editable={true}
                            placeholder="--"
                            onChangeText={SkillsKnown =>
                              this.setState({SkillsKnown})
                            }
                            value={this.state.SkillsKnown}
                          >
                          </TextInput>
                        </View>
                        {/* <View
                          style={[styles.MultiSelectArea,{marginBottom:0}]}
                        >
                          <MultiSelect
                            ref={component => {
                              this.multiSelect = component;
                            }}
                            onSelectedItemsChange={value =>
                              this.setState({ SkillsKnown: value })
                            }
                            uniqueKey="slug"
                            items={this.state.skills_data}
                            selectedItems={this.state.SkillsKnown}
                            borderBottomWidth={0}
                            single={true}
                            searchInputPlaceholderText={CONSTANT.SearchPickSkills}
                            selectText={CONSTANT.SearchPickSkills}
                            styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                            styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                            onChangeInput={text => console.log(text)}
                            displayKey="name"
                            submitButtonText={CONSTANT.Submit}
                          />
                        </View> */}
                        { this.state.themeSettingsDisplayType != 'year' &&
                          <View style={[styles.profileInfoArea, styles.section]}>
                            <Text style={styles.OtherTextStyle}>
                              {CONSTANT.ProfileSettignAddValue}
                            </Text>
                            <TextInput
                              style={[
                                styles.TextInputLayoutStyle,
                                styles.profileTextInputCustom,
                              ]}
                              underlineColorAndroid="transparent"
                              editable={true}
                              placeholder="--"
                              onChangeText={addNewValue =>
                                this.setState({addNewValue})
                              }
                              value={this.state.addNewValue}
                            >
                            </TextInput>
                          </View>
                        }
                        { this.state.themeSettingsDisplayType == 'year' &&
                          <View
                            style={[styles.MultiSelectArea,{marginBottom:0}]}
                          >
                            <MultiSelect
                              ref={component => {
                                this.multiSelect = component;
                              }}
                              onSelectedItemsChange={value =>
                                this.setState({ addNewValue: value })
                              }
                              uniqueKey="value"
                              items={this.state.experience_data}
                              selectedItems={this.state.addNewValue}
                              borderBottomWidth={0}
                              single={true}
                              searchInputPlaceholderText={CONSTANT.SearchPickExperience}
                              selectText={CONSTANT.SearchPickExperience}
                              styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                              styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                              onChangeInput={text => console.log(text)}
                              displayKey="title"
                              submitButtonText={CONSTANT.Submit}
                            />
                          </View>
                        }
                        <TouchableOpacity
                          onPress= {this.state.themeSettingsDisplayType != 'year' ? this.createNewSkills : this.createNewSkillsYears}
                          style={[styles.MainButtonArea, {alignSelf:'flex-start', marginLeft: 5}]}>
                          <Text style={styles.ButtonText}>
                            {CONSTANT.ProfileSettignAddSkills}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                }
                <FlatList
                  style={{marginHorizontal:10}}
                  data={this.state.newSkillData}
                  extraData={this.state.skillRefresh}
                  renderItem={({ item, index }) => (
                    <Collapse>
                      <CollapseHeader>
                        <View
                          style={styles.PersonalDetailCollapseHeaderArea}
                        >
                          <TouchableOpacity
                            activeOpacity={1}
                            style={
                              styles.PersonalDetailCoollapseHeaderTextArea
                            }
                          >
                            <View style={{flexDirection:'row'}}>
                              <Text
                                style={
                                  styles.PersonalDetailCoollapseHeaderText
                                }
                              >
                                {item.skill} ({item.val}{' '}
                              </Text>
                              {this.state.themeSettingsDisplayType != 'year' &&
                                <Text>
                                  %)
                                </Text>
                              }
                              {this.state.themeSettingsDisplayType == 'year' &&
                                <Text>
                                  Years)
                                </Text>
                              }
                            </View>
                          </TouchableOpacity>
                          <View style={styles.PersonalDetailEditBTN}>
                            <AntIcon name="edit" color={"#fff"} size={20} />
                          </View>
                          <TouchableOpacity
                            onPress={() => this.DeleteSkillsBtn(index)}
                            style={styles.PersonalDetailDeleteBTN}
                          >
                            <AntIcon
                              name="delete"
                              color={"#fff"}
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <View style={styles.PersonalDetailCollapseBodyArea}>
                          <TextInput
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#7F7F7F"
                            placeholder={JSON.stringify(item.val)}
                            style={styles.TextInputLayoutStyle}
                            onChangeText={editValue =>
                              this.setState({ editValue })
                            }
                            onEndEditing={ () => this.EditSkillsBtn(index, item.skill, item.val, item.id)}
                          >
                            {/* {item.val} */}
                          </TextInput>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  )}
                />

          {
            <>
              <View style={styles.profileBorderBottom} />
                <View style={styles.section}>
                  <Text style={styles.MainHeadingTextStyle}>
                    Upload Resume
                  </Text>
                </View>
              <View style={styles.profileBorderBottom} />
              <View style={{
                backgroundColor: '#fff',
                elevation: 3,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowColor: '#000',
                marginBottom: 10
              }}>
                <View style={[styles.PersonalDetailSectionArea, {marginTop:10}]}>
                  <TouchableOpacity
                    onPress={() => this.pickSingleResumeBase64()}
                    style={[styles.PersonalDetailDownloadArea, {width:'100%'}]}
                  >
                    <AntIcon name="plus" color={"#767676"} size={27} />
                    <Text style={styles.PersonalDetailDownloadText}>
                      {CONSTANT.ProfileAddFiles}
                    </Text>
                  </TouchableOpacity>
                  <View>
                  { (this.state.Resume_Name != '') && (this.state.resumeName == '') &&
                    <View
                      style={{
                        width: "100%",
                        borderColor: "#ddd",
                        borderWidth: 1,
                        borderRadius: 5,
                        overflow: "hidden"
                      }}
                    >
                      <Text style={{padding: 5}}>
                        {this.state.Resume_Name}.{this.state.Resume_Ext}
                      </Text>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexDirection: "row"
                        }}
                      >
                        <Text style={{ width: "80%", padding: 5 }}>
                          {/* {this.state.Resume_Size} */}
                          {this.state.Resume_Size >= 1073741824 ? (this.state.Resume_Size / 1073741824).toFixed(2) + " GB" :
                          this.state.Resume_Size >= 1048576 ? (this.state.Resume_Size / 1048576).toFixed(2) + " MB" :
                          this.state.Resume_Size >= 1024 ? (this.state.Resume_Size / 1024).toFixed(2) + " KB" : 
                          this.state.Resume_Size > 1 ? this.state.Resume_Size + " bytes" : "0 bytes"
                          }
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.HandleResumeDeleteForm}
                          style={{ padding: 5, width: "10%", alignItems:'center' }}
                        >
                          <AntIcon name="close" color={"red"} size={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  }
                  { this.state.resumeName != '' &&
                    <View
                      style={{
                        width: "100%",
                        borderColor: "#ddd",
                        borderWidth: 1,
                        borderRadius: 5,
                        overflow: "hidden"
                      }}
                    >
                      <Text style={{padding: 5}}>
                        {this.state.resumeName}
                      </Text>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexDirection: "row"
                        }}
                      >
                        <Text style={{ width: "80%", padding: 5 }}>
                          {this.state.resumeSize}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.HandleResumeDeleteForm}
                          style={{ padding: 5, width: "10%", alignItems:'center' }}
                        >
                          <AntIcon name="close" color={"red"} size={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  }
                  </View>
                </View>
              </View>
            </>
          }

                
                <View style={styles.profileBorderBottom} />
                {type !== 'freelancer' && noEmployees === "" ? (
                  <View style={styles.section}>
                    <Text style={styles.MainHeadingTextStyle}>
                      {CONSTANT.ProfileSettignCompanyDetails}
                    </Text>
                  </View>
                ) : null}
                {type !== 'freelancer' && noEmployees === "" ? (
                  <View>
                    <View style={styles.profileBorderBottom} />

                      <View style={[styles.profileInfoArea, styles.section]}>
                      <Text style={styles.OtherTextStyle}>
                        {CONSTANT.ProfileSettignNoEmp}
                      </Text>
                      <Text
                        onPress={this.employeeHideAndShow}
                        style={[
                          styles.TextInputLayoutStyle,
                          styles.profileTextInputCustom,
                        ]}
                        underlineColorAndroid="transparent">
                        {`${entities.decode(noEmployees)}`}
                      </Text>
                    </View>
                    
                  </View>
                ) : null}
                {employeeContent && storedType == 'employer' ? (
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
                      selectText={CONSTANT.ProfileSettignPickEmployees}
                      styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                      styleDropdownMenuSubsection={
                        styles.MultiSelectstyleDropdownMenuSubsection
                      }
                      onChangeInput={text => console.log(text)}
                      displayKey="title"
                      submitButtonText="Submit"
                    />
                  </View>
                ) : null}
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
      //</KeyboardAwareScrollView>
    );
  }
}
export default Profile;
