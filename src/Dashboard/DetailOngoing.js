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
  Image,
  CameraRoll,
  Dimensions,
  TextInput,
  Alert,
  Button,
  Linking,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import JobAttachments from "../DetailJobs/JobAttachments";
import RNBackgroundDownloader from "react-native-background-downloader";
import JobSkill from "../DetailJobs/JobSkill";
import { Header } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";
import * as CONSTANT from "../Constants/Constant";
import { NavigationEvents } from "react-navigation";
import HTML from "react-native-render-html";
import DocumentPicker from "react-native-document-picker";
import SelectedDocLayout from "../CompleteEmployers/SelectedDocLayout";
import SimpleHeader from "../Header/SimpleHeader";
import RBSheet from "react-native-raw-bottom-sheet";
import { Table, Row, Rows } from "react-native-table-component";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class DetailOngoing extends Component {
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
    image: null,
    images: null,
    Description: "",
    fetchHistory: [],
    fetchBudget: {},
    fetchMilestone: [],
    tableHead: ["Milestone Title:", "Due Date:", "Budget:", "Action:"],
    attachmentArrey: [],
  };
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.fetchProjectHistory();
    this.fetchJobDetail();
    this.getUser();
    if (params.milestone_option && params.milestone_option == "on") {
      this.fetchbudgetDetail();
      this.fetchMilestones();
    }
  }
  fetchJobDetail = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "dashboard/job_details_information?project_id=" +
        params.ID +
        "&proposal_id=" +
        params.Proposal_id +
        "&freelance_id=" +
        params.Freelance_id
    );
    const json = await response.json();
    this.setState({ JobDetail: json, isLoading: false });
  };
  fetchProjectHistory = async () => {
    const { params } = this.props.navigation.state;
    const Pid = await AsyncStorage.getItem("projectUid");
    // Alert.alert('ID_2', params.ID)
    // Alert.alert('Proposal_id_2', params.Proposal_id)
    // Alert.alert('Pid', Pid)
    const response = await fetch(
      CONSTANT.BaseUrl +
        "dashboard/get_ongoing_job_chat?id=" +
        params.ID +
        "&user_id=" +
        Pid
    );
    const json = await response.json();
    this.setState({ fetchHistory: json, isLoading: false });

    if(params.attachments){for (const [key, value] of Object.entries(params.attachments)) {
      console.log("value", `${value}`);
      this.state.attachmentArrey.push({
        url: `https:${value}`,
      });
    }}
    console.log("attachment arrey", this.state.attachmentArrey);
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
  pickMultiple() {
    try {
      DocumentPicker.pickMultiple({})
        .then((images) => {
          this.setState({
            image: null,
            images: images,
          });
        })
        .catch((e) => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  SubmitMessage = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const { params } = this.props.navigation.state;
    const { Description, images } = this.state;
    const formData = new FormData();
    formData.append("sender_id", Uid);
    formData.append("id", params.Proposal_id);
    formData.append("chat_desc", Description);
    formData.append("size", images.length >= 1 ? images.length : 0);
    images.forEach((item, i) => {
      var path = item.uri;
      var filename = item.name;
      formData.append("project_files" + i, {
        uri: path,
        type: item.type,
        name: filename || `filename${i}.jpg`,
      });
    });
    fetch(CONSTANT.BaseUrl + "proposal/sendproposal_chat", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => {
        if (response.status == "200") {
          this.fetchProjectHistory();
          Alert.alert("Success", "Message Sent Successfully");
          // this.showSuccessAlert();
        } else if (response.status == "203") {
          Alert.alert("Sorry", "There is an error");
          // this.showAlert();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetchbudgetDetail = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/milestones_details?proposal_id=" +
        params.Proposal_id
    );
    const json = await response.json();
    this.setState({ fetchBudget: json, isLoading: false });
  };
  fetchMilestones = async () => {
    const { params } = this.props.navigation.state;

    const Uid = await AsyncStorage.getItem("projectUid");
    // alert(params.Proposal_id);
    // alert(Uid);
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/list_milestone?id=" +
        params.Proposal_id +
        "&user_id=" +
        Uid
    );
    const json = await response.json();
    this.setState({ fetchMilestone: json, isLoading: false });
  };
  openFile = (url) => {
    Linking.openURL(url);
  };

  render() {
    const { isLoading, showAlert } = this.state;
    const { id, storedValue, storedType, profileImg, type } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        {/* <NavigationEvents onWillFocus={this.fetchJObData} /> */}
        <SimpleHeader HeaderText={CONSTANT.DetailjobHadder} />
        {isLoading && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={{
                height: 30,
                width: 30,
                borderRadius: 30 / 2,
                backgroundColor: "#ffffff",
                elevation: 5,
              }}
            />
          </View>
        )}
        <ScrollView>
          <Text style={{ marginLeft: 20, marginTop: 20 }}>
            {params.employer_name}
          </Text>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 20,
              marginRight: 10,
              marginBottom: 20,
            }}
          >
            {params.title}
          </Text>

          <View style={{ flexDirection: "column", backgroundColor: "#fafafa" }}>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6,
                marginBottom: 10,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ marginLeft: 20 }}>{CONSTANT.DetailjobCarrer}</Text>

              <Text style={{ paddingRight: 20 }}>{params.level}</Text>
            </View>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6,
                marginBottom: 10,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ marginLeft: 20 }}>
                {CONSTANT.Detailjoblocation}
              </Text>
              <Text style={{ paddingRight: 20 }}>{params.location_name}</Text>
            </View>
            
            {params.type &&
              <>
                <View
                  style={{
                    borderBottomColor: "#dddddd",
                    borderBottomWidth: 0.6,
                    marginBottom: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ marginLeft: 20 }}>
                    {CONSTANT.DetailjobJobType}
                  </Text>
                  <Text style={{ paddingRight: 20 }}>{params.type}</Text>
                </View>
              </>
            }

            {params.duration && (
              <>
                <View
                  style={{
                    borderBottomColor: "#dddddd",
                    borderBottomWidth: 0.6,
                    marginBottom: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ marginLeft: 20 }}>
                    {CONSTANT.DetailjobDuration}
                  </Text>
                  <Text style={{ paddingRight: 20 }}>{params.duration}</Text>
                </View>
              </>
            )}
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6,
              }}
            />
          </View>
          {(this.state.attachmentArrey && this.state.attachmentArrey.length >= 1) ? (
            <View>
              <View
                style={{
                  height: 60,
                  justifyContent: "center",
                  marginVertical: 10,
                  paddingLeft: 20,
                  backgroundColor: "#fff",
                  borderLeftWidth: 5,
                  marginHorizontal: 10,
                  borderLeftColor: CONSTANT.primaryColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    marginRight: 10,
                  }}
                >
                  {CONSTANT.DetailOngoingAttachments}
                </Text>
              </View>
              <FlatList
                style={{ paddingBottom: 5, paddingTop: 10 }}
                data={this.state.attachmentArrey}
                keyExtractor={(y, z) => z.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    elevation={5}
                    style={styles.container}
                    onPress={() => this.openFile(item.url)}
                  >
                    <View
                      style={{
                        backgroundColor:'#fff',
                        padding: 10,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 10,
                        borderColor:'#ddd',
                        borderWidth: 1,
                        marginBottom: 10,
                      }}
                    >
                      <View style={{}}>
                        <Text style={{color: CONSTANT.TextColorBlue}}>{item.url}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          {
            <View>
              <View
                style={{
                  height: 60,
                  justifyContent: "center",
                  marginVertical: 10,
                  paddingLeft: 20,
                  backgroundColor: "#fff",
                  borderLeftWidth: 5,
                  marginHorizontal: 10,
                  borderLeftColor: CONSTANT.primaryColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    marginRight: 10,
                  }}
                >
                  {this.state.storedType != "freelancer" ? CONSTANT.DetailOngoingHiredFreelancer : CONSTANT.DetailOngoingEmployer}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
              >
                <Image
                  style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                  source={{ uri: this.state.storedType != "freelancer" ? `${params.freelancer_img}` : `${params.employer_img}` }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.NameTextStyle,
                    { marginLeft: 10, marginRight: 5 },
                  ]}
                >
                  {this.state.storedType != "freelancer" ? params.freelancer_name : params.employer_name}
                </Text>
              </View>
            </View>
          }
          {params.milestone_option == "on" ? (
            <View>
              <View
                style={{
                  height: 60,
                  justifyContent: "center",
                  marginVertical: 10,
                  paddingLeft: 20,
                  backgroundColor: "#fff",
                  borderLeftWidth: 5,
                  marginHorizontal: 10,
                  borderLeftColor: CONSTANT.primaryColor,
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 10 }}>
                  {CONSTANT.DetailOngoingProjectBudgetDetails}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                {this.state.fetchBudget && (
                  <View
                    style={{
                      width: "50%",
                      paddingVertical: 15,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ height: 50, width: 50 }}
                      source={{ uri: this.state.fetchBudget.total_budget }}
                    />
                    <Text
                      style={{
                        marginTop: 15,
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      {this.state.fetchBudget.total_price}
                    </Text>
                  </View>
                )}
                {this.state.fetchBudget && (
                  <View
                    style={{
                      width: "50%",
                      paddingVertical: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fcfcfc",
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ height: 50, width: 50 }}
                      source={{ uri: this.state.fetchBudget.in_escrow }}
                    />
                    <Text
                      style={{
                        marginTop: 15,
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      {this.state.fetchBudget.completed_price}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                {this.state.fetchBudget && (
                  <View
                    style={{
                      width: "50%",
                      paddingVertical: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fcfcfc",
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ height: 50, width: 50 }}
                      source={{ uri: this.state.fetchBudget.milestone_paid }}
                    />
                    <Text
                      style={{
                        marginTop: 15,
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      {this.state.fetchBudget.hired_price}
                    </Text>
                  </View>
                )}
                {this.state.fetchBudget && (
                  <View
                    style={{
                      width: "50%",
                      paddingVertical: 15,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ height: 50, width: 50 }}
                      source={{ uri: this.state.fetchBudget.remainings }}
                    />
                    <Text
                      style={{
                        marginTop: 15,
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      {this.state.fetchBudget.pending_price}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 60,
                  justifyContent: "center",
                  marginVertical: 10,
                  paddingLeft: 20,
                  backgroundColor: "#fff",
                  borderLeftWidth: 5,
                  marginHorizontal: 10,
                  borderLeftColor: CONSTANT.primaryColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    marginRight: 10,
                  }}
                >
                  {CONSTANT.DetailOngoingMilestones}
                </Text>
              </View>

              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#ddd" }}>
                  <Row
                    data={this.state.tableHead}
                    style={{
                      height: 40,
                      backgroundColor: CONSTANT.primaryColor,
                    }}
                    textStyle={{
                      color: "#fff",
                      marginLeft: 6,
                      fontSize: 13,
                      fontWeight: "700",
                    }}
                  />
                  {this.state.fetchMilestone.map((item, index) => (
                    <Row
                      key={index}
                      data={[
                        item.milestone_title,
                        item.milestone_due_date,
                        entities.decode(item.milestone_price),
                        <View style={{ padding: 5 }}>
                          {this.state.storedType == "freelancer" ? (
                            <Button
                              title={item.updated_status}
                              onPress={() =>
                                Alert.alert(
                                  CONSTANT.DetailOngoingSimpleBtnPressed,
                                  JSON.stringify(index)
                                )
                              }
                              color="#ddd"
                            />
                          ) : (
                            <Button
                              title={item.updated_status}
                              onPress={() =>
                                Alert.alert(
                                  CONSTANT.DetailOngoingSimpleBtnPressed,
                                  JSON.stringify(index)
                                )
                              }
                              color={CONSTANT.primaryColor}
                            />
                          )}
                        </View>,
                      ]}
                      textStyle={{
                        margin: 6,
                        color: "#323232",
                        fontSize: 13,
                      }}
                    />
                  ))}
                </Table>
              </View>
            </View>
          ) : null}

          {this.state.fetchHistory.length >= 1 && (
            <View>
              <View
                style={{
                  height: 60,
                  justifyContent: "center",
                  marginVertical: 10,
                  paddingLeft: 20,
                  backgroundColor: "#fff",
                  borderLeftWidth: 5,
                  marginHorizontal: 10,
                  borderLeftColor: CONSTANT.primaryColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    marginRight: 10,
                  }}
                >
                  {CONSTANT.DetailOngoingProjectHistory}
                </Text>
              </View>

              {this.state.fetchHistory.length >= 1 ? (
                <FlatList
                  data={this.state.fetchHistory}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={{ justifyContent: "space-between" }}
                      activeOpacity={0.9}
                    >
                      {index % 2 === 0 ? (
                        <View style={styles.amenetiesarea}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginRight: 15,
                              width: "85%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                marginRight: 15,
                              }}
                            >
                              <Image
                                resizeMode={"contain"}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 15,
                                }}
                                source={{ uri: item.sender_image }}
                              />
                            </View>
                            <View>
                              <Text>{item.date_sent}</Text>
                              <HTML
                                containerStyle={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                html={item.message}
                                imagesMaxWidth={Dimensions.get("window").width}
                              />
                            </View>
                          </View>
                          {/* <TouchableOpacity
                            // onPress={() => this.props.navigation.goBack(null)}
                            style={{
                              flexDirection: "column",
                              display: "flex",
                              alignContent: "center",
                              alignSelf: "center",
                              justifyContent: "center"
                            }}
                          >
                            <AntIcon
                              name="download"
                              size={25}
                              color={"#000"}
                            />
                          </TouchableOpacity> */}
                        </View>
                      ) : (
                        <View style={styles.amenetiesarea2}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginRight: 15,
                              width: "85%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                marginRight: 15,
                              }}
                            >
                              <Image
                                resizeMode={"contain"}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 15,
                                }}
                                source={{ uri: item.sender_image }}
                              />
                            </View>
                            <View>
                              <Text>{item.date_sent}</Text>
                              <HTML
                                containerStyle={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                html={item.message}
                                imagesMaxWidth={Dimensions.get("window").width}
                              />
                            </View>
                          </View>
                          <TouchableOpacity
                          // onPress={() => this.props.navigation.goBack(null)}
                          >
                            <AntIcon
                              name="download"
                              size={25}
                              color={"#323232"}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ resizeMode: "contain", height: 150, width: 150 }}
                    source={require("../Images/nodata.png")}
                  />
                </View>
              )}

              <View />
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.RBSheet.open()}
          style={{
            alignItems: "center",
            height: 50,
            width: "100%",
            alignSelf: "center",
            justifyContent: "center",
            backgroundColor: CONSTANT.primaryColor,
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {CONSTANT.DetailOngoingSendMessage}
          </Text>
        </TouchableOpacity>

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 15,
              paddingRight: 15,
              backgroundColor: "transparent",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            },
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.getAnswersRBSheetMainArea}
          >
            <View
              style={{
                backgroundColor: CONSTANT.primaryColor,
                height: 55,
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              <Text
                style={{ color: "#fff", fontSize: 20, textAlign: "center" }}
              >
                {CONSTANT.DetailOngoingTypeMessage}
              </Text>
            </View>
            <View style={styles.getAnswersRBSheetSpecialityArea}>
              <TextInput
                underlineColorAndroid="transparent"
                multiline={true}
                style={{
                  borderColor: "#807f7f",
                  width: "90%",
                  borderWidth: 0.3,
                  borderRadius: 3,
                  fontSize: 15,
                  padding: 5,
                  height: 150,
                }}
                name="username"
                onChangeText={(Description) => this.setState({ Description })}
                placeholder="Description"
                placeholderTextColor="#807f7f"
              />
              {this.state.images != null ? (
                <FlatList
                  style={{ paddingBottom: 5, paddingTop: 10 }}
                  data={this.state.images}
                  keyExtractor={(y, z) => z.toString()}
                  renderItem={({ item }) => (
                    <SelectedDocLayout docName={item.name} />
                  )}
                />
              ) : null}
              <View
                style={{
                  width: "90%",
                  marginBottom: 20,
                  marginTop: 10,
                  flexDirection: "row",
                  alignSelf: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.SubmitMessage()}
                  style={{
                    alignItems: "center",
                    height: 40,
                    borderRadius: 4,
                    marginRight: 5,
                    width: "45%",
                    alignSelf: "center",
                    backgroundColor: CONSTANT.primaryColor,
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
                    {CONSTANT.DetailOngoingUpdate}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.pickMultiple()}
                  style={{
                    alignItems: "center",
                    height: 40,
                    borderRadius: 4,
                    marginLeft: 5,
                    width: "45%",
                    alignSelf: "center",
                    backgroundColor: "#00cc8d",
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
                    {CONSTANT.DetailOngoingSelectFile}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </RBSheet>
      </View>
    );
  }
}
export default DetailOngoing;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    flexDirection: "column",
  },
  amenetiesarea: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: "space-between",
    width: "100%",
  },
  amenetiesarea2: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: "space-between",
    width: "100%",
  },
  getAnswersRBSheetMainArea: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
  },
  getAnswersRBSheetSpecialityArea: {
    height: 500,
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: "center",
    top: 10,
  },
});
