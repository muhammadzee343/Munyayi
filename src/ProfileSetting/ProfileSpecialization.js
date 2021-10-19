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

class ProfileSpecialization extends Component {

  state={
    isLoading: true,
    ProfileSpecializationData: [],
    ProfileSpecializationRefresh: false,
    MultiSelect_ProfileSpecialization: [],
    Selected_ProfileSpecialization: '',
    SkillsName: '',
    NewSelected_ProfileSpecialization:[],
    New_ProfileSpecializationData:[],
    EditedValue:'',
    experience_data: []
  }

  componentDidMount() {
    this.ApplicationThemeSettings();
    this.ProjectExpSpinner();
    this.ProfileSpecializationSpinner();
    this.fetchProfileSpecializationData();
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
  ProfileSpecializationSpinner = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomies"
    );
		const json = await response.json();
    this.setState({ MultiSelect_ProfileSpecialization: json[0].wt_specialization, isLoading: false });
  };

  fetchProfileSpecializationData = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_profile_tab_settings?user_id=" + Uid
    );
		const json = await response.json();
    this.setState({ ProfileSpecializationData: json.specializations, isLoading: false });
    console.log('arrey from server', this.state.ProfileSpecializationData)

    if(this.state.ProfileSpecializationData.length >= 1){
      for (var x=0 ; x < this.state.ProfileSpecializationData.length ; x++){
        this.state.New_ProfileSpecializationData.push({
          title: this.state.ProfileSpecializationData[x].title,
          spec: this.state.ProfileSpecializationData[x].key,
          value: this.state.ProfileSpecializationData[x].skill
        });
      }
    }
    this.setState({ProfileSpecializationRefresh: true,})
    console.log('new arrey', this.state.New_ProfileSpecializationData)
  };

  addProfileSpecializationData = () => {
    if (
      this.state.Selected_ProfileSpecialization == "" &&
      this.state.SkillsName == "" 
    ) {
      Alert.alert(CONSTANT.OopsText, CONSTANT.PleaseEnterDataProperly);
    } else {
      const {
        New_ProfileSpecializationData,
        MultiSelect_ProfileSpecialization,
        Selected_ProfileSpecialization,
        SkillsName,
        NewSelected_ProfileSpecialization
      } = this.state;
      console.log('multiSelect', this.state.MultiSelect_ProfileSpecialization)
      console.log('SelectedSkill', this.state.Selected_ProfileSpecialization[0])

      NewSelected_ProfileSpecialization[0] = new Object();
      NewSelected_ProfileSpecialization[0].id = Selected_ProfileSpecialization[0];
      console.log('NewSelectedSkill', NewSelected_ProfileSpecialization)

      for (var i = 0; i < MultiSelect_ProfileSpecialization.length; i++) {
        if (MultiSelect_ProfileSpecialization[i].id == NewSelected_ProfileSpecialization[0].id){
          console.log('SelectedSkillName', MultiSelect_ProfileSpecialization[i])
          New_ProfileSpecializationData.push({
            title: MultiSelect_ProfileSpecialization[i].name,
            spec: MultiSelect_ProfileSpecialization[i].id.toString(),
            value: SkillsName,
          });
          
          this.setState({
            ProfileSpecializationRefresh: true,
            Selected_ProfileSpecialization:'',
            NewSelected_ProfileSpecialization:[],
            SkillsName:'',
          });
        }
      }
      console.log('final arrey', this.state.New_ProfileSpecializationData)
    }
  };
  addProfileSpecializationDataYears = () => {
    if (
      this.state.Selected_ProfileSpecialization == "" &&
      this.state.SkillsName == "" 
    ) {
      Alert.alert(CONSTANT.OopsText, CONSTANT.PleaseEnterDataProperly);
    } else {
      const {
        New_ProfileSpecializationData,
        MultiSelect_ProfileSpecialization,
        Selected_ProfileSpecialization,
        SkillsName,
        NewSelected_ProfileSpecialization
      } = this.state;
      console.log('multiSelect', this.state.MultiSelect_ProfileSpecialization)
      console.log('SelectedSkill', this.state.Selected_ProfileSpecialization[0])

      NewSelected_ProfileSpecialization[0] = new Object();
      NewSelected_ProfileSpecialization[0].id = Selected_ProfileSpecialization[0];
      console.log('NewSelectedSkill', NewSelected_ProfileSpecialization)

      for (var i = 0; i < MultiSelect_ProfileSpecialization.length; i++) {
        for (var k = 0; k < this.state.experience_data.length; k++) {
          if (MultiSelect_ProfileSpecialization[i].id == NewSelected_ProfileSpecialization[0].id && this.state.experience_data[k].value == this.state.SkillsName){
            console.log('SelectedSkillName', MultiSelect_ProfileSpecialization[i])
            New_ProfileSpecializationData.push({
              title: MultiSelect_ProfileSpecialization[i].name,
              spec: MultiSelect_ProfileSpecialization[i].id.toString(),
              value: this.state.experience_data[k].title.split(' ')[0]
            });
            
            this.setState({
              ProfileSpecializationRefresh: true,
              Selected_ProfileSpecialization:'',
              NewSelected_ProfileSpecialization:[],
              SkillsName:'',
            });
          }
        }
      }
      console.log('final arrey', this.state.New_ProfileSpecializationData)
    }
  };

  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const {
      New_ProfileSpecializationData,
    } = this.state;
    console.log(
      New_ProfileSpecializationData,
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "profile/update_tabe_settings?user_id=" + Uid + "&edit_type=" + "specialization",{
        specialization: New_ProfileSpecializationData,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchProfileSpecializationData();
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

  ProfileSpecializationDeleteForm = index => {
    this.state.New_ProfileSpecializationData.splice(index, 1);
    this.setState({
      ProfileSpecializationRefresh: true
    });
  };

  EditData = (index , item) => {
    this.state.New_ProfileSpecializationData[index] = {value: this.state.EditedValue  , title: item.title,  spec: item.spec}
    this.setState({ProfileSpecializationRefresh: true,})
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
                    {CONSTANT.SpecializationProfileSpecialization}
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
                          this.setState({Selected_ProfileSpecialization: value})
                        }
                        uniqueKey="id"
                        items={this.state.MultiSelect_ProfileSpecialization}
                        selectedItems={this.state.Selected_ProfileSpecialization}
                        borderBottomWidth={0}
                        single={true}
                        searchInputPlaceholderText={CONSTANT.SpecializationProfileSelectSpecialization}
                        selectText={CONSTANT.SpecializationProfileSelectSpecialization}
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
                      onPress={this.state.themeSettingsDisplayType != 'year' ? this.addProfileSpecializationData : this.addProfileSpecializationDataYears}
                      style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                      <Text style={styles.ButtonText}>
                        {CONSTANT.ProfileAdd}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.New_ProfileSpecializationData ? (
                    <FlatList
                      data={this.state.New_ProfileSpecializationData}
                      extraData={this.state.ProfileSpecializationRefresh}
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
                                onPress={() => this.ProfileSpecializationDeleteForm(index)}
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
                              {/* <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Company Name"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.title}
                              </TextInput> */}
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder={CONSTANT.IndustrialExpProfileAddPercentage}
                                style={styles.TextInputLayoutStyle}
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

export default ProfileSpecialization;
