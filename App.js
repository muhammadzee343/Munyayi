import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  navigationOptions,
  CONST,
  TouchableOpacity,
  NativeModules,
  Alert,
  StatusBar,
  Button,
  SafeAreaView,
  ScrollView,
  Easing,
  Animated,
  Image,
  Dimensions,
  Platform,
  ImageBackground,
  KeyboardAvoidingView,
  ActivityIndicator,
  Share,
  Linking,
} from "react-native";
import {
  createSwitchNavigator,
  createAppContainer,
  DrawerItems,
} from "react-navigation";
import Swiper from "react-native-web-swiper";
import NetInfo from "@react-native-community/netinfo";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { NavigationEvents } from "react-navigation";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntIcon from "react-native-vector-icons/AntDesign";
import RNRestart from "react-native-restart";
import axios from "axios";
import home from "./src/Home/home";
import EmployerLayout from "./src/Home/EmployerLayout";
import Employers from "./src/CompleteEmployers/Employers";
import Octicons from "react-native-vector-icons/Octicons";
import Jobs from "./src/CompleteJobs/Jobs";
import Freelancers from "./src/CompleteFreelancers/Freelancers";
import ProfileTabs from "./src/ProfileSetting/ProfileTabs";
import Profile from "./src/ProfileSetting/Profile";
import DetailFreelancerScreen from "./src/DetailFreelancer/DetailFreelancerScreen";
import DetailJobScreen from "./src/DetailJobs/DetailJobScreen";
import DetailCompanyScreen from "./src/DetailCompany/DetailCompanyScreen";
import DetailServiceScreen from "./src/DetailServices/DetailServiceScreen";
import SearchScreen from "./src/DetailSearch/SearchScreen";
import CustomHeader from "./src/Header/CustomHeader";
import LoginScreen from "./src/Login/LoginScreen";
import PostJob from "./src/CompleteEmployers/PostJob";
import PostService from "./src/CompleteServices/PostService";
import SendOffer from "./src/DetailFreelancer/SendOffer";
import PreLoader from "./src/PreLoader/PreLoader";
import Favorite from "./src/Favorite/Favorite";
import SendProposal from "./src/DetailJobs/SendProposal";
import SearchResultFreelancer from "./src/DetailSearch/SearchResultFreelancer";
import SearchResultEmployer from "./src/DetailSearch/SearchResultEmployer";
import SearchResultJob from "./src/DetailSearch/SearchResultJob";
import SearchResultService from "./src/DetailSearch/SearchResultService";
import Signup from "./src/Login/Signup";
import VerificationAccount from "./src/Login/VerificationAccount";
import ForgetPassword from "./src/Login/ForgetPassword";
import JobbyCategorylist from "./src/Home/JobbyCategorylist";
import SendReport from "./src/DetailJobs/SendReport";
import BuyServiceScreen from "./src/DetailServices/BuyServiceScreen";
import BuyServiceWebview from "./src/DetailServices/BuyServiceWebview";
import MessagesList from "./src/Messages/MessagesList";
import MessageSingleListCard from "./src/Messages/MessageSigleListCard";
import DetailMessageScreen from "./src/Messages/DetailMessageScreen";
import DetailOngoing from "./src/Dashboard/DetailOngoing";
import SocketChat from "./src/Messages/SocketChat";
import Insight from "./src/Dashboard/Insight";
import Invoices from "./src/Dashboard/Invoices";
import InvoiceDetailPage from "./src/Dashboard/InvoiceDetailPage";
import Disputes from "./src/Dashboard/Disputes";
import Insightstar from "./src/Dashboard/Insightstar";
import Packages from "./src/Dashboard/Packages";
import LatestProposals from "./src/ManageFreelancerProjects/LatestProposals";
import PostedServices from "./src/ManageServices/PostedServices";
import CompletedServices from "./src/ManageServices/CompletedServices";
import CompleteServicesDetail from "./src/ManageServices/CompleteServicesDetail";
import OngoingServices from "./src/ManageServices/OngoingServices";
import OngoingServicesDetail from "./src/ManageServices/OngoingServicesDetail";
import AddonsServices from "./src/ManageServices/AddonsServices";
import CancelledServices from "./src/ManageServices/CancelledServices";
import OngoingJobs from "./src/ManageJobs/OngoingJobs";
import CompletedJobs from "./src/ManageJobs/CompletedJobs";
import CancelledJobs from "./src/ManageJobs/CancelledJobs";
import PostedJobs from "./src/ManageJobs/PostedJobs";
import ViewProposals from "./src/ManageJobs/ViewProposals";
import SecuritySettings from "./src/SecuritySetting/SecuritySettings";
import ChangePassword from "./src/SecuritySetting/ChangePassword";
import DeleteAccount from "./src/SecuritySetting/DeleteAccount";
import AccountSecuritySetting from "./src/SecuritySetting/AccountSecuritySetting";
import ManageEmailNotification from "./src/SecuritySetting/ManageEmailNotification";
import PayoutSetting from "./src/PayoutSettings/PayoutSetting";
import HireSetMilestone from "./src/ManageJobs/HireSetMilestone";
import ManageMilestones from "./src/ManageJobs/ManageMilestones";
import AddPortfolio from "./src/ManagePortfolios/AddPortfolio";
import PortfolioListings from "./src/ManagePortfolios/PortfolioListings";
import PortfolioDetail from "./src/ManagePortfolios/PortfolioDetail";
import IdentityVerification from "./src/Dashboard/IdentityVerification";
import Notification from "./src/Dashboard/Notification";
import AboutUs from "./src/GeneralPages/AboutUs";
import Contact from "./src/GeneralPages/Contact";
import * as CONSTANT from "./src/Constants/Constant";
import styles from "./src/Constants/Styles";
console.disableYellowBox = true;
let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });
  const scaleY = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });
  return {
    opacity,
    transform: [{ scaleY }],
  };
};
const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene;
      const params = route.params || {}; // <- That's new
      const transition = params.transition || "default"; // <- That's new
      return {
        collapseExpand: CollapseExpand(index, position),
        default: CollapseExpand(index, position, width),
      }[transition];
    },
  };
};
class App extends Component {
  state = {
    data: [],
  };
  constructor() {
    super();
    this.state = {
      connection_Status: "",
    };
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected == true) {
        this.setState({ connection_Status: "Online" });
      } else {
        this.setState({ connection_Status: "Offline" });
      }
    });
  }
  // componentWillUnmount() {
  //   NetInfo.isConnected.removeEventListener(
  //     'connectionChange',
  //     this._handleConnectivityChange,
  //   );
  // }
  // componentWillUnmount() {
  //   NetInfo.isConnected.removeEventListener(
  //     'connectionChange',
  //     this._handleConnectivityChange,
  //   );
  // }
  _handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      this.setState({ connection_Status: "Online" });
    } else {
      this.setState({ connection_Status: "Offline" });
    }
  };
  _handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      this.setState({ connection_Status: "Online" });
    } else {
      this.setState({ connection_Status: "Offline" });
    }
  };
  componentDidMount() {
    this.CheckApplicationAccess();
  }
  CheckApplicationAccess = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_access");
    const json = await response.json();
    this.setState({ data: json });
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.connection_Status === "Offline" ? (
          <View style={{ flex: 1 }}>
            <Image
              style={{
                resizeMode: "contain",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                textAlign: "center",
              }}
              source={require("./src/Images/NoInternet.png")}
            />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <AppContainer />
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    );
  }
}
export default App;

class WelcomeScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        {Platform.OS === "android" ? (
          <StatusBar
            backgroundColor={CONSTANT.statusBarColor}
            barStyle="light-content"
          />
        ) : (
          <StatusBar hidden />
        )}
        <Image
          source={require("./src/Images/wizardbackground.jpg")}
          style={{
            width: "100%",
            height: "100%",
            opacity: 1.0,
            position: "relative",
          }}
        />
        <View
          style={{
            position: "absolute",
            flex: 1,
            left: 0,
            top: "5%",
            height: "100%",
            width: "100%",
            alignSelf: "center",
          }}
        >
          <Text
            onPress={() => this.props.navigation.navigate("Dashboard")}
            style={{
              color: "#29AAE1",
              fontSize: 18,
              alignSelf: "flex-end",
              marginTop: 10,
              marginRight: 10,
            }}
          >
            {CONSTANT.welcomeSkip}
          </Text>
          {/* <Image
            style={{
              width: "100%",
              resizeMode: "contain",
              height: "100%",
              bottom: 0
            }}
            source={require("./src/Images/scrone.png")}
            
          /> */}
          <View
            style={{
              width: "100%",
              resizeMode: "contain",
              height: "80%",
              bottom: 0,
            }}
          >
            <Swiper>
              <View style={[styles.slideContainer]}>
                <Image
                  style={{
                    width: "100%",
                    resizeMode: "contain",
                    height: "80%",
                    bottom: 0,
                  }}
                  source={require("./src/Images/scrone.png")}
                />
              </View>
              <View style={[styles.slideContainer]}>
                <Image
                  style={{
                    width: "100%",
                    resizeMode: "contain",
                    height: "80%",
                    bottom: 0,
                  }}
                  source={require("./src/Images/scrtwo.png")}
                />
              </View>
              <View style={[styles.slideContainer]}>
                <Image
                  style={{
                    width: "100%",
                    resizeMode: "contain",
                    height: "80%",
                    bottom: 0,
                  }}
                  source={require("./src/Images/scrthree.png")}
                />
              </View>
              <View style={[styles.slideContainer]}>
                <Image
                  style={{
                    width: "100%",
                    resizeMode: "contain",
                    height: "80%",
                    bottom: 0,
                  }}
                  source={require("./src/Images/scrfour.png")}
                />
              </View>
            </Swiper>
          </View>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Login", {
                RegistrationOption: "",
                LoginSignupType: "",
                DefaultRole: "",
                RemoveUsername: "",
                HideLoaction: "",
                TermText: "",
                TermPageLink: "",
                RemoveRegistration: "",
                PhoneOptionReg: "",
                PhoneMandatory: "",
              })
            }
            style={{
              alignItems: "center",
              height: 50,
              margin: 10,
              borderRadius: 10,
              width: "80%",
              alignSelf: "center",
              backgroundColor: "#29AAE1",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#fff",
                paddingTop: 10,
              }}
            >
              {CONSTANT.LoginButton}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
