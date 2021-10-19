import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  NativeModules,
  Switch,
  FlatList,
  PanResponder,
  Image,
  Group,
} from "react-native";
import CustomHeader from "../Header/CustomHeader";
import ModalSelector from "react-native-modal-selector";
import ActionSheet from "react-native-actionsheet";
import { Header } from "react-native-elements";
import axios from "axios";
import { RadioGroup } from "react-native-btr";
import { SwipeableFlatList } from "react-native-swipeable-flat-list";
import CheckBox from "react-native-check-box";
import AntIcon from "react-native-vector-icons/AntDesign";
import DocumentPicker from "react-native-document-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import MultiSelect from "react-native-multiple-select";
import SelectedDocLayout from "../../src/CompleteEmployers/SelectedDocLayout";
const Entities = require("html-entities").XmlEntities;
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import SimpleHeader from "../Header/SimpleHeader";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
const entities = new Entities();
class PostService extends Component {
  constructor(props) {
    super(props);
    (this.array = []),
      (this.arrayAddon = []),
      (this.state = {
        arrayHolder: [],
        arrayHolder_Addon: [],
        textInput_Holder: "",
        textTitle_Holder: "",
        textPrice_Holder: "",
        textDecription_Holder: "",
        radioButtons: [
          {
            label: "Yes",
            value: "yes",
            checked: true,
            color: "#323232",
            disabled: false,
            onPress: this.hide(),
            width: "50%",
            size: 8,
          },
          {
            label: "No",
            value: "no",
            checked: false,
            color: "#323232",
            disabled: false,
            width: "50%",
            size: 8,
          },
        ],
        image: null,
        images: null,
        imagesAddFile: null,
        switchValue: false,
        imagesLength: "",
        switchfeaturedValue: false,
        sendSwitchFeaturedValue: "",
        sendSwitchValue: "",
        isUpdatingLoader: false,
        Uid: "",
        Title: "",
        Cost: "",
        Content: "",
        Address: "",
        Latitude: "",
        Longitude: "",
        pickerOpacity: 0,
        opacityOfOtherItems: 1,
        label: "Firstvalue",
        isLoading: true,
        freelancerKnown: "",
        jobKnown: "",
        freelancerLevelKnown: "",
        englishKnown: "",
        responseKnown: "",
        deliveryKnown: "",
        durationKnown: "",
        projectCategoryKnown: "",
        projectTypeKnown: "",
        projectLevelKnown: "",
        projectLocationKnown: "",
        CatPickerValueHolder: [],
        CatKnown: [],
        LangPickerValueHolder: [],
        LangKnown: [],
        AddonServiceKnown: [],
        SkillsPickerValueHolder: [],
        SkillsKnown: [],
        showAlert: false,
        showSuccessAlert: false,
        SelectedAddonitem: false,
        themeSettingsMinimumPrice:'',

        FAQ_Data: [],
        FAQ_Refresh: false,
        Question: '',
        Answer: '',
        editedQuestion: '',
        editedAnswer: '',
      });
    this.showFilters = true;
  }
  componentDidMount() {
    
    this.ApplicationThemeSettings();
  }
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'user/get_theme_settings');
    const json = await response.json();
    this.setState({
      themeSettingsMinimumPrice: json.services_settings.minimum_service_price,
      themeSettingsLimitImages: json.services_settings.limit_service_images,
      themeSettingsAddons: json.services_settings.remove_service_addon,
      themeSettingsLanguages: json.services_settings.remove_service_languages,
      themeSettingsEnglishLevel: json.services_settings.remove_service_english_level,
      themeSettingsDownloadable: json.services_settings.remove_service_downloadable,
      themeSettingsCategories: json.services_settings.services_categories,
      themeSettingsVideo: json.services_settings.service_video_option,
      themeSettingsFAQ: json.services_settings.service_faq_option,
      themeSettingsResponseTime: json.remove_response_time,
      themeSettingsDeliveryTime: json.remove_dilivery_time,
    });
    this.setState({ arrayHolder: [...this.array] });
    this.setState({ arrayHolder_Addon: [...this.arrayAddon] });
    this.FreelancerLevelSpinner();
    this.JObDurationSpinner();
    this.englishLevelSpinner();
    this.ProjectCatSpinner();
    this.ProjectTypeSpinner();
    this.ProjectCategoriesSpinner();
    this.ProjectLanguageSpinner();
    this.ProjectSkillsSpinner();
    this.ProjectLocationSpinner();
    this.responseTimeSpinner();
    this.deliveryTimeSpinner();
    this.getAddonServicesSpinner();
  }
  joinData = () => {
    this.array.push({ videotitle: this.state.textInput_Holder });
    this.setState({ arrayHolder: [...this.array] });
  };
  joinDataForAddons = () => {
    this.arrayAddon.push({
      title: this.state.textTitle_Holder,
      price: this.state.textPrice_Holder,
      description: this.state.textDecription_Holder,
    });
    this.setState({ arrayHolder_Addon: [...this.arrayAddon] });
  };
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  };
  GetItem(item) {
    Alert.alert(item.title);
  }
  FreelancerLevelSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=freelancer_level",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let freelancer = responseJson;
        this.setState({
          freelancer,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  JObDurationSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=duration_list", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let JobDuration = responseJson;
        this.setState({
          JobDuration,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  englishLevelSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=english_levels", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let EnglishLevel = responseJson;
        this.setState({
          EnglishLevel,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  responseTimeSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=response_time",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let ResponseTime = responseJson;
        this.setState({
          ResponseTime,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  deliveryTimeSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=delivery",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let DeliveryTime = responseJson;
        this.setState({
          DeliveryTime,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  ProjectCatSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=project_level", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let ProjectLevel = responseJson;
        this.setState({
          ProjectLevel,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  ProjectTypeSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=project_type", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let projectType = responseJson;
        this.setState({
          projectType,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  ProjectLocationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=locations",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let projectLocation = responseJson;
        this.setState({
          projectLocation,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  ProjectCategoriesSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=project_cat",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let ProjectCategory = responseJson;
        this.setState({
          isLoading: false,
          ProjectCategory,
        });
      })
      .catch((error) => {
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
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let Language_data = responseJson;
        this.setState({
          isLoading: false,
          Language_data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  ProjectSkillsSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=skills", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let skills_data = responseJson;
        this.setState({
          isLoading: false,
          skills_data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  getAddonServicesSpinner = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    return fetch(
      CONSTANT.BaseUrl + "services/get_addons_services?user_id=" + Uid,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let AddonService_data = responseJson;
        this.setState({
          isLoading: false,
          AddonService_data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  PostService = async () => {
    
    const Uid = await AsyncStorage.getItem("projectUid");
    const {
      sendSwitchValue,
      sendSwitchFeaturedValue,
      Address,
      image,
      Latitude,
      Longitude,
      Title,
      Cost,
      Content,
      deliveryKnown,
      responseKnown,
      englishKnown,
      projectLocationKnown,
      CatKnown,
      LangKnown,
      AddonServiceKnown,
      arrayHolder_Addon,
      arrayHolder,
      imagesAddFile,
      images,
      FAQ_Data
    } = this.state;
    console.log(
      Title,
      deliveryKnown,
      Cost,
      sendSwitchValue,
      arrayHolder_Addon,
      AddonServiceKnown,
      CatKnown,
      LangKnown,
      englishKnown,
      responseKnown,
      Content,
      arrayHolder,
      projectLocationKnown,
      Address,
      Latitude,
      Longitude,
      sendSwitchFeaturedValue,
      image,
      imagesAddFile,
      images,
      FAQ_Data
    );
    if (
      Title != '' &&
      Cost > this.state.themeSettingsMinimumPrice &&
      Content != '' &&
      deliveryKnown[0] != '' &&
      responseKnown[0] != '' &&
      englishKnown[0] != '' &&
      projectLocationKnown != '' &&
      CatKnown != '' &&
      LangKnown != '' &&
      AddonServiceKnown != '' 
      //&&
      //images.length != ''
    ) {
      // const formData = new FormData();
      // formData.append('user_id', Uid);
      // formData.append('title', Title);
      // formData.append('delivery_time', deliveryKnown[0]);
      // formData.append('response_time', responseKnown[0]);
      // formData.append('english_level', englishKnown[0]);
      // formData.append('price', Cost);
      // formData.append('description', Content);
      // formData.append('country', projectLocationKnown[0]);
      // formData.append('address', Address);
      // formData.append('longitude', Longitude);
      // formData.append('latitude', Latitude);
      // formData.append('is_featured', sendSwitchFeaturedValue);
      // formData.append('categories', CatKnown);
      // formData.append('languages', LangKnown);
      // formData.append('addons', AddonServiceKnown);
      // formData.append('addons_service', arrayHolder_Addon);
      // formData.append('videos', arrayHolder);
      // formData.append('downloadable', 'no');
      // if (imagesAddFile >= 1) {
      //   formData.append('donwload_size', imagesAddFile.length);
      // } else {
      //   formData.append('donwload_size', 0);
      // }
      // if (images >= 1) {
      //   formData.append('size', images.length);
      // } else {
      //   formData.append('size', 0);
      // }
      // if (images >= 1) {
      //   images.forEach((item, i) => {
      //     // propertyData.description = this.props.description
      //     var path = item.uri;
      //     // var filename = path.substring(path.lastIndexOf('/')+1);
      //     var filename = item.name;
      //     formData.append('service_documents' + i, {
      //       uri: path,
      //       type: item.type,
      //       name: filename || `filename${i}.jpg`,
      //     });
      //   });
      // }
      // if (imagesAddFile >= 1) {
      //   imagesAddFile.forEach((item, i) => {
      //     // propertyData.description = this.props.description
      //     var path = item.uri;
      //     // var filename = path.substring(path.lastIndexOf('/')+1);
      //     var filename = item.name;
      //     formData.append('downloads_documents' + i, {
      //       uri: path,
      //       type: item.type,
      //       name: filename || `filename${i}.jpg`,
      //     });
      //   });
      // }
      this.setState({ isLoading: true });
      axios
        .post(CONSTANT.BaseUrl + 'services/update_service',{
          submit_type: "add",
          id: "",
          user_id: Uid,
          title: Title,
          delivery_time: deliveryKnown[0],
          response_time: responseKnown[0],
          english_level: englishKnown[0],
          price: Cost,
          description: Content,
          country: projectLocationKnown[0],
          address: Address,
          longitude: Longitude,
          latitude: Latitude,
          is_featured: sendSwitchFeaturedValue,
          categories: CatKnown,
          languages: LangKnown,
          addons: AddonServiceKnown,
          addons_service: arrayHolder_Addon,
          videos: arrayHolder,
          downloadable: "no",
          faq: FAQ_Data,
        })
        .then(async response => {
          console.log(response);
          if (response.status === 200) {
            this.setState({ isLoading: false });
            Alert.alert("Success", response.data.message);
            console.log("Success", response.data.message)
          } else if (response.status === 203) {
            this.setState({ isLoading: false });
            Alert.alert("Error", response);
            console.log("Error", response)
          }
        })
        .catch(error => {
          Alert.alert(error);
          console.log(error);
        });
      // fetch(CONSTANT.BaseUrl + 'services/add_service', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   body: formData,
      // })
      //   .then(response => response.json())
      //   .then(response => {
      //     if (response.status === '200') {
      //       //  Alert.alert(response.data.message  );
      //       this.showSuccessAlert();
      //     } else if (response.status === '203') {
      //       this.showAlert();
      //       // Alert.alert(response.data.message  );
      //     } else {
      //     }
      //   })
      //   .catch(error => {
      //     Alert.alert('Success', 'Data submitted successfully');
      //   });
    } else if(Cost < this.state.themeSettingsMinimumPrice) {
      alert(`Minimum service price should be ${this.state.themeSettingsMinimumPrice}`)
    }else {
      Alert.alert('Sorry', 'Please add complete Data');
    }
  };
  pickMultiple() {
    try {
      DocumentPicker.pickMultiple({})
        .then((images) => {
          this.setState({
            image: null,
            images: images,
          });
        })
        .catch((e) => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }
  pickMultipleForAddFile() {
    try {
      DocumentPicker.pickMultiple({})
        .then((imagesAddFile) => {
          this.setState({
            image: null,
            imagesAddFile: imagesAddFile,
          });
        })
        .catch((e) => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  toggleSwitch = (value) => {
    this.setState({ switchValue: value });
    if (value == true) {
      this.state.sendSwitchValue = "on";
    } else {
      this.state.sendSwitchValue = "off";
    }
  };
  togglefeaturedSwitch = (value) => {
    this.setState({ switchfeaturedValue: value });
    if (value == true) {
      this.state.sendSwitchFeaturedValue = "on";
    } else {
      this.state.sendSwitchFeaturedValue = "off";
    }
  };
  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };
  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };
  showSuccessAlert = () => {
    this.setState({
      showSuccessAlert: true,
    });
  };
  hideSuccessAlert = () => {
    this.setState({
      showSuccessAlert: false,
    });
  };
  hide() {
    this.setState({ showFilters: false });
  }
  handleChange = (index) => {
    let checked = [...this.state.checked];
    checked[index] = !checked[index];
    this.setState({ checked });
  };
  deleteItemById = (id) => {
    const filteredData = this.state.data.filter((item) => item.id !== id);
    this.setState({ data: filteredData });
  };
  deleteAddress(id) {
    Alert.alert(
      "Delete Address",
      "Are you sure want to delete this File ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.deleteAddressDetail(id) },
      ],
      { cancelable: false }
    );
  }
  deleteAddressVideo(id) {
    Alert.alert(
      "Delete Address",
      "Are you sure want to delete this File ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => this.deleteAddressDetailVideoUrl(id),
        },
      ],
      {
        cancelable: false,
      }
    );
  }
  deleteAddressSelectFile(id) {
    Alert.alert(
      "Delete Address",
      "Are you sure want to delete this File ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => this.deleteAddressDetailSelectFileUrl(id),
        },
      ],
      {
        cancelable: false,
      }
    );
  }
  deleteAddressDetail(id) {
    let newimagesAddFile = this.state.imagesAddFile;
    newimagesAddFile.splice(id, 1);
    this.setState({ imagesAddFile: newimagesAddFile });
  }
  deleteAddressDetailVideoUrl(id) {
    let newimagesAddFile = this.state.arrayHolder;
    newimagesAddFile.splice(id, 1);
    this.setState({ arrayHolder: newimagesAddFile });
  }
  deleteAddressDetailSelectFileUrl(id) {
    let newimagesAddFile = this.state.images;
    newimagesAddFile.splice(id, 1);
    this.setState({ images: newimagesAddFile });
  }
  PushInArray=(item , index)=>{
    if (this.state.AddonServiceKnown.includes(item.ID)){
      const index = this.state.AddonServiceKnown.indexOf(item.ID);
      if (index > -1) {
        this.state.AddonServiceKnown.splice(index, 1);
      }
      this.setState({
        SelectedAddonitem : false
      })
    }else {
      this.state.AddonServiceKnown.push(item.ID)
      this.setState({
        SelectedAddonitem : true
      })
    }
  }
  handleTextChange = (Cost) => {
    if (Cost >= this.state.themeSettingsMinimumPrice) {
      this.setState({Cost: Cost});
    } else {
      // this.setState({Cost: ""});
      alert(`Minimum service price should be ${this.state.themeSettingsMinimumPrice}`)
    }
  };

  addInd_ExpData = () => {
		this.state.FAQ_Data.push({
			faq_question: this.state.Question,
			faq_answer: this.state.Answer,
		});
		console.log("data" , this.state.FAQ_Data)
		this.setState({
			FAQ_Refresh: true,
			Answer:'',
			Question:'',
		});
  };
  EditData = (index, item) => {
		console.log(item.faq_question, item.faq_answer)
    this.state.FAQ_Data[index] = {
			faq_question: this.state.editedQuestion != '' ? this.state.editedQuestion : item.faq_question , 
			faq_answer: this.state.editedAnswer != '' ? this.state.editedAnswer : item.faq_answer
		}
    this.setState({FAQ_Refresh: true,})
	};
	FAQ_DeleteForm = index => {
    this.state.FAQ_Data.splice(index, 1);
    this.setState({
      FAQ_Refresh: true
    });
  };

  render() {
    let selectedItem = this.state.radioButtons.find((e) => e.checked == true);
    selectedItem = selectedItem
      ? selectedItem.value
      : this.state.radioButtons[0].value;
    const {
      showAlert,
      showSuccessAlert,
      isLoading,
      isUpdatingLoader,
      imagesAddFile,
      images,
    } = this.state;
    let { data, checked } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.PostService} />
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        {isUpdatingLoader == true ? (
          <View
            style={[
              styles.ActivityIndicatorAreaStyle,
              { backgroundColor: "rgba(0, 0, 0,0.1)" },
            ]}
          >
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView style={styles.section}>
          <Text style={styles.MainHeadingTextStyle}>
            {CONSTANT.PostServicePostAService}
          </Text>
          <View style={styles.PostServiceHeadingBorder} />
          <View style={styles.PostJobSectionHeadingArea}>
            <Text style={styles.SectionHeadingTextStyle}>
              {CONSTANT.PostServiceServiceDescription}
            </Text>
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputLayoutStyle}
            name="username"
            placeholder={CONSTANT.PostServiceServiceTitle}
            placeholderTextColor="#807f7f"
            onChangeText={(Title) => this.setState({ Title })}
          />
          {this.state.themeSettingsDeliveryTime == 'no' &&
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={(value) =>
                  this.setState({ deliveryKnown: value })
                }
                uniqueKey="slug"
                items={this.state.DeliveryTime}
                selectedItems={this.state.deliveryKnown}
                single={true}
                searchInputPlaceholderText={CONSTANT.PostServicePickDeliveryTime}
                selectText={CONSTANT.PostServicePickDeliveryTime}
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={
                  styles.MultiSelectstyleDropdownMenuSubsection
                }
                onChangeInput={(text) => console.log(text)}
                displayKey="name"
                submitButtonText={CONSTANT.Submit}
              />
            </View>
          }
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputLayoutStyle}
            name="username"
            placeholder={CONSTANT.PostServiceServiceCost}
            placeholderTextColor="#807f7f"
            // onChangeText={(Cost) => this.setState({ Cost: Cost >=5 ? Cost : alert('less then 5') })}
            onChangeText={(Cost)=> this.setState({ Cost })}
            // onEndEditing={ (Cost) => this.handleTextChange(Cost) }
            // onChangeText={ Cost => this.handleTextChange(Cost) }
            
          />
          { this.state.themeSettingsDownloadable === 'no' &&
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.PostServiceDownloadableServices}
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <RadioGroup
                  style={styles.RadioButtonStyle}
                  color={CONSTANT.primaryColor}
                  labelStyle={styles.RadioLabelStyle}
                  radioButtons={this.state.radioButtons}
                  onPress={(radioButtons) => this.setState({ radioButtons })}
                />
              </View>
              {selectedItem == "yes" && (
                <View>
                  <Text
                    style={[
                      styles.NameTextStyle,
                      {
                        color: CONSTANT.primaryColor,
                        marginLeft: 10,
                        marginBottom: 10,
                      },
                    ]}
                  >
                    {CONSTANT.PostServiceAddYourFile}
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.pickMultipleForAddFile()}
                    style={styles.MainButtonArea}
                  >
                    <Text style={styles.ButtonText}>
                      {CONSTANT.PostServiceAddFile}
                    </Text>
                  </TouchableOpacity>
                  {this.state.imagesAddFile != null ? (
                    <View style={styles.PostServiceAddArea}>
                      <SwipeableFlatList
                        data={this.state.imagesAddFile}
                        renderItem={({ item }) => (
                          <View style={styles.PostServiceAddInfoArea}>
                            <Text
                              style={styles.NameTextStyle}
                              onPress={this.GetItem.bind(this, item.title)}
                            >
                              {item.name}
                            </Text>
                          </View>
                        )}
                        renderRight={({ item }) => (
                          <TouchableOpacity
                            style={styles.PostServiceAddDeleteIconArea}
                            onPress={() => this.deleteAddress(item)}
                          >
                            <AntIcon name="delete" color={"#fff"} size={16} />
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          }
          {this.state.themeSettingsAddons === 'no' &&
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.PostServiceAddonServices}
                </Text>
              </View>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.TextInputLayoutStyle}
                name="username"
                placeholder={CONSTANT.PostServiceAddonTitle}
                placeholderTextColor="#807f7f"
                onChangeText={(data) => this.setState({ textTitle_Holder: data })}
              />
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.TextInputLayoutStyle}
                name="username"
                placeholder={CONSTANT.PostServiceAddonPrice}
                placeholderTextColor="#807f7f"
                onChangeText={(data) => this.setState({ textPrice_Holder: data })}
              />
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.TextInputLayoutStyle}
                name="username"
                placeholder={CONSTANT.PostServiceAddonDescription}
                placeholderTextColor="#807f7f"
                onChangeText={(data) =>
                  this.setState({ textDecription_Holder: data })
                }
              />
              <TouchableOpacity
                onPress={() => this.joinDataForAddons()}
                style={styles.MainButtonArea}
              >
                <Text style={styles.ButtonText}>
                  {CONSTANT.PostServiceAddAddons}
                </Text>
              </TouchableOpacity>
              {this.state.arrayHolder_Addon != null ? (
                <View style={styles.PostServiceAddArea}>
                  <SwipeableFlatList
                    data={this.state.arrayHolder_Addon}
                    renderItem={({ item }) => (
                      <View style={styles.PostServiceAddInfoArea}>
                        <Text style={styles.NameTextStyle}> {item.title} </Text>
                      </View>
                    )}
                    renderRight={({ item }) => (
                      <TouchableOpacity
                        style={styles.PostServiceAddDeleteIconArea}
                        // onPress={() => this.deleteAddressVideo(item)}
                      >
                        <AntIcon name="delete" color={"#fff"} size={16} />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : null}
              {/* <View style={styles.MultiSelectArea}>
                <MultiSelect
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(value) =>
                    this.setState({ AddonServiceKnown: value })
                  }
                  uniqueKey="ID"
                  items={this.state.AddonService_data}
                  selectedItems={this.state.AddonServiceKnown}
                  borderBottomWidth={0}
                  searchInputPlaceholderText={CONSTANT.PostServicePickAddonService}
                  selectText={CONSTANT.PostServicePickAddonService}
                  styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                  styleDropdownMenuSubsection={
                    styles.MultiSelectstyleDropdownMenuSubsection
                  }
                  onChangeInput={(text) => console.log(text)}
                  displayKey="title"
                  submitButtonText={CONSTANT.Submit}
                />
              </View> */}
              <FlatList
                style={{ borderTopWidth: 1, borderTopColor: "#ddd" }}
                showsVerticalScrollIndicator={false}
                data={this.state.AddonService_data}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item , index }) => (
                  <TouchableOpacity
                    onPress={()=> this.PushInArray(item , index)}
                    activeOpacity={0.9}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#ddd",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "80%",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderColor: "#ddd",
                          borderWidth: 1,
                          borderRadius: 3,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: this.state.AddonServiceKnown.includes(item.ID) ? "#3498db": "#fff",
                        }}
                      >
                        <AntIcon name="check" size={14} color={"#fff"} />
                      </View>
                      <View style={{ width: "90%", paddingLeft: 10 }}>
                        <Text style={styles.SectionHeadingTextStyle}>
                          {item.title}
                        </Text>
                        <Text style={styles.ParagraphTextStyle}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: "20%", alignItems: "flex-end" }}>
                      <Text
                        style={styles.SectionHeadingTextStyle}
                      >{`${entities.decode(item.price)}`}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          }
          { 
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.PostServiceServiceCategories}
                </Text>
              </View>
              <View style={styles.MultiSelectArea}>
                <MultiSelect
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(value) =>
                    this.setState({ CatKnown: value })
                  }
                  uniqueKey="id"
                  items={this.state.ProjectCategory}
                  selectedItems={this.state.CatKnown}
                  borderBottomWidth={0}
                  searchInputPlaceholderText={CONSTANT.PostServicePickCategories}
                  selectText={CONSTANT.PostServicePickCategories}
                  styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                  styleDropdownMenuSubsection={
                    styles.MultiSelectstyleDropdownMenuSubsection
                  }
                  onChangeInput={(text) => console.log(text)}
                  displayKey="name"
                  submitButtonText={CONSTANT.Submit}
                />
              </View>
            </View>
          }
          { this.state.themeSettingsLanguages === 'no' &&
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.PostServiceLanguages}
                </Text>
              </View>
              <View style={styles.MultiSelectArea}>
                <MultiSelect
                  style={{ marginTop: 4 }}
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(value) =>
                    this.setState({ LangKnown: value })
                  }
                  uniqueKey="id"
                  items={this.state.Language_data}
                  selectedItems={this.state.LangKnown}
                  borderBottomWidth={0}
                  searchInputPlaceholderText={CONSTANT.PostServicePickLanguages}
                  selectText={CONSTANT.PostServicePickLanguages}
                  styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                  styleDropdownMenuSubsection={
                    styles.MultiSelectstyleDropdownMenuSubsection
                  }
                  onChangeInput={(text) => console.log(text)}
                  displayKey="name"
                  submitButtonText={CONSTANT.Submit}
                />
              </View>
            </View>  
          }
          { this.state.themeSettingsEnglishLevel === 'no' &&
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.PostServiceEnglishLevel}
                </Text>
              </View>
              <View style={styles.MultiSelectArea}>
                <MultiSelect
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(value) =>
                    this.setState({ englishKnown: value })
                  }
                  uniqueKey="value"
                  items={this.state.EnglishLevel}
                  selectedItems={this.state.englishKnown}
                  borderBottomWidth={0}
                  single={true}
                  searchInputPlaceholderText={CONSTANT.PostServicePickEnglishLavel}
                  selectText={CONSTANT.PostServicePickEnglishLavel}
                  styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                  styleDropdownMenuSubsection={
                    styles.MultiSelectstyleDropdownMenuSubsection
                  }
                  onChangeInput={(text) => console.log(text)}
                  displayKey="title"
                  submitButtonText={CONSTANT.Submit}
                />
              </View>
            </View>  
          }
          {this.state.themeSettingsResponseTime == 'no' &&
            <>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.PostServiceServiceResponseTime}
                </Text>
              </View>
              <View style={styles.MultiSelectArea}>
                <MultiSelect
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(value) =>
                    this.setState({ responseKnown: value })
                  }
                  uniqueKey="slug"
                  items={this.state.ResponseTime}
                  selectedItems={this.state.responseKnown}
                  borderBottomWidth={0}
                  single={true}
                  searchInputPlaceholderText={CONSTANT.PostServicePickResponseTime}
                  selectText={CONSTANT.PostServicePickResponseTime}
                  styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                  styleDropdownMenuSubsection={
                    styles.MultiSelectstyleDropdownMenuSubsection
                  }
                  onChangeInput={(text) => console.log(text)}
                  displayKey="name"
                  submitButtonText={CONSTANT.Submit}
                />
              </View>
            </>
          }
          <View style={styles.PostJobSectionHeadingArea}>
            <Text style={styles.SectionHeadingTextStyle}>
              {CONSTANT.PostServiceServiceDetails}
            </Text>
          </View>
          <TextInput
            multiline={true}
            underlineColorAndroid="transparent"
            style={[styles.TextInputLayoutStyleForDetail, { paddingTop: 10 }]}
            name="username"
            placeholder={CONSTANT.PostServiceServiceContent}
            placeholderTextColor="#807f7f"
            onChangeText={(Content) => this.setState({ Content })}
          />
          { this.state.themeSettingsVideo === 'yes' &&
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.PostServiceAddVideoUrl}
                </Text>
              </View>
              <View style={styles.PostServiceAddVideoURLArea}>
                <TextInput
                  onChangeText={(data) => this.setState({ textInput_Holder: data })}
                  underlineColorAndroid="transparent"
                  placeholder={CONSTANT.PostServiceEnterUrlHere}
                  style={[
                    styles.TextInputLayoutStyle,
                    styles.PostServiceAddVideoURLTextInputStyle,
                  ]}
                />
                <View style={styles.PostServiceAddVideoURLIconArea}>
                  <AntIcon
                    onPress={this.joinData}
                    name="plus"
                    color={"#fff"}
                    size={20}
                  />
                </View>
              </View>
            </View>  
          }
          {this.state.arrayHolder != null ? (
            <View style={styles.PostServiceAddArea}>
              <SwipeableFlatList
                data={this.state.arrayHolder}
                renderItem={({ item }) => (
                  <View style={styles.PostServiceAddInfoArea}>
                    <Text style={styles.NameTextStyle}>
                      {" "}
                      {item.videotitle}{" "}
                    </Text>
                  </View>
                )}
                renderRight={({ item }) => (
                  <TouchableOpacity
                    style={styles.PostServiceAddDeleteIconArea}
                    onPress={() => this.deleteAddressVideo(item)}
                  >
                    <AntIcon name="delete" color={"#fff"} size={16} />
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          <View style={styles.PostJobSectionHeadingArea}>
            <Text style={styles.SectionHeadingTextStyle}>
              {CONSTANT.PostServiceYourLocation}
            </Text>
          </View>
          <View style={styles.MultiSelectArea}>
            <MultiSelect
              ref={(component) => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={(value) =>
                this.setState({ projectLocationKnown: value })
              }
              uniqueKey="slug"
              items={this.state.projectLocation}
              selectedItems={this.state.projectLocationKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText={CONSTANT.PostServicePickLocation}
              selectText={CONSTANT.PostServicePickLocation}
              styleMainWrapper={styles.MultiSelectstyleMainWrapper}
              styleDropdownMenuSubsection={
                styles.MultiSelectstyleDropdownMenuSubsection
              }
              onChangeInput={(text) => console.log(text)}
              displayKey="name"
              submitButtonText={CONSTANT.Submit}
            />
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputLayoutStyle}
            name="username"
            placeholder={CONSTANT.PostServiceAddress}
            placeholderTextColor="#807f7f"
            onChangeText={(Address) => this.setState({ Address })}
          />
          <Text
            style={[
              styles.ParagraphTextStyle,
              { textAlign: "center", marginBottom: 10, marginHorizontal: 10 },
            ]}
          >
            {CONSTANT.PostServiceLatiandLongi}
          </Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputLayoutStyle}
            name="username"
            placeholder={CONSTANT.PostServiceLatitude}
            placeholderTextColor="#807f7f"
            onChangeText={(Latitude) => this.setState({ Latitude })}
          />
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputLayoutStyle}
            name="username"
            placeholder={CONSTANT.PostServiceLongitude}
            placeholderTextColor="#807f7f"
            onChangeText={(Longitude) => this.setState({ Longitude })}
          />

          {this.state.themeSettingsFAQ == 'yes' &&
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.FAQ_ProfileHeading}
                </Text>
              </View>

              <View style={[styles.PersonalDetailSectionArea, {marginLeft: 0, marginRight: 0}]}>
                <View>
                <TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder={CONSTANT.FAQ_ProfileQuestion}
                    onChangeText={Question =>
                      this.setState({ Question })
                    }
                    style={styles.TextInputLayoutStyle}
                    value={this.state.Question}
                  />
                  <TextInput
                    multiline={true}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder={CONSTANT.FAQ_ProfileAnswer}
                    onChangeText={Answer =>
                      this.setState({ Answer })
                    }
                    style={styles.TextInputLayoutStyleForDetail}
                    value={this.state.Answer}
                  />
                  <TouchableOpacity
                    onPress={this.addInd_ExpData}
                    style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                    <Text style={styles.ButtonText}>
                      {CONSTANT.ProfileAdd}
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.FAQ_Data ? (
                  <FlatList
                    data={this.state.FAQ_Data}
                    extraData={this.state.FAQ_Refresh}
                    renderItem={({ item, index }) => (
                      <View>
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
                              <Text
                                style={
                                  styles.PersonalDetailCoollapseHeaderText
                                }
                              >
                                {item.faq_question}
                              </Text>
                            </TouchableOpacity>
                            <View style={styles.PersonalDetailEditBTN}>
                              <AntIcon name="edit" color={"#fff"} size={20} />
                            </View>
                            <TouchableOpacity
                              onPress={() => this.FAQ_DeleteForm(index)}
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
                              placeholder={CONSTANT.FAQ_ProfileQuestion}
                              style={styles.TextInputLayoutStyle}
                              //onSelectionChange={() => this.EditData(index, item)}
                              onChangeText={editedQuestion =>
                                this.setState({ editedQuestion })
                              }
                            >
                              {item.faq_question}
                            </TextInput>
                            <TextInput
                              multiline={true}
                              underlineColorAndroid="transparent"
                              placeholderTextColor="#7F7F7F"
                              placeholder={CONSTANT.FAQ_ProfileAnswer}
                              style={styles.TextInputLayoutStyleForDetail}
                              //onSelectionChange={() => this.EditData(index, item)}
                              onChangeText={editedAnswer =>
                                this.setState({ editedAnswer })
                              }
                            >
                              {item.faq_answer}
                            </TextInput>
                            <TouchableOpacity
                              onPress={() => this.EditData(index , item)}
                              style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                              <Text style={styles.ButtonText}>
                                {CONSTANT.ProfileAdd}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </CollapseBody>
                      </Collapse>
                      </View>
                    )}
                  />
                ) : null}
              </View>
            </View>
          }

          <View style={styles.PostJobSectionHeadingArea}>
            <Text style={styles.SectionHeadingTextStyle}>
              {CONSTANT.PostServiceIsFeatured}
            </Text>
            <Switch
              style={{ alignSelf: "flex-end", marginTop: -20 }}
              onValueChange={this.togglefeaturedSwitch}
              value={this.state.switchfeaturedValue}
            />
          </View>
          <Text
            style={[
              styles.ParagraphTextStyle,
              { textAlign: "center", marginBottom: 10, marginHorizontal: 10 },
            ]}
          >
            {CONSTANT.PostServiceSelectOneAttachment}
          </Text>
          {this.state.images != null ? (
            <View style={styles.PostServiceAddArea}>
              <SwipeableFlatList
                data={this.state.images}
                renderItem={({ item }) => (
                  <View style={styles.PostServiceAddInfoArea}>
                    <Text
                      style={styles.NameTextStyle}
                      onPress={this.GetItem.bind(this, item.title)}
                    >
                      {" "}
                      {item.name}{" "}
                    </Text>
                  </View>
                )}
                renderRight={({ item }) => (
                  <TouchableOpacity
                    style={styles.PostServiceAddDeleteIconArea}
                    onPress={() => this.deleteAddressSelectFile(item)}
                  >
                    <AntIcon name="delete" color={"#fff"} size={16} />
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          <View style={styles.PostJobButtonsArea}>
            <TouchableOpacity
              onPress={this.PostService}
              style={styles.MainButtonArea}
            >
              <Text style={styles.ButtonText}>
                {CONSTANT.PostServiceUpdate}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.pickMultiple()}
              style={[styles.MainButtonArea, { backgroundColor: "#00cc8d" }]}
            >
              <Text style={styles.ButtonText}>
                {CONSTANT.PostServiceSelectFile}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={CONSTANT.AwesomeAlertTitle}
          message={CONSTANT.AwesomeAlertMessage1}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText={CONSTANT.AwesomeAlertConfirmText}
          confirmButtonColor={CONSTANT.primaryColor}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
        <AwesomeAlert
          show={showSuccessAlert}
          showProgress={false}
          title={CONSTANT.AwesomeAlertTitle}
          message={CONSTANT.AwesomeAlertMessage2}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText={CONSTANT.AwesomeAlertConfirmText}
          confirmButtonColor={CONSTANT.primaryColor}
          onConfirmPressed={() => {
            this.hideSuccessAlert();
          }}
        />
      </View>
    );
  }
}
export default PostService;
