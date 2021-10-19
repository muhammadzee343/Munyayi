import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import CardView from "react-native-cardview";
import { Card } from "react-native-elements";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import HTML from "react-native-render-html";
import SignalIcon from "../Assets/Icons/SignalIcon";
import MapLocationIcon from "../Assets/Icons/MapLocationIcon";
import DollarsIcon from "../Assets/Icons/DollarIcon";
import CalendarIcon from "../Assets/Icons/CalenderIcon";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class LatestJobs extends Component {
  state = {
    default_color_badge: "",
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    iconColor: "#dddddd",
    showAlert: false,
    isLoading: false,
  };
  componentDidMount() {
    this.getUser();
    var user_id = this.props.fav_job_user_id;
  }
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
    }
  };
  UpdateFav = async () => {
    var user_id = this.props.fav_job_user_id;
    const fav_id = await AsyncStorage.getItem("projectUid");
    axios
      .post(CONSTANT.BaseUrl + "user/update-favourite", {
        id: fav_id,
        favorite_id: user_id,
        type: "saved_jobs",
      })
      .then(async (response) => {
        if (response.status == "200") {
          this.setState({
            iconColor: CONSTANT.primaryColor,
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
  FeaturedStyle = (featuredJObColor) => {
    return {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderRightWidth: 25,
      borderTopWidth: 25,
      borderTopLeftRadius: 4,
      borderRightColor: "transparent",
      borderTopColor: featuredJObColor,
    };
  };
  render() {
    const { showAlert, storedType, iconColor, isLoading } = this.state;
    var fav_color = this.props.Fav_Color;
    return (
      <View>
        {this.props.featuredJObColor != "" ? (
          <View
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}
            style={styles.LatestJobsshadow2}
          >
            {this.props.featuredJObColor != "" ? (
              <View style={this.FeaturedStyle(this.props.featuredJObColor)} />
            ) : (
              <View style={this.FeaturedStyle("#fff")} />
            )}
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Text style={styles.NameTextStyle}>{this.props.jobname}</Text>
            </View>
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Text style={styles.SectionHeadingTextStyle}>
                {this.props.jobtitle}
              </Text>
            </View>
            <View
              style={{
                paddingLeft: 10,
                flex: 1,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flex: 0.25,
                  flexDirection: "row",
                  // alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    // alignItems: "center",
                  }}
                >
                  <SignalIcon iconColor="black" />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.joblevel}
                  </Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: "row" }}>
                  <MapLocationIcon iconColor="black" />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.jobcountry}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  // alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    // alignItems: "center",
                  }}
                >
                  <DollarsIcon iconColor="#cf061e" />
                  {this.props.jobrate === "" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        paddingLeft: 10,
                      }}
                    >
                      <HTML
                        containerStyle={{ marginRight: 4 }}
                        baseFontStyle={styles.ParagraphTextStyle}
                        html={this.props.jobhourlyhours}
                      />
                      <Text style={styles.ParagraphTextStyle}>
                        {CONSTANT.HomeCompleteJobLayoutRate}
                      </Text>
                      <Text style={styles.ParagraphTextStyle}>
                        {this.props.jobestimatedhours}
                      </Text>
                      <Text style={styles.ParagraphTextStyle}>
                        {CONSTANT.HomeCompleteJobLayoutHours}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ paddingLeft: 10 }}>
                      <HTML
                        containerStyle={{ marginRight: 4 }}
                        baseFontStyle={styles.ParagraphTextStyle}
                        html={this.props.jobrate}
                      />
                    </View>
                  )}
                </View>
                <View style={{ flex: 0.6, flexDirection: "row" }}>
                  <CalendarIcon />
                  <View style={{ paddingLeft: 6 }}>
                    <Text style={[styles.ParagraphTextStyle]}>
                      {this.props.jobduration}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}
            style={styles.LatestJobsshadow2}
          >
            {this.props.featuredJObColor != "" ? (
              <View style={this.FeaturedStyle(this.props.featuredJObColor)} />
            ) : (
              <View style={this.FeaturedStyle("#fff")} />
            )}
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Text style={styles.NameTextStyle}>{this.props.jobname}</Text>
            </View>
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Text style={styles.SectionHeadingTextStyle}>
                {this.props.jobtitle}
              </Text>
            </View>
            <View
              style={{
                paddingLeft: 10,
                flex: 1,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flex: 0.4,
                  flexDirection: "row",
                  // alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    // alignItems: "center",
                  }}
                >
                  <SignalIcon iconColor="black" />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.joblevel}
                  </Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: "row" }}>
                  <MapLocationIcon iconColor="black" />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.jobcountry}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  // alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    // alignItems: "center",
                  }}
                >
                  <DollarsIcon iconColor="#cf061e" />
                  {this.props.jobrate === "" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        paddingLeft: 10,
                      }}
                    >
                      <HTML
                        containerStyle={{ marginRight: 4 }}
                        baseFontStyle={styles.ParagraphTextStyle}
                        html={this.props.jobhourlyhours}
                      />
                      <Text style={styles.ParagraphTextStyle}>
                        {CONSTANT.HomeCompleteJobLayoutRate}
                      </Text>
                      <Text style={styles.ParagraphTextStyle}>
                        {this.props.jobestimatedhours}
                      </Text>
                      <Text style={styles.ParagraphTextStyle}>
                        {CONSTANT.HomeCompleteJobLayoutHours}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ paddingLeft: 10 }}>
                      <HTML
                        containerStyle={{ marginRight: 4 }}
                        baseFontStyle={styles.ParagraphTextStyle}
                        html={this.props.jobrate}
                      />
                    </View>
                  )}
                </View>
                <View style={{ flex: 0.6, flexDirection: "row" }}>
                  <CalendarIcon />
                  <View style={{ paddingLeft: 6 }}>
                    <Text style={[styles.ParagraphTextStyle]}>
                      {this.props.jobduration}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
export default LatestJobs;
