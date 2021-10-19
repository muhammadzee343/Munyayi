import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  AsyncStorage,
  ART,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import * as CONSTANT from "../Constants/Constant";
class PreLoader extends Component {
  state = {
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    showAlert: false,
  };
  componentDidMount() {
    setTimeout(() => {
      this._checkUserLoginStatus();
    }, 1000);
  }
  _checkUserLoginStatus = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const type = await AsyncStorage.getItem("profileType");
      console.log(storedValue, storedType, profileImg, type);
      if (storedValue != null) {
        this.props.navigation.navigate("Home");
      } else {
        this.props.navigation.navigate("Welcome");
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
    } catch (error) {
      // Error saving data
      // alert(error)
      console.log(error);
      this.props.navigation.navigate("LoginScreen");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "android" ? (
          <StatusBar
            backgroundColor={CONSTANT.statusBarColor}
            barStyle="light-content"
          />
        ) : (
          <StatusBar hidden />
        )}
        <Image
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
          source={require("../Images/splashbackground.png")}
        />
      </View>
    );
  }
}
export default PreLoader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
