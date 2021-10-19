import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  PanResponder,
  Alert,
  Dimensions,
  AsyncStorage,
  KeyboardAvoidingView
} from 'react-native';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import AntIcon from "react-native-vector-icons/AntDesign";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class FAQ_Profile extends Component {

  state={
    isLoading: true,
		FAQ_Data: [],
		FAQ_Refresh: false,
		Question: '',
		Answer: '',
		editedQuestion: '',
		editedAnswer: '',
  }

  componentDidMount() {
    this.fetch_FAQ_Data();
  }
  fetch_FAQ_Data = async () => {
	const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/setting?id=" + Uid
    );
	const json = await response.json();
    this.setState({FAQ_Data: json.faqs, isLoading: false});
  };

  addInd_ExpData = () => {
		this.state.FAQ_Data.push({
			faq_question: this.state.Question,
			faq_answer: this.state.Answer,
		});
		console.log("data" , this.state.FAQ_Data)
		this.setState({
			FAQ_Refresh: true,
			Answer:'',
			Question:'',
		});
  };

  EditData = (index, item) => {
		console.log(item.faq_question, item.faq_answer)
    this.state.FAQ_Data[index] = {
			faq_question: this.state.editedQuestion != '' ? this.state.editedQuestion : item.faq_question , 
			faq_answer: this.state.editedAnswer != '' ? this.state.editedAnswer : item.faq_answer
		}
    this.setState({FAQ_Refresh: true,})
	};
	
	FAQ_DeleteForm = index => {
    this.state.FAQ_Data.splice(index, 1);
    this.setState({
      FAQ_Refresh: true
    });
  };

  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const {
      FAQ_Data,
    } = this.state;
    console.log(
      FAQ_Data,
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "profile/update_tabe_settings?user_id=" + Uid + "&edit_type=" + "faq",{
        faq: FAQ_Data,
      })
      .then(async response => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchIndustrial_ExpData();
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };
    
  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        <ScrollView>
          <View>
            <View style={styles.PersonalDetailSectionsStyle}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                  marginHorizontal:10
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.FAQ_ProfileHeading}
                </Text>
              </View>

              <View style={styles.PersonalDetailSectionArea}>
                <View>
								<TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder={CONSTANT.FAQ_ProfileQuestion}
                    onChangeText={Question =>
                      this.setState({ Question })
                    }
                    style={styles.TextInputLayoutStyle}
                    value={this.state.Question}
                  />
                  <TextInput
										multiline={true}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder={CONSTANT.FAQ_ProfileAnswer}
                    onChangeText={Answer =>
                      this.setState({ Answer })
                    }
                    style={styles.TextInputLayoutStyleForDetail}
                    value={this.state.Answer}
                  />
                  <TouchableOpacity
                    onPress={this.addInd_ExpData}
                    style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                    <Text style={styles.ButtonText}>
                      {CONSTANT.ProfileAdd}
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.FAQ_Data ? (
                  <FlatList
                    data={this.state.FAQ_Data}
                    extraData={this.state.FAQ_Refresh}
                    renderItem={({ item, index }) => (
                      <View>
                      <Collapse>
                        <CollapseHeader>
                          <View
                            style={styles.PersonalDetailCollapseHeaderArea}
                          >
                            <TouchableOpacity
                              activeOpacity={1}
                              style={
                                styles.PersonalDetailCoollapseHeaderTextArea
                              }
                            >
                              <Text
                                style={
                                  styles.PersonalDetailCoollapseHeaderText
                                }
                              >
                                {item.faq_question}
                              </Text>
                            </TouchableOpacity>
                            <View style={styles.PersonalDetailEditBTN}>
                              <AntIcon name="edit" color={"#fff"} size={20} />
                            </View>
                            <TouchableOpacity
                              onPress={() => this.FAQ_DeleteForm(index)}
                              style={styles.PersonalDetailDeleteBTN}
                            >
                              <AntIcon
                                name="delete"
                                color={"#fff"}
                                size={20}
                              />
                            </TouchableOpacity>
                          </View>
                        </CollapseHeader>
                        <CollapseBody>
                          <View style={styles.PersonalDetailCollapseBodyArea}>
													<TextInput
                              underlineColorAndroid="transparent"
                              placeholderTextColor="#7F7F7F"
                              placeholder={CONSTANT.FAQ_ProfileQuestion}
                              style={styles.TextInputLayoutStyle}
                              //onSelectionChange={() => this.EditData(index, item)}
                              onChangeText={editedQuestion =>
                                this.setState({ editedQuestion })
                              }
                            >
                              {item.faq_question}
                            </TextInput>
                            <TextInput
															multiline={true}
                              underlineColorAndroid="transparent"
                              placeholderTextColor="#7F7F7F"
                              placeholder={CONSTANT.FAQ_ProfileAnswer}
                              style={styles.TextInputLayoutStyleForDetail}
                              //onSelectionChange={() => this.EditData(index, item)}
                              onChangeText={editedAnswer =>
                                this.setState({ editedAnswer })
                              }
                            >
                              {item.faq_answer}
                            </TextInput>
                            <TouchableOpacity
                              onPress={() => this.EditData(index , item)}
                              style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
                              <Text style={styles.ButtonText}>
                                {CONSTANT.ProfileAdd}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </CollapseBody>
                      </Collapse>
                      </View>
                    )}
                  />
                ) : null}
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={this.UpdateProfileData}
            style={styles.MainButtonArea}>
            <Text style={styles.ButtonText}>
              {CONSTANT.ProfileSave}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

export default FAQ_Profile;
