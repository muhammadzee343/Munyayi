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
  ScrollView,
  ImageBackground,
  Alert
} from "react-native";
import { Header } from "react-native-elements";
import CustomHeader from "../Header/CustomHeader";
import { NavigationEvents } from 'react-navigation';
import AntIcon from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import SimpleHeader from '../Header/SimpleHeader';
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class CompletedJobs extends Component {
  constructor() {
    super();
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
    data: [],
    isLoading: true,
    Toataldata: "",
    page: 1,
    fetching_from_server: false,
    fetchCompletedJobs:[],
     storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    permissionChat:"",
    showAlert: false
  };
  this.offset = 1;
}
  componentDidMount() {
    this.getUser();
    this.fetchCompletedJobs();
  }
  getUser = async () => {
    try {
      const permissionChat = await AsyncStorage.getItem("chatPermission");
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const type = await AsyncStorage.getItem("profileType");
      const id = await AsyncStorage.getItem("projectUid");

      //  console.log(storedValue ,storedType, profileImg  ,type , id);
      if (storedValue !== null) {
        this.setState({ storedValue });
      } else {
        // alert('something wrong')
      }
      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
      if (profileImg !== null) {
        this.setState({ profileImg });
      } else {
        //  alert('something wrong')
      }
      if (type !== null) {
        this.setState({ type });
      } else {
        //  alert('something wrong')
      }
      if (id !== null) {
        this.setState({ id });
      } else {
        //  alert('something wrong')
      }
      if (permissionChat !== null) {
        this.setState({ permissionChat });
      } else {
        //  alert('something wrong')
      }
    } catch (error) {
      // alert(error)
    }
  };
  fetchCompletedJobs = async () => {
    const Pid = await AsyncStorage.getItem("projectUid");
    const storedType = await AsyncStorage.getItem("user_type");
    if(storedType == "freelancer"){
      const response = await fetch(
        CONSTANT.BaseUrl + "dashboard/get_completed_jobs?user_id=" + Pid
      );
      const json = await response.json();
      if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
        this.setState({ fetchCompletedJobs: [] }); // empty data set 
      } else {
        this.setState({ fetchCompletedJobs: json  , isLoading:false},
          );
      }
    }else{
      const response = await fetch(
        CONSTANT.BaseUrl + "dashboard/manage_employer_jobs?type=completed&user_id=" + Pid
      );
      const json = await response.json();
      if (Array.isArray(json) && json[0] && json[0].type && json[0].type === 'error') {
        this.setState({ fetchCompletedJobs: [] }); // empty data set 
      } else {
        this.setState({ fetchCompletedJobs: json  , isLoading:false},
          );
      }
    }
    
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
    const { storedValue, storedType, profileImg, permissionChat ,showAlert } = this.state;
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.ManageJobsCompletedJobs}/>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        {this.state.fetchCompletedJobs.length >= 1 ? 
          <View style={{flex: 1,}}>
            <View style={[styles.section, styles.ManageJobsProjectsInfoArea, {justifyContent:'space-between'}]}>
              <Text style={styles.MainHeadingTextStyle}>{CONSTANT.ManageJobsCompletedProjects}</Text>
              <Text style={[styles.NameTextStyle, {color:CONSTANT.TextColorBlue}]}>{CONSTANT.ManageJobsShowAll}</Text>
            </View>

            <FlatList
              data={this.state.fetchCompletedJobs}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item ,index }) => (
                <TouchableOpacity 
                  onPress={()=> this.props.navigation.navigate("DetailOngoing", 
                  {
                    ID : item.ID , 
                    Proposal_id : item.proposal_id , 
                    title : item.title,
                    level: item.project_level,
                    type: item.project_type,
                    location_name: item.location_name,
                    location_flag : item.location_flag , 
                    employer_name: item.employer_name,
                    employer_img: item.employer_avatar,
                    employer_verified: item.employer_verified,
                    Freelance_id: item.freelance_id,
                    freelancer_name: item.hired_freelancer_title,
                    freelancer_img: item.hired_freelancer_img,
                    duration: item.project_duration,
                    attachments: item.attachments
                  })} 
                  activeOpacity={.7} 
                  style={styles.section}>
                  <View 
                    style={[styles.ManageJobsProjectsMainArea, styles.Elevation]}>
                    <View style={styles.ManageJobsProjectsImageArea}>
                        <Image 
                        resizeMode={"contain"}
                        source={require('../Images/demo.png')} />
                    </View>
                    <View style={[styles.ManageJobsProjectsInfoArea]}>
                      {
                        item.employer_verified == "yes" &&
                        <AntIcon name="checkcircle" size={12} color={"#00cc67"} /> 
                      }
                      <Text numberOfLines={1} style={[styles.NameTextStyle,{marginLeft:10}]}>
                        {item.employer_name}
                      </Text>
                    </View>
                    <View style={[styles.ManageJobsProjectsInfoArea]}>
                      <Text numberOfLines={1} style={[styles.SectionHeadingTextStyle, {marginVertical:10}]}>
                        {item.title}
                      </Text>
                    </View>
                    <View style={[styles.ManageJobsProjectsInfoArea,{flexWrap:'wrap', marginBottom:10, width:'100%'}]}>
                      <View style={[styles.ManageJobsProjectsInfoArea, {width:'50%', height: 30}]}>
                        <Octicons name="briefcase" size={12} color={"#47C3EE"} /> 
                        <Text numberOfLines={1} style={[styles.ParagraphTextStyle,{marginLeft:10}]}>
                          {item.project_level}
                        </Text>
                      </View>
                      <View style={[styles.ManageJobsProjectsInfoArea, {width:'50%', height: 30}]}>
                        <Image 
                          style={{width:15, height:8}}
                          source={{ uri: `${item.location_flag}` }}  
                        />
                        <Text numberOfLines={1} style={[styles.ParagraphTextStyle,{marginLeft:10}]}>
                          {item.location_name}
                        </Text>
                      </View>
                      <View style={[styles.ManageJobsProjectsInfoArea, {width:'50%', height: 30}]}>
                        <Octicons name="project" size={12} color={"#FFA500"} />
                        <Text numberOfLines={1} style={[styles.ParagraphTextStyle,{marginLeft:10}]}>
                          {item.project_type}
                        </Text>
                      </View>
                      {item.project_duration &&
                        <View style={[styles.ManageJobsProjectsInfoArea, {width:'50%', height: 30}]}>
                        <Octicons name="clock" size={12} color={"#32CD32"} /> 
                        <Text numberOfLines={1} style={[styles.ParagraphTextStyle,{marginLeft:10}]}>
                          {item.project_duration}
                        </Text>
                      </View>}
                    </View>
                    { item.hired_freelancer_title == null ?
                      <View style={styles.ManageJobsProjectsFreelancerMainArea}>
                        <View style={styles.ManageJobsProjectsInfoArea}>
                          <Image 
                            style={styles.ManageJobsProjectsFreelancerImageStyle}
                            source={{ uri: `${item.employer_avatar}` }}  
                          />
                          <Text numberOfLines={1} style={[styles.NameTextStyle,{marginLeft:10}]}>
                            {item.employer_name}
                          </Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:'center'}}>
                          <Text numberOfLines={1} style={[styles.SectionHeadingTextStyle,{marginLeft:10, color:CONSTANT.TextColorGreen}]}>
                            {CONSTANT.ManageJobsEmployer}
                          </Text>
                        </View>
                      </View>
                      :
                      <View style={styles.ManageJobsProjectsFreelancerMainArea}>
                        <View style={styles.ManageJobsProjectsInfoArea}>
                          <Image 
                            style={styles.ManageJobsProjectsFreelancerImageStyle}
                            source={{ uri: `${item.hired_freelancer_img}` }}  
                          />
                          <Text numberOfLines={1} style={[styles.NameTextStyle,{marginLeft:10}]}>
                            {item.hired_freelancer_title}
                          </Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:'center'}}>
                          <Text numberOfLines={1} style={[styles.SectionHeadingTextStyle,{marginLeft:10, color:CONSTANT.TextColorGreen}]}>
                            {CONSTANT.ManageJobsHired}
                          </Text>
                        </View>
                      </View>
                    }
                  </View>
                </TouchableOpacity> 
              )}
            />
          </View>
          :
          <View style={styles.NoDataMainArea}>
            <Image
              resizeMode={'contain'}
              style={styles.NoDataImageStyle}
              source={require('../Images/nodata.png')}
            />
          </View>
        }
      </View>
    );
  }
}
export default CompletedJobs;
