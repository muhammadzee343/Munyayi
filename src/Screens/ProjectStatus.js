import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import Styles from "../Constants/Styles";
import * as CONSTANT from "../Constants/Constant";

class ProjectStatusScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.fetchFreelancerData();
  }
  fetchFreelancerData = async () => {
    const { params } = this.props.navigation.state;
    //Alert.alert('hello', JSON.stringify(params.profile_id) )
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_freelancers?listing_type=single&profile_id=" +
        params.profile_id
    );
    const json = await response.json();
    this.setState({ fetchFreelancer: json });
    this.setState({ fetchSkills: json[0].skills });
    this.setState({ fetchAwards: json[0]._awards });
    this.setState({ fetchReviews: json[0].reviews });
    this.setState({ fetchProjects: json[0]._projects });
    this.setState({ fetchExperience: json[0]._experience });
    this.setState({ fetchContent: json[0].content });
    this.setState({ fetchPerHourRate: json[0]._perhour_rate });
    this.setState({ fetchLocation: json[0].location._country });
    this.setState({ fetchRating: json[0].wt_average_rating });
    this.setState({ fetchEducation: json[0]._educations, isLoading: false });
    this.getUser();
    //Alert.alert('content', JSON.stringify(this.state.fetchFreelancer[0].content) )
  };
  render() {
    return (
      <View>
        {this.state.fetchContent != "" && (
          <View style={Styles.section}>
            <Text style={Styles.MainHeadingTextStyle}>
              {CONSTANT.DetailFreelancerAbout}
            </Text>
            {this.state.fetchFreelancer && (
              <HTML
                baseFontStyle={Styles.ParagraphTextStyle}
                html={this.state.fetchContent}
                imagesMaxWidth={Dimensions.get("window").width}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

export default ProjectStatusScreen;
