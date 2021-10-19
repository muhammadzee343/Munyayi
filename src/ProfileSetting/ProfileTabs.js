import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Image,
  Keyboard,
  NativeModules,
  TextInput,
  BackHandler,
  Alert,
  Modal,
  ActivityIndicator
} from "react-native";
import styles from "../Constants/Styles";
import AntIcon from "react-native-vector-icons/AntDesign";
import RNRestart from "react-native-restart";
import axios from "axios";
import * as CONSTANT from "../Constants/Constant";
import CustomHeader from "../Header/CustomHeader";
import Profile from "./Profile";
import Gallery from "./Gallery";
import SocialProfile from "./SocialProfile";
import Brochures from "./Brochures";
import Exp_Edu_Profile from "./Exp_Edu_Profile";
import ProjectsProfile from "./ProjectsProfile";
import AwardsProfile from "./AwardsProfile";
import ProfileVideos from "./ProfileVideos";
import ProfileSpecialization from "./ProfileSpecialization";
import IndustrialExpProfile from "./IndustrialExpProfile";
import FAQ_Profile from "./FAQ_Profile";
import ProfileEmployer from "./ProfileEmployer";
class ProfileTabs extends Component {
  state = {
    freelancer_slider_data: [
      {
        name: "Profile"
      },
      {
        name: "Gallery"
      },
      {
        name: "Experience & Education"
      },
      {
        name: "Profile Videos"
      },
      {
        name: "Projects"
      },
      {
        name: "Awards/Certifications"
      },
      {
        name: "Specialization"
      },
      {
        name: "Industrial Experience"
      },
      {
        name: "SocialProfile"
      },
      {
        name: "FAQ Profile"
      }
    ],
    employer_slider_data: [
      {
        name: "Profile"
      },
      {
        name: "SocialProfile"
      },
      {
        name: "Brochures"
      }
    ],
    Profile: true,
    ProfileEmployer: true,
    Gallery: false,
    SocialProfile: false,
    Brochures: false,
    ExperienceEducation: false,
    ProfileVideos: false,
    Projects: false,
    AwardsCertifications: false,
    Specialization: false,
    IndustrialExperience: false,
    FAQ_Profile: false,
    index_v: 0,
    storedType: "",
    themeSettings: [],
    isLoading: true
  };

  componentDidMount() {
    this.getUser();
    this.ApplicationThemeSettings();
  }

