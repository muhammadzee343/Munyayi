import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import AntIcon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import ViewOverflow from "react-native-view-overflow";
import { ThemeConsumer } from "react-native-elements";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
class FreelancerCategory extends Component {
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
    // console.log("freelancer", this.props.itemData);
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
    var user_id = this.props.fav_user_id;
    const fav_id = await AsyncStorage.getItem("projectUid");
    axios
      .post(CONSTANT.BaseUrl + "user/favorite", {
        id: fav_id,
        favorite_id: user_id,
        type: "_saved_freelancers",
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
      <View style={{ marginLeft: 10 }}>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        {this.props.featuredColor != "" ? (
          <View style={[styles.section, { paddingRight: 0 }]}>
            <ViewOverflow
              horizontal={true}
              style={[styles.FreelancerCategoryshadow, { borderRadius: 20 }]}
            >
              {this.props.featuredColor != "" ? (
                <View
                  style={{
                    overflow: "visible",
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderRightWidth: 25,
                    borderTopWidth: 25,
                    borderTopLeftRadius: 4,
                    borderRightColor: "transparent",
                    borderTopColor: this.props.featuredColor,
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
              <Image
                style={styles.FreelancerCategoryFeaturedImgStyle}
                source={{ uri: `${this.props.imageUrifeatured}` }}
              />
              <Image
                style={styles.FreelancerCategoryImageStyle}
                source={{ uri: `${this.props.imageUrifreelancer}` }}
              />
              <View style={styles.FreelancerCategoryviewStyle}>
                <Text style={styles.NameTextStyle}>
                  {this.props.freelancername}
                </Text>
                {this.props.title != "" && (
                  <Text
                    numberOfLines={1}
                    style={styles.SectionHeadingTextStyle}
                  >
                    {this.props.title}
                  </Text>
                )}
                <View
                  horizontal={true}
                  style={{ flexDirection: "row", marginTop: 2 }}
                >
                  {this.props.rate != "" ? (
                    <Text style={styles.OtherTextStyle}>{this.props.rate}</Text>
                  ) : (
                    <Text style={styles.OtherTextStyle}>
                      {CONSTANT.DetailFreelancerNoPriceYet}
                    </Text>
                  )}
                  <Image
                    style={styles.FreelancerCategoryFlagImgStyle}
                    source={this.props.flagimageUri}
                  />
                  <Text style={styles.OtherTextStyle}>
                    {this.props.country}
                  </Text>
                </View>
              </View>
              <View style={styles.FreelancerCategoryIconArea}>
                {storedType != "" ? (
                  <View>
                    {fav_color == "yes" ? (
                      <AntIcon
                        name="heart"
                        color={CONSTANT.primaryColor}
                        size={17}
                        style={styles.FreelancerCategoryIconStyle}
                      />
                    ) : (
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
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      Alert.alert(CONSTANT.AwesomeAlertMessage4);
                    }}
                    // style={{
                    //   borderColor: "transparent",
                    //   height: 35,
                    //   width: 35,
                    //   borderRadius: 17,
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    //   backgroundColor: "#f4dff7",
                    // }}
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
                      color={"#dddddd"}
                      size={17}
                      style={styles.FreelancerCategoryIconStyle}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </ViewOverflow>
          </View>
        ) : (
          <View style={[styles.section, { paddingRight: 0 }]}>
            <ViewOverflow
              horizontal={true}
              style={[styles.FreelancerCategoryshadow2, { borderRadius: 20 }]}
            >
              {this.props.featuredColor != "" ? (
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
                    borderTopColor: this.props.featuredColor,
                  }}
                />
              ) : (
                <View
                  style={{
                    overflow: "visible",
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderRightWidth: 13,
                    borderTopWidth: 13,
                    borderTopLeftRadius: 4,
                    borderRightColor: "transparent",
                    borderTopColor: "#fff",
                  }}
                />
              )}
              {/* here */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View style={{ flex: 0.8 }}>
                    <Text style={styles.NameTextStyle}>
                      {this.props.freelancername}
                    </Text>
                    {this.props.title ? (
                      <Text
                        numberOfLines={1}
                        style={styles.SectionHeadingTextStyle}
                      >
                        {this.props.title}
                      </Text>
                    ) : (
                      <Text></Text>
                    )}
                    <Text style={styles.OtherTextStyle}>
                      {this.props.country}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2 }}>
                    <Image
                      style={styles.FreelancerCategoryImageStyle}
                      source={{ uri: `${this.props.imageUrifreelancer}` }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                  <View style={{ flex: 0.85 }}>
                    {this.props.rate != "" ? (
                      <Text style={styles.OtherTextStyle}>
                        {this.props.rate}
                      </Text>
                    ) : (
                      <Text style={styles.OtherTextStyle}>
                        {CONSTANT.DetailFreelancerNoPriceYet}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 0.1 }}>
                    {storedType != "" ? (
                      <View>
                        {fav_color == "yes" ? (
                          <AntIcon
                            name="heart"
                            color={CONSTANT.primaryColor}
                            size={17}
                            style={styles.FreelancerCategoryIconStyle}
                          />
                        ) : (
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
                        )}
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          Alert.alert(CONSTANT.AwesomeAlertMessage4);
                        }}
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
                          color={"#dddddd"}
                          size={17}
                          style={styles.FreelancerCategoryIconStyle}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </ViewOverflow>
          </View>
        )}
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
export default FreelancerCategory;
