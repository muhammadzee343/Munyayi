import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Alert,
  AsyncStorage
} from "react-native";
import { withNavigation } from "react-navigation";
import AntIcon from "react-native-vector-icons/AntDesign";
import LatestProposalCard from "./LatestProposalCard";
import SimpleHeader from '../Header/SimpleHeader';
import * as CONSTANT from "../Constants/Constant";
import styles from '../Constants/Styles';
import LatestJobsCard from  "../ManageEmployerJobs/LatestJobsCard";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class LatestProposals extends Component {
  state = {
    data: [],
    fetchProposal:[],
    isLoading: true,
  };
  componentDidMount() {
    this.fetchProposalData();
  }
  fetchProposalData = async () => {
    // const { params } = this.props.navigation.state;
    const uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "dashboard/get_my_proposals?user_id=" + uid
    );
    const json = await response.json();
    this.setState({ fetchProposal: json, isLoading: false });
  };
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.LatestProposals}/>
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
          this.state.fetchProposal.length >= 1 
          ?
          <FlatList
          data={this.state.fetchProposal}
          keyExtractor={(a, b) => b.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
            >
             <LatestProposalCard
             title={`${entities.decode(item.title)}`}
             job_title={`${entities.decode(item.job_title)}`}
             status={`${entities.decode(item.status)}`}
             price={`${entities.decode(item.budget)}`}
             duration={`${entities.decode(item.duration)}`}
             cover={`${entities.decode(item.cover)}`}
             ID={`${item.ID}`}
             job_type={`${entities.decode(item.job_type)}`}
             proposal_documents= {`${item.proposal_documents}`}
             proposal_milestone={`${entities.decode(item.proposal_milestone)}`}
             />
            </TouchableOpacity>
          )}
        />
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
export default withNavigation(LatestProposals);
