import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Alert,
} from "react-native";
import { Header } from "react-native-elements";
import FreelancerCategory from "../Home/FreelancerCategory";
import CustomHeader from "../Header/CustomHeader";
import { NavigationEvents } from "react-navigation";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class Freelancers extends Component {
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
    this.fetchFreelancerData();
  }
  fetchFreelancerData = async () => {
    const Pid = await AsyncStorage.getItem("projectProfileId");
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_freelancers?listing_type=search&profile_id=" +
        Pid +
        "&page_number=" +
        this.offset
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ data: [], isLoading: false }); // empty data set
    } else {
      this.offset = this.offset + 1;
      this.setState({
        data: [...this.state.data, ...this.state.data.concat(json)],
        isLoading: false,
      });
      this.setState({ Toataldata: json[0].count_totals, isLoading: false });
    }
  };
  loadMoreData = async () => {
    const Pid = await AsyncStorage.getItem("projectProfileId");
    //On click of Load More button We will call the web API again
    this.setState({ fetching_from_server: true }, () => {
      fetch(
        CONSTANT.BaseUrl +
          "listing/get_freelancers?listing_type=search&profile_id=" +
          Pid +
          "&page_number=" +
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
              data: this.state.data.concat(responseJson),
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
  renderFooter() {
    return (
      //Footer View with Load More button
      <View>
        {this.state.Toataldata.toString() != this.state.data.length ? (
          <TouchableOpacity
            onPress={this.loadMoreData}
            style={styles.MainButtonArea}
          >
            <Text style={styles.ButtonText}>{CONSTANT.LoadMore}</Text>
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
        <CustomHeader />
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        {this.state.data != "" && (
          <View
            style={[
              styles.section,
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={{
                backgroundColor: "#147329",
                height: 30,
                borderRadius: 15,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <Text style={[styles.MainHeadingTextStyle, { color: "#fff" }]}>
                {this.state.data[0].count_totals}{" "}
              </Text>
              {this.state.data[0].count_totals == 1 ? (
                <Text style={[styles.MainHeadingTextStyle, { color: "#fff" }]}>
                  {CONSTANT.FreelancerFound}
                </Text>
              ) : (
                <Text style={[styles.MainHeadingTextStyle, { color: "#fff" }]}>
                  {CONSTANT.FreelancersFound}
                </Text>
              )}
            </View>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                this.props.navigation.navigate("DetailFreelancerScreen", {
                  profile_id: item.profile_id,
                  user_id: item.user_id,
                })
              }
            >
              <FreelancerCategory
                imageUrifreelancer={{ uri: `${item.profile_img}` }}
                imageUrifeatured={{ uri: `${item.badge.badget_url}` }}
                featuredColor={`${entities.decode(item.badge.badget_color)}`}
                flagimageUri={{ uri: `${item.location.flag}` }}
                freelancername={`${entities.decode(item.name)}`}
                title={`${entities.decode(item._tag_line)}`}
                rate={`${entities.decode(item._perhour_rate)}`}
                country={`${entities.decode(item.location._country)}`}
                Fav_Color={`${entities.decode(item.favorit)}`}
              />
            </TouchableOpacity>
          )}
          ListFooterComponent={this.renderFooter.bind(this)}
        />
      </View>
    );
  }
}
export default Freelancers;
