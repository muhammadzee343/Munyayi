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
  StatusBar,
  Alert,
  AsyncStorage,
  Share,
  Linking,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import StarRating from "react-native-star-rating";
import axios from "axios";
import CompleteJobLayout from "../Home/CompleteJobLayout";
import { Header } from "react-native-elements";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import SimpleHeader from "../Header/SimpleHeader";
import DetailCompanyTabNavigation from "../Screens/AppScreens/DetailCompanyTabNavigation";
import Test from "../Components/Test";

class DetailCompanyScreen extends Component {
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
    iconColor: CONSTANT.primaryColor,
    text: CONSTANT.DetailCompanyScreenSaveCompany,
  };
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.fetchCompanyData();
    this.fetchCompleteJobData();
    // console.log("object", params.profile_id);
    // {
    //   params.profile_id &&
    //     this.props.navigation.navigate("AbouCompnayTabNavigationtScreen", {
    //       profile_id: params.profile_id,
    //     });
    // }
  }
  fetchCompanyData = async () => {
    const { params } = this.props.navigation.state;
    // console.log("fetchCompany", this.props.navigation.getChildNavigation());
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_employers?listing_type=single&profile_id=" +
        params.profile_id
    );
    const json = await response.json();
    this.setState({ fetchCompany: json, isLoading: false });
    // this.props.navigation.navigate("About", { params: { fetchCompany: json } });
    // console.log("fetchCompany", this.state.fetchCompany);
  };
  fetchCompleteJobData = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_jobs?listing_type=company&company_id=" +
        params.employ_id
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ fetchJobs: [], isLoading: false }); // empty data set
    } else {
      this.setState({ fetchJobs: json, isLoading: false });
    }
  };
  onClick = () => {
    Share.share(
      {
        message: this.state.fetchCompany[0].company_link,
        url: this.state.fetchCompany[0].company_link,
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
  UpdateFav = async () => {
    var user_id = this.state.fetchCompany[0].user_id;
    const fav_id = await AsyncStorage.getItem("projectUid");
    axios
      .post(CONSTANT.BaseUrl + "user/favorite", {
        id: fav_id,
        favorite_id: user_id,
        type: "_following_employers",
      })
      .then(async (response) => {
        if (response.status == "200") {
          this.setState({
            iconColor: "#00cc8d",
            text: "Saved",
            isLoading: false,
          });
          alert("Favorite Updated Successfully");
        } else if (response.status == "203") {
          alert("Cannot update favorite/ Network Error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    const { params } = this.props.navigation.state;
    const { isLoading, iconColor } = this.state;
    // console.log("this.state.fetchCompany", params.profile_id);
    return (
      <View style={styles.container}>
        <View>
          <SimpleHeader
            HeaderText={CONSTANT.DetailCompanyScreenDetailEmployers}
          />
        </View>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 0.3 }}>
          <View style={styles.section}>
            <View
              style={[
                styles.DetailCompanyInfoArea,
                styles.Elevation,
                { margin: 10 },
              ]}
            >
              <View
                style={{
                  height: 50,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ margin: 10 }}>
                  {this.state.fetchCompany && (
                    <Text style={styles.NameTextStyle}>
                      {this.state.fetchCompany[0].name}
                    </Text>
                  )}
                  <View style={styles.DetailCompanyIDArea}>
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailCompanyScreenCompanyId}{" "}
                    </Text>
                    {this.state.fetchCompany && (
                      <Text style={styles.ParagraphTextStyle}>
                        {this.state.fetchCompany[0].employ_id}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderColor: "transparent",
                    borderRadius: 30,
                    margin: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      borderColor: "transparent",
                      borderRadius: 30,
                    }}
                    source={{
                      uri: `${params.profile_img}`,
                    }}
                  />
                </View>
              </View>
              <View style={styles.DetailCompanyButtonMainArea}>
                {this.state.fetchCompany != null &&
                this.state.fetchCompany[0].favorit == "yes" ? (
                  <TouchableOpacity style={styles.DetailCompanySavedButtonArea}>
                    <Text style={styles.ButtonText}>
                      {CONSTANT.DetailCompanyScreenSaved}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={this.UpdateFav}
                    style={{
                      width: "85%",
                      backgroundColor: "#29AAE1",
                      height: 40,
                      borderRadius: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.ButtonText}>{this.state.text}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={this.onClick}
                  style={styles.DetailCompanyShareButtonArea}
                >
                  <AntIcon name="sharealt" color={"#fff"} size={17} />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.DetailCompanyInfoArea,
                styles.Elevation,
                { margin: 10 },
              ]}
            >
              <DetailCompanyTabNavigation />
            </View>
          </View>

          {/* <FlatList
            data={this.state.fetchJobs}
            keyExtractor={(a, b) => b.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  this.props.navigation.navigate("DetailJobScreen", {
                    job_id: item.job_id,
                  })
                }
              >
                <CompleteJobLayout
                  Completejobname={`${entities.decode(item.employer_name)}`}
                  featuredCompleteJobColor={`${entities.decode(
                    item.featured_color
                  )}`}
                  imageUriCompleteJobfeatured={{ uri: `${item.featured_url}` }}
                  Completejobtitle={`${entities.decode(item.project_title)}`}
                  jobflagimageUri={{ uri: `${item.location.flag}` }}
                  Completejoblevel={`${entities.decode(
                    item.project_level.level_title
                  )}`}
                  Completejobcountry={`${entities.decode(
                    item.location._country
                  )}`}
                  Completejobrate={item.project_cost}
                  Completejobhourlyhours={item.hourly_rate}
                  Completejobestimatedhours={item.estimated_hours}
                  fav_job_user_id={item.job_id}
                  Fav_Color={`${entities.decode(item.favorit)}`}
                  Completejobduration={`${entities.decode(
                    item.project_duration
                  )}`}
                />
              </TouchableOpacity>
            )}
          /> */}
        </ScrollView>
      </View>
    );
  }
}
export default DetailCompanyScreen;
