import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator
} from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import AntIcon from "react-native-vector-icons/AntDesign";
import StarRating from "react-native-star-rating";
import { RadioGroup } from "react-native-btr";
import { Header } from "react-native-elements";
import RangeSlider from 'rn-range-slider';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import SimpleHeader from '../Header/SimpleHeader';
import MultiSelect from "react-native-multiple-select";
class SearchScreen extends Component {
  constructor() {
    super();
    this.state = {
      radioButtons: [
        {
          label: CONSTANT.SearchFreelancer,
          value: "freelancer",
          checked: true,
          color: "#323232",
          disabled: false,
          onPress: this.hide(),
          size: 7
        },

        {
          label: CONSTANT.SearchJobs,
          value: "jobs",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },
        {
          label: CONSTANT.SearchEmployer,
          value: "employer",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },
        {
          label: CONSTANT.SearchServices,
          value: "services",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        }
      ],
      radioButtonsJob: [
        {
          label: CONSTANT.SearchFreelancer,
          value: "freelancer",
          checked: true,
          color: "#323232",
          disabled: false,
          onPress: this.hide(),
          size: 7
        },

        {
          label: CONSTANT.SearchJobs,
          value: "jobs",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },
        {
          label: CONSTANT.SearchEmployer,
          value: "employer",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },

      ],
      radioButtonsService: [
        {
          label: CONSTANT.SearchFreelancer,
          value: "freelancer",
          checked: true,
          color: "#323232",
          disabled: false,
          onPress: this.hide(),
          size: 7
        },
        {
          label: CONSTANT.SearchEmployer,
          value: "employer",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },
        {
          label: CONSTANT.SearchServices,
          value: "services",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        }
      ],
      isLoading: true,
      title: "",
      isLoading: true,
      freelancerKnown: [],
      jobKnown: [],
      freelancerLevelKnown: [],
      englishKnown: [],
      durationKnown: [],
      projectCategoryKnown: [],
      projectTypeKnown: [],
      projectLevelKnown: [],
      projectLocationKnown: [],
      CatPickerValueHolder: [],
      CatKnown: [],
      LangPickerValueHolder: [],
      LangKnown: [],
      SkillsPickerValueHolder: [],
      SkillsKnown: [],
      EmployeeKnown: "",
      DeliveryKnown: [],
      ResponseKnown: [],
    };
    this.showFilters = true;
  }
  componentDidMount() {
    this.CheckApplicationAccess();
    this.FreelancerLevelSpinner();
    this.JObDurationSpinner();
    this.englishLevelSpinner();
    this.ProjectCatSpinner();
    this.ProjectTypeSpinner();
    this.ProjectCategoriesSpinner();
    this.ProjectLanguageSpinner();
    this.ProjectSkillsSpinner();
    this.ProjectLocationSpinner();
    this.NoEmployeeSpinner();
    this.DeliveryTime();
    this.ResponseTime();
  }
  CheckApplicationAccess = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_access");
    const json = await response.json();
    this.setState({ ApplicationAccessServcie: json.access_type.service_access });
    this.setState({ ApplicationAccessJob: json.access_type.job_access });
  }
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
      })
      .catch(error => {
        console.error(error);
      });
  };
  JObDurationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=duration_list",
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
        let JobDuration = responseJson;

        this.setState({
          JobDuration
        });
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
  ProjectCatSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=project_level",
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
        let ProjectLevel = responseJson;
        this.setState({
          ProjectLevel
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  ProjectTypeSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=project_type",
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
        let projectType = responseJson;
        this.setState({
          projectType
        });
      })
      .catch(error => {
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
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let projectLocation = responseJson;
        this.setState({
          projectLocation
        });
      })
      .catch(error => {
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
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let ProjectCategory = responseJson;
        this.setState({
          ProjectCategory
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
          isLoading: false,
          skills_data
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  NoEmployeeSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=no_of_employes",
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
        let NoEmployee_data = responseJson;
        this.setState({
          NoEmployee_data
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  DeliveryTime = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=delivery",
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
        let deliveryTime_data = responseJson;
        this.setState({
          deliveryTime_data
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  ResponseTime = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=response_time",
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
        let responseTime_data = responseJson;
        this.setState({
          responseTime_data
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  SearchFreelancer = () => {
    const {
      title,
      freelancerLevelKnown,
      englishKnown,
      SkillsKnown,
      LangKnown,
      CatKnown,
      projectLocationKnown
    } = this.state;
    this.props.navigation.navigate("SearchResultFreelancer", {
      title: title,
      freelancerLevelKnown: freelancerLevelKnown,
      englishKnown: englishKnown,
      SkillsKnown: SkillsKnown,
      LangKnown: LangKnown,
      CatKnown: CatKnown,
      projectLocationKnown: projectLocationKnown
    });
  };
  SearchJobs = () => {
    const {
      title,
      freelancerLevelKnown,
      SkillsKnown,
      LangKnown,
      CatKnown,
      projectLocationKnown,
      durationKnown
    } = this.state;
    this.props.navigation.navigate("SearchResultJob", {
      title: title,
      freelancerLevelKnown: freelancerLevelKnown,
      durationKnown: durationKnown,
      SkillsKnown: SkillsKnown,
      LangKnown: LangKnown,
      CatKnown: CatKnown,
      projectLocationKnown: projectLocationKnown
    });
  };
  SearchServices = () => {
    const {
      title,
      CatKnown,
      projectLocationKnown,
      LangKnown,
      ResponseKnown,
      DeliveryKnown
    } = this.state;
    this.props.navigation.navigate("SearchResultService", {
      title: title,
      CatKnown: CatKnown,
      projectLocationKnown: projectLocationKnown,
      LangKnown: LangKnown,
      ResponseKnown: ResponseKnown,
      DeliveryKnown: DeliveryKnown
    });
  };
  SearchEmployer = () => {
    const { title, projectLocationKnown, EmployeeKnown } = this.state;
    this.props.navigation.navigate("SearchResultEmployer", {
      title: title,
      EmployeeKnown: EmployeeKnown,
      projectLocationKnown: projectLocationKnown
    });
  };
  hide() {
    this.setState({ showFilters: false });
  }
  render() {
    let selectedItem = this.state.radioButtons.find(e => e.checked == true);
    selectedItem = selectedItem
      ? selectedItem.value
      : this.state.radioButtons[0].value;
    const {
      title,
      freelancerKnown,
      englishKnown,
      SkillsKnown,
      LangKnown,
      CatKnown,
      projectLocationKnown,
      isLoading
    } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.searchHeader}/>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}
          >
            <Text
              style={styles.MainHeadingTextStyle}
            >
              {CONSTANT.SearchNarrowMain}
            </Text>
          </View>
          <View
            style={styles.section}
          >
            {/* <Text style={[styles.NameTextStyle,{ marginBottom: 10 }]}>
              {CONSTANT.SearchNarrow}
            </Text> */}
            <View style={{alignItems: 'center',}}>
              {
                this.state.ApplicationAccessServcie === "yes" && this.state.ApplicationAccessJob === "yes" ?
                  <RadioGroup
                    color={CONSTANT.primaryColor}
                    labelStyle={{ fontSize: 10}}
                    radioButtons={this.state.radioButtons}
                    onPress={radioButtons => this.setState({ radioButtons })}
                    style={styles.RadioButtonStyle}
                  />
                  : this.state.ApplicationAccessServcie === "yes" && this.state.ApplicationAccessJob === "" ?
                  <RadioGroup
                    color={CONSTANT.primaryColor}
                    labelStyle={{ fontSize: 10 }}
                    radioButtons={this.state.radioButtonsService}
                    onPress={radioButtons => this.setState({ radioButtons })}
                    style={styles.RadioButtonStyle}
                  /> 
                  : this.state.ApplicationAccessServcie === "" && this.state.ApplicationAccessJob === "yes" ?
                  <RadioGroup
                    color={CONSTANT.primaryColor}
                    labelStyle={{ fontSize: 10 }}
                    radioButtons={this.state.radioButtonsJob}
                    onPress={radioButtons => this.setState({ radioButtons })}
                    style={styles.RadioButtonStyle}
                  />
                : null
              }
            </View>
            {/* <View style={styles.selectedItemView}>
              <Text style={styles.selectedText}>Selected Item: {selectedItem}</Text>
            </View> */}
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.TextInputLayoutStyle}
              name="username"
              placeholder={CONSTANT.SearchType}
              placeholderTextColor="#807f7f"
              onChangeText={title => this.setState({ title })}
            />
            {selectedItem == "freelancer" || selectedItem == "jobs" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.SearchFreelancerType}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}>
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
                    searchInputPlaceholderText={CONSTANT.SearchPickFreelancerLevel}
                    selectText={CONSTANT.SearchPickFreelancerLevel}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="title"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            {selectedItem == "jobs" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.SearchLength}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ durationKnown: value })
                    }
                    uniqueKey="value"
                    items={this.state.JobDuration}
                    selectedItems={this.state.durationKnown}
                    borderBottomWidth={0}
                    searchInputPlaceholderText={CONSTANT.SearchPickDuration}
                    selectText={CONSTANT.SearchPickDuration}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="title"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            {selectedItem == "freelancer" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.SearchEnglishLevel}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
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
                    searchInputPlaceholderText={CONSTANT.SearchPickEnglishLevel}
                    selectText={CONSTANT.SearchPickEnglishLevel}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="title"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            {selectedItem == "freelancer" || selectedItem == "jobs" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.SearchSkillRequired}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
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
                    searchInputPlaceholderText={CONSTANT.SearchPickSkills}
                    selectText={CONSTANT.SearchPickSkills}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            {selectedItem == "freelancer" || selectedItem == "jobs" || selectedItem == "services" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.Searchlanguages}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
                >
                  {/* <Text style={{width:'20%' , alignSelf:'center' , marginLeft:10 , fontSize:15}}>Categories:</Text> */}
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
              </View>
            ) : null}
            {selectedItem == "jobs" || selectedItem == "services" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.SearchCategories}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ CatKnown: value })
                    }
                    uniqueKey="slug"
                    items={this.state.ProjectCategory}
                    selectedItems={this.state.CatKnown}
                    borderBottomWidth={0}
                    searchInputPlaceholderText={CONSTANT.SearchPickCategories}
                    selectText={CONSTANT.SearchPickCategories}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            <View
              style={styles.DeatilSearchInfoArea}
            >
              <Text
                style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
              >
                {CONSTANT.SearchLocation}
              </Text>
            </View>
            <View style={[styles.MultiSelectArea,{marginHorizontal:10}]}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({ projectLocationKnown: value })
                }
                uniqueKey="slug"
                items={this.state.projectLocation}
                selectedItems={this.state.projectLocationKnown}
                borderBottomWidth={0}
                searchInputPlaceholderText={CONSTANT.SearchPickLocation}
                selectText={CONSTANT.SearchPickLocation}
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                onChangeInput={text => console.log(text)}
                displayKey="name"
                submitButtonText={CONSTANT.Submit}
              />
            </View>
            {selectedItem == "employer" ? (
              <View >
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.SearchNoEmp}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ EmployeeKnown: value })
                    }
                    uniqueKey="value"
                    items={this.state.NoEmployee_data}
                    selectedItems={this.state.EmployeeKnown}
                    borderBottomWidth={0}
                    single={true}
                    searchInputPlaceholderText={CONSTANT.SearchPickEmployees}
                    selectText={CONSTANT.SearchPickEmployees}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="title"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            {selectedItem == "services" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.SearchDelivery}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ DeliveryKnown: value })
                    }
                    uniqueKey="slug"
                    items={this.state.deliveryTime_data}
                    selectedItems={this.state.DeliveryKnown}
                    borderBottomWidth={0}
                    single={false}
                    searchInputPlaceholderText={CONSTANT.SearchPickDeliveryTime}
                    selectText={CONSTANT.SearchPickDeliveryTime}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            {selectedItem == "services" ? (
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}
                  >
                    {CONSTANT.Searchresponse}
                  </Text>
                </View>
                <View
                  style={[styles.MultiSelectArea,{marginHorizontal:10}]}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ ResponseKnown: value })
                    }
                    uniqueKey="slug"
                    items={this.state.responseTime_data}
                    selectedItems={this.state.ResponseKnown}
                    borderBottomWidth={0}
                    single={false}
                    searchInputPlaceholderText={CONSTANT.SearchPickResponseTime}
                    selectText={CONSTANT.SearchPickResponseTime}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
              </View>
            ) : null}
            {/* {selectedItem == "jobs" ?
              <View>
                <View
                  style={styles.DeatilSearchInfoArea}
                >
                  <Text
                    style={[styles.NameTextStyle,{fontWeight:'700',marginLeft:10}]}>
                    {CONSTANT.SearchPriceRange}
             </Text>
                </View>
                <RangeSlider
                  style={{ width: "100%", height: 80 }}
                  gravity={'center'}
                  min={0}
                  max={1000}
                  step={30}
                  selectionColor={CONSTANT.primaryColor}
                  blankColor="#ddd"
                  onValueChanged={(low, high, fromUser) => {
                    this.setState({ rangeLow: low, rangeHigh: high })
                  }} />
              </View>
              : null} */}
            {selectedItem == "jobs" ? (
              <TouchableOpacity
                onPress={this.SearchJobs}
                style={styles.MainButtonArea}
              >
                <Text
                  style={styles.ButtonText}
                >
                  {CONSTANT.SearchButtonJobs}
                </Text>
              </TouchableOpacity>
            ) : selectedItem == "employer" ? (
              <TouchableOpacity
                onPress={this.SearchEmployer}
                style={styles.MainButtonArea}
              >
                <Text
                  style={styles.ButtonText}
                >
                  {CONSTANT.SearchButtonEmployers}
                </Text>
              </TouchableOpacity>
            ) : selectedItem == "freelancer" ? (
              <TouchableOpacity
                onPress={this.SearchFreelancer}
                style={styles.MainButtonArea}
              >
                <Text
                  style={styles.ButtonText}
                >
                  {CONSTANT.SearchButtonFreelancer}
                </Text>
              </TouchableOpacity>
            ) : selectedItem == "services" ? (
              <TouchableOpacity
                onPress={this.SearchServices}
                style={styles.MainButtonArea}
              >
                <Text
                  style={styles.ButtonText}
                >
                  {CONSTANT.SearchButtonService}
                </Text>
              </TouchableOpacity>) : null
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default SearchScreen;
