import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Image,
  Alert,
} from "react-native";
import { Header } from "react-native-elements";
import CustomHeader from "../Header/CustomHeader";
import CompleteJobLayout from "../Home/CompleteJobLayout";
import { NavigationEvents } from "react-navigation";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class Jobs extends Component {
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
    this.fetchCompleteJobData();
    this.CheckApplicationAccess();
  }
  CheckApplicationAccess = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_access");
    const json = await response.json();
    this.setState({
      ApplicationAccessServcie: json.access_type.service_access,
    });
    this.setState({ ApplicationAccessJob: json.access_type.job_access });
  };
  fetchCompleteJobData = async () => {
    const Pid = await AsyncStorage.getItem("projectProfileId");
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_jobs?listing_type=search&profile_id=" +
        Pid +
        "&page_number=" +
        this.offset
    );
    // const json = await response.json();
    // this.setState({ fetchJobs: json, isLoading: false });
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
          "listing/get_jobs?listing_type=search&profile_id=" +
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
    const { isLoading, ApplicationAccessJob } = this.state;
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
        {ApplicationAccessJob != "" ? (
          <View>
            {this.state.data != "" && (
              <View
                style={[
                  styles.section,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    width: "40%",
                    backgroundColor: "#147329",
                    height: 30,
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={[styles.MainHeadingTextStyle, { color: "#fff" }]}
                  >
                    {this.state.data[0].count_totals}{" "}
                  </Text>
                  {this.state.data[0].count_totals == 1 ? (
                    <Text
                      style={[styles.MainHeadingTextStyle, { color: "#fff" }]}
                    >
                      {CONSTANT.JobFound}
                    </Text>
                  ) : (
                    <Text
                      style={[styles.MainHeadingTextStyle, { color: "#fff" }]}
                    >
                      {CONSTANT.JobsFound}
                    </Text>
                  )}
                </View>
              </View>
            )}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              keyExtractor={(a, b) => b.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    this.props.navigation.navigate("DetailJobScreen", {
                      job_id: item.job_id,
                    })
                  }
                >
                  <CompleteJobLayout
                    Completejobname={`${entities.decode(item.employer_name)}`}
                    featuredCompleteJobColor={`${entities.decode(
                      item.featured_color
                    )}`}
                    imageUriCompleteJobfeatured={{
                      uri: `${item.featured_url}`,
                    }}
                    Completejobtitle={`${entities.decode(item.project_title)}`}
                    jobflagimageUri={{ uri: `${item.location.flag}` }}
                    Completejoblevel={`${entities.decode(
                      item.project_level.level_title
                    )}`}
                    Completejobcountry={`${entities.decode(
                      item.location._country
                    )}`}
                    Completejobrate={item.project_cost}
                    Completejobhourlyhours={item.hourly_rate}
                    Completejobestimatedhours={item.estimated_hours}
                    project_type={`${entities.decode(item.project_type)}`}
                    fav_job_user_id={item.job_id}
                    Fav_Color={`${entities.decode(item.favorit)}`}
                    Completejobduration={`${entities.decode(
                      item.project_duration
                    )}`}
                  />
                </TouchableOpacity>
              )}
              ListFooterComponent={this.renderFooter.bind(this)}
            />
          </View>
        ) : (
          <View style={styles.NoDataMainArea}>
            <Image
              style={styles.NoDataImageStyle}
              source={require("../Images/noAccess.png")}
            />
            <Text></Text>
          </View>
        )}
      </View>
    );
  }
}
export default Jobs;
