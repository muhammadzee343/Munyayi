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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class Exp_Edu_Profile extends Component {

  state={
    isLoading: true,
    ExperienceData: [],
    EducationData: [],
    arrayHolder_Experience: [],
    arrayHolder_Education: [],
    AddExperienceForm: false,
    ExpJobTitle: "",
    ExpCompanyName: "",
    ExpDescription: "",
    ExpEndDate: "Ending Date",
    ExpStartingDate: "Starting Date",
    ExpJobTitle: "",
    EduDescription: "",
    EduEndDate: "End Date",
    EduInstituteName: "",
    EduInstituteTitle: "",
    EduStartingDate: "Starting Date",
    ExpRefresh: false,
    EduRefresh: false,
    DatePickerVisibleExpStartingDate: false,
    DatePickerVisibleExpEndDate: false,
    DatePickerVisibleEduStartingDate: false,
    DatePickerVisibleEduEndDate: false,
    value: "",
    mode: "date",
    displayFormat: "DD/MM/YYYY",
    label: "Starting Date",
    textInput_Holder: "",
    EditExpDesc:'',
    EditExpEnd:'00/00/0000',
    EditExpStart:'00/00/0000',
    EditExpTitle:'',
    EditExpCompany:'',
    EditDatePickerVisibleExpStartingDate: false,
    EditDatePickerVisibleExpEndDate: false,
    EditDatePickerVisibleEduStartingDate: false,
    EditDatePickerVisibleEduEndDate: false,
    EditEduDesc:'',
    EditEduEnd:'Ending Date',
    EditEduStart:'Starting Date',
    EditEduTitle:'',
    EditEduInstitute:'',
    themeSettingsExperience: '',
    themeSettingsEducation: '',
    monthNames : [
      {name: "January", id: '01'},
      {name: "February", id: '02'},
      {name: "March", id: '03'},
      {name: "April", id: '04'},
      {name: "May", id: '05'},
      {name: "June", id: '06'},
      {name: "July", id: '07'},
      {name: "August", id: '08'},
      {name: "September", id: '09'},
      {name: "October", id: '10'},
      {name: "November", id: '11'},
      {name: "December", id: '12'},
    ],
    newExpText: '',
    dateSymbol: '',
    YearValue: '',
    dateFormat:'',
  }
  componentDidMount() {
    this.fetchExp_EduData();
    this.ApplicationThemeSettings();
  }
  fetchExp_EduData = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_profile_tab_settings?user_id=" + Uid
    );
		const json = await response.json();
    this.setState({ ExperienceData: json.experience, isLoading: false });
    this.setState({ EducationData: json.education, isLoading: false });
    console.log(this.state.EducationData)
  };
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'user/get_theme_settings');
    const json = await response.json();
    this.setState({
      themeSettingsExperience: json.freelancers_settings.frc_remove_experience,
      themeSettingsEducation: json.freelancers_settings.frc_remove_education,
      themeSettingsCalenderFormat: json.calendar_format,
    });
    console.log('1', this.state.themeSettingsExperience);
    console.log('2', this.state.themeSettingsEducation);
    console.log('3', this.state.themeSettingsCalenderFormat);
    this.setState({dateSymbol: this.state.themeSettingsCalenderFormat == 'Y-m-d' || this.state.themeSettingsCalenderFormat == 'd-m-Y' ? '-' : '/'})
    console.log('dateSymbol', this.state.dateSymbol)
    this.setState({YearValue: this.state.themeSettingsCalenderFormat == 'Y-m-d' || this.state.themeSettingsCalenderFormat == 'Y/m/d' ? 0 : 2})
    console.log('YearValue', this.state.YearValue)
    this.setState({dateFormat: this.state.themeSettingsCalenderFormat == 'Y-m-d' ? "YYYY-MM-DD" : 
      this.state.themeSettingsCalenderFormat == 'd-m-Y' ? "DD-MM-YYYY" :
      this.state.themeSettingsCalenderFormat == 'Y/m/d' ? "YYYY/MM/DD" : 
      this.state.themeSettingsCalenderFormat == 'd/m/Y' ? "DD/MM/YYYY" :
      null
    })
    console.log('dateFormat', this.state.dateFormat)
  }

  ExpEditData = (index, company, title, desc, start, end, period) => {
    const {
      EditExpTitle,
      EditExpCompany,
      EditExpStart,
      EditExpEnd,
      EditExpDesc,
      monthNames,
      newExpText,
      dateSymbol,
      YearValue
    } = this.state;
    console.log(index, company, title, desc, start, end, period)

    console.log('start date', EditExpStart.split(dateSymbol)[YearValue])
    console.log('month names', monthNames)
    for(var i = 0; i < monthNames.length; i++){
      if(monthNames[i].id == EditExpStart.split(dateSymbol)[1]){
        console.log('required item', monthNames[i].name)
        var newExpStartText= `${monthNames[i].name} ${EditExpStart.split(dateSymbol)[YearValue]}`
        console.log('newExpStartText', newExpStartText)
      }
      if(monthNames[i].id == EditExpEnd.split(dateSymbol)[1]){
        console.log('required item', monthNames[i].name)
        var newExpEndText= `${monthNames[i].name} ${EditExpEnd.split(dateSymbol)[YearValue]}`
        console.log('newExpEndText', newExpEndText)
      }
    }
    var newNewExpText= newExpStartText == undefined && newExpEndText == undefined ? '' : `${newExpStartText} - ${newExpEndText}`
    console.log('newNewExpText', newNewExpText)
    // this.setState({newExpText: newNewExpText})
    // console.log('newExpText', newExpText)

    this.state.ExperienceData[index] = {
      title: EditExpTitle != '' ? EditExpTitle : title,
      company: EditExpCompany != '' ? EditExpCompany: company,
      startdate: EditExpStart != '00/00/0000' ? EditExpStart : start,
      enddate: EditExpEnd != '00/00/0000' ? EditExpEnd : end,
      period: newNewExpText == '' ? period : newNewExpText,
      description: EditExpDesc != '' ? EditExpDesc : desc
    }
    this.setState({ExpRefresh: true});
    var newNewExpText= ''
  };
  EduEditData = (index, item) => {

    const {
      EditEduTitle,
      EditEduInstitute,
      EditEduStart,
      EditEduEnd,
      EditEduDesc,
      monthNames,
      dateSymbol,
      YearValue
    } = this.state;

    console.log('start date', EditEduStart.split(dateSymbol)[YearValue])
    console.log('month names', monthNames)
    for(var i = 0; i < monthNames.length; i++){
      if(monthNames[i].id == EditEduStart.split(dateSymbol)[1]){
        console.log('required item', monthNames[i].name)
        var newEduStartText= `${monthNames[i].name} ${EditEduStart.split(dateSymbol)[YearValue]}`
        console.log('newEduStartText', newEduStartText)
      }
      if(monthNames[i].id == EditEduEnd.split(dateSymbol)[1]){
        console.log('required item', monthNames[i].name)
        var newEduEndText= `${monthNames[i].name} ${EditEduEnd.split(dateSymbol)[YearValue]}`
        console.log('newEduEndText', newEduEndText)
      }
    }
    var newNewEduText= newEduStartText == undefined && newEduEndText == undefined ? '' : `${newEduStartText} - ${newEduEndText}`
    console.log('newNewEduText', newNewEduText)

    this.state.EducationData[index] = {
      title: EditEduTitle != '' ? EditEduTitle : item.title,
      institute: EditEduInstitute != '' ? EditEduInstitute: item.institute,
      startdate: EditEduStart != 'Starting Date' ? EditEduStart : item.startdate,
      enddate: EditEduEnd != 'Ending Date' ? EditEduEnd : item.enddate,
      period: newNewEduText == '' ? item.period : newNewEduText,
      description: EditEduDesc != '' ? EditEduDesc : item.description
    }
    this.setState({EduRefresh: true});
  };
  fetchExperienceFormData = () => {
    if (
      this.state.ExpCompanyName == "" &&
      this.state.ExpJobTitle == "" &&
      this.state.ExpDescription == ""
    ) {
      Alert.alert(CONSTANT.OopsText,CONSTANT.PleaseEnterDataProperly);
    } else {
      const {
        ExpCompanyName,
        ExpDescription,
        ExpEndDate,
        ExpStartingDate,
        ExpJobTitle,
        monthNames,
        newExpText,
        dateSymbol,
        YearValue
      } = this.state;

      console.log('start date', ExpStartingDate.split(dateSymbol)[YearValue])
      console.log('month names', monthNames)
      for(var i = 0; i < monthNames.length; i++){
        if(monthNames[i].id == ExpStartingDate.split(dateSymbol)[1]){
          console.log('required item', monthNames[i].name)
          var newExpStartText= `${monthNames[i].name} ${ExpStartingDate.split(dateSymbol)[YearValue]}`
          console.log('newExpStartText', newExpStartText)
        }
        if(monthNames[i].id == ExpEndDate.split(dateSymbol)[1]){
          console.log('required item', monthNames[i].name)
          var newExpEndText= `${monthNames[i].name} ${ExpEndDate.split(dateSymbol)[YearValue]}`
          console.log('newExpEndText', newExpEndText)
        }
      }
      var newNewExpText= `${newExpStartText} - ${newExpEndText}`
      console.log('newNewExpText', newNewExpText)
      // this.setState({newExpText: newNewExpText})
      // console.log('newExpText', newExpText)

      this.state.ExperienceData.push({
        company: ExpCompanyName,
        startdate: ExpStartingDate,
        enddate: ExpEndDate,
        period: newNewExpText,
        title: ExpJobTitle,
        description: ExpDescription
      });
      this.setState({
        ExpRefresh: true,
        ExpCompanyName:'',
        ExpStartingDate:'Starting Date',
        ExpEndDate:'Ending Date',
        ExpJobTitle:'',
        ExpDescription:'',
      });
    }
  };
  fetchEducationFormData = () => {
    if (
      this.state.EduInstituteName == "" &&
      this.state.EduInstituteTitle == "" &&
      this.state.EduDescription == ""
    ) {
      Alert.alert(CONSTANT.OopsText,CONSTANT.PleaseEnterDataProperly);
    } else {
      const {
        EduDescription,
        EduEndDate,
        EduInstituteName,
        EduInstituteTitle,
        EduStartingDate,
        monthNames,
        dateSymbol,
        YearValue
      } = this.state; 

      console.log('start date', EduStartingDate.split(dateSymbol)[YearValue])
      console.log('month names', monthNames)
      for(var i = 0; i < monthNames.length; i++){
        if(monthNames[i].id == EduStartingDate.split(dateSymbol)[1]){
          console.log('required item', monthNames[i].name)
          var newEduStartText= `${monthNames[i].name} ${EduStartingDate.split(dateSymbol)[YearValue]}`
          console.log('newEduStartText', newEduStartText)
        }
        if(monthNames[i].id == EduEndDate.split(dateSymbol)[1]){
          console.log('required item', monthNames[i].name)
          var newEduEndText= `${monthNames[i].name} ${EduEndDate.split(dateSymbol)[YearValue]}`
          console.log('newEduEndText', newEduEndText)
        }
      }
      var newNewEduText= `${newEduStartText} - ${newEduEndText}`
      console.log('newNewEduText', newNewEduText)

      this.state.EducationData.push({
        institute: EduInstituteName,
        startdate: EduStartingDate,
        enddate: EduEndDate,
        period: newNewEduText,
        title: EduInstituteTitle,
        description: EduDescription
      });
      this.setState({
        EduRefresh: true,
        EduInstituteName:'',
        EduStartingDate:'Starting Date',
        EduEndDate:'Ending Date',
        EduInstituteTitle:'',
        EduDescription:'',
      });
    }
  };

  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const {
      ExperienceData,
      EducationData,
    } = this.state;
    console.log(
      ExperienceData,
      EducationData,
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "profile/update_tabe_settings?user_id=" + Uid + "&edit_type=" + "edu_exp",{
        education: EducationData,
        experience: ExperienceData,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          this.fetchExp_EduData();
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Error, response.data.message);
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };
  joinDataEducation = () => {
    this.arrayEducation.push({
      titleExpe: "Add Education" 
    });
    this.setState({ arrayHolder_Education: [...this.arrayEducation] });
  };
  HandleExpDeleteForm = index => {
    this.state.ExperienceData.splice(index, 1);
    this.setState({
      ExpRefresh: true
    });
  };
  HandleEduDeleteForm = index => {
    this.state.EducationData.splice(index, 1);
    this.setState({
      EduRefresh: true
    });
  };
  showDatePickerExpStartingDate = () => {
    this.setState({
      DatePickerVisibleExpStartingDate: true
    });
  };
  showDatePickerExpEndDate = () => {
    this.setState({
      DatePickerVisibleExpEndDate: true
    });
  };
  showDatePickerEduStartingDate = () => {
    this.setState({
      DatePickerVisibleEduStartingDate: true
    });
  };
  showDatePickerEduEndDate = () => {
    this.setState({
      DatePickerVisibleEduEndDate: true
    });
  };
  EditshowDatePickerExpStartingDate = () => {
    this.setState({
      EditDatePickerVisibleExpStartingDate: true
    });
  };
  EditshowDatePickerExpEndDate = () => {
    this.setState({
      EditDatePickerVisibleExpEndDate: true
    });
  };
  EditshowDatePickerEduStartingDate = () => {
    this.setState({
      EditDatePickerVisibleEduStartingDate: true
    });
  };
  EditshowDatePickerEduEndDate = () => {
    this.setState({
      EditDatePickerVisibleEduEndDate: true
    });
  };
  hideDatePickerExpStartingDate = () => {
    this.setState({
      DatePickerVisibleExpStartingDate: false
    });
  };
  hideDatePickerExpEndDate = () => {
    this.setState({
      DatePickerVisibleExpEndDate: false
    });
  };
  hideDatePickerEduStartingDate = () => {
    this.setState({
      DatePickerVisibleEduStartingDate: false
    });
  };
  hideDatePickerEduEndDate = () => {
    this.setState({
      DatePickerVisibleEduEndDate: false
    });
  };
  EdithideDatePickerExpStartingDate = () => {
    this.setState({
      EditDatePickerVisibleExpStartingDate: false
    });
  };
  EdithideDatePickerExpEndDate = () => {
    this.setState({
      EditDatePickerVisibleExpEndDate: false
    });
  };
  EdithideDatePickerEduStartingDate = () => {
    this.setState({
      EditDatePickerVisibleEduStartingDate: false
    });
  };
  EdithideDatePickerEduEndDate = () => {
    this.setState({
      EditDatePickerVisibleEduEndDate: false
    });
  };
  handleConfirmExpStartingDate = date => {
    const dateS = date.toUTCString();
    this.setState({ ExpStartingDate: moment(dateS).format(this.state.dateFormat) });
    this.hideDatePickerExpStartingDate();
  };
  handleConfirmExpEndDate = date => {
    const dateS = date.toUTCString();
    this.setState({ ExpEndDate: moment(dateS).format(this.state.dateFormat) });
    this.hideDatePickerExpEndDate();
  };
  handleConfirmEduStartingDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EduStartingDate: moment(dateS).format(this.state.dateFormat) });
    this.hideDatePickerEduStartingDate();
  };
  handleConfirmEduEndDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EduEndDate: moment(dateS).format(this.state.dateFormat) });
    this.hideDatePickerEduEndDate();
  };
  EdithandleConfirmExpStartingDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EditExpStart: moment(dateS).format(this.state.dateFormat) });
    this.EdithideDatePickerExpStartingDate();
  };
  EdithandleConfirmExpEndDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EditExpEnd: moment(dateS).format(this.state.dateFormat) });
    this.EdithideDatePickerExpEndDate();
  };
  EdithandleConfirmEduStartingDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EditEduStart: moment(dateS).format(this.state.dateFormat) });
    this.EdithideDatePickerEduStartingDate();
  };
  EdithandleConfirmEduEndDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EditEduEnd: moment(dateS).format(this.state.dateFormat) });
    this.EdithideDatePickerEduEndDate();
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
            { this.state.themeSettingsExperience === 'no' &&
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
                  <Text style={styles.MainHeadingTextStyle}>{CONSTANT.ExpEduProfileExperience}</Text>
                </View>

                <View style={styles.PersonalDetailSectionArea}>
                  <View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder={'Company Name'}
                      onChangeText={ExpCompanyName =>
                        this.setState({ ExpCompanyName })
                      }
                      style={styles.TextInputLayoutStyle}
                      value={this.state.ExpCompanyName}
                    />
                    <View>
                      <DateTimePickerModal
                        cancelTextIOS={"CANCEL"}
                        confirmTextIOS={"OK"}
                        cancelTextStyle={{ color: "#3d4461", fontSize: 20 }}
                        confirmTextStyle={{ color: "#3d4461", fontSize: 20 }}
                        isVisible={this.state.DatePickerVisibleExpStartingDate}
                        mode="date"
                        onConfirm={this.handleConfirmExpStartingDate}
                        onCancel={this.hideDatePickerExpStartingDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.ExpStartingDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerExpStartingDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <DateTimePickerModal
                        isVisible={this.state.DatePickerVisibleExpEndDate}
                        mode="date"
                        onConfirm={this.handleConfirmExpEndDate}
                        onCancel={this.hideDatePickerExpEndDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.ExpEndDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerExpEndDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      onChangeText={data =>
                        this.setState({ textInput_Holder: data })
                      }
                      placeholderTextColor="#7F7F7F"
                      underlineColorAndroid="transparent"
                      placeholder={CONSTANT.ExpEduProfileJobTitle}
                      onChangeText={ExpJobTitle =>
                        this.setState({ ExpJobTitle })
                      }
                      value={this.state.ExpJobTitle}
                      style={styles.TextInputLayoutStyle}
                    />
                    <TextInput
                      multiline={true}
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder={CONSTANT.ExpEduProfileDescription}
                      onChangeText={ExpDescription =>
                        this.setState({ ExpDescription })
                      }
                      value={this.state.ExpDescription}
                      style={styles.TextInputLayoutStyleForDetail}
                    />
                    <TouchableOpacity
                      onPress={this.fetchExperienceFormData}
                      style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                      <Text style={styles.ButtonText}>
                        {CONSTANT.ProfileAdd}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.ExperienceData ? (
                    <FlatList
                      data={this.state.ExperienceData}
                      extraData={this.state.ExpRefresh}
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
                                <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }
                                >
                                  {item.company}
                                </Text>
                                {/* {
                                  item.startdate != '' && item.enddate != ''&&
                                  <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }
                                  >
                                    ({item.startdate.split(' ')[0]} - {item.enddate.split(' ')[0]})
                                  </Text>
                                } */}
                                <Text
                                style={
                                  styles.PersonalDetailCoollapseHeaderText
                                }
                                >
                                  ({item.period})
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.PersonalDetailEditBTN}>
                                <AntIcon name="edit" color={"#fff"} size={20} />
                              </View>
                              <TouchableOpacity
                                onPress={() => this.HandleExpDeleteForm(index)}
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
                                placeholder={CONSTANT.ExpEduProfileCompanyName}
                                style={styles.TextInputLayoutStyle}
                                onChangeText={EditExpCompany =>
                                  this.setState({ EditExpCompany })
                                }
                              >
                                {item.company}
                              </TextInput>
                              {/* <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Starting Date"
                                style={styles.TextInputLayoutStyle}
                                onChangeText={EditExpStart =>
                                  this.setState({ EditExpStart })
                                }
                              >
                                {item.startdate.split(' ')[0]}
                              </TextInput> */}
                              <View>
                                <DateTimePickerModal
                                  isVisible={this.state.EditDatePickerVisibleExpStartingDate}
                                  mode="date"
                                  onConfirm={this.EdithandleConfirmExpStartingDate}
                                  onCancel={this.EdithideDatePickerExpStartingDate}
                                />
                              </View>
                              <View
                                style={[
                                  styles.TextInputLayoutStyle,
                                  {
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }
                                ]}
                              >
                                <Text style={{ color: "#323232" }}>
                                  {this.state.EditExpStart == "00/00/0000" ? item.startdate.split(' ')[0] : this.state.EditExpStart}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => this.EditshowDatePickerExpStartingDate()}
                                  style={{ padding: 5 }}
                                >
                                  <AntIcon
                                    name="calendar"
                                    color={CONSTANT.primaryColor}
                                    size={22}
                                  />
                                </TouchableOpacity>
                              </View>
                              {/* <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="End Date"
                                style={styles.TextInputLayoutStyle}
                                onChangeText={EditExpEnd =>
                                  this.setState({ EditExpEnd })
                                }
                              >
                                {item.enddate.split(' ')[0]}
                              </TextInput> */}
                              <View>
                                <DateTimePickerModal
                                  isVisible={this.state.EditDatePickerVisibleExpEndDate}
                                  mode="date"
                                  onConfirm={this.EdithandleConfirmExpEndDate}
                                  onCancel={this.EdithideDatePickerExpEndDate}
                                />
                              </View>
                              <View
                                style={[
                                  styles.TextInputLayoutStyle,
                                  {
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }
                                ]}
                              >
                                <Text style={{ color: "#323232" }}>
                                  {this.state.EditExpEnd == "00/00/0000" ? item.enddate.split(' ')[0] : this.state.EditExpEnd}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => this.EditshowDatePickerExpEndDate()}
                                  style={{ padding: 5 }}
                                >
                                  <AntIcon
                                    name="calendar"
                                    color={CONSTANT.primaryColor}
                                    size={22}
                                  />
                                </TouchableOpacity>
                              </View>
                              <TextInput
                                onChangeText={EditExpTitle =>
                                  this.setState({ EditExpTitle })
                                }
                                placeholderTextColor="#7F7F7F"
                                underlineColorAndroid="transparent"
                                placeholder={CONSTANT.ExpEduProfileJobTitle}
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.title}
                              </TextInput>
                              <TextInput
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder={CONSTANT.ExpEduProfileDescription}
                                style={styles.TextInputLayoutStyleForDetail}
                                onChangeText={EditExpDesc =>
                                  this.setState({ EditExpDesc })
                                }
                              >
                                {item.description}
                              </TextInput>
                              <TouchableOpacity
                                onPress={() => this.ExpEditData(index, item.company, item.title, item.description, item.startdate, item.enddate, item.period)}
                                style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                                <Text style={styles.ButtonText}>
                                  {CONSTANT.ProfileAdd}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </CollapseBody>
                        </Collapse>
                      )}
                    />
                  ) : null}
                </View>
              </View>
            }
            { this.state.themeSettingsEducation === 'no' &&
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
                  <Text style={styles.MainHeadingTextStyle}>{CONSTANT.ExpEduProfileEducation}</Text>
                </View>
                <View style={styles.PersonalDetailSectionArea}>
                  <View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder={CONSTANT.ExpEduProfileInstituteName}
                      onChangeText={EduInstituteName =>
                        this.setState({ EduInstituteName })
                      }
                      value={this.state.EduInstituteName}
                      style={styles.TextInputLayoutStyle}
                    />
                    <View>
                      <DateTimePickerModal
                        isVisible={this.state.DatePickerVisibleEduStartingDate}
                        mode="date"
                        onConfirm={this.handleConfirmEduStartingDate}
                        onCancel={this.hideDatePickerEduStartingDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.EduStartingDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerEduStartingDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <DateTimePickerModal
                        isVisible={this.state.DatePickerVisibleEduEndDate}
                        mode="date"
                        onConfirm={this.handleConfirmEduEndDate}
                        onCancel={this.hideDatePickerEduEndDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.EduEndDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerEduEndDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      onChangeText={data =>
                        this.setState({ textInput_Holder: data })
                      }
                      placeholderTextColor="#7F7F7F"
                      underlineColorAndroid="transparent"
                      placeholder={CONSTANT.ExpEduProfileInstituteTitle}
                      onChangeText={EduInstituteTitle =>
                        this.setState({ EduInstituteTitle })
                      }
                      value={this.state.EduInstituteTitle}
                      style={styles.TextInputLayoutStyle}
                    />
                    <TextInput
                      multiline={true}
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder={CONSTANT.ExpEduProfileDescription}
                      onChangeText={EduDescription =>
                        this.setState({ EduDescription })
                      }
                      value={this.state.EduDescription}
                      style={styles.TextInputLayoutStyleForDetail}
                    />
                    <TouchableOpacity
                      onPress={this.fetchEducationFormData}
                      style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                      <Text style={styles.ButtonText}>
                        {CONSTANT.ProfileAdd}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {this.state.EducationData ? (
                    <FlatList
                      data={this.state.EducationData}
                      extraData={this.state.EduRefresh}
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
                                <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }
                                >
                                  {item.institute}
                                </Text>
                                {/* {
                                  item.startdate != '' && item.enddate != ''&&
                                  <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }
                                  >
                                    ({item.startdate.split(' ')[0]} - {item.enddate.split(' ')[0]})
                                  </Text>
                                } */}
                                {item.period !== '' &&
                                  <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }>
                                    ({item.period})
                                  </Text>
                                }
                              </TouchableOpacity>
                              <View style={styles.PersonalDetailEditBTN}>
                                <AntIcon name="edit" color={"#fff"} size={20} />
                              </View>
                              <TouchableOpacity
                                onPress={() => this.HandleEduDeleteForm(index)}
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
                                placeholder={CONSTANT.ExpEduProfileInstituteName}
                                style={styles.TextInputLayoutStyle}
                                onChangeText={EditEduInstitute =>
                                  this.setState({ EditEduInstitute })
                                }
                              >
                                {item.institute}
                              </TextInput>
                              {/* <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Starting Date"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.startdate.split(' ')[0]}
                              </TextInput>
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="End Date"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.enddate.split(' ')[0]}
                              </TextInput> */}
                              <View>
                                <DateTimePickerModal
                                  isVisible={this.state.EditDatePickerVisibleEduStartingDate}
                                  mode="date"
                                  onConfirm={this.EdithandleConfirmEduStartingDate}
                                  onCancel={this.EdithideDatePickerEduStartingDate}
                                />
                              </View>
                              <View
                                style={[
                                  styles.TextInputLayoutStyle,
                                  {
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }
                                ]}
                              >
                                <Text style={{ color: "#323232" }}>
                                  {this.state.EditEduStart == "Starting Date" ? item.startdate.split(' ')[0] : this.state.EditEduStart}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => this.EditshowDatePickerEduStartingDate()}
                                  style={{ padding: 5 }}
                                >
                                  <AntIcon
                                    name="calendar"
                                    color={CONSTANT.primaryColor}
                                    size={22}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View>
                                <DateTimePickerModal
                                  isVisible={this.state.EditDatePickerVisibleEduEndDate}
                                  mode="date"
                                  onConfirm={this.EdithandleConfirmEduEndDate}
                                  onCancel={this.EdithideDatePickerEduEndDate}
                                />
                              </View>
                              <View
                                style={[
                                  styles.TextInputLayoutStyle,
                                  {
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }
                                ]}
                              >
                                <Text style={{ color: "#323232" }}>
                                  {this.state.EditEduEnd == "Ending Date" ? item.enddate.split(' ')[0] : this.state.EditEduEnd}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => this.EditshowDatePickerEduEndDate()}
                                  style={{ padding: 5 }}
                                >
                                  <AntIcon
                                    name="calendar"
                                    color={CONSTANT.primaryColor}
                                    size={22}
                                  />
                                </TouchableOpacity>
                              </View>
                              <TextInput
                                onChangeText={EditEduTitle =>
                                  this.setState({ EditEduTitle })
                                }
                                placeholderTextColor="#7F7F7F"
                                underlineColorAndroid="transparent"
                                placeholder={CONSTANT.ExpEduProfileDegreeTitle}
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.title}
                              </TextInput>
                              <TextInput
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder={CONSTANT.ExpEduProfileDescription}
                                style={styles.TextInputLayoutStyleForDetail}
                                onChangeText={EditEduDesc =>
                                  this.setState({ EditEduDesc })
                                }
                              >
                                {item.description}
                              </TextInput>
                              <TouchableOpacity
                                onPress={() => this.EduEditData(index, item)}
                                style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                                <Text style={styles.ButtonText}>
                                  {CONSTANT.ProfileAdd}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </CollapseBody>
                        </Collapse>
                      )}
                    />
                  ) : null}
                </View>
              </View>
            }
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

export default Exp_Edu_Profile;
