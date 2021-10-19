import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
class EmployerLayout extends Component {
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
  render() {
    const { showAlert, storedType, iconColor, isLoading } = this.state;
    var fav_color = this.props.Fav_Color;
    return (
      <View style={styles.section}>
        <View
          style={[
            styles.EmployerLayoutMainArea,
            styles.Elevation,
            { margin: 5 },
          ]}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 0.2, margin: 10 }}>
              <Image
                style={styles.EmployerLayoutImgStyle}
                source={{ uri: `${this.props.companyProfileImage}` }}
              />
            </View>
            <View style={{ flex: 0.65, margin: 10 }}>
              <Text style={[styles.NameTextStyle, { paddingBottom: 2 }]}>
                {this.props.companyName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View style={styles.OpenLinkBtnStyle}>
                  <Text
                    style={[
                      styles.OtherTextStyle,
                      { color: CONSTANT.TextColorDark },
                    ]}
                  >
                    {CONSTANT.EmployersOpenJobs}
                  </Text>
                </View>
                <View style={styles.OpenLinkBtnStyle}>
                  <Text
                    style={[
                      styles.OtherTextStyle,
                      { color: CONSTANT.TextColorDark },
                    ]}
                  >
                    {CONSTANT.EmployersFullProfile}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.HeartIconContainer}>
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
                  style={styles.EmployerLayoutIconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default EmployerLayout;
