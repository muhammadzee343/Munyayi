import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator
} from "react-native";
import * as CONSTANT from "../Constants/Constant";
import SimpleHeader from "../Header/SimpleHeader";
import styles from "../Constants/Styles";
import axios from "axios";
import AntIcon from "react-native-vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class ManageMilestones extends Component {
  state = {
    data: [],
    fetchBudget: {},
    fetchMilestone: [],
    Description: "",
    storedType: "",
    DatePickerVisibleExpStartingDate: false,
    Date: "",
    title: "",
    Desc: "",
    price: "",
    AddMileStoneCheck: true,
    isLoading: true,
    sendMilestonerequest: true
  };
  componentDidMount() {
    this.getUser();
  }

  fetchbudgetDetail = async () => {
    const { params } = this.props.navigation.state;
    this.setState({
      price: params.proposed_amount
    });
    const my_id =
      this.state.storedType == "employer" ? params.proposal_id : params.id;
    const response = await fetch(
      CONSTANT.BaseUrl + "listing/milestones_details?proposal_id=" + my_id
    );
    const json = await response.json();
    this.setState({ fetchBudget: json, isLoading: false });
    if (
      this.state.fetchBudget.total_price ===
      this.state.fetchBudget.pending_price
    ) {
      this.setState({
        AddMileStoneCheck: false
      });
      var RemainingmileStoneAmount =
        this.state.fetchBudget.total_price -
        this.state.fetchBudget.pending_price;
      this.setState({
        price: RemainingmileStoneAmount
      });
    } else {
      var RemainingmileStoneAmount =
        this.state.fetchBudget.total_price -
        this.state.fetchBudget.pending_price;
      this.setState({
        price: RemainingmileStoneAmount
      });
    }
  };

  fetchMilestones = async () => {
    const { params } = this.props.navigation.state;
    const Uid = await AsyncStorage.getItem("projectUid");
    const my_id =
      this.state.storedType == "employer" ? params.proposal_id : params.id;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/list_milestone?id=" +
        my_id +
        "&user_id=" +
        Uid
    );
    const json = await response.json();
    this.setState({ fetchMilestone: json, isLoading: false });
  };

  CancelMilestone = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const { params } = this.props.navigation.state;
    if (this.state.Description != "") {
      axios
        .post(CONSTANT.BaseUrl + "listing/cancel_milestone_request", {
          user_id: Uid,
          proposal_id: params.id,
          cancelled_reason: this.state.Description
        })
        .then(async response => {
          Alert.alert("Success", response.data.message);
        })
        .catch(error => {
          Alert.alert("Oops", error);
        });
    }
  };

  ApproveMilestone = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const { params } = this.props.navigation.state;
    axios
      .post(CONSTANT.BaseUrl + "listing/approve_milestone_request", {
        user_id: Uid,
        id: params.id,
        status: "approved"
      })
      .then(async response => {
        Alert.alert("Success", response.data.message);
        this.props.navigation.navigate("DetailOngoing" , {
          Proposal_id: params.Proposal_id ,
          ID: params.id,
          Freelance_id: Uid,
        })
      })
      .catch(error => {
        Alert.alert("Oops", error);
      });
  };

  getUser = async () => {
    try {
      const storedType = await AsyncStorage.getItem("user_type");
      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
    } catch (error) {}
    this.fetchbudgetDetail();
    this.fetchMilestones();
  };

  showDatePickerExpStartingDate = () => {
    this.setState({
      DatePickerVisibleExpStartingDate: true
    });
  };

  hideDatePickerExpStartingDate = () => {
    this.setState({
      DatePickerVisibleExpStartingDate: false
    });
  };

  handleConfirmExpStartingDate = date => {
    const dateS = date.toUTCString();
    this.setState({ Date: moment(dateS).format("YYYY/MM/DD") });
    this.hideDatePickerExpStartingDate();
  };

  AddMilestone = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const { params } = this.props.navigation.state;
    const { title, desc, Date, price } = this.state;
    if (title && desc && Date && price != "") {
      axios
        .post(CONSTANT.BaseUrl + "listing/add_milestone", {
          user_id: Uid,
          id: params.proposal_id,
          title: title,
          due_date: Date,
          price: price,
          description: desc
        })
        .then(async response => {
          console.log(response);
          if (response.status === 200) {
            this.setState({ isLoading: false });
            Alert.alert("Success", response.data.message);
            this.fetchbudgetDetail();
            this.fetchMilestones();
          } else if (response.status === 203) {
            this.setState({ isLoading: false });
            Alert.alert("Error", response.data.message);
          }
        })
        .catch(error => {
          Alert.alert(error);
          console.log(error);
        });
    } else {
      Alert.alert("Oops", "Please add complete date.");
    }
  };

  SendMilestoneRequest = () => {
    const { params } = this.props.navigation.state;
    axios
      .post(CONSTANT.BaseUrl + "listing/send_milestone_request", {
        id: params.proposal_id
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert("Success", response.data.message);
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert("Error", response.data.message);
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };

  render() {
    const { params } = this.props.navigation.state;
    const { isLoading } = this.state;
    return (
      <View style={style.container}>
        <SimpleHeader HeaderText={CONSTANT.ManageMileStoneHeaderText} />
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView style={{ marginHorizontal: 10, paddingVertical: 10 }}>
          {this.state.storedType == "freelancer" ? (
            <View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    marginVertical: 10,
                    fontWeight: "700"
                  }}
                >
                  {params.title}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text>{CONSTANT.ManageMileStoneProjectType}{params.job_type}</Text>
                <Text>{CONSTANT.ManageMileStoneCost}{params.price}</Text>
              </View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>
                  {CONSTANT.ManageMileStoneProjectBudgetDetails}
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderColor: "#ddd",
                  borderWidth: 0.6,
                  borderRadius: 4,
                  backgroundColor: "#fff"
                }}
              >
                <Text style={{ fontSize: 15 }}>{params.employer_name}</Text>
                <Text style={{ fontSize: 15, fontWeight: "700" }}>
                  {params.title}
                </Text>
                <View style={{ flexDirection: "row", flex: 3, marginTop: 10 }}>
                  <Text style={{ flex: 1, fontSize: 12 }}>
                    {params.project_level}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 12 }}>
                    {params.project_type}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 12 }}>
                    {params.location_name}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {this.state.storedType != "freelancer" && (
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>{CONSTANT.ManageMileStoneFreelancer}</Text>
              </View>

              <View
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderColor: "#ddd",
                  borderWidth: 0.6,
                  borderRadius: 4,
                  backgroundColor: "#fff"
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{ width: 60, height: 60 }}
                    source={{ uri: params.freelancer_avatar }}
                  />
                  <View
                    style={{ flexDirection: "column", alignSelf: "center" }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: 12,
                        fontWeight: "700"
                      }}
                    >
                      {params.freelancer_title}
                    </Text>
                    <Text style={{ flex: 1, marginLeft: 10, fontSize: 12 }}>
                      {"( "}
                      {params.freelancer_reviews_rate} / 5{" )"}{" "}
                      {params.freelancer_total_rating} {CONSTANT.ManageMileStoneFeedbackFound}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ marginVertical: 10, fontSize: 15, color: "green" }}
                >
                  {params.proposed_amount} {"( "}
                  {params.duration}
                  {" )"}
                </Text>
                <Text style={{ flex: 1, fontSize: 15 }}>{params.content}</Text>
                {this.state.AddMileStoneCheck == true ? (
                  <TouchableOpacity
                    onPress={() => this.RBSheet.open()}
                    style={{
                      alignItems: "center",
                      height: 40,
                      margin: 10,
                      borderRadius: 4,
                      width: "40%",
                      alignSelf: "center",
                      backgroundColor: CONSTANT.primaryColor,
                      marginTop: 10
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#fff",
                        paddingTop: 10,
                        fontSize: 15,
                        fontWeight: "700"
                      }}
                    >
                      {CONSTANT.ManageMileStoneAddMilestone}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => this.SendMilestoneRequest()}
                    style={{
                      alignItems: "center",
                      height: 40,
                      margin: 10,
                      borderRadius: 4,
                      width: "60%",
                      alignSelf: "center",
                      backgroundColor: CONSTANT.primaryColor,
                      marginTop: 10
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#fff",
                        paddingTop: 10,
                        fontSize: 15,
                        fontWeight: "700"
                      }}
                    >
                      {CONSTANT.ManageMileStoneSendMSFreelancer}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View style={{ flexDirection: "row" }}>
            {this.state.fetchBudget && (
              <View
                style={{
                  width: "50%",
                  paddingVertical: 15,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ height: 50, width: 50 }}
                  source={{ uri: this.state.fetchBudget.total_budget }}
                />
                <Text
                  style={{ marginTop: 15, fontSize: 15, fontWeight: "700" }}
                >
                  {entities.decode(this.state.fetchBudget.total_price)}
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
                  backgroundColor: "#fcfcfc"
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ height: 50, width: 50 }}
                  source={{ uri: this.state.fetchBudget.in_escrow }}
                />
                <Text
                  style={{ marginTop: 15, fontSize: 15, fontWeight: "700" }}
                >
                  {entities.decode(this.state.fetchBudget.completed_price)}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            {this.state.fetchBudget && (
              <View
                style={{
                  width: "50%",
                  paddingVertical: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fcfcfc"
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ height: 50, width: 50 }}
                  source={{ uri: this.state.fetchBudget.milestone_paid }}
                />
                <Text
                  style={{ marginTop: 15, fontSize: 15, fontWeight: "700" }}
                >
                  {entities.decode(this.state.fetchBudget.hired_price)}
                </Text>
              </View>
            )}
            {this.state.fetchBudget && (
              <View
                style={{
                  width: "50%",
                  paddingVertical: 15,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ height: 50, width: 50 }}
                  source={{ uri: this.state.fetchBudget.remainings }}
                />
                <Text
                  style={{ marginTop: 15, fontSize: 15, fontWeight: "700" }}
                >
                  {entities.decode(this.state.fetchBudget.pending_price)}
                </Text>
              </View>
            )}
          </View>
          {this.state.fetchMilestone.length >= 1 && (
            <View>
              <View style={styles.PostJobSectionHeadingArea}>
                <Text style={styles.SectionHeadingTextStyle}>{CONSTANT.ManageMileStoneMilestones}</Text>
              </View>
              <FlatList
                data={this.state.fetchMilestone}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      bordercolor: "#f7f7f7",
                      marginVertical: 5,
                      borderWidth: 0.4,
                      borderRadius: 4,
                      padding: 15
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "700" }}>
                     {CONSTANT.ManageMileStoneBudget}{item.milestone_price}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#767676" }}>
                      {CONSTANT.ManageMileStoneDueDate}{item.milestone_due_date}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#767676" }}>
                      {item.milestone_title}
                    </Text>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        marginVertical: 10,
                        borderRadius: 4,
                        width: "50%",
                        backgroundColor: "#ddd",
                        marginTop: 10
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "center",
                          alignItems: "center",
                          textAlign: "center",
                          color: "#fff",
                          paddingTop: 10,
                          fontSize: 15,
                          fontWeight: "700"
                        }}
                      >
                        {item.updated_status}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}

          {this.state.storedType == "freelancer" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20
              }}
            >
              <TouchableOpacity
                onPress={() => this.ApproveMilestone()}
                style={{
                  alignItems: "center",
                  height: 40,
                  margin: 10,
                  borderRadius: 4,
                  width: "40%",
                  alignSelf: "center",
                  backgroundColor: "#36CC71",
                  marginTop: 10
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    alignItems: "center",
                    textAlign: "center",
                    color: "#fff",
                    paddingTop: 10,
                    fontSize: 15,
                    fontWeight: "700"
                  }}
                >
                  {CONSTANT.ManageMileStoneAccept}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.RBSheet.open()}
                style={{
                  alignItems: "center",
                  height: 40,
                  margin: 10,
                  borderRadius: 4,
                  width: "40%",
                  alignSelf: "center",
                  backgroundColor: CONSTANT.primaryColor,
                  marginTop: 10
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    alignItems: "center",
                    textAlign: "center",
                    color: "#fff",
                    paddingTop: 10,
                    fontSize: 15,
                    fontWeight: "700"
                  }}
                >
                  {CONSTANT.ManageMileStoneDecline}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {this.state.storedType == "freelancer" ? (
            <RBSheet
              ref={ref => {
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
                  borderTopRightRadius: 6
                }
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={style.getAnswersRBSheetMainArea}
              >
                <View
                  style={{
                    backgroundColor: CONSTANT.primaryColor,
                    height: 55,
                    justifyContent: "center",
                    fontWeight: "700"
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 20, textAlign: "center" }}
                  >
                    {CONSTANT.ManageMileStoneCancelReason}
                  </Text>
                </View>
                <View style={style.getAnswersRBSheetSpecialityArea}>
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
                      height: 150
                    }}
                    name="username"
                    onChangeText={Description => this.setState({ Description })}
                    placeholder={CONSTANT.ManageMileStoneTypeReason}
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
                      justifyContent: "center"
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.CancelMilestone()}
                      style={{
                        alignItems: "center",
                        height: 40,
                        borderRadius: 4,
                        marginRight: 5,
                        width: "45%",
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
                        {CONSTANT.ManageMileStoneSendReason}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </RBSheet>
          ) : (
            <RBSheet
              ref={ref => {
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
                  borderTopRightRadius: 6
                }
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={style.getAnswersRBSheetMainArea}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "space-between",
                    margin: 10
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    {CONSTANT.ManageMileStoneAddMilestone}
                  </Text>
                  <AntIcon
                    onPress={() => this.RBSheet.close()}
                    name="close"
                    color={"#323232"}
                    size={15}
                  />
                </View>
                <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.TextInputLayoutStyle}
                    name="username"
                    placeholder={CONSTANT.ManageMileStoneMilestoneTitle}
                    placeholderTextColor="#807f7f"
                    onChangeText={title => this.setState({ title })}
                  />
                  <View
                    style={{
                      flex: 20,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flex: 14,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <TextInput
                        underlineColorAndroid="transparent"
                        name="username"
                        placeholder={CONSTANT.ManageMileStoneDDate}
                        placeholderTextColor="#807f7f"
                        onChangeText={Date => this.setState({ Date })}
                        value={this.state.Date}
                      />
                      <TouchableOpacity
                        onPress={() => this.showDatePickerExpStartingDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}></View>
                    <TextInput
                      defaultValue={this.state.price}
                      value={this.state.price}
                      underlineColorAndroid="transparent"
                      style={[styles.TextInputLayoutStyle, { flex: 5 }]}
                      name="username"
                      placeholder={CONSTANT.ManageMileStonePrice}
                      placeholderTextColor="#807f7f"
                      onChangeText={price => this.setState({ price })}
                    />
                  </View>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[
                      styles.TextInputLayoutStyle,
                      { marginTop: Platform.OS === "android" ? 60 : 0 }
                    ]}
                    name="username"
                    placeholder={CONSTANT.ManageMileStoneDescription}
                    placeholderTextColor="#807f7f"
                    onChangeText={desc => this.setState({ desc })}
                  />
                  <View>
                    <DateTimePickerModal
                      cancelTextIOS={"CANCEL"}
                      confirmTextIOS={"OK"}
                      cancelTextStyle={{ color: "#3d4461", fontSize: 20 }}
                      confirmTextStyle={{ color: "#3d4461", fontSize: 20 }}
                      isVisible={this.state.DatePickerVisibleExpStartingDate}
                      mode="date"
                      onConfirm={this.handleConfirmExpStartingDate}
                      onCancel={this.hideDatePickerExpStartingDate}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => this.AddMilestone()}
                  style={{
                    alignItems: "center",
                    height: 40,
                    margin: 10,
                    borderRadius: 4,
                    width: "40%",
                    alignSelf: "center",
                    backgroundColor: CONSTANT.primaryColor,
                    marginTop: 10
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      alignItems: "center",
                      textAlign: "center",
                      color: "#fff",
                      paddingTop: 10,
                      fontSize: 15,
                      fontWeight: "700"
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </RBSheet>
          )}
        </ScrollView>
      </View>
    );
  }
}
export default ManageMilestones;
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  amenetiesarea: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: "space-between",
    width: "100%"
  },
  amenetiesarea2: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: "space-between",
    width: "100%"
  },
  getAnswersRBSheetMainArea: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden"
  },
  getAnswersRBSheetSpecialityArea: {
    height: 500,
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: "center",
    top: 10
  }
});
