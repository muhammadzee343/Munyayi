import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  AsyncStorage,
  Alert,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Header } from "react-native-elements";
import SkillCard from "../DetailFreelancer/SkillCard";
import AwardCard from "../DetailFreelancer/AwardCard";
import FeedbackCard from "../DetailFreelancer/FeedbackCard";
import ProjectsCard from "../DetailFreelancer/ProjectsCard";
import ExperienceCard from "../DetailFreelancer/ExperienceCard";
import EducationCard from "../DetailFreelancer/EducationCard";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AwesomeAlert from "react-native-awesome-alerts";
import HTML from "react-native-render-html";
const Entities = require("html-entities").XmlEntities;
import { NavigationEvents } from "react-navigation";
const entities = new Entities();
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import SimpleHeader from "../Header/SimpleHeader";
import StarRating from "react-native-star-rating";
import MoneybagIcon from "../Assets/Icons/MoneybagIcon";
import MapLocationIcon from "../Assets/Icons/MapLocationIcon";
import FeedbackIcon from "../Assets/Icons/FeedbackIcon";
import CalendarIcon from "../Assets/Icons/CalenderIcon";
import BottomNav from "../Screens/BottomNav";
import FreelancerTabNavigationScreen from "../Screens/AppScreens/FreelancerTabNavigationScreen";

