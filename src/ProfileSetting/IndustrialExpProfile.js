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
  KeyboardAvoidingView
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

class IndustrialExpProfile extends Component {

  state={
    isLoading: true,
    Industrial_ExperienceData: [],
    Ind_ExpRefresh: false,
    MultiSelect_Ind_Exp: [],
    Selected_Ind_Exp: '',
    SkillsName: '',
    new_Selected_Ind_Exp:[],
    New_Industrial_ExperienceData:[],
    EditedValue:'',
  }

  componentDidMount() {
    this.ApplicationThemeSettings();
    this.ProjectExpSpinner();
    this.Industrial_ExpSpinner();
    this.fetchIndustrial_ExpData();
  }
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'user/get_theme_settings');
    const json = await response.json();
    this.setState({themeSettingsDisplayType: json.freelancers_settings.skills_display_type, isLoading: false});
    console.log('display type', this.state.themeSettingsDisplayType)
  }
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
          isLoading: false,
          experience_data
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  Industrial_ExpSpinner = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomies"
    );
		const json = await response.json();
    this.setState({ MultiSelect_Ind_Exp: json[0].wt_industrial_experience, isLoading: false });
 
  };

  fetchIndustrial_ExpData = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_profile_tab_settings?user_id=" + Uid
    );
		const json = await response.json();
    this.setState({ Industrial_ExperienceData: json.industrial_experiences, isLoading: false });
    console.log('arrey from server', this.state.Industrial_ExperienceData)
    if(this.state.Industrial_ExperienceData.length >= 1){
      for (var x=0 ; x < this.state.Industrial_ExperienceData.length ; x++){
        this.state.New_Industrial_ExperienceData.push({
          title: this.state.Industrial_ExperienceData[x].title,
          exp: this.state.Industrial_ExperienceData[x].key,
          value: this.state.Industrial_ExperienceData[x].skill
        });
      }
    }
    this.setState({
      Ind_ExpRefresh: true
    });
    console.log('new arrey', this.state.New_Industrial_ExperienceData)
  };

  addInd_ExpData = () => {
    for (const [key, value] of Object.entries(this.state.Selected_Ind_Exp)) {
      console.log(`${key}: ${value}`);
      this.state.new_Selected_Ind_Exp.push({
        id: `${value}`,
      });
      console.log("New Required Array", this.state.new_Selected_Ind_Exp);
    }

    for(var i=0; i<this.state.MultiSelect_Ind_Exp.length; i++){
      if(this.state.MultiSelect_Ind_Exp[i].id == this.state.new_Selected_Ind_Exp[0].id ) {
        console.log("This is what i want" ,this.state.MultiSelect_Ind_Exp[i].name )
        //Alert.alert("This is what i want" , JSON.stringify(this.state.MultiSelect_Ind_Exp[i].name))

        this.state.New_Industrial_ExperienceData.push({
          title: this.state.MultiSelect_Ind_Exp[i].name,
          exp: this.state.MultiSelect_Ind_Exp[i].id.toString(),
          value: this.state.SkillsName
        });
        
        console.log("This is my new loop data" , this.state.New_Industrial_ExperienceData)
        console.log("MY Final array" ,this.state.Industrial_ExperienceData )
        console.log("MY New Final array" ,this.state.New_Industrial_ExperienceData )
        this.setState({
          Ind_ExpRefresh: true,
          Selected_Ind_Exp:'',
          new_Selected_Ind_Exp:[],
          SkillsName:'',
        });
      }else{
      }
    }
  };
  addInd_ExpDataYears = () => {
    for (const [key, value] of Object.entries(this.state.Selected_Ind_Exp)) {
      console.log(`${key}: ${value}`);
      this.state.new_Selected_Ind_Exp.push({
        id: `${value}`,
      });
      console.log("New Required Array", this.state.new_Selected_Ind_Exp);
    }

    for(var i=0; i<this.state.MultiSelect_Ind_Exp.length; i++){
      for(var n=0; n<this.state.experience_data.length; n++){
        if(this.state.MultiSelect_Ind_Exp[i].id == this.state.new_Selected_Ind_Exp[0].id && this.state.experience_data[n].value == this.state.SkillsName ) {
          console.log("This is what i want" ,this.state.MultiSelect_Ind_Exp[i].name )
          //Alert.alert("This is what i want" , JSON.stringify(this.state.MultiSelect_Ind_Exp[i].name))

          this.state.New_Industrial_ExperienceData.push({
            title: this.state.MultiSelect_Ind_Exp[i].name,
            exp: this.state.MultiSelect_Ind_Exp[i].id.toString(),
            value: this.state.experience_data[n].title.split(' ')[0]
          });
          
          console.log("This is my new loop data" , this.state.New_Industrial_ExperienceData)
          console.log("MY Final array" ,this.state.Industrial_ExperienceData )
          console.log("MY New Final array" ,this.state.New_Industrial_ExperienceData )
          this.setState({
            Ind_ExpRefresh: true,
            Selected_Ind_Exp:'',
            new_Selected_Ind_Exp:[],
            SkillsName:'',
          });
        }else{
        }
      }
    }
  };

  EditData = (index , item) => {
    this.state.New_Industrial_ExperienceData[index] = {value: this.state.EditedValue  , title: item.title,  exp: item.exp}
    this.setState({Ind_ExpRefresh: true,})
    console.log("edited value" ,this.state.EditedValue )
    console.log("edited array" ,this.state.New_Industrial_ExperienceData[index] )
  };

  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const {
      New_Industrial_ExperienceData,
    } = this.state;
    console.log(
      New_Industrial_ExperienceData,
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "profile/update_tabe_settings?user_id=" + Uid + "&edit_type=" + "industrial_experience",{
        industrial_experiences:New_Industrial_ExperienceData,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchIndustrial_ExpData();
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

  Ind_EduDeleteForm = index => {
    this.state.New_Industrial_ExperienceData.splice(index, 1);
    this.setState({
      Ind_ExpRefresh: true
    });
  };
    
  render() {
    const {isLoading} = this.state;
    return (
      // <KeyboardAvoidingView
      //   behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   style={styles.container}
      // >
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
                {CONSTANT.IndustrialExpProfileIndustrialExp}
                </Text>
              </View>

              <View style={styles.PersonalDetailSectionArea}>
                <View>
                  <View style={styles.MultiSelectArea}>
                    <MultiSelect
                      ref={component => {
                        this.multiSelect = component;
                      }}
                      onSelectedItemsChange={value =>
                        this.setState({Selected_Ind_Exp: value})
                      }
                      uniqueKey="id"
                      items={this.state.MultiSelect_Ind_Exp}
                      selectedItems={this.state.Selected_Ind_Exp}
                      borderBottomWidth={0}
                      single={true}
                      searchInputPlaceholderText={CONSTANT.IndustrialExpProfileSelectIndustrialExp}
                      selectText={CONSTANT.IndustrialExpProfileSelectIndustrialExp}
                      styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                      styleDropdownMenuSubsection={
                        styles.MultiSelectstyleDropdownMenuSubsection
                      }
                      onChangeInput={text => console.log(text)}
                      displayKey="name"
                      submitButtonText={CONSTANT.Submit}
                    />
                  </View>
                  { this.state.themeSettingsDisplayType != 'year' &&
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder={CONSTANT.IndustrialExpProfileAddPercentage}
                      onChangeText={SkillsName =>
                        this.setState({ SkillsName })
                      }
                      style={styles.TextInputLayoutStyle}
                      value={this.state.SkillsName}
                    />
                  }
                  { this.state.themeSettingsDisplayType == 'year' &&
                    <View style={styles.MultiSelectArea}>
                      <MultiSelect
                        ref={component => {
                          this.multiSelect = component;
                        }}
                        onSelectedItemsChange={value =>
                          this.setState({SkillsName: value})
                        }
                        uniqueKey="value"
                        items={this.state.experience_data}
                        selectedItems={this.state.SkillsName}
                        borderBottomWidth={0}
                        single={true}
                        searchInputPlaceholderText={CONSTANT.SearchPickExperience}
                        selectText={CONSTANT.SearchPickExperience}
                        styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                        styleDropdownMenuSubsection={
                          styles.MultiSelectstyleDropdownMenuSubsection
                        }
                        onChangeInput={text => console.log(text)}
                        displayKey="title"
                        submitButtonText={CONSTANT.Submit}
                      />
                    </View>
                  }
                  <TouchableOpacity
                    onPress={this.state.themeSettingsDisplayType != 'year' ? this.addInd_ExpData : this.addInd_ExpDataYears}
                    style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                    <Text style={styles.ButtonText}>
                      {CONSTANT.ProfileAdd}
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.New_Industrial_ExperienceData ? (
                  <FlatList
                    data={this.state.New_Industrial_ExperienceData}
                    extraData={this.state.Ind_ExpRefresh}
                    renderItem={({ item, index }) => (
                      <View>
                      { item.title != '' &&
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
                                {item.title}
                              </Text>
                              {
                                item.value != '' &&
                                <View style={{flexDirection:'row'}}>
                                  <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }
                                  >
                                    ({item.value}{' '}
                                  </Text>
                                  { this.state.themeSettingsDisplayType != 'year' &&
                                    <Text>
                                      %)
                                    </Text>
                                  }
                                  { this.state.themeSettingsDisplayType == 'year' &&
                                    <Text>
                                      Years)
                                    </Text>
                                  }
                                </View>
                              }
                            </TouchableOpacity>
                            <View style={styles.PersonalDetailEditBTN}>
                              <AntIcon name="edit" color={"#fff"} size={20} />
                            </View>
                            <TouchableOpacity
                              onPress={() => this.Ind_EduDeleteForm(index)}
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
                              placeholder={CONSTANT.IndustrialExpProfileAddPercentage}
                              style={styles.TextInputLayoutStyle}
                              //onSelectionChange={() => this.EditData(index, item)}
                              onChangeText={EditedValue =>
                                this.setState({ EditedValue })
                              }
                            >
                              {item.value}
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
                      }
                      </View>
                    )}
                  />
                ) : null}
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

export default IndustrialExpProfile;
