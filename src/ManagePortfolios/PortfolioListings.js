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
import SimpleHeader from '../Header/SimpleHeader';
import MultiSelect from 'react-native-multiple-select';
import AntIcon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import DocumentPicker from "react-native-document-picker";

class PortfolioListings extends Component {

  state={
		isLoading: true,
    PortfolioListing: [],
    refreshPortfolioListing: false,
    portfolioStatusMulti:[
      {
        name: 'publish',
        slug: 'publish'
      },
      {
        name: 'draft',
        slug: 'draft'
      }
    ],
    ServiceStatusKnown: '',
    selectedIndex: null,
	}

  componentDidMount() {
		this.fetchPortfolioListing();
  }

  fetchPortfolioListing = async () => {
    const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl +
        "portfolios/get_portfolios?listing_type=listing&user_id=" + Uid
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ PortfolioListing: [], isLoading: false }); // empty data set
    } else {
      this.setState({ PortfolioListing: json, isLoading: false });
    }
    console.log('PortfolioListing', JSON.stringify(this.state.PortfolioListing))
    //this.setState({ ServiceStatusKnown: this.state.PortfolioListing.status });
  };

  updatePortfolioStatus = async (id, stu) =>  {
    this.setState({ isLoading: true });
    console.log(id ,stu);
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "portfolios/update_post_status?user_id=" + Uid,{
        id: id,
        status: this.state.ServiceStatusKnown.toString()
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchPortfolioListing();
          this.setState({ isLoading: false });
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
  }

  deletePortfolio(id, index) {
    Alert.alert(
      "Delete Portfolio",
      "Are you sure want to delete this?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.deletePortfolioDetail(id, index) },
      ],
      { cancelable: false }
    );
  }
  deletePortfolioDetail = async (id, index) =>  {
    this.state.PortfolioListing.splice(index, 1);
    this.setState({ refreshPortfolioListing: true });

    this.setState({ isLoading: true });
    console.log(
      id,
    );
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + "portfolios/delete_portfolio?user_id=" + Uid,{
        id: id,
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
          this.fetchPortfolioListing();
          this.setState({ isLoading: false });
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
  }
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
    const {isLoading} = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={'Portfolio Listing'} />
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
              {/* <View>
                <Text style={{ fontSize: 18, margin: 10, fontWeight: "700" }}>
                  {this.state.data[0].count_totals}{" "}
                  {CONSTANT.CompletedServicesEmployersFound}
                </Text>
              </View> */}
              <FlatList
              contentContainerStyle={{flexGrow: 1}}
                data={this.state.PortfolioListing}
                ListEmptyComponent={this._listEmptyComponent}
                extraData={this.state.refreshPortfolioListing}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={item.status != 'draft' ? 0.7 : 1}
                    onPress={item.status != 'draft' ? () =>
                      this.props.navigation.navigate("PortfolioDetail", {
                        portfolio_id: item.ID,
                      })
                    : null}
                  >
                    <View style={{
                      flex: 1,
                      margin: 10,
                      backgroundColor: item.status == 'draft' ? '#ffeaea' : '#fff',
                      elevation: 5,
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "#000",
                      shadowOpacity: 0.2,
                    }}>
                      <View style={{ flexDirection: "row", padding: 10, alignItems:'center' }}>
                        <View style={{ flexDirection: "row", flex: 9 }}>
                          { item.gallery_imgs != '' &&
                            <View>
                              <Image
                                style={{ height: 70, width: 70, borderRadius: 5 }}
                                source={{uri: item.gallery_imgs[0].url}}
                              />
                            </View>
                          }
                          <View style={{ flexDirection: "column", paddingLeft:10, justifyContent:'center', width:'80%'}}>
                            <Text
                              //numberOfLines={1}
                              style={{
                                fontSize: 17,
                                marginRight: 10,
                                fontWeight: "700",
                                color: "#323232",
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 14,
                                fontWeight: "700",
                                color: CONSTANT.primaryColor,
                              }}
                            >
                              {item.custom_link}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={{justifyContent: 'center', alignItems: 'center', height:50, backgroundColor:CONSTANT.primaryColor, borderRadius:5, width:30}}
                          onPress={() => this.deletePortfolio(item.ID, index)}
                        >
                          <AntIcon name="delete" color={"#fff"} size={16} />
                        </TouchableOpacity>
                      </View>
                      <View style={{marginHorizontal: 10,}}>
                        <Text style={[styles.SectionHeadingTextStyle, {marginVertical:10}]}>Portfolio Status</Text>
                        <View style={{marginBottom: 10, flexDirection:'row' }}>
                          <MultiSelect
                            onToggleList={()=> this.setState({selectedIndex: index})}
                            ref={component => {
                              this.multiSelect = component;
                            }}
                            onSelectedItemsChange={value =>
                              this.setState({ ServiceStatusKnown: value })
                              }
                            uniqueKey="slug"
                            items={this.state.portfolioStatusMulti}
                            selectedItems={ this.state.selectedIndex === index ?
                              this.state.ServiceStatusKnown : null
                            }
                            borderBottomWidth={0}
                            single={true}
                            searchInputPlaceholderText={'Pick Portfolio Status'}
                            selectText={item.status != '' ? item.status : 'Pick Portfolio Status'}
                            styleMainWrapper={{
                              backgroundColor: "#ffffff",
                              borderRadius: 5,
                              marginTop:10,
                              width:'84%'
                            }}
                            styleDropdownMenuSubsection={{
                              backgroundColor: "#ffffff",
                              paddingRight: -10,
                              height: 60,
                              paddingLeft: 10,
                              borderWidth: 0.5,
                              borderColor: "#dddddd",
                              borderTopLeftRadius: 5,
                              borderBottomLeftRadius: 5,
                            }}
                            onChangeInput={text => console.log(text)}
                            displayKey="name"
                            submitButtonText={CONSTANT.Submit}
                          />
                          <TouchableOpacity 
                            onPress={() => this.updatePortfolioStatus(item.ID, this.state.ServiceStatusKnown)}
                            style={{
                              justifyContent: 'center', 
                              alignItems:'center', 
                              backgroundColor: CONSTANT.primaryColor, 
                              height:60, 
                              width:60, 
                              borderTopRightRadius:5, 
                              borderBottomRightRadius:5
                            }}>
                            <AntIcon
                              name="check"
                              color={'#fff'}
                              size={25}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                //   ListFooterComponent={this.renderFooter.bind(this)}
              />
          </ScrollView>
          
      </View>
    );
  }
}

export default PortfolioListings;
