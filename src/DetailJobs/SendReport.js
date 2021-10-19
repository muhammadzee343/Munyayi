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
  Alert
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import SimpleHeader from '../Header/SimpleHeader';
import { Header } from "react-native-elements";
class SendReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Uid: "",
      EmployerJobsKnown: "",
      Description: ""
    };
  }
  componentDidMount() {
    this.fetchReportJobReason();
  }
  fetchReportJobReason = async () => {
    const response = await fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=reason_type"
    );
    const json = await response.json();
    this.setState({ EmployerJobs: json });
  };
  SendOffer = async () => {
    const { EmployerJobsKnown, Description } = this.state;
    const Uid = await AsyncStorage.getItem("projectUid");
    const { params } = this.props.navigation.state;
    axios
      .post(
        CONSTANT.BaseUrl + "chat/send_offer",
        {
          id: Uid,
          user_id: params.user_id,
          reason: EmployerJobsKnown[0],
          description: Description,
          type: "project"
        }
      )
      .then(async response => {
        Alert.alert("Report Send Successfully", response.message);
      })
      .catch(error => {
        console.log(error);
      });
  };
  render() {
    const { Description } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.SendReport} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text
              style={styles.MainHeadingTextStyle}
            >
              {CONSTANT.SendReport}
            </Text>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({ EmployerJobsKnown: value })
                }
                uniqueKey="value"
                items={this.state.EmployerJobs}
                selectedItems={this.state.EmployerJobsKnown}
                borderBottomWidth={0}
                single={true}
                inputContainerStyle={{ borderBottomColor: "transparent" }}
                searchInputPlaceholderText={CONSTANT.SendReportPickReasonToLeave}
                selectText={CONSTANT.SendReportPickReasonToLeave}
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}

                onChangeInput={text => console.log(text)}
                displayKey="title"
                submitButtonText={CONSTANT.Submit}
              />
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              multiline={true}
              style={styles.TextInputLayoutStyleForDetail}
              name="username"
              onChangeText={Description => this.setState({ Description })}
              placeholder={CONSTANT.Description}
              placeholderTextColor="#807f7f"
            />
            <TouchableOpacity
              onPress={this.SendOffer}
              style={styles.MainButtonArea}
            >
              <Text
                style={styles.ButtonText}
              >
                {CONSTANT.SendReport}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default SendReport;
