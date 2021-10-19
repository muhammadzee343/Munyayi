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
  ActivityIndicator,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import RNRestart from "react-native-restart";
import { CalloutSubview } from "react-native-maps";
import axios from "axios";
import home from "../Home/home";
import CustomHeader from "../Header/CustomHeader";
import { Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as CONSTANT from "../Constants/Constant";
import SimpleHeader from "../Header/SimpleHeader";
import SquareTextInput from "../Components/CustomSquareTextInput";
import MessageBoxIcon from "../Assets/Icons/MessageBox";
import PasswordLockIcon from "../Assets/Icons/PasswordLockIcon";
import SquareButton from "../Components/SquareButton";
class LoginScreen extends Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isProgress: false,
      showPass: true,
    };
  }
  openProgressbar = () => {
    this.setState({ isProgress: true });
  };
  login = () => {
    const { username, password } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (username == "") {
      //alert("Please enter Email address");
      this.setState({ email: "Please enter Email address" });
    } else if (reg.test(username) === false) {
      //alert("Email is Not Correct");
      this.setState({ email: "Email is Not Correct" });
      return false;
    } else if (password == "") {
      this.setState({ email: "Please enter password" });
    } else {
      this.openProgressbar();
      axios
        .post(CONSTANT.BaseUrl + "user/do_login", {
          username: username,
          password: password,
        })
        .then(async (response) => {
          if (response.data.type == "success") {
            await AsyncStorage.setItem(
              "full_name",
              response.data.profile.pmeta.full_name
            );
            await AsyncStorage.setItem(
              "user_type",
              response.data.profile.pmeta.user_type
            );
            await AsyncStorage.setItem(
              "profile_img",
              response.data.profile.pmeta.profile_img
            );
            await AsyncStorage.setItem(
              "listing_type",
              response.data.profile.umeta.listing_type
            );
            await AsyncStorage.setItem(
              "profileBanner",
              response.data.profile.pmeta.banner_img
            );
            await AsyncStorage.setItem("profileType", response.data.type);
            await AsyncStorage.setItem(
              "projectUid",
              response.data.profile.umeta.id
            );
            await AsyncStorage.setItem(
              "projectProfileId",
              JSON.stringify(response.data.profile.umeta.profile_id)
            );
            await AsyncStorage.setItem(
              "chatPermission",
              response.data.profile.umeta.chat_permission
            );
            await AsyncStorage.setItem(
              "shipping_address1",
              response.data.profile.shipping.address_1
            );
            await AsyncStorage.setItem(
              "shipping_city",
              response.data.profile.shipping.city
            );
            await AsyncStorage.setItem(
              "shipping_company",
              response.data.profile.shipping.company
            );
            await AsyncStorage.setItem(
              "shipping_country",
              response.data.profile.shipping.country
            );
            await AsyncStorage.setItem(
              "shipping_first_name",
              response.data.profile.shipping.first_name
            );
            await AsyncStorage.setItem(
              "shipping_last_name",
              response.data.profile.shipping.last_name
            );
            await AsyncStorage.setItem(
              "shipping_state",
              response.data.profile.shipping.state
            );
            await AsyncStorage.setItem(
              "billing_address_1",
              response.data.profile.billing.address_1
            );
            await AsyncStorage.setItem(
              "billing_city",
              response.data.profile.billing.city
            );
            await AsyncStorage.setItem(
              "billing_company",
              response.data.profile.billing.company
            );
            await AsyncStorage.setItem(
              "billing_country",
              response.data.profile.billing.country
            );
            await AsyncStorage.setItem(
              "billing_first_name",
              response.data.profile.billing.first_name
            );
            await AsyncStorage.setItem(
              "billing_last_name",
              response.data.profile.billing.last_name
            );
            await AsyncStorage.setItem(
              "billing_email",
              response.data.profile.billing.email
            );
            await AsyncStorage.setItem(
              "billing_phone",
              response.data.profile.billing.phone
            );
            await AsyncStorage.setItem(
              "billing_state",
              response.data.profile.billing.state
            );
            await AsyncStorage.setItem(
              "user_email",
              response.data.profile.umeta.user_email
            );
            await AsyncStorage.setItem(
              "peojectJobAccess",
              response.data.profile.umeta.job_access
            );
            await AsyncStorage.setItem(
              "projectServiceAccess",
              response.data.profile.umeta.service_access
            );
            this.setState({ isProgress: false });
            RNRestart.Restart();
          } else if (response.data.type == "error") {
            this.setState({ isProgress: false });
            alert("Please Check Your Email / Password or Check Network ");
          }
        })
        .catch((error) => {
          this.setState({ isProgress: false });
          console.log(error);
        });
    }
    Keyboard.dismiss();
  };
  onButtonPress = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    // then navigate
    navigate("NewScreen");
  };
  handleBackButton = () => {
    Alert.alert(
      "Exit App",
      "Exiting the application?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    );
    return true;
  };
  onChangeUsername = (value) => {
    this.setState({
      username: value,
    });
  };
  onChangePassword = (value) => {
    this.setState({
      password: value,
    });
  };
  render() {
    const { params } = this.props.navigation.state;
    return this.state.isProgress ? (
      <CustomProgressBar />
    ) : (
      <View style={{ flex: 1 }}>
        <SimpleHeader HeaderText={CONSTANT.LoginHeader} />
        <View style={styles.container}>
          <Text style={{ margin: 10, color: "red" }}>{this.state.email}</Text>
          <Image
            resizeMode={"contain"}
            style={{ width: 110, alignSelf: "center" }}
            source={require("../Images/logologin.png")}
          />
          <Text
            style={{
              textAlign: "center",
              alignSelf: "center",
              color: CONSTANT.blackColor,
              fontSize: 23,
            }}
          >
            {CONSTANT.Loginmain}
          </Text>

          <SquareTextInput
            placeHolder="Email"
            leftIcon={<MessageBoxIcon iconColor="#29AAE1" />}
            value={this.state.username}
            onChangeText={this.onChangeUsername}
          />
          <SquareTextInput
            placeHolder="Password"
            leftIcon={<PasswordLockIcon iconColor="#29AAE1" />}
            value={this.state.password}
            onChangeText={this.onChangePassword}
          />

          <Text
            onPress={() =>
              this.props.navigation.navigate("ForgetPassword", {
                RegistrationOption: params.RegistrationOption,
              })
            }
            style={{
              textAlign: "center",
              alignSelf: "center",
              color: "#616161",
              fontSize: 15,
              margin: 10,
            }}
          >
            {CONSTANT.LoginForget}
          </Text>
          <SquareButton
            title={CONSTANT.LoginButton}
            onPress={this.login}
            // iconName={<HeartIcon iconColor="#fff" />}
            width="80%"
            type="primary"
          />
        </View>

        {params.RegistrationOption != "disable" && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              this.props.navigation.navigate("Signup", {
                LoginSignupType: params.LoginSignupType,
                DefaultRole: params.DefaultRole,
                RemoveUsername: params.RemoveUsername,
                HideLoaction: params.HideLoaction,
                TermText: params.TermText,
                TermPageLink: params.TermPageLink,
                RemoveRegistration: params.RemoveRegistration,
                PhoneOptionReg: params.PhoneOptionReg,
                PhoneMandatory: params.PhoneMandatory,
              })
            }
            style={{
              backgroundColor: CONSTANT.primaryColor,
              height: 45,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 17,
              }}
            >
              {CONSTANT.LoginMoveSignup}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
const CustomProgressBar = ({ visible }) => (
  <Modal onRequestClose={() => null} visible={visible}>
    <View
      style={{
        flex: 1,
        backgroundColor: "#dcdcdc",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <View
        style={{
          borderRadius: 10,
          backgroundColor: "white",
          padding: 25,
          position: "absolute",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "200" }}>
          {CONSTANT.Loading}
        </Text>
        <ActivityIndicator size="large" color={CONSTANT.primaryColor} />
      </View>
    </View>
  </Modal>
);
export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
