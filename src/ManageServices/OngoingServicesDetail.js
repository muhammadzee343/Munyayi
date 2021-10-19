import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Share,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  AsyncStorage,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import ImageSlider from "react-native-image-slider";
import AntIcon from "react-native-vector-icons/AntDesign";
import JobAttachments from "../DetailJobs/JobAttachments";
import ServiceSkill from "../DetailServices/ServiceSkill";
import { Header } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";
import * as CONSTANT from "../Constants/Constant";
import { NavigationEvents } from "react-navigation";
import StarRating from "react-native-star-rating";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import DocumentPicker from "react-native-document-picker";
import SelectedDocLayout from "../CompleteEmployers/SelectedDocLayout";
import RBSheet from "react-native-raw-bottom-sheet";
import HTML from "react-native-render-html";
import MultiSelect from "react-native-multiple-select";
import axios from 'axios';
console.disableYellowBox = true;

const { width: viewportWidth } = Dimensions.get("window");
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class OngoingServicesDetail extends Component {
  static navigationOptions = {
    title: "Home",
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: CONSTANT.primaryColor,
    },
    headerTitleStyle: {
      fontSize: 18,
    },
  };
  state = {
    data: [],
    isLoading: true,
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    showAlert: false,
    SaveStatus: "Save",
    fetchImages: [],
    fetchHistory: [],
    ServiceStatus:[],
    new_ServiceStatus:[],
    ServiceStatusKnown:'',
    ServiceRating:[],
    new_ServiceRating:[],
    score:'1',
    addFeedback:'',
    addCancelService:'',
    index_v:'',
    score1:'1',
    refresh_ServiceRating: false,
    ratingArray: [],
    ratings:{},
    New_ratingArray:[],
  };
  componentDidMount() {
    this.getUser();
    this.fetchProjectHistory();
    this.FetchServiceStatus();
  }
  FetchServiceStatus = async () => {
    const response = await fetch(
      CONSTANT.BaseUrl + "user/get_theme_settings"
    );
    const json = await response.json();
    this.setState({ServiceStatus: json.job_status, isLoading: false });
    console.log('Service Status', JSON.stringify(this.state.ServiceStatus));
    for (const [key, value] of Object.entries(this.state.ServiceStatus)) {
      console.log(`${key}: ${value}`);
      this.state.new_ServiceStatus.push({
        name: `${value}`,
        slug: `${key}`,
      });
    }
    console.log("New Required Array", this.state.new_ServiceStatus);
    
    this.setState({ServiceRating: json.services_ratings, isLoading: false });
    console.log('Service Status', JSON.stringify(this.state.ServiceRating));
    for (const [key, value] of Object.entries(this.state.ServiceRating)) {
      console.log(`${key}: ${value}`);
      this.state.new_ServiceRating.push({
        questions: `${value}`,
        key: `${key}`
      });
    }
    console.log("New Required Array", this.state.new_ServiceRating);
  };
  fetchProjectHistory = async () => {
    const { params } = this.props.navigation.state;
    const Pid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl +
        "dashboard/get_ongoing_job_chat?id=" +
        params.data.order_id +
        "&user_id=" +
        Pid
    );
    const json = await response.json();
    this.setState({ fetchHistory: json, isLoading: false });
    // this.getUser();
  };
  getUser = async () => {
    try {
      const permissionChat = await AsyncStorage.getItem("chatPermission");
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const type = await AsyncStorage.getItem("profileType");
      const id = await AsyncStorage.getItem("projectUid");

      //  console.log(storedValue ,storedType, profileImg  ,type , id);
      if (storedValue !== null) {
        this.setState({ storedValue });
      } else {
        // alert('something wrong')
      }
      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
      if (profileImg !== null) {
        this.setState({ profileImg });
      } else {
        //  alert('something wrong')
      }
      if (type !== null) {
        this.setState({ type });
      } else {
        //  alert('something wrong')
      }
      if (id !== null) {
        this.setState({ id });
      } else {
        //  alert('something wrong')
      }
      if (permissionChat !== null) {
        this.setState({ permissionChat });
      } else {
        //  alert('something wrong')
      }
    } catch (error) {
      // alert(error)
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
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  SubmitMessage = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const { params } = this.props.navigation.state;
    const { Description, images } = this.state;
    const formData = new FormData();
    formData.append("sender_id", Uid);
    formData.append("id", params.data.order_id);
    formData.append("chat_desc", Description);
    formData.append("size", images.length);
    images.forEach((item, i) => {
      var path = item.uri;
      var filename = item.name;
      formData.append("project_files" + i, {
        uri: path,
        type: item.type,
        name: filename || `filename${i}.jpg`,
      });
    });
    fetch(CONSTANT.BaseUrl + "proposal/sendproposal_chat", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => {
        if (response.status == "200") {
          //Alert.alert("I am in 200");
          console.log(response);
          this.showSuccessAlert();
        } else if (response.status == "203") {
          //Alert.alert("I am in 203");
          console.log(response);
          this.showAlert();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  openFeedback = () => {
    console.log('service Known', this.state.ServiceStatusKnown)
    if(this.state.ServiceStatusKnown == 'completed'){
      this.onCompleteRBSheet.open()
    }else if(this.state.ServiceStatusKnown == 'cancelled'){
      this.onCancelledRBSheet.open()
    }else null;
  }
  closeFeedback = async () => {
    this.onCompleteRBSheet.close()

    this.setState({ isLoading: true });
    const {
      addFeedback,
      ratingArray
    } = this.state;
    
    const Uid = await AsyncStorage.getItem('projectUid');
    const { params } = this.props.navigation.state;
    console.log(
      addFeedback,
      JSON.stringify(ratingArray),
      Uid,
      params.data.order_id
    );
    // axios
    //   .post(CONSTANT.BaseUrl + "dashboard/complete_services?user_id=" + Uid + '&service_order_id=' + params.data.order_id,{
    //     feedback_description: addFeedback,
    //     feedback: ratingArray,
    //   })
    //   .then(async response => {
    //     console.log(response);
    //     if (response.status === 200) {
    //       this.setState({ isLoading: false });
    //       Alert.alert("Success", response.data.message);
    //       console.log("Success", response.data.message)
    //     } else if (response.status === 203) {
    //       this.setState({ isLoading: false });
    //       Alert.alert("Error", response.data.message);
    //       console.log("Error", response.data.message)
    //     }
    //   })
    //   .catch(error => {
    //     Alert.alert(error);
    //     console.log(error);
    //   });
  }
  cancelReason = async () => {
    this.onCancelledRBSheet.close()

    this.setState({ isLoading: true });
    const {
      addCancelService
    } = this.state;
    console.log(
      addCancelService
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    const { params } = this.props.navigation.state;
    axios
      .post(CONSTANT.BaseUrl + "dashboard/cancelled_services?user_id=" + Uid + '&service_order_id=' + params.data.order_id,{
        cancelled_reason: addCancelService,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert("Success", response.data.message);
          console.log("Success", response.data.message)
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert("Error", response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  }

  onStarRatingPress(rating, index, key_value) {

    this.setState({
      ratings:{
        ...this.state.ratings,
        [index]:{key_value, rating}
      }
    })
    //console.log('my rating', this.state.ratings)
    
    // if(this.state.ratingArray != []){
    //   for (var i = 0 ; i <= this.state.ratingArray.length() ; i++){
    //     console.log("This is my new loop" , this.state.ratingArray)
    //   }
    // } else {
      // for (const [key, value] of Object.entries(this.state.ServiceRating)) {
        // console.log(`${key}: ${value}`);

        // this.state.ratingArray.push({${key_value} : `${rating}`})
        this.state.ratingArray.push({[key_value] : rating})
      // }
      console.log('rating array', this.state.ratingArray)
      //this.setState({index_v: index});
    // }
  }
  _listEmptyComponent = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", height: '100%', alignSelf: 'center', alignItems: 'center', marginBottom:10 }}>
        <Image style={{ resizeMode: 'contain', height: 150, width: 150 }}
          source={require('../Images/nodata.png')}
        />
      </View>
    )
  }

  render() {
    const { params } = this.props.navigation.state;
    const {
      storedValue,
      storedType,
      profileImg,
      permissionChat,
      showAlert,
      isLoading
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* <NavigationEvents onWillFocus={this.fetchServiceData} /> */}
        <StatusBar
          backgroundColor={CONSTANT.statusBarColor}
          barStyle="light-content"
        />
        <View
          style={{
            height: 60,
            paddingLeft: 15,
            paddingRight: 15,
            width: "100%",
            backgroundColor: CONSTANT.primaryColor,
            flexDirection: "row",
            shadowOffset: { width: 0, height: 2 },
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack(null)}
            style={{
              flexDirection: "column",
              width: "20%",
              display: "flex",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <AntIcon name="back" size={25} color={"#fff"} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "column",
              width: "60%",
              display: "flex",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: "#fff",
                  height: 30,
                  marginTop: 9,
                }}
              >
                {CONSTANT.OngoingServicesDetailServiceHistory}
              </Text>
            </View>
          </View>
        </View>
        {isLoading == true ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView>
          <View style={{ flexDirection: "row", padding: 10, flex: 4 }}>
            <View
              style={{
                flexDirection: "row",
                flex: 3,
                marginTop: 10,
                marginHorizontal: 10,
              }}
            >
              <View>
                <Image
                  style={{ height: 70, width: 70, borderRadius: 5 }}
                  source={{ uri: params.data.featured_img }}
                />
              </View>
              <View style={{ flexDirection: "column", marginLeft: 10, justifyContent: 'center', width:'80%' }}>
                {params.data.is_featured == "yes" && (
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 10, color: "#767676" }}
                  >
                    {CONSTANT.ManageServicesFeatured}
                  </Text>
                )}

                <Text
                  style={{
                    fontSize: 17,
                    marginRight: 10,
                    fontWeight: "700",
                    color: "#323232",
                  }}
                >
                  {entities.decode(params.data.service_title)}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 10, color: "#767676" }}
                  >
                    {CONSTANT.ManageServicesStartingfrom}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: CONSTANT.primaryColor,
                    }}
                  >
                    {" "}
                    {entities.decode(params.data.price)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ }}>
            <View
              style={{
                height: 65,
                flexDirection: "column",
                justifyContent: "center",
                margin: 10,
                backgroundColor: "#fcfcfc",
                borderLeftWidth: 5,
                borderLeftColor: CONSTANT.primaryColor,
              }}
            >
              <Text
                style={{
                  marginLeft: 20,
                  textAlign: "left",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                {CONSTANT.AddonsServices}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
              }}
            >
              <FlatList
                data={params.data.addons}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={{
                      marginBottom: 5,
                    }}
                    activeOpacity={0.9}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        padding: 10,
                        backgroundColor: "#fff",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flexDirection: "column", marginLeft: 10, marginBottom:5, width:'80%' }}>
                        <Text
                          //numberOfLines={1}
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: "#323232",
                          }}
                        >
                          {entities.decode(item.title)}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{ fontSize: 13, color: "#767676" }}
                        >
                          {entities.decode(item.detail)}
                        </Text>
                      </View>

                      <View>
                        <Text
                          numberOfLines={1}
                          style={{ fontSize: 13, color: "#767676" }}
                        >
                          {entities.decode(item.price)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          { storedType !== 'freelancer' &&
            <View style={{ }}>
              <View
                style={{
                  height: 65,
                  flexDirection: "column",
                  justifyContent: "center",
                  margin: 10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                }}
              >
                <Text
                  style={{
                    marginLeft: 20,
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {CONSTANT.OngoingServicesDetailHiredFreelancer}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  padding: 10,
                  backgroundColor: "#fff",
                  alignItems: "center",
                }}
              >
                <View>
                  {storedType == "freelancer" ? (
                    <Image
                      style={{ height: 50, width: 50, borderRadius: 25 }}
                      source={{ uri: params.data.employer_avatar }}
                    />
                  ) : (
                    <Image
                      style={{ height: 50, width: 50, borderRadius: 25 }}
                      source={{ uri: params.data.freelancer_avatar }}
                    />
                  )}
                </View>
                <View style={{ flexDirection: "column", marginLeft: 10 }}>
                  {storedType == "freelancer" ? (
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 13, color: "#767676" }}
                    >
                      {entities.decode(params.data.employer_title)}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 13, color: "#767676" }}
                    >
                      {entities.decode(params.data.freelancer_title)}
                    </Text>
                  )}

                  {storedType == "freelancer" ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#323232",
                      }}
                    >
                      {entities.decode(params.data.employertagline)}
                    </Text>
                  ) : (
                    <View>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: "#323232",
                        }}
                      >
                        {entities.decode(params.data.freelancertagline)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={{marginBottom: 10, marginHorizontal: 20, flexDirection:'row' }}>
                <MultiSelect
                  ref={component => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={value =>
                    this.setState({ ServiceStatusKnown: value })
                  }
                  uniqueKey="slug"
                  items={this.state.new_ServiceStatus}
                  selectedItems={this.state.ServiceStatusKnown}
                  borderBottomWidth={0}
                  single={true}
                  searchInputPlaceholderText={'Pick Service Status'}
                  selectText={'Hired'}
                  styleMainWrapper={{
                    backgroundColor: "#ffffff",
                    borderRadius: 5,
                    marginTop:10,
                    width:'84%'
                  }}
                  styleDropdownMenuSubsection={{
                    backgroundColor: "#ffffff",
                    paddingRight: -10,
                    height: 60,
                    paddingLeft: 10,
                    borderWidth: 0.5,
                    borderColor: "#dddddd",
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                  onChangeInput={text => console.log(text)}
                  displayKey="name"
                  submitButtonText={CONSTANT.Submit}
                />
                <TouchableOpacity 
                  onPress={this.openFeedback}
                  style={{justifyContent: 'center', alignItems:'center', backgroundColor: CONSTANT.primaryColor, height:60, width:60, borderTopRightRadius:5, borderBottomRightRadius:5}}>
                  <AntIcon
                    name="check"
                    color={'#fff'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
          <View style={{}}>
            <View
              style={{
                height: 65,
                flexDirection: "column",
                justifyContent: "center",
                margin: 10,
                backgroundColor: "#fcfcfc",
                borderLeftWidth: 5,
                borderLeftColor: CONSTANT.primaryColor,
              }}
            >
              <Text
                style={{
                  marginLeft: 20,
                  textAlign: "left",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                {CONSTANT.OngoingServicesDetailChatHistory}
              </Text>
            </View>
            <FlatList
              data={this.state.fetchHistory}
              keyExtractor={(x, i) => i.toString()}
              ListEmptyComponent= { this._listEmptyComponent }
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                  }}
                  activeOpacity={0.9}
                >
                  {index % 2 === 0 ? (
                    <View style={styles.amenetiesarea}>
                      <View
                        style={{
                          flexDirection: "row",
                          marginRight: 15,
                          width: "80%",
                        }}
                      >
                        <View style={{ flexDirection: "row", marginRight: 15 }}>
                          <Image
                            resizeMode={"contain"}
                            style={{ width: 30, height: 30, borderRadius: 15 }}
                            source={{ uri: item.sender_image }}
                          />
                        </View>
                        <View>
                          <Text>{item.date_sent}</Text>
                          <HTML
                            containerStyle={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            html={item.message}
                            imagesMaxWidth={Dimensions.get("window").width}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        // onPress={() => this.props.navigation.goBack(null)}
                        style={{
                          flexDirection: "column",
                          display: "flex",
                          alignContent: "center",
                          alignSelf: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AntIcon name="download" size={25} color={"#000"} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.amenetiesarea2}>
                      <View
                        style={{
                          flexDirection: "row",
                          marginRight: 15,
                          width: "80%",
                        }}
                      >
                        <View style={{ flexDirection: "row", marginRight: 15 }}>
                          <Image
                            resizeMode={"contain"}
                            style={{ width: 30, height: 30, borderRadius: 15 }}
                            source={{ uri: item.sender_image }}
                          />
                        </View>
                        <View>
                          <Text>{item.date_sent}</Text>
                          <HTML
                            containerStyle={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            html={item.message}
                            imagesMaxWidth={Dimensions.get("window").width}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                      // onPress={() => this.props.navigation.goBack(null)}
                      >
                        <AntIcon name="download" size={25} color={"#323232"} />
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.MessageRBSheet.open()}
          style={{
            alignItems: "center",
            height: 50,
            width: "100%",
            alignSelf: "center",
            justifyContent: "center",
            backgroundColor: CONSTANT.primaryColor,
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {CONSTANT.OngoingServicesDetailSendMessage}
          </Text>
        </TouchableOpacity>
        <RBSheet
          ref={(ref) => {
            this.MessageRBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 15,
              paddingRight: 15,
              backgroundColor: "transparent",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            },
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.getAnswersRBSheetMainArea}
          >
            <View
              style={{
                backgroundColor: CONSTANT.primaryColor,
                height: 55,
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              <Text
                style={{ color: "#fff", fontSize: 20, textAlign: "center" }}
              >
                {CONSTANT.OngoingServicesDetailTypeMessage}
              </Text>
            </View>
            <View style={styles.getAnswersRBSheetSpecialityArea}>
              <TextInput
                underlineColorAndroid="transparent"
                multiline={true}
                style={{
                  borderColor: "#807f7f",
                  width: "90%",
                  borderWidth: 0.3,
                  borderRadius: 3,
                  fontSize: 15,
                  padding: 5,
                  height: 150,
                }}
                name="username"
                onChangeText={(Description) => this.setState({ Description })}
                placeholder={CONSTANT.OngoingServicesDetailDescription}
                placeholderTextColor="#807f7f"
              />
              {this.state.images != null ? (
                <FlatList
                  style={{ paddingBottom: 5, paddingTop: 10 }}
                  data={this.state.images}
                  keyExtractor={(y, z) => z.toString()}
                  renderItem={({ item }) => (
                    <SelectedDocLayout docName={item.name} />
                  )}
                />
              ) : null}
              <View
                style={{
                  width: "90%",
                  marginBottom: 20,
                  marginTop: 10,
                  flexDirection: "row",
                  alignSelf: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.SubmitMessage()}
                  style={{
                    alignItems: "center",
                    height: 40,
                    borderRadius: 4,
                    marginRight: 5,
                    width: "45%",
                    alignSelf: "center",
                    backgroundColor: CONSTANT.primaryColor,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      alignItems: "center",
                      textAlign: "center",
                      color: "#fff",
                      paddingTop: 10,
                    }}
                  >
                    {CONSTANT.OngoingServicesDetailUpdate}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.pickMultiple()}
                  style={{
                    alignItems: "center",
                    height: 40,
                    borderRadius: 4,
                    marginLeft: 5,
                    width: "45%",
                    alignSelf: "center",
                    backgroundColor: "#00cc8d",
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      alignItems: "center",
                      textAlign: "center",
                      color: "#fff",
                      paddingTop: 10,
                    }}
                  >
                    {CONSTANT.OngoingServicesDetailSelectFile}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.onCompleteRBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: 'transparent',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            },
          }}>
          <View style={{
              width: '100%',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              backgroundColor: CONSTANT.primaryColor,
              height: 55,
              justifyContent: 'center',
              fontWeight: '700',
            }}>
            <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
              {CONSTANT.OngoingServicesDetailCompleteService}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              width: '100%',
              overflow: 'hidden',
              paddingHorizontal:10,
            }}>
           
            <FlatList
              data={this.state.new_ServiceRating}
              extraData={this.state.refresh_ServiceRating}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={{flex: 1,}}>
                  <View style={{flexDirection:'row', alignItems: 'center'}}>
                    <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'#f7f7f7', padding:10, marginRight:10, marginVertical:5, borderRadius:5}}>
                      {/* {this.state.index_v === index ? ( */}
                        <View style={{flexDirection:'row'}}>
                          <View style={{borderColor:'#ddd', borderWidth:1, borderRadius:5, width:30, height:30, justifyContent: 'center', alignItems:'center', backgroundColor:CONSTANT.primaryColor, marginRight:5}}>
                            <Text style={[styles.SectionHeadingTextStyle,{color: CONSTANT.TextColorLight}]}>{this.state.ratings[index] != null ? this.state.ratings[index].rating : 0}</Text>
                          </View>
                          <StarRating
                            disabled={false}
                            maxStars={5}
                            starSize={24}
                            fullStarColor={"#fecb02"}
                            emptyStarColor={"#fecb02"}
                            rating={this.state.ratings[index] != null ? this.state.ratings[index].rating : 0}
                            selectedStar={(rating) => this.onStarRatingPress(rating, index, item.key)}
                          />
                        </View>
                         {/* ) : (
                        <View style={{flexDirection:'row'}}>
                          <View style={{borderColor:'#ddd', borderWidth:1, borderRadius:5, width:30, height:30, justifyContent: 'center', alignItems:'center', backgroundColor:CONSTANT.primaryColor, marginRight:5}}>
                            <Text style={[styles.SectionHeadingTextStyle,{color: CONSTANT.TextColorLight}]}>{this.state.score1}</Text>
                          </View>
                          <StarRating
                             disabled={false}
                            maxStars={5}
                            starSize={24}
                            fullStarColor={"#fecb02"}
                            emptyStarColor={"#fecb02"}
                            rating={this.state.score1}
                            selectedStar={(rating) => this.onStarRatingPress(rating, index , item.key)}
                          />
                        </View>
                      )} */}
                    </View>
                    <View style={{flex: 1,}}>
                      <Text style={styles.NameTextStyle}>{item.questions}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
            <TextInput
              multiline={true}
              placeholderTextColor="#7F7F7F"
              underlineColorAndroid="transparent"
              placeholder={CONSTANT.OngoingServicesDetailAddFeedback}
              onChangeText={addFeedback =>
                this.setState({ addFeedback })
              }
              //value={this.state.addFeedback}
              style={{
                height: 150,
                backgroundColor:'#ffffff',
                borderRadius: 5,
                borderWidth: 0.7,
                borderColor: "#dddddd",
                color: "#323232",
                paddingHorizontal:10,
                marginBottom: 10,
                justifyContent:'center',
                fontSize:14,
              }}
            />
            <TouchableOpacity 
              onPress={this.closeFeedback}
              style={{
                height: 40,
                marginVertical: 10,
                borderRadius: 5,
                width: "40%",
                marginHorizontal:5,
                flexDirection:'row',
                alignItems: "center",
                justifyContent:"center",
                alignSelf: "center",
                backgroundColor: CONSTANT.primaryColor,
              }}>
              <Text style={{
                color: "#ffffff",
                fontSize: 12,
                fontWeight:'700',
                textAlign:"center",
              }}>{CONSTANT.OngoingServicesDetailSendFeedback}</Text>
            </TouchableOpacity>
          </ScrollView>
          {/* <View style={{width:'100%', backgroundColor:'#fff'}}>
            <TouchableOpacity 
              onPress={() => this.onCompleteRBSheet.close()}
              style={{
                height: 40,
                marginVertical: 10,
                borderRadius: 5,
                width: "40%",
                marginHorizontal:5,
                flexDirection:'row',
                alignItems: "center",
                justifyContent:"center",
                alignSelf: "center",
                backgroundColor: CONSTANT.primaryColor
              }}>
              <Text style={{
                color: "#ffffff",
                fontSize: 12,
                fontWeight:'700',
                textAlign:"center",
              }}>SEND FEEDBACK</Text>
            </TouchableOpacity>
          </View> */}
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.onCancelledRBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: 'transparent',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            },
          }}>
          <View style={{
              width: '100%',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              backgroundColor: CONSTANT.primaryColor,
              height: 55,
              justifyContent: 'center',
              fontWeight: '700',
            }}>
            <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
              {CONSTANT.OngoingServicesDetailCancelReason}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              width: '100%',
              overflow: 'hidden',
              padding:10
            }}>
            <TextInput
              multiline={true}
              placeholderTextColor="#7F7F7F"
              underlineColorAndroid="transparent"
              placeholder={CONSTANT.OngoingServicesDetailAddCReason}
              onChangeText={addCancelService =>
                this.setState({ addCancelService })
              }
              //value={this.state.addCancelService}
              style={{
                height: 150,
                backgroundColor:'#ffffff',
                borderRadius: 5,
                borderWidth: 0.7,
                borderColor: "#dddddd",
                color: "#323232",
                paddingHorizontal:10,
                marginBottom: 10,
                justifyContent:'center',
                fontSize:14,
              }}
            />
          </ScrollView>
          <View style={{width:'100%', backgroundColor:'#fff'}}>
          <TouchableOpacity 
              onPress={this.cancelReason}
              style={{
                height: 40,
                marginVertical: 10,
                borderRadius: 5,
                width: "40%",
                marginHorizontal:5,
                flexDirection:'row',
                alignItems: "center",
                justifyContent:"center",
                alignSelf: "center",
                backgroundColor: CONSTANT.primaryColor
              }}>
              <Text style={{
                color: "#ffffff",
                fontSize: 12,
                fontWeight:'700',
                textAlign:"center",
              }}>{CONSTANT.OngoingServicesDetailCancelService}</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    );
  }
}
export default OngoingServicesDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  amenetiesarea: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: "space-between",
    width: "100%",
  },
  amenetiesarea2: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: "space-between",
    width: "100%",
  },
  getAnswersRBSheetMainArea: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
  },
  getAnswersRBSheetSpecialityArea: {
    height: 500,
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,

    top: 10,
  },
  getAnswersRBSheetMainArea: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
  },
  getAnswersRBSheetSpecialityArea: {
    height: 500,
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: "center",
    top: 10,
  },
});
