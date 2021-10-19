import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  AsyncStorage,
  NativeModules,
  TextInput,
  BackHandler,
  Alert,
  Modal,
  ActivityIndicator
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import RNRestart from 'react-native-restart';
import { CalloutSubview } from "react-native-maps";
import axios from "axios";
import home from "../Home/home";
import CustomHeader from "../Header/CustomHeader";
import { Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as CONSTANT from '../Constants/Constant';
class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
  }
  RestPassword = () => {
    const { username } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (username == "") {
      this.setState({ email: "Please enter Email address" });
    } else if (reg.test(username) === false) {
      this.setState({ email: "Email is Not Correct" });
      return false;
    } else {
      axios
        .post(
          CONSTANT.BaseUrl + "user/forgot_password",
          {
            email: username,
          }
        )
        .then(async response => {
          if (response.status == 200) {
            Alert.alert(response.data.message);
          } else if (response.status == 203) {
            Alert.alert(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    Keyboard.dismiss();
  };
  render() {
    const {params} = this.props.navigation.state;
    return (
      <View style={{ flex: 1 }}>

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
            elevation: 10
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
              justifyContent: "center"
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
              justifyContent: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignSelf: "center"
              }}
            >
              <Text numberOfLines={1}
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: "#fff",
                  height: 30,
                  marginTop: 9
                }}
              >
                {CONSTANT.ForgetHeader}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={{ padding: 10, margin: 10, color: "red" }}>

          </Text>
          <Image
            style={{ width: 150, resizeMode: "center", alignSelf: "center" }}
            source={require("../Images/logologin.png")}
          />
          <Text
            style={{
              textAlign: "center",
              alignSelf: "center",
              color: "#807f7f"
            }}
          >
            {CONSTANT.Forgetmain}
          </Text>
          <View
            style={{
              width: "90%",
              borderWidth: 0.6, borderRadius: 4, margin: 10, borderColor: '#dddddd'
            }}
          >
            <TextInput
              style={{ fontSize: 15, padding: 5, height: 40 }}
              underlineColorAndroid="transparent"
              name="username"
              placeholder={CONSTANT.ForgetEmail}
              placeholderTextColor="#807f7f"
              onChangeText={username => this.setState({ username })}
            />
          </View>

          <TouchableOpacity
            onPress={this.RestPassword}
            style={{
              alignItems: "center",
              height: 40,
              margin: 10,
              borderRadius: 4,
              width: "50%",
              alignSelf: "center",
              backgroundColor: CONSTANT.primaryColor
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#fff",
                paddingTop: 10
              }}
            >
              {CONSTANT.ForgetButton}
            </Text>
          </TouchableOpacity>
        </View>

        {params.RegistrationOption != 'disable' &&
          <View style={{ height: 55 }}>
            <Text
              onPress={() => this.props.navigation.navigate("Signup")}
              style={{
                textAlign: "center",
                alignSelf: "center",
                justifyContent: "center",
                color: "#000",
                fontSize: 18,
                margin: 15
              }}
            >
              {CONSTANT.ForgetMoveSignup}
            </Text>
          </View>
        }
      </View>
    );
  }
}
export default ForgetPassword;
const styles = StyleSheet.create({
  container: {
    height: "77%",
    marginBottom: 55,
    justifyContent: "center",
    alignItems: "center"
  }
});
