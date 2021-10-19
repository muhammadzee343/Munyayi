import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import CompleteJobLayout from '../Home/CompleteJobLayout';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import SimpleHeader from '../Header/SimpleHeader';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
class JobbyCategorylist extends Component {
  state = {
    data: [],
    isLoading: true,
    fetchJobs: [],
  };
  componentDidMount() {
    this.fetchJobData();
  }
  fetchJobData = async () => {
    const {params} = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        'listing/get_jobs?listing_type=search&category=' +
        params.slug,
    );
    const json = await response.json();
    this.setState({fetchJobs: json, isLoading: false});
  };
  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.HomeJobsByCategory}/>
        {isLoading && (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        )}
        {this.state.fetchJobs.length >= 1 &&
        'employer_name' in this.state.fetchJobs[0] ? (
          <FlatList
            data={this.state.fetchJobs}
            keyExtractor={(a, b) => b.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.props.navigation.navigate('DetailJobScreen', {
                    job_id: item.job_id,
                  })
                }>
                <CompleteJobLayout
                  Completejobname={`${entities.decode(item.employer_name)}`}
                  featuredCompleteJobColor={`${entities.decode(
                    item.featured_color,
                  )}`}
                  imageUriCompleteJobfeatured={{uri: `${item.featured_url}`}}
                  Completejobtitle={`${entities.decode(item.project_title)}`}
                  jobflagimageUri={{uri: `${item.location.flag}`}}
                  Completejoblevel={`${entities.decode(
                    item.project_level.level_title,
                  )}`}
                  Completejobcountry={`${entities.decode(
                    item.location._country,
                  )}`}
                  Completejobrate={(item.project_cost)}
                  Completejobhourlyhours={(item.hourly_rate)}
                  Completejobestimatedhours={(item.estimated_hours)}
                  Completejobduration={`${entities.decode(
                    item.project_duration,
                  )}`}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.NoDataMainArea}>
            <Image
              resizeMode={'contain'}
              style={styles.NoDataImageStyle}
              source={require('../Images/nodata.png')}
            />
          </View>
        )}
      </View>
    );
  }
}
export default withNavigation(JobbyCategorylist);