class CustomDrawerComponent extends Component {
  state = {
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    permissionChat: "",
    listing_type: "",
    showAlert: false,
    IdentityVerify: "",
    NotificationCount: "",
    themeSettingsPortfolio: "",
    profileImageUrl: "",
    SwitchUserInfo: "",
    themeSettingsSwitchAccount: "",
    isLoading: true,
    spinner: true,
  };
  componentDidMount() {
    this.ApplicationThemeSettings();
    this.CheckApplicationAccess();
    this.CheckIdentityVerify();
    this.CheckNotificationCount();
    this.CheckSwitchUserInfo();
    this.getUser();
    this.getPofileImageData();
  }
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_theme_settings");
    const json = await response.json();
    this.setState({
      themeSettingsPortfolio: json.freelancers_settings.portfolio.gadget,
    });
    console.log(JSON.stringify(this.state.themeSettingsPortfolio));
    this.setState({ themeSettingsSwitchAccount: json.switch_account });
    console.log(JSON.stringify(this.state.themeSettingsSwitchAccount));
    this.setState({
      themeSettingsIdentityVerification: json.identity_verification,
    });
    console.log(JSON.stringify(this.state.themeSettingsIdentityVerification));
    this.setState({
      themeSettingsRegistrationOption: json.registration_option,
      themeSettingsLoginSignupType: json.login_signup_type,
      themeSettingsDefaultRole: json.default_role,
      themeSettingsRemoveUsername: json.remove_username,
      themeSettingsHideLoaction: json.hide_loaction,
      themeSettingsTermText: json.term_text,
      themeSettingsTermPageLink: json.term_page_link,
      themeSettingsRemoveRegistration: json.remove_registration,
      themeSettingsPhoneOptionReg: json.phone_option_reg,
      themeSettingsPhoneMandatory: json.phone_mandatory,
      themeSettingsHidePayoutEmployers:
        json.employers_settings.hide_payout_employers,
    });
  };
  CheckApplicationAccess = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_access");
    const json = await response.json();
    this.setState({
      ApplicationAccessServcie: json.access_type.service_access,
    });
    this.setState({ ApplicationAccessJob: json.access_type.job_access });
  };
  CheckIdentityVerify = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/verification_request?user_id=" + Uid
    );
    const json = await response.json();
    this.setState({ IdentityVerify: json.identity_verified });
    console.log("IdentityVerify", this.state.IdentityVerify);
  };
  CheckNotificationCount = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "user/notification_count?user_id=" + Uid
    );
    const json = await response.json();
    this.setState({ NotificationCount: json.unread_notification_count });
    console.log("NotificationCount", this.state.NotificationCount);
  };
  CheckSwitchUserInfo = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "switch_user/user_info?user_id=" + Uid
    );
    const json = await response.json();
    this.setState({ SwitchUserInfo: json });
    console.log("SwitchUserInfo", this.state.SwitchUserInfo.type);
  };
  getUser = async () => {
    try {
      const permissionChat = await AsyncStorage.getItem("chatPermission");
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const type = await AsyncStorage.getItem("profileType");
      const id = await AsyncStorage.getItem("projectUid");
      const listing_type = await AsyncStorage.getItem("listing_type");

      //  console.log(storedValue ,storedType, profileImg  ,type , id);
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
      if (listing_type !== null) {
        this.setState({ listing_type });
      } else {
        //  alert('something wrong')
      }
      if (permissionChat !== null) {
        this.setState({ permissionChat });
      } else {
        //  alert('something wrong')
      }
    } catch (error) {
      // alert(error)
    }
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
  logout = () => {
    const { id, storedValue, storedType, profileImg, type } = this.state;
    RNRestart.Restart();
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => console.log("success data deleted"));
    this.clearAsyncStorage();

    this.checkAppAccess();
  };
  clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
  canceledLogout = () => {};
  logoutAlert = () => {
    Alert.alert("Confirm", "Are you sure that you want to logout?", [
      { text: "Yes", onPress: () => this.logout() },
      { text: "Cancel", onPress: () => this.canceledLogout },
    ]);
  };
  switchAlert = (user_type) => {
    Alert.alert(
      "Switch Account",
      `Are you sure you want to switch user to ${user_type}?`,
      [
        { text: "Yes", onPress: () => this.Switch() },
        { text: "No", onPress: () => this.canceledSwitch },
      ]
    );
  };
  switchAlert2 = () => {
    Alert.alert("Switch Account", `Are you sure you want to switch user?`, [
      { text: "Yes", onPress: () => this.Switch() },
      { text: "No", onPress: () => this.canceledSwitch },
    ]);
  };
  Switch = async () => {
    //this.setState({ isLoading: true });
    this.setState({ spinner: true });
    const Uid = await AsyncStorage.getItem("projectUid");
    axios
      .post(CONSTANT.BaseUrl + "switch_user/switch_user_account", {
        user_id: Uid,
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
        console.log(error);
      });
  };
  canceledSwitch = () => {};
  checkAppAccess = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_access");
    const json = await response.json();
    this.setState({ data: json });
  };
  getPofileImageData = async () => {
    const id = await AsyncStorage.getItem("projectUid");
    return fetch(CONSTANT.BaseUrl + "profile/get_profile_basic?user_id=" + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          profileImageUrl: responseJson.profile_img,
          //isLoading: false,
          spinner: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  updateAppNotice = () => {
    Alert.alert(
      CONSTANT.AppRateThisApp,
      CONSTANT.AppPleasegiveusFiveStar +
        (Platform.OS == "ios" ? CONSTANT.Appappstore : CONSTANT.Appplaystore) +
        ".",
      [
        {
          text: CONSTANT.AppRateNow,
          onPress: () => {
            if (Platform.OS == "ios") {
              Linking.openURL(CONSTANT.APP_STORE_LINK).catch((err) =>
                console.error("An error occurred", err)
              );
            } else {
              Linking.openURL(CONSTANT.PLAY_STORE_LINK).catch((err) =>
                console.error("An error occurred", err)
              );
            }
          },
        },
      ]
    );
  };
  onClickShare = () => {
    Share.share(
      {
        message: CONSTANT.PLAY_STORE_LINK,
        url: CONSTANT.PLAY_STORE_LINK,
        title: CONSTANT.AppWowdidyouseethat,
      },
      {
        // Android only:
        dialogTitle: CONSTANT.AppShareAppLink,
        // iOS only:
        excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"],
      }
    );
  };
  render() {
    const {
      storedValue,
      storedType,
      profileImg,
      permissionChat,
      showAlert,
      listing_type,
      //isLoading,
      spinner,
    } = this.state;
    console.log("Chat Permission=", permissionChat, storedType);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={this.getUser} />
        <View
          style={{
            height: 150,
            backgroundColor: CONSTANT.primaryColor,
            flexDirection: "row",
          }}
        >
          {storedValue != "" ? (
            <Image
              source={
                this.state.profileImageUrl != ""
                  ? { uri: `${this.state.profileImageUrl}` }
                  : require("./src/Images/no_user.png")
              }
              style={{
                marginLeft: 20,
                marginTop: 65,
                height: 60,
                width: 60,
                borderRadius: 50,
              }}
            />
          ) : (
            <Image
              source={require("./src/Images/guest.png")}
              style={{
                marginLeft: 20,
                marginTop: 65,
                height: 60,
                width: 60,
                borderRadius: 50,
              }}
            />
          )}
          <View
            style={{ marginLeft: 10, marginTop: 75, flexDirection: "column" }}
          >
            {storedValue != "" ? (
              <Text style={{ fontWeight: "500", color: "#fff" }}>
                {storedValue}
              </Text>
            ) : (
              <Text style={{ fontWeight: "500", color: "#fff" }}>
                {CONSTANT.DrawerGuest}
              </Text>
            )}
            {storedType != "" ? (
              <Text style={{ color: "#fff" }}>{storedType}</Text>
            ) : (
              <Text style={{ color: "#fff" }}>{CONSTANT.DrawerGreeting}</Text>
            )}
          </View>
        </View>
        <Spinner visible={spinner} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginLeft: 5 }}>
            <Text
              style={{
                margin: 10,
                fontWeight: "500",
                fontSize: 18,
                color: "#7a7a7a",
              }}
            >
              {CONSTANT.DrawerDashboard}
            </Text>
            {storedType == "" ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Login", {
                    RegistrationOption: this.state
                      .themeSettingsRegistrationOption,
                    LoginSignupType: this.state.themeSettingsLoginSignupType,
                    DefaultRole: this.state.themeSettingsDefaultRole,
                    RemoveUsername: this.state.themeSettingsRemoveUsername,
                    HideLoaction: this.state.themeSettingsHideLoaction,
                    TermText: this.state.themeSettingsTermText,
                    TermPageLink: this.state.themeSettingsTermPageLink,
                    RemoveRegistration: this.state
                      .themeSettingsRemoveRegistration,
                    PhoneOptionReg: this.state.themeSettingsPhoneOptionReg,
                    PhoneMandatory: this.state.themeSettingsPhoneMandatory,
                  })
                }
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="login" size={17} color={"#e67e22"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerLogin}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {this.state.themeSettingsSwitchAccount == "yes" &&
              storedType != "" && (
                <>
                  {this.state.SwitchUserInfo.type != "not_exist" ? (
                    <TouchableOpacity
                      //onPress={() => this.props.navigation.navigate('switchAlert')}
                      onPress={() =>
                        this.switchAlert(this.state.SwitchUserInfo.user_type)
                      }
                    >
                      <View
                        style={{
                          height: 60,
                          backgroundColor: "#fafafa",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={{
                            uri: `${this.state.SwitchUserInfo.profile_img}`,
                          }}
                          style={{
                            marginLeft: 10,
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                          }}
                        />
                        <View
                          style={{ marginLeft: 10, flexDirection: "column" }}
                        >
                          <Text style={{ fontWeight: "300" }}>
                            {this.state.SwitchUserInfo.user_name}
                          </Text>
                          <Text style={{ fontWeight: "300" }}>
                            {this.state.SwitchUserInfo.user_type}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      //onPress={() => this.props.navigation.navigate('Switch Account')}
                      onPress={() => this.switchAlert2()}
                    >
                      <View style={{ flexDirection: "row", margin: 10 }}>
                        <AntIcon name="retweet" size={17} color={"#9b59b6"} />
                        <Text
                          style={{
                            marginLeft: 20,
                            fontSize: 15,
                            color: "#323232",
                            fontWeight: "300",
                          }}
                        >
                          {this.state.SwitchUserInfo.text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              )}

            {storedType != "" ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Insight")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="barschart" size={17} color={"#3498db"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerInsight}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {storedType != "" &&
              this.state.themeSettingsIdentityVerification == "yes" && (
                <TouchableOpacity
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("IdentityVerification")
                  }
                >
                  <View style={{ flexDirection: "row", margin: 10 }}>
                    <AntIcon name="Safety" size={17} color={"blue"} />
                    <Text
                      style={{
                        marginLeft: 20,
                        fontSize: 15,
                        color: "#323232",
                        fontWeight: "300",
                      }}
                    >
                      {CONSTANT.DrawerIdentityVerification}
                    </Text>
                  </View>
                  {this.state.IdentityVerify !== "" && (
                    <View style={{ marginRight: 10 }}>
                      {this.state.IdentityVerify == 0 ? (
                        <AntIcon
                          name="closecircleo"
                          size={20}
                          color={"#ff5851"}
                        />
                      ) : (
                        <AntIcon
                          name="checkcircleo"
                          size={20}
                          color={"#2ecc71"}
                        />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              )}
            {storedType != "" ? (
              <TouchableOpacity
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => this.props.navigation.navigate("Notification")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="bells" size={17} color={"#3498db"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerNotification}
                  </Text>
                </View>
                {this.state.NotificationCount !== "" &&
                  this.state.NotificationCount !== 0 && (
                    <View
                      style={{
                        backgroundColor: CONSTANT.primaryColor,
                        marginRight: 10,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 20,
                        minWidth: 20,
                        paddingHorizontal: 3,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: 10,
                        }}
                      >
                        {this.state.NotificationCount}
                      </Text>
                    </View>
                  )}
              </TouchableOpacity>
            ) : null}
            {storedType != "" && listing_type == "paid" ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Packages")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <Octicons name="package" size={17} color={"#9b59b6"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerPackages}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {storedType != "" ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("SecuritySettings")
                }
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <Octicons name="settings" size={17} color={"#3498db"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerAccountSetting}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {storedType != "" && permissionChat === "allow" ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("MessagesList")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="message1" size={17} color={"#ff5851"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerInbox}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {storedType != "" && this.state.ApplicationAccessJob === "yes" ? (
              <Collapse>
                <CollapseHeader>
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#f7f7f7",
                      alignItems: "center",
                      borderRadius: 5,
                      marginBottom: 5,
                    }}
                  >
                    <AntIcon
                      name="layout"
                      color={"#2ecc71"}
                      size={20}
                      style={{
                        alignSelf: "center",
                        textAlign: "center",
                        marginLeft: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#24355a",
                        paddingLeft: 20,
                        paddingVertical: 20,
                      }}
                    >
                      {CONSTANT.DrawerManageJobs}
                    </Text>
                    <SimpleLineIcons
                      name="arrow-right"
                      color={"#767676"}
                      size={15}
                      style={{
                        alignSelf: "center",
                        position: "absolute",
                        right: 10,
                      }}
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody style={{ paddingHorizontal: 20 }}>
                  {storedType != "" && storedType == "employer" && (
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("PostJob")}
                      style={{
                        marginLeft: 30,
                        borderLeftWidth: 1,
                        borderRadius: 0.5,
                        borderStyle: "dashed",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderLeftColor: "#767676",
                      }}
                    >
                      <Text style={{ color: "#767676" }}>
                        ---- {CONSTANT.DrawerPostJob}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {storedType != "" && storedType == "employer" && (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("PostedJobs")
                      }
                      style={{
                        marginLeft: 30,
                        borderLeftWidth: 1,
                        borderRadius: 0.5,
                        borderStyle: "dashed",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderLeftColor: "#767676",
                      }}
                    >
                      <Text style={{ color: "#767676" }}>
                        ---- {CONSTANT.DrawerPostedJobs}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {storedType != "" && storedType == "freelancer" && (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("LatestProposals")
                      }
                      style={{
                        marginLeft: 30,
                        borderLeftWidth: 1,
                        borderRadius: 0.5,
                        borderStyle: "dashed",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderLeftColor: "#767676",
                      }}
                    >
                      <Text style={{ color: "#767676" }}>
                        ---- {CONSTANT.DrawerProposalJobs}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("OngoingJobs")
                    }
                    style={{
                      marginLeft: 30,
                      borderLeftWidth: 1,
                      borderRadius: 0.5,
                      borderStyle: "dashed",
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderLeftColor: "#767676",
                    }}
                  >
                    <Text style={{ color: "#767676" }}>
                      ---- {CONSTANT.DrawerOngoingJobs}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("CompletedJobs")
                    }
                    style={{
                      marginLeft: 30,
                      borderLeftWidth: 1,
                      borderRadius: 0.5,
                      borderStyle: "dashed",
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderLeftColor: "#767676",
                    }}
                  >
                    <Text style={{ color: "#767676" }}>
                      ---- {CONSTANT.DrawerCompletedJobs}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("CancelledJobs")
                    }
                    style={{
                      marginLeft: 30,
                      borderLeftWidth: 1,
                      borderRadius: 0.5,
                      borderStyle: "dashed",
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderLeftColor: "#767676",
                    }}
                  >
                    <Text style={{ color: "#767676" }}>
                      ---- {CONSTANT.DrawerCancelledJobs}
                    </Text>
                  </TouchableOpacity>
                </CollapseBody>
              </Collapse>
            ) : null}

            {storedType != "" &&
            this.state.ApplicationAccessServcie === "yes" ? (
              <Collapse>
                <CollapseHeader>
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#f7f7f7",
                      borderRadius: 5,
                      marginBottom: 5,
                    }}
                  >
                    <AntIcon
                      name="customerservice"
                      color={"blue"}
                      size={20}
                      style={{
                        alignSelf: "center",
                        textAlign: "center",
                        marginLeft: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#24355a",
                        paddingLeft: 20,
                        paddingVertical: 20,
                      }}
                    >
                      {CONSTANT.DrawerManageServices}
                    </Text>
                    <SimpleLineIcons
                      name="arrow-right"
                      color={"#767676"}
                      size={15}
                      style={{
                        alignSelf: "center",
                        position: "absolute",
                        right: 10,
                      }}
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody style={{ paddingHorizontal: 20 }}>
                  {storedType != "" && storedType == "freelancer" && (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("PostService")
                      }
                      style={{
                        marginLeft: 30,
                        borderLeftWidth: 1,
                        borderRadius: 0.5,
                        borderStyle: "dashed",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderLeftColor: "#767676",
                      }}
                    >
                      <Text style={{ color: "#767676" }}>
                        ---- {CONSTANT.DrawerPostService}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {storedType != "" && storedType == "freelancer" && (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("PostedServices")
                      }
                      style={{
                        marginLeft: 30,
                        borderLeftWidth: 1,
                        borderRadius: 0.5,
                        borderStyle: "dashed",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderLeftColor: "#767676",
                      }}
                    >
                      <Text style={{ color: "#767676" }}>
                        ---- {CONSTANT.DrawerPostedServices}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {storedType != "" && storedType == "freelancer" && (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("AddonsServices")
                      }
                      style={{
                        marginLeft: 30,
                        borderLeftWidth: 1,
                        borderRadius: 0.5,
                        borderStyle: "dashed",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderLeftColor: "#767676",
                      }}
                    >
                      <Text style={{ color: "#767676" }}>
                        ---- {CONSTANT.DrawerAddonServices}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("OngoingServices")
                    }
                    style={{
                      marginLeft: 30,
                      borderLeftWidth: 1,
                      borderRadius: 0.5,
                      borderStyle: "dashed",
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderLeftColor: "#767676",
                    }}
                  >
                    <Text style={{ color: "#767676" }}>
                      ---- {CONSTANT.DrawerOngoingServices}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("CompletedServices")
                    }
                    style={{
                      marginLeft: 30,
                      borderLeftWidth: 1,
                      borderRadius: 0.5,
                      borderStyle: "dashed",
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderLeftColor: "#767676",
                    }}
                  >
                    <Text style={{ color: "#767676" }}>
                      ---- {CONSTANT.DrawerCompletedServices}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("CancelledServices")
                    }
                    style={{
                      marginLeft: 30,
                      borderLeftWidth: 1,
                      borderRadius: 0.5,
                      borderStyle: "dashed",
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderLeftColor: "#767676",
                    }}
                  >
                    <Text style={{ color: "#767676" }}>
                      ---- {CONSTANT.DrawerCancelledServices}
                    </Text>
                  </TouchableOpacity>
                </CollapseBody>
              </Collapse>
            ) : null}
            {storedType != "" ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Favorite")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="hearto" size={17} color={"#8e44ad"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerFavorite}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {storedType != "" ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Invoices")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="creditcard" size={17} color={"#3498db"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerInvoices}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {storedType != "" ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Disputes")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="disconnect" size={17} color={"#9b59b6"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerDisputes}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {storedType != "" && storedType == "freelancer" && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("PayoutSetting")}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="creditcard" size={17} color={"#2ecc71"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerPayoutsSettings}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {storedType != "" &&
              storedType != "freelancer" &&
              this.state.themeSettingsHidePayoutEmployers != "yes" && (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("PayoutSetting")
                  }
                >
                  <View style={{ flexDirection: "row", margin: 10 }}>
                    <AntIcon name="creditcard" size={17} color={"#2ecc71"} />
                    <Text
                      style={{
                        marginLeft: 20,
                        fontSize: 15,
                        color: "#323232",
                        fontWeight: "300",
                      }}
                    >
                      {CONSTANT.DrawerPayoutsSettings}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

            {storedType != "" &&
              storedType == "freelancer" &&
              this.state.themeSettingsPortfolio != "" &&
              this.state.themeSettingsPortfolio != "hide" && (
                <Collapse>
                  <CollapseHeader>
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        marginBottom: 5,
                      }}
                    >
                      <AntIcon
                        name="profile"
                        color={"blue"}
                        size={20}
                        style={{
                          alignSelf: "center",
                          textAlign: "center",
                          marginLeft: 10,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#24355a",
                          paddingLeft: 20,
                          paddingVertical: 20,
                        }}
                      >
                        {CONSTANT.DrawerManagePortfolio}
                      </Text>
                      <SimpleLineIcons
                        name="arrow-right"
                        color={"#767676"}
                        size={15}
                        style={{
                          alignSelf: "center",
                          position: "absolute",
                          right: 10,
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ paddingHorizontal: 20 }}>
                    {storedType != "" && storedType == "freelancer" && (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("AddPortfolio")
                        }
                        style={{
                          marginLeft: 30,
                          borderLeftWidth: 1,
                          borderRadius: 0.5,
                          borderStyle: "dashed",
                          paddingTop: 10,
                          paddingBottom: 10,
                          borderLeftColor: "#767676",
                        }}
                      >
                        <Text style={{ color: "#767676" }}>
                          ---- {CONSTANT.DrawerAddPortfolio}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {storedType != "" && storedType == "freelancer" && (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("PortfolioListings")
                        }
                        style={{
                          marginLeft: 30,
                          borderLeftWidth: 1,
                          borderRadius: 0.5,
                          borderStyle: "dashed",
                          paddingTop: 10,
                          paddingBottom: 10,
                          borderLeftColor: "#767676",
                        }}
                      >
                        <Text style={{ color: "#767676" }}>
                          ---- {CONSTANT.DrawerPortfolioListings}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </CollapseBody>
                </Collapse>
              )}

            {storedType != "" ? (
              <TouchableOpacity
                onPress={() => {
                  this.logoutAlert();
                }}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <AntIcon name="logout" size={17} color={"#c0392b"} />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#323232",
                      fontWeight: "300",
                    }}
                  >
                    {CONSTANT.DrawerLogout}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6,
                marginTop: 10,
                marginBottom: 15,
              }}
            />
            <Text
              style={{
                margin: 10,
                fontWeight: "500",
                fontSize: 18,
                color: "#7a7a7a",
              }}
            >
              {CONSTANT.DrawerGeneral}
            </Text>
            <TouchableOpacity
              // onPress={() => this.props.navigation.navigate("AboutUs")}
              onPress={() => {
                Linking.openURL("https://www.munyayi.com/about/");
              }}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <AntIcon name="profile" size={17} color={"#3498db"} />
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 15,
                    color: "#323232",
                    fontWeight: "300",
                  }}
                >
                  {CONSTANT.DrawerAboutus}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.updateAppNotice()}>
              <View style={{ flexDirection: "row", margin: 10 }}>
                <AntIcon name="like2" size={17} color={"#1abc9c"} />
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 15,
                    color: "#323232",
                    fontWeight: "300",
                  }}
                >
                  {CONSTANT.DrawerRateApp}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onClickShare()}>
              <View style={{ flexDirection: "row", margin: 10 }}>
                <AntIcon name="mail" size={17} color={"#e74c3c"} />
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 15,
                    color: "#323232",
                    fontWeight: "300",
                  }}
                >
                  {CONSTANT.DrawerInviteFriends}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => this.props.navigation.navigate("Contact")}
              onPress={() => {
                Linking.openURL("https://www.munyayi.com/contact-us/");
              }}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <AntIcon name="questioncircleo" size={17} color={"#f1c40f"} />
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 15,
                    color: "#323232",
                    fontWeight: "300",
                  }}
                >
                  {CONSTANT.DrawerContact}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
