import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  AsyncStorage,
  FlatList
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import axios from "axios";
import ViewOverflow from "react-native-view-overflow";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from "../Constants/Constant";
import ViewProposals from "./ViewProposals";
import styles from "../Constants/Styles";
import HTML from "react-native-render-html";
import { withNavigation } from "react-navigation";
class PostedJobsCard extends Component {
  state = {
    default_color_badge: "",
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    iconColor: "#dddddd",
    showAlert: false,
    isLoading: false
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
        type: "_saved_projects"
      })
      .then(async response => {
        if (response.status == "200") {
          this.setState({
            iconColor: CONSTANT.primaryColor,
            isLoading: false
          });
          alert("Favorite Updated Successfully");
        } else if (response.status == "203") {
          alert("Cannot update favorite/ Network Error");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };
  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };
  render() {
    const { showAlert, storedType, iconColor, isLoading } = this.state;
    var fav_color = this.props.Fav_Color;
    return (
      <View style={{ marginTop: 15 }}>
        {this.props.featuredCompleteJobColor != "" ? (
          <View style={[styles.section, { paddingRight: 0 }]}>
            <ViewOverflow
              style={[styles.CompleteJobLayoutmainStyle, styles.Elevation]}
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
                    borderTopColor: this.props.featuredCompleteJobColor
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
                    borderTopColor: "#fff"
                  }}
                />
              )}
              <Image
                style={styles.CompleteJobLayoutFeaturedImgStyle}
                source={this.props.imageUriCompleteJobfeatured}
              />
              <View style={styles.CompleteJobLayoutshadow}>
                <View>
                  <Text numberOfLines={1} style={styles.NameTextStyle}>
                    {this.props.Completejobname}
                  </Text>
                </View>
                <View>
                  <Text style={styles.SectionHeadingTextStyle}>
                    {this.props.Completejobtitle}
                  </Text>
                </View>
                <View style={styles.CompleteJobLayoutInfoArea}>
                  <Text
                    style={[
                      styles.ParagraphTextStyle,
                      { color: "#00cc8d", width: 13, textAlign: "center" }
                    ]}
                  >
                    $
                  </Text>
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.Completejoblevel}
                  </Text>
                </View>
                <View style={styles.CompleteJobLayoutInfoArea}>
                  <Image
                    style={styles.CompleteJobLayoutFlagImgStyle}
                    source={this.props.jobflagimageUri}
                  />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.Completejobcountry}
                  </Text>
                </View>
                <View style={styles.CompleteJobLayoutInfoArea}>
                  <AntIcon name="folder1" color={"#3498db"} size={13} />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.type}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 40,
                  flexDirection: "row",
                  borderTopColor: "#ddd",
                  borderTopWidth: 0.5,
                  backgroundColor: "#fff"
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "50%",
                    borderRightWidth: 0.5,
                    borderRightColor: "#ddd"
                  }}
                >
                  <Text
                    style={{
                      color: "#323232",
                      alignSelf: "center",
                      fontSize: 12,
                      top: 12
                    }}
                  >
                    {CONSTANT.Edit}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ViewProposals", {
                      my_id: this.props.fav_job_user_id,
                      title: this.props.Completejobtitle,
                      employer_name: this.props.Completejobname,
                      project_type: this.props.type,
                      project_level: this.props.Completejoblevel,
                      location_name: this.props.Completejobcountry,
                    })
                  }
                  style={{
                    width: "50%",
                    flexDirection: "column",
                    alignContent: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "#323232",
                      fontSize: 10,
                      marginRight: 5
                    }}
                  >
                    {this.props.count == "1"
                      ? this.props.count + CONSTANT.PostedJobsCardProposal
                      : this.props.count + CONSTANT.PostedJobsCardProposals}
                  </Text>
                  {this.props.freelancerImages.length >= 1 && (
                    <FlatList
                      horizontal
                      data={this.props.freelancerImages}
                      keyExtractor={(a, b) => b.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={{
                            alignItems: "center",
                            alignSelf: "center",
                            backgroundColor: "transparent"
                          }}
                          activeOpacity={0.9}
                        >
                          <Image
                            style={{
                              height: 18,
                              width: 18,
                              borderRadius: 9,
                              backgroundColor: "transparent",
                              borderColor: "#000",
                              borderWidth: 0.6
                            }}
                            source={{ uri: item.url }}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </ViewOverflow>
          </View>
        ) : (
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
                    borderTopColor: this.props.featuredCompleteJobColor
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
                    borderTopColor: "#fff"
                  }}
                />
              )}
              <Image
                style={styles.CompleteJobLayoutFeaturedImgStyle}
                source={this.props.imageUriCompleteJobfeatured}
              />

              <View style={styles.CompleteJobLayoutshadow}>
                <View>
                  <Text numberOfLines={1} style={styles.NameTextStyle}>
                    {this.props.Completejobname}
                  </Text>
                </View>
                <View style={styles.CompleteJobLayoutInfoArea}>
                  <Text style={styles.SectionHeadingTextStyle}>
                    {this.props.Completejobtitle}
                  </Text>
                </View>
                <View style={styles.CompleteJobLayoutInfoArea}>
                  <Text
                    style={[
                      styles.ParagraphTextStyle,
                      { color: "#00cc8d", width: 13, textAlign: "center" }
                    ]}
                  >
                    $
                  </Text>
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.Completejoblevel}
                  </Text>
                </View>
                <View style={styles.CompleteJobLayoutInfoArea}>
                  <Image
                    style={styles.CompleteJobLayoutFlagImgStyle}
                    source={this.props.jobflagimageUri}
                  />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.Completejobcountry}
                  </Text>
                </View>
                <View style={styles.CompleteJobLayoutInfoArea}>
                  <AntIcon name="folder1" color={"#3498db"} size={13} />
                  <Text
                    style={[styles.ParagraphTextStyle, { paddingLeft: 10 }]}
                  >
                    {this.props.type}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 40,
                  flexDirection: "row",
                  borderTopColor: "#ddd",
                  borderTopWidth: 0.5,
                  backgroundColor: "#fff"
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "50%",
                    borderRightWidth: 0.5,
                    borderRightColor: "#ddd"
                  }}
                >
                  <Text
                    style={{
                      color: "#323232",
                      alignSelf: "center",
                      fontSize: 12,
                      top: 12
                    }}
                  >
                    {CONSTANT.Edit}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ViewProposals" , 
                    {my_id: this.props.fav_job_user_id,
                      title: this.props.Completejobtitle,
                      employer_name: this.props.Completejobname,
                      project_type: this.props.type,
                      project_level: this.props.Completejoblevel,
                      location_name: this.props.Completejobcountry,})
                  }
                  style={{
                    width: "50%",
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "#323232",
                      fontSize: 10,
                      marginRight: 5
                    }}
                  >
                    {this.props.count == "1"
                      ? this.props.count + CONSTANT.PostedJobsCardProposal
                      : this.props.count + CONSTANT.PostedJobsCardProposals}
                  </Text>
                  {this.props.freelancerImages.length >= 1 && (
                    <FlatList
                      horizontal
                      data={this.props.freelancerImages}
                      keyExtractor={(a, b) => b.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={{
                            alignItems: "center",
                            alignSelf: "center",
                            backgroundColor: "transparent"
                          }}
                          activeOpacity={0.9}
                        >
                          <Image
                            style={{
                              height: 18,
                              width: 18,
                              borderRadius: 9,
                              backgroundColor: "transparent",
                              borderColor: "#000",
                              borderWidth: 0.6
                            }}
                            source={{ uri: item.url }}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </ViewOverflow>
          </View>
        )}
      </View>
    );
  }
}
export default withNavigation(PostedJobsCard);
