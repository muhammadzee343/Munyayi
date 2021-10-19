import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import styles from "../Constants/Styles";
import * as CONSTANT from "../Constants/Constant";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleHeader from "../Header/SimpleHeader";
import { TouchableOpacity } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
import AntIcon from "react-native-vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";

class Disputes extends Component {
  state = {
    data: [],
    data2: [],
    DisputeQuery: [],
    DisputeProject: [],
    DisputeProjectArray: [],
    DisputeQuerryKnown: "",
    DisputeProjectArrayKnown: "",
    isLoading: true,
    DetailDispute: ""
  };

  componentDidMount() {
    this.fetchDisputesData();
    this.fetchDisputesForm();
  }
  fetchDisputesData = async () => {
    this.setState({ isLoading: true });
    const Uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_dispute_listings?user_id=" + Uid
    );
    const json = await response.json();

    this.setState({ data: json, isLoading: false, data2: json[0] });
    //Alert.alert("data" , JSON.stringify(this.state.data));
  };
  fetchDisputesForm = async () => {
    const Uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/dispute_form?user_id=" + Uid
    );
    const json = await response.json();

    this.setState({ DisputeQuery: json.dispute_query, isLoading: false });
    this.setState({ DisputeProject: json.options, isLoading: false });

    for (const [key, value] of Object.entries(this.state.DisputeProject)) {
      console.log(`${key}: ${value}`);
      this.state.DisputeProjectArray.push({
        title: `${value}`,
        slug: `${key}`
      });
      console.log("Required Array", this.state.DisputeProjectArray);
    }
  };
  OpenDispute = async () => {
	this.RBSheet.close()
    this.setState({ isLoading: true });
    const {
      DetailDispute,
      DisputeProjectArrayKnown,
      DisputeQuerryKnown
    } = this.state;
    const Uid = await AsyncStorage.getItem("projectUid");
    if (DisputeProjectArrayKnown == "" && DisputeQuerryKnown == "") {
      this.setState({ isLoading: false });
      Alert.alert("Oops", "Please fill the complete form.");
    } else {
      console.log(
        "Sending this Data",
        Uid +
        "////////" +
        DisputeProjectArrayKnown +
        "////////" +
        DisputeQuerryKnown +
        "////////" +
        DetailDispute
      );
      axios
        .post(CONSTANT.BaseUrl + "profile/create_dispute", {
          user_id: Uid,
          project: DisputeProjectArrayKnown ,
          reason: DisputeQuerryKnown,
          description: DetailDispute
        }).then(async response => {
          if (response.status == 200) {
            this.setState({ isLoading: false });
            Alert.alert("Success", response.data.message);
            this.fetchDisputesData();
          } else if (response.status == 203) {
            this.setState({ isLoading: false });
            Alert.alert("Oops", response.data.message);
          }
        }).catch(error => {
          console.log(error);
        });
    }
  };
  _listEmptyComponent = () => {
    return (
      <View style={styles.NoDataMainArea}>
        <Image style={styles.NoDataImageStyle}
          source={require('../Images/nodata.png')}
        />
      </View>
    )
  }

  render() {
    const { storedType, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.DrawerDisputes} />
        {isLoading && storedType !== "" ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {this.state.DisputeQuery != '' &&
          <View
            style={[
              styles.section,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }
            ]}
          >
            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.DrawerDisputes}
            </Text>
            <TouchableOpacity
              onPress={() => this.RBSheet.open()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <AntIcon name="plus" size={12} color={CONSTANT.primaryColor} />
              <Text
                style={[
                  styles.ParagraphTextStyle,
                  { color: CONSTANT.primaryColor, marginLeft: 3 }
                ]}
              >
                {CONSTANT.DisputesCreateDisputes}
              </Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.data2.type != 'error' ?
          <FlatList
            style={styles.section}
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({ item }) => (
              <View
                // onPress = {() => Linking.canOpenURL('https://google.com').then(() => {
                // 		Linking.openURL('https://google.com');
                // })}
                style={{
                  borderColor: "#ddd",
                  borderWidth: 1,
                  borderRadius: 5,
                  marginBottom: 10,
                  backgroundColor: "#fff",
                  paddingHorizontal: 10,
                  paddingVertical: 10
                }}
              >
                <View style={{flex:1, width:'100%', justifyContent:'space-between', paddingVertical:5, paddingHorizontal:5}}>
									<Text style={styles.SectionHeadingTextStyle}>{CONSTANT.DisputesSubject}</Text>
									<Text style={styles.ParagraphTextStyle}>{item.title}</Text>
								</View>
								<View style={{flex:1, justifyContent:'space-between', width:'100%', paddingVertical:5, paddingHorizontal:5}}>
									<Text style={styles.SectionHeadingTextStyle}>{CONSTANT.DisputesProjServ}</Text>
									<Text style={styles.ParagraphTextStyle}>{item.project_title}</Text>
								</View>
								<View style={{flex:1, justifyContent:'space-between', width:'100%', paddingVertical:5, paddingHorizontal:5}}>
									<Text style={styles.SectionHeadingTextStyle}>{CONSTANT.DisputesStatus}</Text>
									<Text style={styles.ParagraphTextStyle}>{item.post_status}</Text>
								</View>
								<TouchableOpacity 
									//onPress={ () => {this.props.navigation.navigate("InvoiceDetailPage", { feedback: item.feedback })}}
                  onPress={() => this.DisputeActionRBSheet.open()}
									style={styles.MainButtonArea}>
									<AntIcon name="eyeo" size={20} color={'#fff'}/>
								</TouchableOpacity>
                <RBSheet
                  ref={(ref) => {
                    this.DisputeActionRBSheet = ref;
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
                  <View
                    style={{
                      backgroundColor: "#fff",
                      width: "100%",
                      height:'100%',
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: CONSTANT.primaryColor,
                        height: 55,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{ color: "#fff", fontSize: 20, textAlign: "center" }}
                      >
                        Admin Feedback
                      </Text>
                    </View>
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      style={{
                        height: "100%",
                        width:'100%',
                        backgroundColor:'#fff',
                        paddingHorizontal:10,
                        paddingVertical:20
                      }}>
                      {item.post_status === 'Resolved' ? 
                        <Text>{item.feedback}</Text> 
                        :
                        <Text>No feedback provided yet</Text>
                      }
                    </ScrollView>
                  </View>
                </RBSheet>
							</View>
              
            )}
          />
          :
          <View style={styles.NoDataMainArea}>
            <Image style={styles.NoDataImageStyle}
              source={require('../Images/nodata.png')}
            />
          </View>
        }
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
            style={{
              backgroundColor: "#fff",
              width: "100%",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              overflow: "hidden"
            }}
          >
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                <Text style={styles.MainHeadingTextStyle}>
                  {CONSTANT.DisputesCreateDisputes}
                </Text>
                <TouchableOpacity
                  onPress={() => this.RBSheet.close()}
                  style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                  <AntIcon name="close" size={16} color={"#767676"} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.ParagraphTextStyle, { marginBottom: 10 }]}>
                {CONSTANT.DisputesParagraph}
              </Text>
              <View style={styles.MultiSelectArea}>
                <MultiSelect
                  ref={component => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={value => this.setState({ DisputeProjectArrayKnown: value })}
                  uniqueKey="slug"
                  items={this.state.DisputeProjectArray}
                  selectedItems={this.state.DisputeProjectArrayKnown}
                  borderBottomWidth={0}
                  single={true}
                  searchInputPlaceholderText={CONSTANT.DisputesReason}
                  selectText={CONSTANT.DisputesReason}
                  styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                  styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                  onChangeInput={text => console.log(text)}
                  displayKey="title"
                  submitButtonText="Submit"
                />
              </View>
              <View style={styles.MultiSelectArea}>
                <MultiSelect
                  ref={component => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={value =>
                    this.setState({ DisputeQuerryKnown: value })
                  }
                  uniqueKey="ID"
                  items={this.state.DisputeQuery}
                  selectedItems={this.state.DisputeQuerryKnown}
                  borderBottomWidth={0}
                  single={true}
                  searchInputPlaceholderText={CONSTANT.DisputesProjectsService}
                  selectText={CONSTANT.DisputesProjectsService}
                  styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                  styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                  onChangeInput={text => console.log(text)}
                  displayKey="post_title"
                  submitButtonText={CONSTANT.Submit}
                />
              </View>
              <TextInput
                multiline={true}
                style={styles.TextInputLayoutStyleForDetail}
                underlineColorAndroid="transparent"
                editable={true}
                secureTextEntry={true}
                name="DetailDispute"
                placeholder={CONSTANT.DisputesDescription}
                placeholderTextColor="#807f7f"
                onChangeText={DetailDispute => this.setState({ DetailDispute })}
              />
              <TouchableOpacity style={styles.MainButtonArea} onPress={() => this.OpenDispute()}>
                <Text
                  style={styles.ButtonText}
                >
                  {CONSTANT.DisputesSendDispute}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </RBSheet>
        
      </View>
    );
  }
}

export default Disputes;
