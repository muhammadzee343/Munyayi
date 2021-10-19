import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  TextInput,
  ImageBackground,
  Alert,
  ViewBase
} from "react-native";
import { Header } from "react-native-elements";
import AddonsServicesCard from "./AddonsServicesCard";
import CustomHeader from "../Header/CustomHeader";
import { NavigationEvents } from 'react-navigation';
import AntIcon from "react-native-vector-icons/AntDesign";
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from "axios";
import * as CONSTANT from '../Constants/Constant';
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class AddonsServices extends Component {
  constructor() {
    super();
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
    data: [],
    isLoading: true,
    Toataldata: "",
    page: 1,
    fetching_from_server: false,
    fetchAddonsServices:[],
    Title:'',
    Price:'',
    Description:''
  };
  this.offset = 1;
}
  componentDidMount() {
    this.fetchAddons();
  }
  fetchAddons = async () => {
    const Pid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "services/get_addons_services?user_id=" + Pid
    );
    const json = await response.json();
    if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
      this.setState({ fetchAddonsServices: [] }); // empty data set 
    } else {
      this.setState({ fetchAddonsServices: json  , isLoading:false},
        );
    }
  };
 
  renderFooter() {
    return (
      //Footer View with Load More button
      <View>
        {this.state.Toataldata.toString() != this.state.data.length ? (
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={this.loadMoreData}
              style={styles.loadMoreBtn}
            >
              <Text style={styles.btnText}>Load More</Text>
              {this.state.fetching_from_server ? (
                <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
              ) : null}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
  AddNow= async ()=>{
    const Pid = await AsyncStorage.getItem("projectUid");
    const {params} = this.props.navigation.state;
    if (
      this.state.Title == '' &&
      this.state.price == '' &&
      this.state.Description == ''
    ) {
      //alert("Please enter Email address");
      this.setState({email: 'Please Add Complete Data'});
    } else {
      // this.openProgressbar();
      axios
        .post(CONSTANT.BaseUrl + 'services/add_addon_service', {
          user_id: Pid,
          submit_type: "add",
          title: this.state.Title,
          price: this.state.Price,
          description : this.state.Description
        })
        .then(async response => {
          if (response.status === 200) {
            Alert.alert("Good" , "Data Posted successfully");
            this.fetchAddons();
          } else if (response.status === 203) {
            Alert.alert("Oops" , "Seems to be an issue with data / Network");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

  }
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
       
       <View
          style={{
            height: 60,
            paddingLeft: 15,
            paddingRight: 15,
            width: '100%',
            backgroundColor: CONSTANT.primaryColor,
            flexDirection: 'row',
            shadowOffset: {width: 0, height: 2},
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 10,
          }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack(null)}
            style={{
              flexDirection: 'column',
              width: '20%',
              display: 'flex',
              alignContent: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <AntIcon name="back" size={25} color={'#fff'} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'column',
              width: '60%',
              display: 'flex',
              alignContent: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: '#fff',
                  height: 30,
                  marginTop: 9,
                }}>
                {CONSTANT.AddonsServices}
              </Text>
            </View>
          </View>
        </View>
        {isLoading && (
          <View style={{ justifyContent: "center", height: "100%" }}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={{
                height: 30,
                width: 30,
                borderRadius: 60,
                alignContent: "center",
                alignSelf: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                elevation: 5
              }}
            />
          </View>
        )}
        {/* {
          this.state.data != "" &&
          <View>
            <Text style={{fontSize:18 , margin:10 , fontWeight:'700'}}>{this.state.data[0].count_totals} Employers found:</Text>
          </View>
        } */}
        <View style={{flexDirection:"row" , alignItems:'center' , justifyContent:'space-between' , margin: 10 , padding:5,}}>
          <Text style={{fontSize:16 , fontWeight:'700'}}>{CONSTANT.AddonsServicesListing}</Text>
          <TouchableOpacity
              onPress={()=> this.RBSheet.open()}
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
                 {CONSTANT.AddonsServicesAddNew}
            </Text>
            </TouchableOpacity>
        </View>
        {
            this.state.fetchAddonsServices.length >= 1 &&
            <FlatList
            data={this.state.fetchAddonsServices}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({ item , index }) => (
              <TouchableOpacity style={{
                  backgroundColor: '#fff', flexDirection: 'column', borderRadius: 4, overflow: 'hidden', flex: 1, flexDirection: 'column', margin: 2, 
        
                  
                }}
                  activeOpacity={0.9}
                  onPress={()=> this.props.navigation.navigate("AddonsServicesDetail", 
                  {data : this.state.fetchAddonsServices[index]}
                  )}
                >
                <AddonsServicesCard
                    title={`${entities.decode(item.title)}`}
                    status={`${entities.decode(item.status)}`}
                    description={`${entities.decode(item.description)}`}
                    price={`${entities.decode(item.price)}`}
                />
              </TouchableOpacity>
            )}
          //   ListFooterComponent={this.renderFooter.bind(this)}
          />
        }

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
            },
          }}>
          <View
            style={styles.getAnswersRBSheetMainArea}>
            <View style={styles.getAnswersRBSheetPostQuestionArea}>
              <Text
                style={styles.getAnswersRBSheetPostQuestionText}>
                {CONSTANT.AddonsServicesAddNewAddon}
              </Text>
            </View>

            <View
              style={styles.getAnswersRBSheetSpecialityArea}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.getAnswersRBSheetSpecialityScrollArea}>
                <View style={styles.getAnswersRBSheetSpecialityMultiArea}>
                </View>
                <View
                  style={styles.getAnswersRBSheetQueryArea}>
                  <TextInput
                    style={styles.getAnswersRBSheetQueryText}
                    underlineColorAndroid="transparent"
                    name="Title"
                    placeholder={CONSTANT.AddonsServicesTitle}
                    placeholderTextColor="#807f7f"
                    onChangeText={Title => this.setState({Title})}
                  />
                </View>
                <View
                  style={styles.getAnswersRBSheetQueryArea}>
                  <TextInput
                    style={styles.getAnswersRBSheetQueryText}
                    underlineColorAndroid="transparent"
                    name="Price"
                    keyboardType='numeric'
                    placeholder={CONSTANT.AddonsServicesPrice}
                    placeholderTextColor="#807f7f"
                    onChangeText={Price => this.setState({Price})}
                  />
                </View>
                <View
                  style={styles.getAnswersRBSheetDetailArea}>
                  <TextInput
                    multiline={true}
                    style={styles.getAnswersRBSheetDetailText}
                    underlineColorAndroid="transparent"
                    name="Description"
                    placeholder={CONSTANT.AddonsServicesDetail}
                    placeholderTextColor="#807f7f"
                    onChangeText={Description => this.setState({Description})}
                  />
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity
              onPress={this.AddNow}
              style={styles.buttonHover}>
              <Text
                style={styles.getAnswersRBSheetAskQuery}>
                {CONSTANT.AddonsServicesSubmit}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        
      </View>
    );
  }
}
export default AddonsServices;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  loadMoreBtn: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: CONSTANT.primaryColor,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    fontFamily:CONSTANT.PoppinsMedium,
  },
  buttonHover: {
    width: 150,
    height: 50,
    backgroundColor: CONSTANT.primaryColor,
    borderBottomColor: CONSTANT.primaryColor,
    marginLeft: 15,
    borderWidth: 0,
    marginTop: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    marginBottom: 25,
    shadowOffset: {width: 1, height: 13},
    fontSize: 13,
    borderRadius: 4,
    overflow: 'hidden',
    fontFamily:CONSTANT.PoppinsMedium,
  },
  getAnswersMainArea: {justifyContent: 'center', height: '100%'},
  getAnswersActivityIndicatorStyle: {
    height: 30,
    width: 30,
    borderRadius: 60,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
  },
  getAnswersScrollArea: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  getAnswersTextArea: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },
  getAnswersHealthText: {
    color: '#323232',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  getAnswersTitleText: {
    color: CONSTANT.primaryColor,
    textAlign: 'center',
    fontSize: 25,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  getAnswersDescriptionText: {
    color: '#323232',
    textAlign: 'center',
    fontSize: 13,
    marginLeft: 30,
    marginRight: 30,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  getAnswersTouchableArea: {
    alignItems: 'center',
    height: 40,
    margin: 15,
    borderRadius: 4,
    width: '70%',
    alignSelf: 'center',
    backgroundColor: '#3fabf3',
  },
  getAnswersTouchableText: {
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 10,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  getAnswersBackgroundArea: {
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 4,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    borderRadius: 4,
  },
  getAnswersBackgroundTextArea: {flexDirection: 'row'},
  getAnswersBackgroundTextStyle: {
    color: '#3d4461',
    width: '70%',
    fontSize: 20,
    fontFamily:CONSTANT.PoppinsBold,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  getAnswersAddNow: {
    width: '30%',
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 15,
  },
  getAnswersItemArea: {marginLeft: 5, marginRight: 5, marginBottom: 5},
  getAnswersItemText: {
    color: '#3d4461',
    width: '98%',
    fontSize: 17,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  getAnswersTypeReply: {
    height: 45,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 0.6,
    borderColor: '#dddddd',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  getAnswersPostAnswer: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    top: 18,
    fontFamily:CONSTANT.PoppinsMedium
  },
  getAnswersGetAnswersArea: {flexDirection: 'row'},
  getAnswersGetAnswersText: {
    color: '#3d4461',
    width: '70%',
    fontSize: 20,
    fontFamily:CONSTANT.PoppinsBold,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  getAnswersListStyle: {paddingLeft: 5},
  getAnswersRBSheetMainArea: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  getAnswersRBSheetPostQuestionArea: {backgroundColor: CONSTANT.primaryColor, height: 50},
  getAnswersRBSheetPostQuestionText: {
    width: '100%',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 10,
  },
  getAnswersRBSheetSpecialityArea: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  getAnswersRBSheetSpecialityScrollArea: {width: '100%'},
  getAnswersRBSheetSpecialityMultiArea: {marginLeft: 10, marginRight: 10, marginTop: 10},
  getAnswersRBSheetSpecialityMultiStyle: {marginLeft: 10, marginRight: 10, marginBottom: 10},
  getAnswersRBSheetSpecialityDropdown: {backgroundColor: '#000'},
  getAnswersRBSheetSpecialityWrapper: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 10,
  },
  getAnswersRBSheetSpecialitySubDropdown: {
    backgroundColor: '#fff',
    paddingRight: -7,
    height: 55,
    paddingLeft: 10,
    borderWidth: 0.6,
    borderColor: '#fff',
    borderColor: '#dddddd',
    borderRadius: 4,
  },
  getAnswersRBSheetQueryArea: {
    borderWidth: 0.6,
    margin: 10,
    borderRadius: 4,
    borderColor: '#dddddd',
  },
  getAnswersRBSheetQueryText: {
    fontSize: 15,
    padding: 5,
    height: 40,
    color: '#323232',
  },
  getAnswersRBSheetDetailArea: {
    height: 150,
    borderWidth: 0.6,
    margin: 10,
    borderRadius: 4,
    borderColor: '#dddddd',
  },
  getAnswersRBSheetDetailText: {
    fontSize: 15,
    height: 150,
    padding: 5,
    height: 40,
    color: '#323232',
  },
  getAnswersRBSheetAskQuery: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    top: 18,
  }
});