class DetailFreelancerScreen extends Component {
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
    themeSettingsStats: "",
    themeSettingsEarnings: "",
    themeSettingsSkillsDisplayType: "",
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
  componentDidMount() {
    // this.props.SendFreelencerData(this.state.FreelancerData);
    this.ApplicationThemeSettings();
    this.fetchFreelancerData();
  }
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_theme_settings");
    const json = await response.json();
    this.setState({
      themeSettingsStats: json.freelancers_settings.detail_page_stats,
      themeSettingsEarnings: json.freelancers_settings.hide_detail_page_earning,

      themeSettingsExperience: json.freelancers_settings.frc_remove_experience,
      themeSettingsEducation: json.freelancers_settings.frc_remove_education,
      themeSettingsPortfolio: json.freelancers_settings.portfolio.enable.others,
      themeSettingsAwards: json.freelancers_settings.frc_remove_awards,
      themeSettingsSkillsDisplayType:
        json.freelancers_settings.skills_display_type,
    });
    console.log("1", this.state.themeSettingsStats);
  };
  fetchFreelancerData = async () => {
    const { params } = this.props.navigation.state;
    //Alert.alert('hello', JSON.stringify(params.profile_id) )
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_freelancers?listing_type=single&profile_id=" +
        params.profile_id
    );
    const json = await response.json();
    this.setState({ fetchFreelancer: json });
    this.setState({ fetchSkills: json[0].skills });
    this.setState({ fetchAwards: json[0]._awards });
    this.setState({ fetchReviews: json[0].reviews });
    this.setState({ fetchProjects: json[0]._projects });
    this.setState({ fetchExperience: json[0]._experience });
    this.setState({ fetchContent: json[0].content });
    this.setState({ fetchPerHourRate: json[0]._perhour_rate });
    this.setState({ fetchLocation: json[0].location._country });
    this.setState({ fetchRating: json[0].wt_average_rating });
    this.setState({ fetchEducation: json[0]._educations, isLoading: false });
    this.getUser();
    // console.log("json", json);
    // this.props.SendFreelencerData(json[0]);
    //Alert.alert('content', JSON.stringify(this.state.fetchFreelancer[0].content) )
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
      // alert(error)
      console.log(error);
    }
  };
  fetchFreelancer = async () => {
    const { params } = this.props.navigation.state;
    //Alert.alert('hello', JSON.stringify(params.profile_id) )
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_freelancers?listing_type=single&profile_id=" +
        params.profile_id
    );
    const json = await response.json();
    this.setState({ fetchFreelancer: json });
    this.setState({ fetchSkills: json[0].skills });
    this.setState({ fetchAwards: json[0]._awards });
    this.setState({ fetchReviews: json[0].reviews });
    this.setState({ fetchProjects: json[0]._projects });
    this.setState({ fetchExperience: json[0]._experience });
    this.setState({ fetchContent: json[0].content });
    this.setState({ fetchPerHourRate: json[0]._perhour_rate });
    this.setState({ fetchLocation: json[0].location._country });
    this.setState({ fetchRating: json[0].wt_average_rating });
    this.setState({ fetchEducation: json[0]._educations, isLoading: false });
    //Alert.alert('content', JSON.stringify(this.state.fetchFreelancer[0].content) )
  };

  render() {
    // console.log("dsjklaasl;", this.state.FreelancerData);
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    const { fetchFreelancer, isLoading, showAlert } = this.state;
    const { id, storedValue, storedType, profileImg, type } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <SimpleHeader
          HeaderText={
            this.state.fetchFreelancer ? this.state.fetchFreelancer[0].name : ""
          }
        />
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
          <View style={[styles.section, { margin: 5 }]}>
            <View style={[styles.FeedbackCardMainArea, styles.Elevation]}>
              <View
                style={{
                  backgroundColor: "trasparant",
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <View>
                  {this.state.fetchFreelancer && (
                    <Image
                      style={styles.FeedbackCardImageStyle}
                      source={{
                        uri: `${this.state.fetchFreelancer[0].profile_img}`,
                      }}
                    />
                  )}
                </View>
                <View>
                  {this.state.fetchFreelancer && (
                    <Text style={styles.NameTextStyle}>
                      {this.state.fetchFreelancer[0].name}
                    </Text>
                  )}
                  {this.state.fetchFreelancer && (
                    <Text style={styles.SectionHeadingTextStyle}>
                      {this.state.fetchFreelancer[0]._tag_line}
                    </Text>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={[styles.FeedbackCardHalf, styles.Elevation]}>
                  <View style={{ marginLeft: 10 }}>
                    <View
                      style={[
                        styles.iconCircleStyle,
                        { backgroundColor: "#f4dff7" },
                      ]}
                    >
                      <MoneybagIcon iconColor="#4f00d1" />
                    </View>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    {this.state.fetchPerHourRate != "" ? (
                      <Text style={styles.NameTextStyle}>{`${entities.decode(
                        this.state.fetchPerHourRate
                      )}`}</Text>
                    ) : (
                      <Text style={styles.ParagraphTextStyle}>
                        {CONSTANT.DetailFreelancerNoPriceYet}
                      </Text>
                    )}
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailFreelancerHourly}
                    </Text>
                  </View>
                </View>
                <View style={[styles.FeedbackCardHalf, styles.Elevation]}>
                  <View style={{ marginLeft: 10 }}>
                    <View
                      style={[
                        styles.iconCircleStyle,
                        { backgroundColor: "#d9e7fa" },
                      ]}
                    >
                      <MapLocationIcon iconColor="#1873f5" />
                    </View>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailFreelancerLocation}
                    </Text>
                    {this.state.fetchLocation != "" ? (
                      <Text style={styles.NameTextStyle}>{`${entities.decode(
                        this.state.fetchLocation
                      )}`}</Text>
                    ) : (
                      <Text style={styles.ParagraphTextStyle}>
                        {CONSTANT.DetailFreelancerNoLocationYet}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={[styles.FeedbackCardHalf, styles.Elevation]}>
                  <View style={{ marginLeft: 10 }}>
                    <View
                      style={[
                        styles.iconCircleStyle,
                        { backgroundColor: "#f4dff7" },
                      ]}
                    >
                      <FeedbackIcon iconColor="#4f00d1" />
                    </View>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <View style={{ flexDirection: "row", marginLeft: 5 }}>
                      <Text style={styles.NameTextStyle}>
                        {this.state.fetchRating != ""
                          ? "( " + `${entities.decode(this.state.fetchRating)}`
                          : "( " + 0}
                      </Text>
                      <Text>/5 {")"}</Text>
                    </View>
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailFreelancerFeedback}
                    </Text>
                  </View>
                </View>
                <View style={[styles.FeedbackCardHalf, styles.Elevation]}>
                  <View style={{ marginLeft: 10, flex: 0.3 }}>
                    <View
                      style={[
                        styles.iconCircleStyle,
                        { backgroundColor: "#d9e7fa" },
                      ]}
                    >
                      <CalendarIcon />
                    </View>
                  </View>
                  <View style={{ marginLeft: 10, flex: 0.7 }}>
                    {this.state.fetchFreelancer && (
                      <Text style={styles.NameTextStyle}>{`${entities.decode(
                        this.state.fetchFreelancer[0].member_since
                      )}`}</Text>
                    )}
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailFreelancerMember}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View
              style={[
                styles.BottomTabContainerStyle,
                styles.Elevation,
                { margin: 5 },
              ]}
            >
              <FreelancerTabNavigationScreen />
            </View>
          </View>

          {type == "success" && storedType == "employer" ? (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("SendOffer", {
                  user_id: params.user_id,
                })
              }
              style={[styles.MainButtonArea, { backgroundColor: "#51aef5" }]}
            >
              <Text style={styles.ButtonText}>
                {CONSTANT.DetailFreelancerSave}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.showAlert();
              }}
              style={[styles.MainButtonArea, { backgroundColor: "#51aef5" }]}
            >
              <Text style={styles.ButtonText}>
                {CONSTANT.DetailFreelancerSave}
              </Text>
            </TouchableOpacity>
          )}

          {this.state.fetchReviews != "" && (
            <>
              <View style={styles.section}>
                <Text style={styles.MainHeadingTextStyle}>
                  {CONSTANT.DetailFreelancerClient}
                </Text>
              </View>
              <FlatList
                data={this.state.fetchReviews}
                keyExtractor={(a, b) => b.toString()}
                renderItem={({ item }) => (
                  <FeedbackCard
                    Reviewname={`${entities.decode(item.employer_name)}`}
                    Reviewtitle={`${entities.decode(item.project_title)}`}
                    Reviewlevel={`${entities.decode(item.level_title)}`}
                    ReviewLocation={`${entities.decode(item.project_location)}`}
                    ReviewDate={`${entities.decode(item.post_date)}`}
                    ReviewRating={`${entities.decode(item.project_rating)}`}
                    ReviewContent={`${entities.decode(item.review_content)}`}
                    ReviewImage={{ uri: `${item.employer_image}` }}
                  />
                )}
              />
            </>
          )}
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
      </SafeAreaView>
    );
  }
}

export default DetailFreelancerScreen;
