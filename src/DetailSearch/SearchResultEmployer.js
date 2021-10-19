import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Button,
  StatusBar,
  FlatList,
  ActivityIndicator
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Header } from "react-native-elements";
import EmployerLayout from "../Home/EmployerLayout";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import SimpleHeader from '../Header/SimpleHeader';
class SearchResultEmployer extends Component {
  constructor() {
    super();
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
    data: [],
    isLoading: true,
    Toataldata: "",
    page: 1,
    fetching_from_server: false,
  };
  this.offset = 1;
}
  componentDidMount() {
    this.fetchEmployerData();
  }
  fetchEmployerData = async () => {
    const { params } = this.props.navigation.state;
    var _location = this.get_search_array(
      params.projectLocationKnown,
      "location"
    );
    const response = await fetch(
      CONSTANT.BaseUrl +
      "listing/get_employers?listing_type=search&profile_id=&keyword=" +
      params.title +
      _location +
      "&employees=" +
      params.EmployeeKnown+ "&page_number=" +
      this.offset
    );
    // const json = await response.json();
    // this.setState({ data: json });
    const json = await response.json();
    if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
      this.setState({ data: [], isLoading: false }); // empty data set 
    } else {
      this.offset = this.offset + 1;
      this.setState({
        data: [...this.state.data, ...this.state.data.concat(json)],
        isLoading: false
      });
      this.setState({ Toataldata: json[0].count_totals, isLoading: false });
    }
  };
  get_search_array = (term, key) => {
    var _list = "";
    for (var i = 0; i < term.length; i++) {
      _list += "&" + key + "[]=" + term[i];
    }
    return _list;
  };
  _listEmptyComponent = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", height: '100%', alignSelf: 'center', alignItems: 'center' }}>
        <Image style={{ resizeMode: 'contain', height: 150, width: 150 }}
          source={require('../Images/nodata.png')}
        />
      </View>
    )
  }
  loadMoreData = async() => {
    

    const { params } = this.props.navigation.state;
    var _location = this.get_search_array(
      params.projectLocationKnown,
      "location"
    );
    //On click of Load More button We will call the web API again
    this.setState({ fetching_from_server: true }, () => {
      fetch(
        CONSTANT.BaseUrl +
        "listing/get_employers?listing_type=search&profile_id=&keyword=" +
        params.title +
        _location +
        "&employees=" +
        params.EmployeeKnown+ "&page_number=" +
        this.offset
      )
        //Sending the currect offset with get request
        .then(response => response.json())
        .then(responseJson => {
          //Successful response from the API Call

          //After the response increasing the offset for the next API call.
          if (
            Array.isArray(responseJson) &&
            responseJson[0] &&
            responseJson[0].type &&
            responseJson[0].type === "error"
          ) {
            this.setState({ data: [], isLoading: false }); // empty data set
          } else {
            this.offset = this.offset + 1;
            this.setState({
              data: this.state.data.concat(responseJson),
              isLoading: false,
              fetching_from_server: false
            });
            //                   this.setState({Toataldata: responseJson[0].totals , isLoading: false});
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  };
  renderFooter() {
    return (
      //Footer View with Load More button
      <View>
        {this.state.Toataldata.toString() != this.state.data.length ? (
          <TouchableOpacity
            onPress={this.loadMoreData}
            style={styles.MainButtonArea}
          >
            <Text style={styles.ButtonText}>{CONSTANT.SearchLoadMore}</Text>
            {this.state.fetching_from_server ? (
              <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.SearchSearchResultEmployer}/>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        {
          this.state.data != "" &&
          <View style={[styles.section, {flexDirection:'row'}]}>
            <Text style={styles.MainHeadingTextStyle}>
              {this.state.data[0].count_totals}{' '}
            </Text>
            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.SearchEmployersFound}
            </Text>
          </View>
        }
        <FlatList
          data={this.state.data}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={this._listEmptyComponent}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                this.props.navigation.navigate("DetailCompanyScreen", {
                  profile_id: item.profile_id
                })
              }
            >
              <EmployerLayout
                companBannerImage={{ uri: `${item.banner_img}` }}
                companyProfileImage={{ uri: `${item.profile_img}` }}
                companyName={`${entities.decode(item.name)}`}
                companyTitle={`${entities.decode(item._tag_line)}`}
              />
            </TouchableOpacity>
          )}
          ListFooterComponent={this.renderFooter.bind(this)}
        />
      </View>
    );
  }
}
export default SearchResultEmployer;
