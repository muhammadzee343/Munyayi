import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Share,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  AsyncStorage,
  CameraRoll,
  Dimensions,
  Alert,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import JobAttachments from "../DetailJobs/JobAttachments";
// import RNFetchBlob from 'react-native-fetch-blob';
import RNBackgroundDownloader from "react-native-background-downloader";
import JobSkill from "../DetailJobs/JobSkill";
import { Header } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import { NavigationEvents } from "react-navigation";
import HTML from "react-native-render-html";
import SimpleHeader from "../Header/SimpleHeader";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class DetailJobScreen extends Component {
  static navigationOptions = {
    title: "Home",
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: CONSTANT.primaryColor,
    },
    headerTitleStyle: {
      fontSize: 18,
    },
  };
  state = {
    data: [],
    isLoading: true,
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    showAlert: false,
  };
  componentDidMount() {
    this.ApplicationThemeSettings();
    this.fetchJObData();
  }
  ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_theme_settings");
    const json = await response.json();
    this.setState({
      themeSettingsDetailJobFAQs: json.project_settings.job_faq_option,
      themeSettingsDetailJobAttachment: json.remove_project_attachments,
      themeSettingsDetailJobLocation: json.remove_location_job,
    });
  };
  fetchJObData = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_jobs?listing_type=single&job_id=" +
        params.job_id
    );
    const json = await response.json();
    this.setState({ fetchJob: json });
    this.setState({ fetchJob: json });
    this.setState({ fetchAttachment: json[0].attanchents });
    this.setState({ fetchFAQs: json[0].faq });
    this.setState({ fetchSkills: json[0].skills, isLoading: false });
    this.getUser();
  };
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
      console.log(error);
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
  onClick = () => {
    Share.share(
      {
        message: this.state.fetchJob[0].job_link,
        url: this.state.fetchJob[0].job_link,
        title: "Wow, did you see that?",
      },
      {
        // Android only:
        dialogTitle: "Share BAM goodness",
        // iOS only:
        excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"],
      }
    );
  };
  downloadFile = () => {
    RNBackgroundDownloader.download({
      id: "file123",
      url: this.state.fetchAttachment[0].url,
      destination: `${RNBackgroundDownloader.directories.documents}/file.zip`,
    })
      .begin((expectedBytes) => {
        console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress((percent) => {
        console.log(`Downloaded: ${percent * 100}%`);
      })
      .done(() => {
        console.log("Download is done!");
      })
      .error((error) => {
        console.log("Download canceled due to error: ", error);
      });
  };
  render() {
    const { isLoading, showAlert } = this.state;
    const { id, storedValue, storedType, profileImg, type } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={[styles.container, { margin: 5 }]}>
        {/* <NavigationEvents onWillFocus={this.fetchJObData} /> */}
        <SimpleHeader HeaderText={CONSTANT.DetailjobHadder} />
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={[styles.DetailJobScreenMainArea]}>
              <View style={styles.section}>
                {this.state.fetchJob && (
                  <Text style={styles.NameTextStyle}>
                    {this.state.fetchJob[0].employer_name}
                  </Text>
                )}
                {this.state.fetchJob && (
                  <Text style={styles.SectionHeadingTextStyle}>
                    {this.state.fetchJob[0].project_title}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", width: "90%" }}>
                  <View
                    style={[
                      styles.DetailJobScreenMainDetailArea,
                      styles.Elevation,
                    ]}
                  >
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailjobCarrer}
                    </Text>
                    {this.state.fetchJob && (
                      <Text style={styles.NameTextStyle}>
                        {this.state.fetchJob[0].project_level.level_title}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.DetailJobScreenMainDetailArea,
                      styles.Elevation,
                    ]}
                  >
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.Detailjoblocation}
                    </Text>
                    {this.state.fetchJob && (
                      <Text style={styles.NameTextStyle}>
                        {this.state.fetchJob[0].location._country}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={[
                      styles.DetailJobScreenMainDetailArea,
                      styles.Elevation,
                    ]}
                  >
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailjobJobType}
                    </Text>
                    {this.state.fetchJob && (
                      <Text style={styles.NameTextStyle}>
                        {this.state.fetchJob[0].project_type}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.DetailJobScreenMainDetailArea,
                      styles.Elevation,
                    ]}
                  >
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailjobDuration}
                    </Text>
                    {this.state.fetchJob && (
                      <Text style={styles.NameTextStyle}>
                        {this.state.fetchJob[0].project_duration}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.DetailJobScreenMainPriceArea,
                    styles.Elevation,
                    { flexDirection: "row" },
                  ]}
                >
                  <View>
                    <Text style={styles.ParagraphTextStyle}>
                      {CONSTANT.DetailjobAmount}
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      top: 10,
                    }}
                  >
                    {this.state.fetchJob && (
                      <Text style={styles.NameTextStyle}>{`${entities.decode(
                        this.state.fetchJob[0].project_cost === ""
                          ? this.state.fetchJob[0].hourly_rate +
                              CONSTANT.DetailjobHourRate +
                              this.state.fetchJob[0].estimated_hours +
                              CONSTANT.DetailjobHours
                          : this.state.fetchJob[0].project_cost
                      )}`}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[styles.DetailJobScreenMainPriceArea, styles.Elevation]}
            >
              <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.DetailjobProjectDetail}
              </Text>
              {this.state.fetchJob && (
                <View style={{}}>
                  <HTML
                    html={this.state.fetchJob[0].project_content}
                    baseFontStyle={styles.ParagraphTextStyle}
                  />
                </View>
              )}
            </View>
            <View
              style={[
                styles.DetailJobScreenMainPriceArea,
                styles.Elevation,
                { marginBottom: 10 },
              ]}
            >
              <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.DetailjobSkill}
              </Text>
            </View>
            <FlatList
              data={this.state.fetchSkills}
              keyExtractor={(a, b) => b.toString()}
              renderItem={({ item }) => (
                //  <TouchableOpacity
                //  onPress={() => this.props.navigation.navigate('DetailJobScreen', {profile_id: item.profile_id})}>
                <JobSkill skillName={`${entities.decode(item.skill_name)}`} />
                // </TouchableOpacity>
              )}
              horizontal={false}
            />

            {this.state.themeSettingsDetailJobFAQs == "yes" &&
              this.state.fetchFAQs != "" && (
                <View>
                  <Text style={styles.MainHeadingTextStyle}>
                    {CONSTANT.DetailServiceFAQ}
                  </Text>

                  <FlatList
                    data={this.state.fetchFAQs}
                    keyExtractor={(a, b) => b.toString()}
                    renderItem={({ item }) => (
                      <Collapse>
                        <CollapseHeader>
                          <View
                            style={[
                              styles.PersonalDetailCollapseHeaderArea,
                              {
                                alignItems: "center",
                                backgroundColor: "#ddd",
                                paddingLeft: 10,
                              },
                            ]}
                          >
                            <Text style={styles.NameTextStyle}>
                              {item.faq_question}
                            </Text>
                          </View>
                        </CollapseHeader>
                        <CollapseBody>
                          <View
                            style={[
                              styles.PersonalDetailCollapseBodyArea,
                              { marginBottom: 10, marginTop: 0 },
                            ]}
                          >
                            <Text style={styles.ParagraphTextStyle}>
                              {item.faq_answer}
                            </Text>
                          </View>
                        </CollapseBody>
                      </Collapse>
                    )}
                    //horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}

            {this.state.fetchAttachment != "" &&
              this.state.themeSettingsDetailJobAttachment == "no" && (
                <>
                  <Text style={styles.MainHeadingTextStyle}>
                    {CONSTANT.DetailjobAttachment}
                  </Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <FlatList
                      data={this.state.fetchAttachment}
                      keyExtractor={(a, b) => b.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={this.downloadFile}>
                          <JobAttachments
                            attachmentName={`${entities.decode(
                              item.document_name
                            )}`}
                            attachmentSize={`${entities.decode(
                              item.file_size
                            )}`}
                          />
                        </TouchableOpacity>
                      )}
                      horizontal={true}
                    />
                  </ScrollView>
                </>
              )}
            <View style={styles.DetailJobScreenFooterArea}>
              {type == "success" &&
              this.state.fetchJob &&
              storedType == "freelancer" ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("SendProposal", {
                      job_id: params.job_id,
                      job_main_title: this.state.fetchJob[0].project_title,
                      job_type: this.state.fetchJob[0].project_type,
                      job_level: this.state.fetchJob[0].project_level
                        .level_title,
                      job_time: this.state.fetchJob[0].estimated_hours,
                      job_Duration: this.state.fetchJob[0].project_duration,
                      job_Price: this.state.fetchJob[0].project_cost,
                      hourly_rate: this.state.fetchJob[0].hourly_rate,
                    })
                  }
                  style={styles.DetailJobScreenSendButtonArea}
                >
                  <Text style={styles.ButtonText}>
                    {CONSTANT.DetailjobProposal}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.showAlert();
                  }}
                  style={styles.DetailJobScreenSendButtonArea}
                >
                  <Text style={styles.ButtonText}>
                    {CONSTANT.DetailjobProposal}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={this.onClick}
                style={[
                  styles.DetailJobScreenAlertButtonArea,
                  { backgroundColor: "#00cc8d" },
                ]}
              >
                <AntIcon name="sharealt" color={"#fff"} size={17} />
              </TouchableOpacity>
              {type == "success" && storedType == "freelancer" ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("SendReport", {
                      job_id: params.job_id,
                    })
                  }
                  style={styles.DetailJobScreenAlertButtonArea}
                >
                  <AntIcon name="warning" color={"#fff"} size={17} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.showAlert();
                  }}
                  style={styles.DetailJobScreenAlertButtonArea}
                >
                  <AntIcon name="warning" color={"#fff"} size={17} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
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
export default DetailJobScreen;