componentDidMount = () => {
  this.CheckApplicationAccess();
};
CheckApplicationAccess = async () => {
  const response = await fetch(CONSTANT.BaseUrl + "user/get_access");
  const json = await response.json();
  this.setState({ ApplicationAccessJob: json.access_type.job_access });
  var ApplicationAccessJobWJO = this.state.ApplicationAccessJob;
};
const DashboardTabNavigator = createBottomTabNavigator(
  {
    // MainNavigator: MainDrawer},{
    Home: {
      screen: home,
      navigationOptions: {
        headerStyle: {
          backgroundColor: CONSTANT.primaryColor,
        },
        headerTintColor: CONSTANT.primaryColor,
        tabBarLabel: CONSTANT.HomeBottomTabHome,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="home" color={tintColor} size={25} />
        ),
      },
    },
    Jobs: {
      screen: Jobs,
      navigationOptions: {
        tabBarLabel: CONSTANT.HomeBottomTabJobs,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="appstore-o" color={tintColor} size={25} />
        ),
      },
    },
    Freelancers: {
      screen: Freelancers,
      navigationOptions: {
        headerStyle: {
          backgroundColor: "#FF9800",
        },
        headerTintColor: "#fff",
        tabBarLabel: CONSTANT.HomeBottomTabFreelancer,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="user" color={tintColor} size={25} />
        ),
      },
    },
    Employers: {
      screen: Employers,
      navigationOptions: {
        tabBarLabel: CONSTANT.HomeBottomTabEmployer,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="wallet" color={tintColor} size={25} />
        ),
      },
    },
    Profile: {
      screen: ProfileTabs,
      navigationOptions: {
        tabBarLabel: CONSTANT.HomeBottomTabProfile,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="setting" color={tintColor} size={25} />
        ),
      },
    },
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
      };
    },
    tabBarOptions: {
      activeTintColor: CONSTANT.primaryColor,
    },
  },
  {
    headerMode: "none",
  }
);
const DashboardTabNavigatorWOJ = createBottomTabNavigator(
  {
    // MainNavigator: MainDrawer},{
    Home: {
      screen: home,
      navigationOptions: {
        headerStyle: {
          backgroundColor: CONSTANT.primaryColor,
        },
        headerTintColor: CONSTANT.primaryColor,
        tabBarLabel: CONSTANT.HomeBottomTabHome,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="home" color={tintColor} size={25} />
        ),
      },
    },
    // Jobs: {
    //   screen: Jobs,
    //   navigationOptions: {
    //     tabBarLabel: CONSTANT.HomeBottomTabJobs,
    //     tabBarIcon: ({tintColor}) => (
    //       <AntIcon name="appstore-o" color={tintColor} size={25} />
    //     ),
    //   },
    // },
    Freelancers: {
      screen: Freelancers,
      navigationOptions: {
        headerStyle: {
          backgroundColor: "#FF9800",
        },
        headerTintColor: "#fff",
        tabBarLabel: CONSTANT.HomeBottomTabFreelancer,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="user" color={tintColor} size={25} />
        ),
      },
    },
    Employers: {
      screen: Employers,
      navigationOptions: {
        tabBarLabel: CONSTANT.HomeBottomTabEmployer,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="wallet" color={tintColor} size={25} />
        ),
      },
    },
    Profile: {
      screen: ProfileTabs,
      navigationOptions: {
        tabBarLabel: CONSTANT.HomeBottomTabProfile,
        tabBarIcon: ({ tintColor }) => (
          <AntIcon name="setting" color={tintColor} size={25} />
        ),
      },
    },
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
      };
    },
    tabBarOptions: {
      activeTintColor: CONSTANT.primaryColor,
    },
  },
  {
    headerMode: "none",
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator,
    Profile: Profile,
    ProfileTabs: ProfileTabs,
    Employers: Employers,
    Jobs: Jobs,
    DetailFreelancerScreen: DetailFreelancerScreen,
    DetailJobScreen: DetailJobScreen,
    DetailCompanyScreen: DetailCompanyScreen,
    SearchScreen: SearchScreen,
    EmployerLayout: EmployerLayout,
    LoginScreen: LoginScreen,
    PostJob: PostJob,
    PostService: PostService,
    SendOffer: SendOffer,
    CustomHeader: CustomHeader,
    PreLoader: PreLoader,
    Favorite: Favorite,
    SendProposal: SendProposal,
    SearchResultFreelancer: SearchResultFreelancer,
    SearchResultEmployer: SearchResultEmployer,
    SearchResultJob: SearchResultJob,
    SearchResultService: SearchResultService,
    Signup: Signup,
    JobbyCategorylist: JobbyCategorylist,
    SendReport: SendReport,
    CustomDrawerComponent: CustomDrawerComponent,
    ForgetPassword: ForgetPassword,
    DetailServiceScreen: DetailServiceScreen,
    VerificationAccount: VerificationAccount,
    BuyServiceScreen: BuyServiceScreen,
    BuyServiceWebview: BuyServiceWebview,
    MessagesList: MessagesList,
    MessageSingleListCard: MessageSingleListCard,
    DetailMessageScreen: DetailMessageScreen,
    SocketChat: SocketChat,
    Insightstar: Insightstar,
    Insight: Insight,
    Invoices: Invoices,
    InvoiceDetailPage: InvoiceDetailPage,
    Disputes: Disputes,
    Packages: Packages,
    LatestProposals: LatestProposals,
    DetailOngoing: DetailOngoing,
    PostedServices: PostedServices,
    CompletedServices: CompletedServices,
    CompleteServicesDetail: CompleteServicesDetail,
    OngoingServices: OngoingServices,
    OngoingServicesDetail: OngoingServicesDetail,
    AddonsServices: AddonsServices,
    CancelledServices: CancelledServices,
    OngoingJobs: OngoingJobs,
    CompletedJobs: CompletedJobs,
    CancelledJobs: CancelledJobs,
    PostedJobs: PostedJobs,
    ViewProposals: ViewProposals,
    ManageEmailNotification: ManageEmailNotification,
    AccountSecuritySetting: AccountSecuritySetting,
    DeleteAccount: DeleteAccount,
    ChangePassword: ChangePassword,
    SecuritySettings: SecuritySettings,
    PayoutSetting: PayoutSetting,
    HireSetMilestone: HireSetMilestone,
    ManageMilestones: ManageMilestones,
    AddPortfolio: AddPortfolio,
    PortfolioListings: PortfolioListings,
    PortfolioDetail: PortfolioDetail,
    IdentityVerification: IdentityVerification,
    Notification: Notification,
    AboutUs: AboutUs,
    Contact: Contact,
  },
  {
    headerMode: "none",
    mode: Platform.OS === "ios" ? "modal" : "card",
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
      gesturesEnabled: false,
    },
    gesturesEnabled: false,
    transitionConfig: TransitionConfiguration,
  }
);
const AppDrawerNavigator = createDrawerNavigator(
  {
    Dash: { screen: DashboardStackNavigator },
    Login: LoginScreen,
    PostJOb: PostJob,
  },
  {
    headerMode: "none",
    mode: Platform.OS === "ios" ? "modal" : "card",
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
      gesturesEnabled: false,
    },
    gesturesEnabled: false,
    transitionConfig: TransitionConfiguration,
    contentComponent: CustomDrawerComponent,
    contentOptions: {
      activeTintColor: CONSTANT.primaryColor,
    },
  }
);
const AppSwitchNavigator = createSwitchNavigator(
  {
    PreLoader: { screen: PreLoader },
    Welcome: { screen: WelcomeScreen },
    Dashboard: { screen: AppDrawerNavigator },
  },
  {
    headerMode: "none",
    initialRouteName: "PreLoader",
    mode: Platform.OS === "ios" ? "modal" : "card",
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
      gesturesEnabled: false,
    },
    gesturesEnabled: false,
    transitionConfig: TransitionConfiguration,
  }
);
const AppContainer = createAppContainer(AppSwitchNavigator);
