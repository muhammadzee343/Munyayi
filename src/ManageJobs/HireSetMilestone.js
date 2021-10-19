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
  Alert
} from "react-native";
import * as CONSTANT from "../Constants/Constant";
import SimpleHeader from "../Header/SimpleHeader";
const Entities = require("html-entities").XmlEntities;
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import AntIcon from "react-native-vector-icons/AntDesign";
const entities = new Entities();
class HireSetMilestone extends Component {
  state = {
    data: [],
    fetchProposal: [],
    isLoading: true,
    Message:'',
  };
  componentDidMount() {
    this.fetchProposalData();
  }
  fetchProposalData = async () => {
    const { params } = this.props.navigation.state;
    const uid = await AsyncStorage.getItem("projectUid");
    // Alert.alert("My Data" , JSON.stringify(params.Job_id))
    const response = await fetch(
      CONSTANT.BaseUrl +
        "dashboard/manage_job_proposals?user_id=" +
        uid +
        "&job_id=2034"
    );
    const json = await response.json();
    this.setState({ fetchProposal: json, isLoading: false });
  };

  render() {
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.Viewproposals} />
        {this.state.fetchProposal.length >= 1 ? (
          <FlatList
            data={this.state.fetchProposal}
            keyExtractor={(a, b) => b.toString()}
            renderItem={({ item }) => (
             <View></View>
            )}
          />
        ) : (
          <View style={styles.LatestProposalMainScrollArea}>
            <Image
              resizeMode={"contain"}
              style={styles.LatestProposalMainScrollImageStyle}
              source={require("../Images/nodata.png")}
            />
          </View>
        )}

<RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              backgroundColor: 'transparent',
              overflow:'hidden'
            },
          }}>
            <View style={{height:45 , width:'100%' , alignContent:'center' , justifyContent:'center' ,backgroundColor: CONSTANT.primaryColor , borderTopLeftRadius: 6,
              borderTopRightRadius: 6,}}>
              <Text style={{fontSize: 18 , fontWeight:'700' , color:'white' , textAlign:'center'}}>{CONSTANT.HireSetMilestoneSendMessage}</Text>
            </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.getAnswersRBSheetMainArea}>
              <View>
              <TextInput
                underlineColorAndroid="transparent"
                multiline={true}
                style={{
                  borderColor: '#807f7f',
                  borderWidth: 0.3,
                  borderRadius: 3,
                  fontSize: 15,
                  padding: 5,
                  height: 150,
                  margin:10,
                  padding:10
                }}
                name="username"
                onChangeText={Message => this.setState({Message})}
                placeholder={CONSTANT.HireSetMilestoneTypeMessage}
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
                        {CONSTANT.HireSetMilestoneSendNow}
                      </Text>
                    </TouchableOpacity>
          </ScrollView>
        </RBSheet>
      </View>
    );
  }
}
export default HireSetMilestone;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  },
  shadow: {
    display: "flex",
    marginVertical: 5,
    marginHorizontal: 10,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    flexDirection: "column",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "transparent",
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "#000",
    shadowOpacity: 0.1
  },
  amenetiesarea: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  amenetiesarea2: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
    padding: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  getAnswersRBSheetMainArea: {
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'hidden',
  },
  getAnswersRBSheetSpecialityArea: {
    height: 500,
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
    top: 10,
  },
});
