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
import RBSheet from "react-native-raw-bottom-sheet";
import HTML from "react-native-render-html";
console.disableYellowBox = true;

const { width: viewportWidth } = Dimensions.get("window");
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class CompleteServicesDetail extends Component {
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
  };
  componentDidMount() {
    this.getUser();
    this.fetchProjectHistory();
  }
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

  render() {
    const { params } = this.props.navigation.state;
    const {
      storedValue,
      storedType,
      profileImg,
      permissionChat,
      showAlert,
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
                {CONSTANT.CompletedServicesDetailServiceHistory}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView style={{ paddingBottom: 20 }}>
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
              <View style={{ flexDirection: "column", marginLeft: 10, justifyContent: 'center',}}>
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
            {/* {storedType == "freelancer" && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.RBSheet.open()}
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#EEE",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{ fontSize: 11, textAlign: "center", bottom: 5 }}
                  >
                    {CONSTANT.ManageServicesRating}
                  </Text>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={10}
                    fullStarColor={"#fecb02"}
                    emptyStarColor={"#fecb02"}
                    rating={params.data.service_ratings}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                  />
                  <AntIcon
                    name="infocirlceo"
                    color={"#323232"}
                    size={14}
                    style={{ alignSelf: "center", top: 5 }}
                  />
                </View>
              </TouchableOpacity>
            )} */}
          </View>

          <View style={{ top: 20 }}>
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
                {CONSTANT.CompletedServicesDetailAddonsServices}
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
                      <View style={{ flexDirection: "column", marginLeft: 10 }}>
                        <Text
                          numberOfLines={1}
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
          <View style={{ top: 35 }}>
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
                {CONSTANT.CompletedServicesDetailOrderBy}
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
                )}
              </View>
            </View>
          </View>

          <View style={{ top: 35 }}>
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
                {CONSTANT.CompletedServicesDetailChatHistory}
              </Text>
            </View>
            <FlatList
              data={this.state.fetchHistory}
              keyExtractor={(x, i) => i.toString()}
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
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
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
                {CONSTANT.CompletedServicesDetailReviewDetail}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: "#323232",
                  fontSize: 15,
                  textAlign: "left",
                  marginHorizontal: 10,
                  marginTop: 10,
                }}
              >
                {entities.decode(params.data.feedback)}
              </Text>
              <View style={styles.getAnswersRBSheetSpecialityArea}>
                <FlatList
                  data={params.data.rating_data}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={{ marginBottom: 10 }}
                      activeOpacity={0.9}
                    >
                      <View
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text style={{ fontSize: 15, textAlign: "left" }}>
                          {item.title}
                        </Text>
                        <StarRating
                          disabled={true}
                          maxStars={5}
                          starSize={10}
                          fullStarColor={"#fecb02"}
                          emptyStarColor={"#fecb02"}
                          rating={item.score}
                          selectedStar={(rating) =>
                            this.onStarRatingPress(rating)
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </RBSheet>
      </View>
    );
  }
}
export default CompleteServicesDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  imageOpacity: {
    backgroundColor: "#000",
    opacity: 0.74,
    zIndex: 1,
    height: 200,
  },
  snapcarousalarea: {
    marginVertical: 5,
    height: 200,
    overflow: "hidden",
    borderRadius: 10,
  },
  snapcarousalimg: {
    height: 200,
    borderRadius: 10,
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
});
