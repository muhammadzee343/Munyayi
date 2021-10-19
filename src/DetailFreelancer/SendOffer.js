import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  Alert,
  ActivityIndicator,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import SimpleHeader from "../Header/SimpleHeader";
import { Header } from "react-native-elements";
class SendOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      Uid: "",
      EmployerJobsKnown: "",
      Description: "",
    };
  }
  componentDidMount() {
    this.fetchEmployerJobs();
  }
  fetchEmployerJobs = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    return fetch(CONSTANT.BaseUrl + "chat/employer_jobs?employer_id=" + Uid, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let EmployerJobs = responseJson.projects;
        console.log(EmployerJobs);
        this.setState({
          EmployerJobs,
        });
        this.setState({
          isLoading: false,
        });
        console.log(EmployerJobs);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        console.error(error);
      });
  };
  sendOffernow = async () => {
    this.setState({
      isLoading: true,
    });
    const { EmployerJobsKnown, Description } = this.state;
    const Uid = await AsyncStorage.getItem("projectUid");
    const { params } = this.props.navigation.state;
    console.log(
      "this is more inside function",
      Uid,
      params.user_id,
      EmployerJobsKnown[0]
    );
    axios
      .post(CONSTANT.BaseUrl + "chat/send_offer", {
        sender_id: Uid,
        receiver_id: params.user_id,
        project_id: EmployerJobsKnown[0],
        message: Description,
        status: "unread",
      })
      .then(async (response) => {
        this.setState({
          isLoading: false,
        });
        Alert.alert("Offer Sent Successfully", response.message);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  };
  render() {
    const { Description } = this.state;
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.SendOffer} />
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView style={{ flexDirection: "column" }}>
          <View style={styles.section}>
            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.SendOffer}
            </Text>
          </View>
          <View style={styles.section}>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={(value) =>
                  this.setState({ EmployerJobsKnown: value })
                }
                uniqueKey="id"
                items={this.state.EmployerJobs}
                selectedItems={this.state.EmployerJobsKnown}
                borderBottomWidth={0}
                single={true}
                inputContainerStyle={{ borderBottomColor: "transparent" }}
                searchInputPlaceholderText={CONSTANT.SendOfferPickEmployerJob}
                onChangeInput={(text) => console.log(text)}
                selectText={CONSTANT.SendOfferPickEmployerJob}
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={
                  styles.MultiSelectstyleDropdownMenuSubsection
                }
                displayKey="title"
                submitButtonText={CONSTANT.Submit}
              />
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              multiline={true}
              style={styles.TextInputLayoutStyleForDetail}
              name="username"
              onChangeText={(Description) => this.setState({ Description })}
              placeholder={CONSTANT.Description}
              placeholderTextColor="#807f7f"
            />
            <TouchableOpacity
              onPress={this.sendOffernow}
              style={styles.MainButtonArea}
            >
              <Text style={styles.ButtonText}>{CONSTANT.SendOffer}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default SendOffer;
