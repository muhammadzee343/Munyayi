import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  I18nManager,
  ActivityIndicator,
  ScrollView
} from "react-native";
import styles from "../Constants/Styles";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from "../Constants/Constant";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
I18nManager.forceRTL(false);

class AwardsProfile extends Component {
  state = {
    fetchAwardsData: [],
    awardrefresh: false,
    isLoading: true,
    date: null,
    title: null,
    image:'',
    DatePickerVisibleAwardDate: false,
    editDate:'',
    editTitle:'',
    editDatePickerVisibleAwardDate: false,
    Awardsimages: {},
    editAwardsimages: {},
    editImage: {},
    themeSettingsCalenderFormat: '',
    updateAwardsData: [],
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
  };
  componentDidMount() {
    this.fetchAwardData();
    this.ApplicationThemeSettings();
  }
  fetchAwardData = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_profile_tab_settings?user_id=" + Uid
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ fetchAwardsData: [], isLoading: false }); // empty data set
    } else {
      this.setState({ fetchAwardsData: json.awards, isLoading: false, updateAwardsData: [] });
      console.log(this.state.fetchAwardsData)

      for(let u = 0; u < this.state.fetchAwardsData.length; u++ ){
        this.state.updateAwardsData.push({
          title: this.state.fetchAwardsData[u].title,
          date: this.state.fetchAwardsData[u].date,
          image:{
            attachment_id: this.state.fetchAwardsData[u].attachment_id.toString(),
            url: this.state.fetchAwardsData[u].url
          },
          // image0: {}
        });
      }
      console.log(this.state.updateAwardsData)
    }
  };
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'user/get_theme_settings');
    const json = await response.json();
    this.setState({
      themeSettingsCalenderFormat: json.calendar_format,
    });
    console.log('3', this.state.themeSettingsCalenderFormat);
  }
  AddNowClicked = () => {
    console.log('title', this.state.title)
    console.log('date', this.state.date)
    console.log('image', this.state.image)
    if(this.state.title == null || this.state.date == null){
      alert('Please add data first')
    }else{

      var dateSymbol= this.state.themeSettingsCalenderFormat == 'Y-m-d' || this.state.themeSettingsCalenderFormat == 'd-m-Y' ? '-' : '/'
      console.log('dateSymbol', dateSymbol)
      var YearValue= this.state.themeSettingsCalenderFormat == 'Y-m-d' || this.state.themeSettingsCalenderFormat == 'Y/m/d' ? 0 : 2
      console.log('YearValue', YearValue)

      console.log('start date', this.state.date.split(dateSymbol)[YearValue])
      console.log('month names', this.state.monthNames)
      for(var i = 0; i < this.state.monthNames.length; i++){
        if(this.state.monthNames[i].id == this.state.date.split(dateSymbol)[1]){
          console.log('required item', this.state.monthNames[i].name)
          var newDateText= `${this.state.monthNames[i].name} ${this.state.date.split(dateSymbol)[YearValue]}`
          console.log('newDateText', newDateText)
        }
      }

      this.state.fetchAwardsData.push({
        title: this.state.title,
        date: this.state.date,
        award_date: newDateText,
        url: this.state.image.uri
      });
      console.log(this.state.title);
      console.log(this.state.date);
      this.setState({
        awardrefresh: true,
        title:'',
        date:'',
        image: ''
      });
      this.state.updateAwardsData.push({
        title: this.state.title,
        date: this.state.date,
        image0: this.state.Awardsimages,
        // image:{
        //   attachment_id: '',
        //   url: '',
        // },
      });
    }
  };
  EditData = (index , item) => {

    var dateSymbol= this.state.themeSettingsCalenderFormat == 'Y-m-d' || this.state.themeSettingsCalenderFormat == 'd-m-Y' ? '-' : '/'
    console.log('dateSymbol', dateSymbol)
    var YearValue= this.state.themeSettingsCalenderFormat == 'Y-m-d' || this.state.themeSettingsCalenderFormat == 'Y/m/d' ? 0 : 2
    console.log('YearValue', YearValue)

    console.log('start date', this.state.editDate.split(dateSymbol)[YearValue])
      console.log('month names', this.state.monthNames)
      for(let e = 0; e < this.state.monthNames.length; e++){
        if(this.state.monthNames[e].id == this.state.editDate.split(dateSymbol)[1]){
          console.log('required item', this.state.monthNames[e].name)
          var newDateText= `${this.state.monthNames[e].name} ${this.state.editDate.split(dateSymbol)[YearValue]}`
          console.log('newDateText', newDateText)
        }
      }

    this.state.fetchAwardsData[index] = {
      title: this.state.editTitle != '' ? this.state.editTitle : item.title, 
      date: this.state.editDate != '' ? this.state.editDate : item.date,  
      award_date: newDateText != undefined ? newDateText : item.award_date,
      url: this.state.editImage.uri != null || '' ? this.state.editImage.uri : item.url
    }
    this.setState({awardrefresh: true, editImage: {}})
    console.log('1st edit arrey', this.state.fetchAwardsData)
    this.state.updateAwardsData[index] = {
      title: this.state.editTitle != '' ? this.state.editTitle : item.title, 
      date: this.state.editDate != '' ? this.state.editDate : item.date,
      image:{
        attachment_id: item.attachment_id,
        url: item.url
      },
      image0: this.state.editAwardsimages //!= null || '' ? this.state.editAwardsimages : this.state.Awardsimages,
    };
    console.log('2nd edit arrey', this.state.updateAwardsData)
  };
  onDeletePress= (index)=> {
    this.state.fetchAwardsData.splice(index, 1);
    this.state.updateAwardsData.splice(index, 1);
    this.setState({
      awardrefresh: true
    });
  }

  showDatePickerAwardDate = () => {
    this.setState({
      DatePickerVisibleAwardDate: true
    });
  };
  handleConfirmAwardDate = date => {
    const dateS = date.toUTCString();
    this.setState({ date: moment(dateS).format(
      this.state.themeSettingsCalenderFormat == 'Y-m-d' ? "YYYY-MM-DD" : 
      this.state.themeSettingsCalenderFormat == 'd-m-Y' ? "DD-MM-YYYY" :
      this.state.themeSettingsCalenderFormat == 'Y/m/d' ? "YYYY/MM/DD" : 
      this.state.themeSettingsCalenderFormat == 'd/m/Y' ? "DD/MM/YYYY" : 
      null
    )});
    this.hideDatePickerAwardDate();
  };
  hideDatePickerAwardDate = () => {
    this.setState({
      DatePickerVisibleAwardDate: false
    });
  };
  editshowDatePickerAwardDate = () => {
    this.setState({
      editDatePickerVisibleAwardDate: true
    });
  };
  edithandleConfirmAwardDate = date => {
    const dateS = date.toUTCString();
    this.setState({ editDate: moment(dateS).format(
      this.state.themeSettingsCalenderFormat == 'Y-m-d' ? "YYYY-MM-DD" : 
      this.state.themeSettingsCalenderFormat == 'd-m-Y' ? "DD-MM-YYYY" :
      this.state.themeSettingsCalenderFormat == 'Y/m/d' ? "YYYY/MM/DD" : 
      this.state.themeSettingsCalenderFormat == 'd/m/Y' ? "DD/MM/YYYY" :
      null
    ) });
    this.edithideDatePickerAwardDate();
  };
  edithideDatePickerAwardDate = () => {
    this.setState({
      editDatePickerVisibleAwardDate: false
    });
  };

  pickAwards() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      //includeExif: true,
      //compressImageQuality: 0.1,
    })
      .then(image => {
        this.setState({
          image: {
            uri: `data:${image.mime};base64,` + image.data,
            width: image.width,
            height: image.height,
          },
        });
        this.setState({
          Awardsimages: {
            name: Platform.OS === 'ios' ? image.filename : image.path.slice(76),
            type: image.mime,
            base64_string: image.data,
          },
        });
        console.log('image', image)
        console.log('Awardsimages', this.state.Awardsimages)
      })
      .catch(e => console.log(e));
  }
  editPickAwards() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: false,
      includeBase64: true,
      includeExif: true,
    })
      .then(image => {
        this.setState({
          editImage: {
            uri: `data:${image.mime};base64,` + image.data,
          },
        });
        console.log('editImage', this.state.editImage)
        this.setState({
          editAwardsimages: {
            name: Platform.OS === 'ios' ? image.filename : image.path.slice(76),
            type: image.mime,
            base64_string: image.data,
          },
        });
      })
      .catch(e => console.log(e));
  }

  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const {
      updateAwardsData,
    } = this.state;
    console.log(
      updateAwardsData,
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "profile/update_tabe_settings?user_id=" + Uid + "&edit_type=" + "awards",{
        awards: updateAwardsData,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchAwardData();
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
        Alert.alert(error);
        this.setState({ isLoading: false });
        console.log('catch', error);
      });
  };
  // UpdateProfileData = async () => {
  //   this.setState({ isLoading: true });

  //   const Uid = await AsyncStorage.getItem('projectUid');
  //   const {
  //     title,
  //     date,
  //     Awardsimages,
  //   } = this.state;
  //   console.log(
  //     title,
  //     date,
  //     Awardsimages,
  //     Uid
  //   );
  //   const formData = new FormData();
  //   formData.append("id", id);
  //   formData.append("title", title);
  //   formData.append("date", date);
  //   // if( Awardsimages != null){
  //   //   Awardsimages.forEach((item, i) => {
  //   //     formData.append("image" + i, {
  //   //       uri: item.uri,
  //   //       type: item.type,
  //   //       name: item.name,
  //   //     });
  //   //   });
  //   // }
  //   // formData.append(
  //   //   "size", Awardsimages != [] ? Awardsimages.length : "0"
  //   // );
  //   axios
  //     .post(CONSTANT.BaseUrl + "profile/update_tabe_settings?user_id=" + Uid + "&edit_type=" + "awards", formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //     .then(async response => {
  //       if (response.status === 200) {
  //         this.setState({ isLoading: false });
  //         Alert.alert("Success", response.data.message);
  //         console.log("Success", response);
  //         //this.fetchAwardDownloadData();
  //       } else if (response.status === 203) {
  //         this.setState({ isLoading: false });
  //         Alert.alert("Error", response.data.message);
  //         console.log("Error", response);
  //       }
  //     })
  //     .catch(error => {
  //       //Alert.alert(error);
  //       console.log(error);
  //     });
  // };

  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.container}>
         {isLoading  ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView>
          <View style={styles.PersonalDetailSectionsStyle}>
            <View style={styles.PersonalDetailSectionArea}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                  {CONSTANT.AwardsProfileAddAwardsCertifications}
                </Text>
              </View>
              <View>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.TextInputLayoutStyle}
                  name="Award Title"
                  placeholder={CONSTANT.AwardsProfileAwardTitle}
                  placeholderTextColor="#807f7f"
                  onChangeText={title => this.setState({ title })}
                  value={this.state.title}
                />
                <View>
                  <DateTimePickerModal
                    cancelTextIOS={"CANCEL"}
                    confirmTextIOS={"OK"}
                    cancelTextStyle={{ color: "#3d4461", fontSize: 20 }}
                    confirmTextStyle={{ color: "#3d4461", fontSize: 20 }}
                    isVisible={this.state.DatePickerVisibleAwardDate}
                    mode="date"
                    onConfirm={this.handleConfirmAwardDate}
                    onCancel={this.hideDatePickerAwardDate}
                  />
                </View>
                <View style={{flexDirection:'row'}}>
                  <TextInput
                    editable={false}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#807f7f"
                    placeholder={CONSTANT.AwardsProfileAwardDate}
                    style={[styles.TextInputLayoutStyle,{width:'85%'}]}
                    value={this.state.date}
                  />
                  <TouchableOpacity
                    onPress={() => this.showDatePickerAwardDate()}
                    style={{width:50, height:50, justifyContent: 'center', alignItems:'center' }}
                  >
                    <AntIcon
                      name="calendar"
                      color={CONSTANT.primaryColor}
                      size={22}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row', height: 150, width:'100%'}}>
                  <TouchableOpacity
                    onPress={() => this.pickAwards()}
                    style={styles.PersonalDetailDownloadArea}
                  >
                    <AntIcon name="plus" color={"#767676"} size={27} />
                    <Text style={styles.PersonalDetailDownloadText}>
                    {CONSTANT.AwardsProfileAddImage}
                    </Text>
                  </TouchableOpacity>
                  <Image
                    resizeMode={'cover'}
                    style={[styles.AwardandProjectImageStyle, {height:'100%', width:'50%'}]}
                    source={{
                      uri:
                        this.state.image.uri == null || '' ?
                        "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+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"
                        :
                        this.state.image.uri
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.AddNowClicked}
                  style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                  <Text style={styles.ButtonText}>
                    {CONSTANT.ProfileAdd}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.state.fetchAwardsData.length >= 1 && (
              <FlatList
                data={this.state.fetchAwardsData}
                extraData={this.state.awardrefresh}
                keyExtractor={(y, z) => z.toString()}
                renderItem={({ item , index}) => (
                  <View>
                    <Collapse>
                      <CollapseHeader>
                        <View
                          style={[
                            {
                              marginHorizontal:10,
                              paddingLeft: 10,
                              paddingRight: 10,
                              flexDirection: "row",
                              justifyContent: "space-between",
                            },
                            styles.AwardandProjectMainArea,
                            styles.Elevation
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignContent: "center"
                            }}
                          >
                            <Image
                              resizeMode={'cover'}
                              style={styles.AwardandProjectImageStyle}
                              source={{
                                uri:
                                    item.url == null || '' ?
                                    "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+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"
                                    :
                                    item.url
                              }}
                            />
                            <View
                              style={{
                                flexDirection: "column",
                                justifyContent: "center"
                              }}
                            >
                              <Text style={styles.NameTextStyle}>{item.title}</Text>
                              <Text style={styles.ParagraphTextStyle}>
                                {/* {item.date.split(' ')[0]} */}
                                {item.award_date}
                              </Text>
                            </View>
                          </View>
                          <View style={{ flexDirection: "row" }}>
                            {/* <TouchableOpacity
                          style={{
                            backgroundColor: "#3d4461",
                            padding: 10,
                            height:60,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                          
                        >
                          <AntIcon name="edit" color={"#fff"} size={20} />
                        </TouchableOpacity> */}
                            <TouchableOpacity
                              onPress={() => this.onDeletePress(index)}
                              style={{
                                backgroundColor: "#ff5851",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <AntIcon name="delete" color={"#fff"} size={20} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <View style={styles.PersonalDetailCollapseBodyArea}>
                          <TextInput
                            underlineColorAndroid="transparent"
                            defaultValue={item.title}
                            style={styles.TextInputLayoutStyle}
                            name="Award Title"
                            placeholder={CONSTANT.AwardsProfileAwardTitle}
                            placeholderTextColor="#807f7f"
                            onChangeText={editTitle => this.setState({ editTitle })}
                          />
                          {/* <TextInput
                            underlineColorAndroid="transparent"
                            defaultValue={item.date.split(' ')[0]}
                            style={styles.TextInputLayoutStyle}
                            name="Award Date"
                            placeholder="Award Date"
                            placeholderTextColor="#807f7f"
                            onChangeText={date => this.setState({ date })}
                          /> */}
                          <View>
                            <DateTimePickerModal
                              cancelTextIOS={"CANCEL"}
                              confirmTextIOS={"OK"}
                              cancelTextStyle={{ color: "#3d4461", fontSize: 20 }}
                              confirmTextStyle={{ color: "#3d4461", fontSize: 20 }}
                              isVisible={this.state.editDatePickerVisibleAwardDate}
                              mode="date"
                              onConfirm={this.edithandleConfirmAwardDate}
                              onCancel={this.edithideDatePickerAwardDate}
                            />
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <TextInput
                              editable={false}
                              underlineColorAndroid="transparent"
                              placeholderTextColor="#323232"
                              placeholder={item.date.split(' ')[0]}
                              style={[styles.TextInputLayoutStyle,{width:'85%'}]}
                              value={this.state.editDate}
                            />
                            <TouchableOpacity
                              onPress={() => this.editshowDatePickerAwardDate()}
                              style={{width:50, height:50, justifyContent: 'center', alignItems:'center' }}
                            >
                              <AntIcon
                                name="calendar"
                                color={CONSTANT.primaryColor}
                                size={22}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={{flexDirection:'row', height: 150, width:'100%'}}>
                            <TouchableOpacity
                              onPress={() => this.editPickAwards()}
                              style={styles.PersonalDetailDownloadArea}
                            >
                              <AntIcon name="plus" color={"#767676"} size={27} />
                              <Text style={styles.PersonalDetailDownloadText}>
                              {CONSTANT.AwardsProfileAddImage}
                              </Text>
                            </TouchableOpacity>
                            <Image
                              resizeMode={'cover'}
                              style={[styles.AwardandProjectImageStyle, {height:'100%', width:'50%'}]}
                              source={{
                                uri:
                                  this.state.editImage.uri == null || '' ?
                                  "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+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"
                                  :
                                  this.state.editImage.uri
                              }}
                            />
                          </View>
                          <TouchableOpacity
                            onPress={() => this.EditData(index, item)}
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
            )}
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

export default AwardsProfile;
