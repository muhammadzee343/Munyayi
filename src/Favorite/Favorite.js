import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  AsyncStorage,
  ActivityIndicator, Alert
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Header } from "react-native-elements";
import { RadioGroup } from "react-native-btr";
const { width } = Dimensions.get("window");
import FreelancerCategory from "../Home/FreelancerCategory";
import CompleteJobLayout from "../Home/CompleteJobLayout";
import EmployerLayout from "../Home/EmployerLayout";
import ServiceLayout from "../Home/ServicesLayout";
import * as CONSTANT from '../Constants/Constant';
import SimpleHeader from "../Header/SimpleHeader";
import styles from "../Constants/Styles";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
export default class Favorite extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
      radioButtons: [
        {
          label: CONSTANT.FavoriteFreelancer,
          value: "freelancer",
          checked: true,
          color: "#323232",
          disabled: false,
          onPress: this.hide(),
          width: "33.33%",
          size: 7
        },

        {
          label: CONSTANT.FavoriteJobs,
          value: "jobs",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7
        },
        {
          label: CONSTANT.FavoriteEmployer,
          value: "employer",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7
        },
        // {
        //   label: CONSTANT.FavoriteService,
        //   value: "services",
        //   checked: false,
        //   color: "#323232",
        //   disabled: false,
        //   size: 7
        // }
      ],
      radioButtonsJob: [
        {
          label: CONSTANT.FavoriteFreelancer,
          value: "freelancer",
          checked: true,
          color: "#323232",
          disabled: false,
          onPress: this.hide(),
          size: 7
        },

        {
          label: CONSTANT.FavoriteJobs,
          value: "jobs",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },
        {
          label: CONSTANT.FavoriteEmployer,
          value: "employer",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },
      ],
      radioButtonsService: [
        {
          label: CONSTANT.FavoriteFreelancer,
          value: "freelancer",
          checked: true,
          color: "#323232",
          disabled: false,
          onPress: this.hide(),
          size: 7
        },
        {
          label: CONSTANT.FavoriteEmployer,
          value: "employer",
          checked: false,
          color: "#323232",
          disabled: false,
          size: 7
        },
        // {
        //   label: CONSTANT.FavoriteService,
        //   value: "services",
        //   checked: false,
        //   color: "#323232",
        //   disabled: false,
        //   size: 7
        // }
      ],
    };
    this.showFilters = true;
  }
  componentDidMount() {
    this.CheckApplicationAccess();
    this.fetchFreelancerData();
    this.fetchCompleteJobData();
    this.fetchCompleteCompanyData();
    this.fetchCompleteServiceData();
  }
  CheckApplicationAccess = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "user/get_access");
    const json = await response.json();
    this.setState({ ApplicationAccessServcie: json.access_type.service_access });
    this.setState({ ApplicationAccessJob: json.access_type.job_access });
  }
  fetchFreelancerData = async () => {
    const Pid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "listing/get_freelancers?listing_type=favorite&user_id=" + Pid
    );
    const json = await response.json();
    if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
      this.setState({ fetchFreelancer: [], isLoading: false, }); // empty data set 
    } else {
      this.setState({ fetchFreelancer: json, isLoading: false, });
    }
  };
  fetchCompleteJobData = async () => {
    const Pid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "listing/get_jobs?listing_type=favorite&user_id=" +
      Pid
    );
    const json = await response.json();
    if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
      this.setState({ fetchJobs: [], isLoading: false, }); // empty data set 
    } else {
      this.setState({ fetchJobs: json, isLoading: false, });
    }
  };
  fetchCompleteCompanyData = async () => {
    const Pid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "listing/get_employers?listing_type=favorite&user_id=" + Pid
    );
    const json = await response.json();
    if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
      this.setState({ fetchcompanies: [], isLoading: false, }); // empty data set 
    } else {
      this.setState({ fetchcompanies: json, isLoading: false, });
    }
  };
  fetchCompleteServiceData = async () => {
    const Pid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "services/get_services?listing_type=favorite&user_id=" + Pid
    );
    const json = await response.json();
    if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
      this.setState({ fetchservices: [], isLoading: false, }); // empty data set 
    } else {
      this.setState({ fetchservices: json, isLoading: false, });
    }
  };
  hide() {
    this.setState({ showFilters: false });
  }
  ListEmpty = () => {
    return (
      //View to show when list is empty
      <View style={{ justifyContent: "center", flex: 1, margin: 10 }}>
        <Text style={{ textAlign: "center" }}>No Data Found</Text>
      </View>
    );
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
  render() {
    let selectedItem = this.state.radioButtons.find(e => e.checked == true);
    selectedItem = selectedItem
      ? selectedItem.value
      : this.state.radioButtons[0].value;
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.FavoriteMyFavorites}/>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
          <View style={{ 
            alignSelf: 'center', 
            alignItems: 'center',  
            height: 45 
            }}>
            {
              this.state.ApplicationAccessServcie === "yes" && this.state.ApplicationAccessJob === "yes" ?
                <RadioGroup
                  color={CONSTANT.primaryColor}
                  labelStyle={{ fontSize: 10 }}
                  radioButtons={this.state.radioButtons}
                  onPress={radioButtons => this.setState({ radioButtons })}
                  style={styles.RadioButtonStyle}
                />
                : this.state.ApplicationAccessServcie === "yes" && this.state.ApplicationAccessJob === "" ?
                  <RadioGroup
                    color={CONSTANT.primaryColor}
                    labelStyle={{ fontSize: 10 }}
                    radioButtons={this.state.radioButtonsService}
                    onPress={radioButtons => this.setState({ radioButtons })}
                    style={styles.RadioButtonStyle}
                  /> : this.state.ApplicationAccessServcie === "" && this.state.ApplicationAccessJob === "yes" ?
                    <RadioGroup
                      color={CONSTANT.primaryColor}
                      labelStyle={{ fontSize: 10 }}
                      radioButtons={this.state.radioButtonsJob}
                      onPress={radioButtons => this.setState({ radioButtons })}
                      style={styles.RadioButtonStyle}
                    /> : null
            }
          </View>
          <ScrollView>
          
            {selectedItem == "freelancer" && this.state.fetchFreelancer &&(
              <View>
                {/*                 
                <View>
                  <Text style={{fontSize:18 , margin:10 , fontWeight:'700'}}>{this.state.fetchFreelancer[0].count_totals} Freelancers found:</Text>
                </View>
                 */}
            <FlatList
                data={this.state.fetchFreelancer}
                ListEmptyComponent={this._listEmptyComponent}
                keyExtractor={(y, z) => z.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      this.props.navigation.navigate("DetailFreelancerScreen", {
                        profile_id: item.profile_id,
                        user_id: item.user_id
                      })
                    }
                  >
                    <FreelancerCategory
                      imageUrifreelancer={{ uri: `${item.profile_img}` }}
                      imageUrifeatured={{ uri: `${item.badge.badget_url}` }}
                      featuredColor={`${entities.decode(
                        item.badge.badget_color
                      )}`}
                      flagimageUri={{ uri: `${item.location.flag}` }}
                      freelancername={`${entities.decode(item.name)}`}
                      title={`${entities.decode(item._tag_line)}`}
                      rate={`${entities.decode(item._perhour_rate)}`}
                      country={`${entities.decode(item.location._country)}`}
                    />
                  </TouchableOpacity>
                )}
              />
              </View>
              
            )}
            {selectedItem == "jobs" && this.state.fetchJobs && (
              <View>
                {/* <View>
                  <Text style={{fontSize:18 , margin:10 , fontWeight:'700'}}>{this.state.fetchJobs[0].count_totals} Jobs found:</Text>
                </View>
              */}
              <FlatList
                data={this.state.fetchJobs}
                ListEmptyComponent={this._listEmptyComponent}
                keyExtractor={(a, b) => b.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      this.props.navigation.navigate("DetailJobScreen", {
                        job_id: item.job_id
                      })
                    }
                  >
                    <CompleteJobLayout
                      Completejobname={`${entities.decode(item.employer_name)}`}
                      featuredCompleteJobColor={`${entities.decode(
                        item.featured_color
                      )}`}
                      imageUriCompleteJobfeatured={{
                        uri: `${item.featured_url}`
                      }}
                      Completejobtitle={`${entities.decode(
                        item.project_title
                      )}`}
                      jobflagimageUri={{ uri: `${item.location.flag}` }}
                      Completejoblevel={`${entities.decode(
                        item.project_level.level_title
                      )}`}
                      Completejobcountry={`${entities.decode(
                        item.location._country
                      )}`}
                      Completejobrate={(item.project_cost)}
                      Completejobhourlyhours={(item.hourly_rate)}
                      Completejobestimatedhours={(item.estimated_hours)}
                      Completejobduration={`${entities.decode(
                        item.project_duration
                      )}`}
                    />
                  </TouchableOpacity>
                )}
              />
               </View>
            )}
            {selectedItem == "employer" && (
              <FlatList
                data={this.state.fetchcompanies}
                ListEmptyComponent={this._listEmptyComponent}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      this.props.navigation.navigate("DetailCompanyScreen", {
                        profile_id: item.profile_id,
                        employ_id: item.employ_id
                      })
                    }>
                    <EmployerLayout
                      companBannerImage={{ uri: `${item.banner_img}` }}
                      companyProfileImage={{ uri: `${item.profile_img}` }}
                      companyName={`${entities.decode(item.name)}`}
                      companyTitle={`${entities.decode(item._tag_line)}`}
                      Fav_Color={`${entities.decode(item.favorit)}`}
                      fav_user_id={item.user_id}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
            {selectedItem == "services" && (
              <FlatList
                data={this.state.fetchservices}
                ListEmptyComponent={this._listEmptyComponent}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={{
                    backgroundColor: '#fff', 
                    flexDirection: 'column', 
                    borderRadius: 4, 
                    overflow: 'hidden', 
                    flex: 1, 
                    flexDirection: 'column', 
                    margin: 2, elevation: 5,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowColor: "#000",
                  }}
                    activeOpacity={0.9}
                    onPress={() =>
                      this.props.navigation.navigate(
                        "DetailServiceScreen",
                        { service_id: item.service_id }
                      )
                    }
                  >
                    <ServiceLayout
                      imageUri_banner={{ uri: `${item.images[0].url}` }}
                      imageUri_profile={{ uri: `${item.auther_image}` }}
                      service_name={`${entities.decode(item.auther_title)}`}
                      service_title={`${entities.decode(item.title)}`}
                      service_price={`${entities.decode(item.price)}`}
                      service_rating={`${entities.decode(item.total_rating)}`}
                    />
                  </TouchableOpacity>
                )}
                numColumns={2}
                keyExtractor={(item, index) => index}
              />
            )}
          </ScrollView>
      </View>
    );
  }
}
