import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
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
} from "react-native";
import styles from "../Constants/Styles";
import { withNavigation, DrawerActions } from "react-navigation";
import CustomHeader from "../Header/CustomHeader";
import * as CONSTANT from "../Constants/Constant";
import axios from "axios";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class YourPayouts extends Component {
  constructor() {
    super();
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      data: [],
      Toataldata: "",
      NumberRes: "",
      fetching_from_server: false,
      page: 1,
      loading: true,
      spinner: false,
    };
    this.offset = 1;
  }
  componentDidMount() {
    this.fetchPayoutListingData();
  }
  fetchPayoutListingData = async () => {
    this.setState({
      spinner: true,
    });
    const id = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl +
        "profile/get_payout_listings?user_id=" +
        id +
        "&page=" +
        this.offset
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ PayoutListData: [], spinner: false }); // empty data set
    } else {
      this.offset = this.offset + 1;
      this.setState({
        data: [
          ...this.state.data,
          ...this.state.data.concat(json.payment_list),
        ],
        spinner: false,
      });
      this.setState({ Toataldata: json.total, spinner: false });
    }
  };
  loadMoreData = async () => {
    const id = await AsyncStorage.getItem("projectUid");
    // const response = await fetch(
    //   CONSTANT.BaseUrl + 'profile/get_payout_listings?user_id=' + id + "&page=" +this.offset,
    // );
    // const json = await response.json();
    // if (
    //   Array.isArray(json) &&
    //   json[0] &&
    //   json[0].type &&
    //   json[0].type === 'error'
    // ) {
    //   this.setState({PayoutListData: [], isLoading: false}); // empty data set
    // } else {
    //   this.offset = this.offset + 1;
    //         this.setState({
    //           data: this.state.data.concat(json),
    //           isLoading: false,
    //           fetching_from_server: false
    //         });

    // }

    this.setState({ fetching_from_server: true }, () => {
      fetch(
        CONSTANT.BaseUrl +
          "profile/get_payout_listings?user_id=" +
          id +
          "&page=" +
          this.offset
      )
        //Sending the currect offset with get request
        .then((response) => response.json())
        .then((responseJson) => {
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
              data: this.state.data.concat(responseJson.payment_list),
              isLoading: false,
              fetching_from_server: false,
            });
            //                   this.setState({Toataldata: responseJson[0].totals , isLoading: false});
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };
  _listEmptyComponent = () => {
    return (
      <View>
        {this.state.Toataldata.toString() == "0" ? (
          <View style={styles.SearchResultScreenNoResultArea}>
            <Image
              style={styles.SearchResultScreenNoResultImage}
              source={require("../Images/nodata.png")}
            />
            <Text style={styles.SearchResultScreenNoResultText}>
              {CONSTANT.SearchResultNoRecordFound}
            </Text>
          </View>
        ) : (
          Alert.alert(CONSTANT.OopsText, CONSTANT.NoMoreDataAvailable)
        )}
      </View>
    );
  };
  renderFooter() {
    return (
      //Footer View with Load More button
      <View>
        {this.state.Toataldata.toString() != this.state.data.length ? (
          <View style={styles.SearchResultScreenfooter}>
            <TouchableOpacity
              onPress={this.loadMoreData}
              style={styles.SearchResultScreenloadMoreBtn}
            >
              <Text style={styles.SearchResultScreenbtnText}>
                {CONSTANT.LoadMore}
              </Text>
              {this.state.fetching_from_server ? (
                <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
              ) : null}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }

  render() {
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        {spinner ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {this.state.data != '' ?
          <View>
            <View>
              <Text style={{ margin: 10, fontSize: 17, fontWeight: "700" }}>
                {CONSTANT.YourPayoutYourPayments}
              </Text>
            </View>
            {this.state.Toataldata != "" ? (
              <FlatList
                data={this.state.data}
                ListEmptyComponent={this._listEmptyComponent}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      borderColor: "#767676",
                      borderRadius: 4,
                      borderWidth: 0.6,
                      marginHorizontal: 10,
                      marginVertical: 5,
                      overflow: "hidden",
                    }}
                    activeOpacity={0.9}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 15,
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                        >
                          {CONSTANT.YourPayoutDate}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                        >
                          {item.processed_date}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 15,
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                        >
                          {CONSTANT.YourPayoutPayoutDetails}
                        </Text>
                        {item.payment_details.hasOwnProperty(
                          "bank_account_number"
                        ) ? (
                          <Text
                            style={{
                              fontSize: 15,
                              marginHorizontal: 10,
                              marginVertical: 5,
                            }}
                          >
                            {item.payment_details.bank_account_number.slice(0, 4) +
                              "****"}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 15,
                              marginHorizontal: 10,
                              marginVertical: 5,
                            }}
                          >
                            {CONSTANT.YourPayoutNoDetail}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 15,
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                        >
                          {CONSTANT.YourPayoutAmount}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                        >
                          {entities.decode(item.currency_symbol)}
                          {item.amount}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 15,
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                        >
                          {CONSTANT.YourPayoutPaymentMethod}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                        >
                          {item.payment_method}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                ListFooterComponent={this.renderFooter.bind(this)}
              />
            ) : null}
          </View>
          :
          <View style={[styles.NoDataMainArea, {marginTop: spinner ? 100 : 0}]}>
            <Image style={styles.NoDataImageStyle}
              source={require('../Images/nodata.png')}
            />
          </View>
        }
      </View>
    );
  }
}
export default withNavigation(YourPayouts);