  getUser = async () => {
    try {
      const storedType = await AsyncStorage.getItem("user_type");

      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
    } catch (error) {}
  };

  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_theme_settings");
    const json = await response.json();
    this.setState({ themeSettings: json, isLoading: false });
    console.log(
      JSON.stringify(
        this.state.themeSettings.freelancers_settings.freelancer_specialization
      )
    );
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
      themeSettingsHidePayoutEmployers: json.employers_settings.hide_payout_employers
    });

    if (
      this.state.themeSettings.freelancers_settings.freelancer_gallery_option !=
        "no" &&
      this.state.themeSettings.freelancers_settings.freelancer_gallery_option != "enable"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "Gallery"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings.frc_remove_experience !=
        "no" &&
      this.state.themeSettings.freelancers_settings.frc_remove_education != "no"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "Experience & Education"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings.freelancer_specialization !=
      "enable"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "Specialization"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings
        .freelancer_industrial_experience != "enable"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "Industrial Experience"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings.portfolio.enable.others !=
      "no"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "Profile Videos"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings.portfolio.enable.others !=
      "no"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "Projects"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings.frc_remove_awards != "no"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "Awards/Certifications"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings
        .freelancer_social_profile_settings.gadget != "enable"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "SocialProfile"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;
    if (
      this.state.themeSettings.freelancers_settings.freelancer_faq_option !=
      "yes"
    ) {
      let index = this.state.freelancer_slider_data.findIndex(
        item => item.name === "FAQ Profile"
      );
      this.state.freelancer_slider_data.splice(index, 1);
      console.log("deleted array", this.state.freelancer_slider_data);
    } else null;

    if (this.state.themeSettings.employers_settings.hide_brochures != "no") {
      let index = this.state.employer_slider_data.findIndex(
        item => item.name === "Brochures"
      );
      this.state.employer_slider_data.splice(index, 1);
      console.log("deleted array employer", this.state.employer_slider_data);
    } else null;
    if (
      this.state.themeSettings.employers_settings
        .employer_social_profile_settings.gadget != "enable"
    ) {
      let index = this.state.employer_slider_data.findIndex(
        item => item.name === "SocialProfile"
      );
      this.state.employer_slider_data.splice(index, 1);
      console.log("deleted array employer", this.state.employer_slider_data);
    } else null;
  };

  onSliderMenuItemPress = (item, index) => {
    if (item.name == "Profile") {
      this.setState({ Profile: true });
      this.setState({ ProfileEmployer: true });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Gallery") {
      this.setState({ Profile: false });
      this.setState({ ProfileEmployer: false });
      this.setState({ Gallery: true });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    }  else if (item.name == "SocialProfile") {
      this.setState({ Profile: false });
      this.setState({ ProfileEmployer: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: true });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Brochures") {
      this.setState({ Profile: false });
      this.setState({ ProfileEmployer: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: true });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Experience & Education") {
      this.setState({ Profile: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: true });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Profile Videos") {
      this.setState({ Profile: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: true });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Projects") {
      this.setState({ Profile: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: true });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Awards/Certifications") {
      this.setState({ Profile: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: true });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Specialization") {
      this.setState({ Profile: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: true });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "Industrial Experience") {
      this.setState({ Profile: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: true });
      this.setState({ FAQ_Profile: false });
    } else if (item.name == "FAQ Profile") {
      this.setState({ Profile: false });
      this.setState({ Gallery: false });
      this.setState({ SocialProfile: false });
      this.setState({ Brochures: false });
      this.setState({ ExperienceEducation: false });
      this.setState({ ProfileVideos: false });
      this.setState({ Projects: false });
      this.setState({ AwardsCertifications: false });
      this.setState({ Specialization: false });
      this.setState({ IndustrialExperience: false });
      this.setState({ FAQ_Profile: true });
    }

    this.setState({ index_v: index });
  };

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader />
        {this.state.isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {this.state.storedType !== "" ? (
          <>
            <View
              style={{ height: 50, backgroundColor: CONSTANT.primaryColor }}
            >
              <FlatList
                //style={{backgroundColor: '#24355a'}}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={
                  this.state.storedType == "freelancer"
                    ? this.state.freelancer_slider_data
                    : this.state.employer_slider_data
                }
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => this.onSliderMenuItemPress(item, index)}
                  >
                    <View
                      style={{
                        height: 50,
                        marginRight: 10,
                        paddingHorizontal: 15,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      {this.state.index_v === index ? (
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "700"
                          }}
                        >
                          {item.name}
                        </Text>
                      ) : (
                        <Text style={{ color: "#fff", fontSize: 12 }}>
                          {item.name}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <>
              {this.state.Profile == true && this.state.storedType == "freelancer"
                ? <Profile />
                : this.state.ProfileEmployer == true && this.state.storedType == "employer" 
                ? <ProfileEmployer /> : null}
              {this.state.Gallery == true && <Gallery />}
              {this.state.SocialProfile == true && <SocialProfile />}
              {this.state.Brochures == true && <Brochures />}
              {this.state.AwardsCertifications == true && <AwardsProfile />}
              {this.state.ProfileVideos == true && <ProfileVideos />}
              {this.state.ExperienceEducation == true && <Exp_Edu_Profile />}
              {this.state.Projects == true && <ProjectsProfile />}
              {this.state.Specialization == true &&
                this.state.themeSettings.freelancers_settings
                  .freelancer_specialization == "enable" && (
                  <ProfileSpecialization />
                )}
              {this.state.IndustrialExperience == true && (
                <IndustrialExpProfile />
              )}
              {this.state.FAQ_Profile == true && <FAQ_Profile />}
            </>
          </>
        ) : (
          <View
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "column",
              textAlign: "center",
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <Image
              style={{
                alignSelf: "center",
                alignItems: "center"
              }}
              source={require("../Images/loginFirst.png")}
            />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("LoginScreen", {
                RegistrationOption: this.state.themeSettingsRegistrationOption,
                LoginSignupType: this.state.themeSettingsLoginSignupType,
                DefaultRole: this.state.themeSettingsDefaultRole,
                RemoveUsername: this.state.themeSettingsRemoveUsername,
                HideLoaction: this.state.themeSettingsHideLoaction,
                TermText: this.state.themeSettingsTermText,
                TermPageLink: this.state.themeSettingsTermPageLink,
                RemoveRegistration: this.state.themeSettingsRemoveRegistration,
                PhoneOptionReg: this.state.themeSettingsPhoneOptionReg,
                PhoneMandatory: this.state.themeSettingsPhoneMandatory,
              })}
              style={styles.MainButtonArea}
            >
              <Text style={styles.ButtonText}>
                {CONSTANT.ProfileSettignLogin}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
export default ProfileTabs;
