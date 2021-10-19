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
  TextInput,
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
import styles from "../Constants/Styles";
import SimpleHeader from "../Header/SimpleHeader";
import { NavigationEvents } from "react-navigation";
import Carousel from "react-native-snap-carousel";
import HTML from "react-native-render-html";
import StarRating from "react-native-star-rating";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
console.disableYellowBox = true;

const { width: viewportWidth } = Dimensions.get("window");
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class DetailServiceScreen extends Component {
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
  };
  componentDidMount() {
    this.ApplicationThemeSettings();
    this.fetchServiceData();
  }
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_theme_settings");
    const json = await response.json();
    this.setState({
      themeSettingsDetailServiceFAQs: json.services_settings.service_faq_option,
      themeSettingsResponseTime: json.remove_response_time,
      themeSettingsDeliveryTime: json.remove_dilivery_time,
    });
  };
  fetchServiceData = async () => {
    const { params } = this.props.navigation.state;
    //Alert.alert('id', JSON.stringify(params.service_id));
    const response = await fetch(
      CONSTANT.BaseUrl +
        "services/get_services?listing_type=single&service_id=" +
        params.service_id
    );
    const json = await response.json();
    this.setState({ fetchSingleServicetitle: json[0].title });
    this.setState({ fetchSingleServiceAmount: json[0].formated_price });
    this.setState({ fetchSingleServicedelivery_time: json[0].delivery_time });
    this.setState({ fetchSingleServiceservice_views: json[0].service_views });
    this.setState({ fetchSingleServicesoled: json[0].sold });
    this.setState({ fetchSingleServiceresponse_time: json[0].response_time });
    this.setState({ fetchSingleServicetotal_rating: json[0].total_rating });
    this.setState({ fetchSingleServicequeu: json[0].queue });
    this.setState({ fetchSingleServicecontent: json[0].content });
    this.setState({ fetchSingleServiceauther_image: json[0].auther_image });
    this.setState({ fetchSingleServiceauther_date: json[0].auther_date });
    this.setState({ fetchSingleServiceauther_title: json[0].auther_title });
    this.setState({ fetchSingleServiceservice_url: json[0].service_url });
    this.setState({
      fetchSingleServiceservice_id: json[0].service_id,
      isLoading: false,
    });
    this.setState({ fetchSingleServicefavorit: json[0].favorit });
    this.setState({ fetchImages: json[0].images });
    this.setState({ fetchCategories: json[0].categories });
    this.setState({ fetchAddons: json[0].addons });
    this.setState({ fetchFAQs: json[0].faq });
    this.getUser();
  };
  getUser = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const type = await AsyncStorage.getItem("profileType");
      const id = await AsyncStorage.getItem("projectUid");
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
    } catch (error) {
      // Error saving data
      console.log(error);
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
  onClick = () => {
    Share.share(
      {
        message: this.state.fetchSingleServiceservice_url,
        url: this.state.fetchSingleServiceservice_url,
        title: "Wow, did you see that?",
      },
      {
        // Android only:
        dialogTitle: "Share BAM goodness",
        // iOS only:
        excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"],
      }
    );
  };
  SaveServcice = async () => {};
  _renderItem({ item, index }) {
    return (
      <View style={styles.DetailServiceSnapCarousalArea}>
        <Image source={{ uri: `${item.url}` }} style={styles.SnapCarousalImg} />
      </View>
    );
  }
  render() {
    const { type, storedType } = this.state;
    const { fetchFreelancer, isLoading, showAlert } = this.state;

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.fetchServiceData} />
        <SimpleHeader HeaderText={CONSTANT.DetailServiceHadder} />
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={{ backgroundColor: '#000' }}>
            <Image
              style={{height:200}}
              source={{uri: `${this.state.fetchImages >= 1 ? this.state.fetchImages : 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+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' } ` }}
              />
          </View> */}
          {this.state.fetchImages.length >= 1 && (
            <View>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={this.state.fetchImages}
                renderItem={this._renderItem}
                sliderWidth={viewportWidth}
                itemWidth={350}
                loop={true}
                autoplay={true}
                autoplayDelay={500}
                autoplayInterval={1500}
              />
            </View>
          )}
          <View style={styles.section}>
            <FlatList
              style={[
                styles.Elevation,
                { paddingBottom: 20, flexWrap: "wrap" },
              ]}
              data={this.state.fetchCategories}
              keyExtractor={(a, b) => b.toString()}
              renderItem={({ item }) => (
                <ServiceSkill
                  serviceskillName={`${entities.decode(item.category_name)}`}
                />
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
            <Text style={styles.SectionHeadingTextStyle}>
              {this.state.fetchSingleServicetitle}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.OtherTextStyle,
                  {
                    marginRight: 5,
                    marginTop:
                      CONSTANT.SectionHeadingFontSize - CONSTANT.OtherFontSize,
                  },
                ]}
              >
                {CONSTANT.DetailServicStarting}
              </Text>
              <Text
                style={[
                  styles.SectionHeadingTextStyle,
                  { color: CONSTANT.primaryColor },
                ]}
              >
                {entities.decode(this.state.fetchSingleServiceAmount)}
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: "#ffffff" }}>
            {this.state.themeSettingsDeliveryTime == "no" && (
              <View
                style={[
                  styles.DetailServiceDetailArea,
                  styles.section,
                  {
                    borderTopWidth: 0.5,
                    borderTopColor: "#dddddd",
                  },
                ]}
              >
                <Text style={styles.ParagraphTextStyle}>
                  {CONSTANT.DetailServiceDelivery}
                </Text>
                <Text style={styles.NameTextStyle}>
                  {entities.decode(this.state.fetchSingleServicedelivery_time)}
                </Text>
              </View>
            )}
            <View style={[styles.DetailServiceDetailArea, styles.section]}>
              <Text style={styles.ParagraphTextStyle}>
                {CONSTANT.DetailServiceViews}
              </Text>
              <Text style={styles.NameTextStyle}>
                {this.state.fetchSingleServiceservice_views}
              </Text>
            </View>
            <View style={[styles.DetailServiceDetailArea, styles.section]}>
              <Text style={styles.ParagraphTextStyle}>
                {CONSTANT.DetailServiceSales}
              </Text>
              <Text style={styles.NameTextStyle}>
                {this.state.fetchSingleServicesoled}
              </Text>
            </View>
            {this.state.themeSettingsResponseTime == "no" && (
              <View style={[styles.DetailServiceDetailArea, styles.section]}>
                <Text style={styles.ParagraphTextStyle}>
                  {CONSTANT.DetailServiceResponse}
                </Text>
                <Text style={styles.NameTextStyle}>
                  {entities.decode(this.state.fetchSingleServiceresponse_time)}
                </Text>
              </View>
            )}
            <View style={[styles.DetailServiceDetailArea, styles.section]}>
              <Text style={styles.ParagraphTextStyle}>
                {CONSTANT.DetailServiceFeedback}
              </Text>
              {/* <Text style={styles.NameTextStyle}>
                {entities.decode(this.state.fetchSingleServicetotal_rating)}/5
              </Text> */}
              <View style={{ flexDirection: "row" }}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={16}
                  fullStarColor={"#fecb02"}
                  emptyStarColor={"#fecb02"}
                  rating={this.state.fetchSingleServicetotal_rating}
                  //selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
                {this.state.fetchSingleServicetotal_rating && (
                  <View style={{ flexDirection: "row", marginLeft: 5 }}>
                    <Text style={styles.NameTextStyle}>
                      {this.state.fetchSingleServicetotal_rating != ""
                        ? "( " +
                          `${entities.decode(
                            this.state.fetchSingleServicetotal_rating
                          )}`
                        : "( " + 0}
                    </Text>
                    <Text>/5 {")"}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={[styles.DetailServiceDetailArea, styles.section]}>
              <Text style={styles.ParagraphTextStyle}>
                {CONSTANT.DetailServiceServices}
              </Text>
              <Text style={styles.NameTextStyle}>
                {this.state.fetchSingleServicequeu}
              </Text>
            </View>
            <View style={[styles.DetailServiceDetailArea, styles.section]}>
              <Text style={styles.ParagraphTextStyle}>
                {CONSTANT.DetailServiceClick}
              </Text>
              <Text style={styles.NameTextStyle}>{this.state.SaveStatus}</Text>
            </View>
            <View style={{ width: "100%", marginTop: 20 }}>
              <Text
                style={[
                  styles.OtherTextStyle,
                  { textAlign: "center", marginHorizontal: "10%" },
                ]}
              >
                {CONSTANT.DetailServiceMain}
              </Text>
            </View>
            {type == "success" && storedType == "employer" ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("BuyServiceScreen", {
                    price: this.state.fetchSingleServiceAmount,
                    id: this.state.fetchSingleServiceservice_id,
                  })
                }
                style={styles.MainButtonArea}
              >
                <Text style={styles.ButtonText}>
                  {CONSTANT.DetailServiceButtonSave}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.showAlert();
                }}
                style={styles.MainButtonArea}
              >
                <Text style={styles.ButtonText}>
                  {CONSTANT.DetailServiceButtonSave}
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6,
                marginTop: 10,
              }}
            />
          </View>
          <View style={styles.section}>
            <View
              style={[
                styles.Elevation,
                {
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  padding: 10,
                  marginVertical: 10,
                  borderRadius: 5,
                },
              ]}
            >
              <Image
                style={{
                  borderRadius: 5,
                  width: 60,
                  marginRight: 10,
                  height: 60,
                }}
                source={{ uri: `${this.state.fetchSingleServiceauther_image}` }}
              />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.OtherTextStyle}>
                  {this.state.fetchSingleServiceauther_date}
                </Text>
                <Text style={styles.NameTextStyle}>
                  {this.state.fetchSingleServiceauther_title}
                </Text>
              </View>
            </View>

            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.DetailServiceDetail}
            </Text>
            <View style={{}}>
              <HTML
                html={this.state.fetchSingleServicecontent}
                baseFontStyle={styles.NameTextStyle}
              />
            </View>

            {this.state.themeSettingsDetailServiceFAQs == "yes" && (
              <View>
                <Text style={styles.MainHeadingTextStyle}>
                  {CONSTANT.DetailServiceFAQ}
                </Text>

                <FlatList
                  data={this.state.fetchFAQs}
                  keyExtractor={(a, b) => b.toString()}
                  renderItem={({ item }) => (
                    <Collapse>
                      <CollapseHeader>
                        <View
                          style={[
                            styles.PersonalDetailCollapseHeaderArea,
                            {
                              alignItems: "center",
                              backgroundColor: "#ddd",
                              paddingLeft: 10,
                            },
                          ]}
                        >
                          <Text style={styles.NameTextStyle}>
                            {item.faq_question}
                          </Text>
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <View
                          style={[
                            styles.PersonalDetailCollapseBodyArea,
                            { marginBottom: 10, marginTop: 0 },
                          ]}
                        >
                          <Text style={styles.ParagraphTextStyle}>
                            {item.faq_answer}
                          </Text>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  )}
                  //horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
                {/* <AccordionList
                  list={this.state.fetchFAQs}
                  //keyExtractor={item => `${item.id}`}
                  keyExtractor={(a, b) => b.toString()}
                  header={
                    <View
                          style={[styles.PersonalDetailCollapseHeaderArea, {alignItems: 'center', backgroundColor:'#ddd', paddingLeft :10}]}
                        >
                            <Text
                              style={
                                styles.NameTextStyle
                              }
                            >
                              {item.faq_question}
                            </Text>
                        </View>
                  }
                  body={
                    <View style={[styles.PersonalDetailCollapseBodyArea, {marginBottom: 10, marginTop: 0}]}>
                          <Text style={styles.ParagraphTextStyle}>
                            {item.faq_answer}
                          </Text>
                        </View>
                  }
                  
                /> */}
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.onClick}
              style={{
                width: "100%",
                backgroundColor: "#00cc8d",
                height: 40,
                marginVertical: 20,
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntIcon name="sharealt" color={"#fff"} size={17} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={CONSTANT.AwesomeAlertTitle}
          message={CONSTANT.AwesomeAlertMessage3}
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
      </View>
    );
  }
}
export default DetailServiceScreen;
