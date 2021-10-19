import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  AsyncStorage,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import ViewOverflow from "react-native-view-overflow";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import HTML from "react-native-render-html";
import SignalIcon from "../Assets/Icons/SignalIcon";
import MapLocationIcon from "../Assets/Icons/MapLocationIcon";
import DollarsIcon from "../Assets/Icons/DollarIcon";
import CalendarIcon from "../Assets/Icons/CalenderIcon";
class CompleteJobLayout extends Component {
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
    var user_id = this.props.fav_user_id;
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
      .post(CONSTANT.BaseUrl + "user/favorite", {
        id: fav_id,
        favorite_id: user_id,
        type: "_saved_projects",
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
  render() {
    const { showAlert, storedType, iconColor, isLoading } = this.state;
    var fav_color = this.props.Fav_Color;
    return (
      <View>
        {this.props.featuredCompleteJobColor != "" ? (
          <View style={[styles.section, { paddingRight: 0 }]}>
            <ViewOverflow
              style={[styles.CompleteJobLayoutmainStyle2, styles.Elevation]}
            >
              {this.props.featuredCompleteJobColor != "" ? (
                <View
                  style={{
                    width: 0,
                    height: 0,
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderRightWidth: 25,
                    borderTopWidth: 25,
                    borderTopLeftRadius: 4,
                    borderRightColor: "transparent",
                    borderTopColor: this.props.featuredCompleteJobColor,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 0,
                    height: 0,
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderRightWidth: 25,
                    borderTopWidth: 25,
                    borderTopLeftRadius: 4,
                    borderRightColor: "transparent",
                    borderTopColor: "#fff",
                  }}
                />
              )}
              <View
                style={[
                  styles.CompleteJobLayoutshadow,
                  { flex: 1, flexDirection: "row", margin: 7 },
                ]}
              >
                <View style={{ flex: 0.8 }}>
                  <Text numberOfLines={1} style={styles.NameTextStyle}>
                    {this.props.Completejobname}
                  </Text>
                  <Text style={styles.SectionHeadingTextStyle}>
                    {this.props.Completejobtitle}
                  </Text>
                  <View style={{ marginTop: 15 }}>
                    <View
                      style={{ flexDirection: "row", flex: 1, marginTop: 5 }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.5,
                        }}
                      >
                        <SignalIcon iconColor="black" />
                        <Text
                          style={[
                            styles.ParagraphTextStyle,
                            { paddingLeft: 10 },
                          ]}
                        >
                          {this.props.Completejoblevel}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.4,
                        }}
                      >
                        <MapLocationIcon iconColor="black" />
                        <Text
                          style={[
                            styles.ParagraphTextStyle,
                            { paddingLeft: 10 },
                          ]}
                        >
                          {this.props.Completejobcountry}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{ flexDirection: "row", flex: 1, marginTop: 5 }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.5,
                        }}
                      >
                        <DollarsIcon iconColor="#cf061e" />
                        {this.props.Completejobrate === "" ? (
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
                              html={this.props.Completejobhourlyhours}
                            />
                            <Text style={styles.ParagraphTextStyle}>
                              {CONSTANT.HomeCompleteJobLayoutRate}{" "}
                            </Text>
                            <Text style={styles.ParagraphTextStyle}>
                              {this.props.Completejobestimatedhours}{" "}
                            </Text>
                            <Text style={styles.ParagraphTextStyle}>
                              {CONSTANT.HomeCompleteJobLayoutHours}
                            </Text>
                          </View>
                        ) : (
                          <View style={{ paddingLeft: 10 }}>
                            <HTML
                              baseFontStyle={styles.ParagraphTextStyle}
                              html={this.props.Completejobrate}
                            />
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.5,
                        }}
                      >
                        <CalendarIcon />
                        <Text
                          style={[
                            styles.ParagraphTextStyle,
                            { paddingLeft: 10 },
                          ]}
                        >
                          {this.props.Completejobduration}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 0.2 }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={this.UpdateFav}
                    style={{
                      backgroundColor: "#fcc2d1",
                      height: 30,
                      width: 30,
                      borderColor: "gray",
                      borderRadius: 15,
                      justifyContent: "center",
                      marginBottom: 5,
                    }}
                  >
                    <AntIcon
                      name="heart"
                      color={this.state.iconColor}
                      size={17}
                      style={styles.FreelancerCategoryIconStyle}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ViewOverflow>
          </View>
        ) : (
          <View style={[styles.section, { paddingRight: 0 }]}>
            <ViewOverflow
              style={[
                styles.CompleteJobLayoutmainStyle2,
                styles.Elevation,
                { margin: 7 },
              ]}
            >
              {this.props.featuredCompleteJobColor != "" ? (
                <View
                  style={{
                    width: 0,
                    height: 0,
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderRightWidth: 25,
                    borderTopWidth: 25,
                    borderTopLeftRadius: 4,
                    borderRightColor: "transparent",
                    borderTopColor: this.props.featuredCompleteJobColor,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 0,
                    height: 0,
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderRightWidth: 25,
                    borderTopWidth: 25,
                    borderTopLeftRadius: 4,
                    borderRightColor: "transparent",
                    borderTopColor: "#fff",
                  }}
                />
              )}
              <View
                style={[
                  styles.CompleteJobLayoutshadow,
                  { flex: 1, flexDirection: "row" },
                ]}
              >
                <View style={{ width: "90%" }}>
                  <Text numberOfLines={1} style={styles.NameTextStyle}>
                    {this.props.Completejobname}
                  </Text>
                  <Text style={styles.SectionHeadingTextStyle}>
                    {this.props.Completejobtitle}
                  </Text>
                  <View style={{ marginTop: 15 }}>
                    <View
                      style={{ flexDirection: "row", flex: 1, marginTop: 5 }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.5,
                        }}
                      >
                        <SignalIcon iconColor="black" />
                        <Text
                          style={[
                            styles.ParagraphTextStyle,
                            { paddingLeft: 10 },
                          ]}
                        >
                          {this.props.Completejoblevel}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.4,
                        }}
                      >
                        <MapLocationIcon iconColor="black" />
                        <Text
                          style={[
                            styles.ParagraphTextStyle,
                            { paddingLeft: 10 },
                          ]}
                        >
                          {this.props.Completejobcountry}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{ flexDirection: "row", flex: 1, marginTop: 5 }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.5,
                        }}
                      >
                        <DollarsIcon iconColor="#cf061e" />
                        {this.props.Completejobrate === "" ? (
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
                              html={this.props.Completejobhourlyhours}
                            />
                            <Text style={styles.ParagraphTextStyle}>
                              {CONSTANT.HomeCompleteJobLayoutRate}{" "}
                            </Text>
                            <Text style={styles.ParagraphTextStyle}>
                              {this.props.Completejobestimatedhours}{" "}
                            </Text>
                            <Text style={styles.ParagraphTextStyle}>
                              {CONSTANT.HomeCompleteJobLayoutHours}
                            </Text>
                          </View>
                        ) : (
                          <View style={{ paddingLeft: 10 }}>
                            <HTML
                              baseFontStyle={styles.ParagraphTextStyle}
                              html={this.props.Completejobrate}
                            />
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 0.5,
                        }}
                      >
                        <CalendarIcon />
                        <Text
                          style={[
                            styles.ParagraphTextStyle,
                            { paddingLeft: 10 },
                          ]}
                        >
                          {this.props.Completejobduration}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ width: "10%" }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={this.UpdateFav}
                    style={{
                      backgroundColor: "#fcc2d1",
                      height: 30,
                      width: 30,
                      borderColor: "gray",
                      borderRadius: 15,
                      justifyContent: "center",
                      marginBottom: 5,
                    }}
                  >
                    <AntIcon
                      name="heart"
                      color={this.state.iconColor}
                      size={17}
                      style={styles.FreelancerCategoryIconStyle}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ViewOverflow>
          </View>
        )}
      </View>
    );
  }
}
export default CompleteJobLayout;
