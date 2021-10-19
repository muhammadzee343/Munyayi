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
  ActivityIndicator,
} from "react-native";
import * as CONSTANT from "../Constants/Constant";
import styles from '../Constants/Styles';
import SimpleHeader from "../Header/SimpleHeader";
const Entities = require("html-entities").XmlEntities;
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";
import AntIcon from "react-native-vector-icons/AntDesign";
const entities = new Entities();
class ViewProposals extends Component {
  state = {
    data: [],
    fetchProposal: [],
    isLoading: true,
    Message: ""
  };
  componentDidMount() {
    this.fetchProposalData();
  }
  fetchProposalData = async () => {
    const { params } = this.props.navigation.state;
    const uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl +
        "dashboard/manage_job_proposals?user_id=" +
        uid +
        "&job_id=" +
        params.my_id
    );
    const json = await response.json();
    this.setState({ fetchProposal: json, isLoading: false });
  };
  SendMessage = async () => {
    this.RBSheet.close();
    const Uid = await AsyncStorage.getItem("projectUid");
    if (this.state.Message == "") {
      Alert.alert("Oops", "Please add a Message.");
    } else {
      this.setState({
        Message: ""
      });
      axios
        .post(CONSTANT.BaseUrl + "chat/sendUserMessage", {
          sender_id: Uid,
          receiver_id: this.state.fetchProposal[0].user_id,
          message: this.state.Message
        })
        .then(async response => {
          Alert.alert("Success", "Messgae sent successfully");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  SendMilestonerequest = async()=>{
    const { params } = this.props.navigation.state;
      axios
        .post(CONSTANT.BaseUrl + "listing/send_milestone_request", {
          id : params.my_id,
        })
        .then(async response => {
          this.props.navigation.navigate("ManageMilestones" ,
          {
            id : params.my_id,
            title: params.title,
            employer_name: params.employer_name,
            project_type: params.project_type,
            project_level: params.project_level,
            location_name: params.location_name,
            freelancer_title: this.state.fetchProposal[0].freelancer_title,
            freelancer_total_rating: this.state.fetchProposal[0].freelancer_total_rating,
            proposed_amount: this.state.fetchProposal[0].proposed_amount,
            duration: this.state.fetchProposal[0].duration,
            freelancer_reviews_rate: this.state.fetchProposal[0].freelancer_reviews_rate,
            content: this.state.fetchProposal[0].content,
            proposal_docs: this.state.fetchProposal[0].proposal_docs,
            freelancer_avatar: this.state.fetchProposal[0].freelancer_avatar,
            proposal_id: this.state.fetchProposal[0].proposal_id
          })
        })
        .catch(error => {
          console.log(error);
        });
  }
  _listEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: 'center',}}>
        <Image style={{ resizeMode: 'contain', height: 150, width: 150 }}
          source={require('../Images/nodata.png')}
        />
      </View>
    )
  }
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.Viewproposals} />
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={this.state.fetchProposal}
            ListEmptyComponent={ this._listEmptyComponent }
            keyExtractor={(a, b) => b.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  borderColor: "#ddd",
                  borderWidth: 0.6,
                  borderRadius: 4,
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "#000000",
                  shadowOpacity: 0.2,
                  margin: 10
                }}
                activeOpacity={0.9}
              >
                <View
                  style={{
                    padding: 10,
                    alignItems: "flex-start"
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      resizeMode={"contain"}
                      style={{ height: 60, width: 60, marginRight: 10 }}
                      source={{ uri: item.freelancer_avatar }}
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text style={{ fontSize: 18, fontWeight: "700" }}>
                        {item.freelancer_title}
                      </Text>
                      <Text style={{ fontSize: 15 }}>
                        {"("}
                        {item.freelancer_reviews_rate} / 5{")"}{" "}
                        {item.freelancer_total_rating} {CONSTANT.ViewProposalsFeedbackFound}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                      color: "green",
                      marginVertical: 10
                    }}
                  >
                    {item.proposed_amount} {"("}
                    {item.duration}
                    {")"}
                  </Text>

                  <Text
                    style={{
                      color: "#323232",
                      fontSize: 15
                    }}
                  >
                    {item.content}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.RBSheet.open()}
                      style={{
                        alignItems: "center",
                        height: 40,
                        margin: 10,
                        borderRadius: 4,
                        width: "30%",
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
                        {CONSTANT.ViewProposalsChatNow}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=> this.SendMilestonerequest()}
                      style={{
                        alignItems: "center",
                        height: 40,
                        margin: 10,
                        borderRadius: 4,
                        width: "60%",
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
                        {CONSTANT.ViewProposalsHireSetMilestones}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      height: 40,
                      flexDirection: "row"
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        style={{
                          color: "#323232",
                          alignSelf: "center",
                          fontSize: 12
                        }}
                      >
                        {item.proposal_docs == 0
                          ? item.proposal_docs + " File"
                          : item.proposal_docs + " Files"}{" "}
                       {CONSTANT.ViewProposalsAttached}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

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
              overflow: "hidden"
            }
          }}
        >
          <View
            style={{
              height: 45,
              width: "100%",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: CONSTANT.primaryColor,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "white",
                textAlign: "center"
              }}
            >
              {CONSTANT.ViewProposalsSendMessage}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: "#fff",
              width: "100%",
              overflow: "hidden"
            }}
          >
            <View>
              <TextInput
                underlineColorAndroid="transparent"
                multiline={true}
                style={{
                  borderColor: "#807f7f",
                  borderWidth: 0.3,
                  borderRadius: 3,
                  fontSize: 15,
                  padding: 5,
                  height: 150,
                  margin: 10,
                  padding: 10
                }}
                name="username"
                onChangeText={ Message => this.setState({ Message }) }
                placeholder={CONSTANT.ViewProposalsTypeMessage}
                placeholderTextColor="#807f7f"
              />
            </View>
            <TouchableOpacity
              onPress={() => this.SendMessage()}
              style={{
                alignItems: "center",
                height: 40,
                margin: 10,
                borderRadius: 4,
                width: "30%",
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
                {CONSTANT.ViewProposalsSendNow}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </RBSheet>
      </View>
    );
  }
}
export default ViewProposals;
