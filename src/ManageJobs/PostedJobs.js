import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Alert
} from "react-native";
import { Header } from "react-native-elements";
import CustomHeader from "../Header/CustomHeader";
import PostedJobsCard from "./PostedJobsCard";
import { NavigationEvents } from 'react-navigation';
import * as CONSTANT from '../Constants/Constant';
import AntIcon from "react-native-vector-icons/AntDesign";
import SimpleHeader from '../Header/SimpleHeader';
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class PostedJobs extends Component {
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
  }
  fetchCompleteJobData = async() => {
    const Pid = await AsyncStorage.getItem("projectUid");
    //alert(Pid)
    const response = await fetch(
      CONSTANT.BaseUrl + "dashboard/manage_employer_jobs?user_id=" +
      Pid+ "&page_number=" +
      this.offset
    );
    const json = await response.json();
    if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
      this.setState({ data: [], isLoading: false });
    } else {
      this.offset = this.offset + 1;
      this.setState({
        data: [...this.state.data, ...this.state.data.concat(json)],
        isLoading: false
      });
    }
  };
  // loadMoreData = async() => {
  //   const Pid = await AsyncStorage.getItem("projectProfileId");
  //   //On click of Load More button We will call the web API again
    
  //   this.setState({ fetching_from_server: true }, () => {
  //     fetch(
  //       CONSTANT.BaseUrl + "dashboard/manage_employer_jobs?user_id=" +
  //       Pid+ "&page_number=" +
  //       this.offset
  //     )
  //       //Sending the currect offset with get request
  //       .then(response => response.json())
  //       .then(responseJson => {
  //         //Successful response from the API Call
  //         //After the response increasing the offset for the next API call.
  //         if (
  //           Array.isArray(responseJson) &&
  //           responseJson[0] &&
  //           responseJson[0].type &&
  //           responseJson[0].type === "error"
  //         ) {
  //           this.setState({ data: [], isLoading: false }); // empty data set
  //         } else {
  //           this.offset = this.offset + 1;
  //           this.setState({
  //             data: this.state.data.concat(responseJson),
  //             isLoading: false,
  //             fetching_from_server: false
  //           });
  //           // this.setState({Toataldata: responseJson[0].totals , isLoading: false});
  //         }
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   });
  // };
  renderFooter() {
    return (
      //Footer View with Load More button
      <View>
        {/* {this.state.Toataldata.toString() != this.state.data.length ? (
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={this.loadMoreData}
              style={styles.loadMoreBtn}>
              <Text style={styles.btnText}>Load More</Text>
              {this.state.fetching_from_server ? (
                <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
              ) : null}
            </TouchableOpacity>
          </View>
        ) : null} */}
      </View>
    );
  }
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.PostedJob} />
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
        {
          this.state.data != "" &&
          <View>
            {/* <Text style={{fontSize:18 , margin:10 , fontWeight:'700'}}>{this.state.data[0].count_totals} PostedJobs found:</Text> */}
          </View>
        }
        <FlatList
          data={this.state.data}
          keyExtractor={(a, b) => b.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              // onPress={() =>
              //   this.props.navigation.navigate("DetailJobScreen", {
              //     job_id: item.ID
              //   })
              // }
            >
              <PostedJobsCard
                Completejobname={`${entities.decode(item.employer_name)}`}
                featuredCompleteJobColor={`${entities.decode(
                  item.color
                )}`}
                type={`${entities.decode(item.project_type)}`}
                count={item.proposals_count}
                freelancerImages={item.freelancer_imges}
                imageUriCompleteJobfeatured={{ uri: "https:" + `${item.tag}` }}
                Completejobtitle={`${entities.decode(item.title)}`}
                jobflagimageUri={{ uri: `${item.location_flag}` }}
                Completejoblevel={`${entities.decode(
                  item.project_level
                )}`}
                Completejobcountry={`${entities.decode(
                  item.location_name
                )}`}
                Completejobrate={(item.project_cost)}
                Completejobhourlyhours={(item.hourly_rate)}
                Completejobestimatedhours={(item.estimated_hours)}
                fav_job_user_id={item.ID.toString()}
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
    );
  }
}
export default PostedJobs;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
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
});
