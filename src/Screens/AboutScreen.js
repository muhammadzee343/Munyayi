import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import Styles from "../Constants/Styles";
import * as CONSTANT from "../Constants/Constant";
import { connect } from "react-redux";
class AboutScreen extends PureComponent {
  state = {
    fetchContent: "",
    fetchFreelancer: "",
  };
  componentDidMount() {
    this.setState({
      fetchContent: this.props.FreelancerData.content,
      fetchFreelancer: this.props.FreelancerData,
    });
  }

  render() {
    console.log("receive FreelancerData in about screen", this.props.FreelancerData);
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

const mapStateToProps = (state) => {
  return {
    FreelancerData: state.FreelancerData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    SendFreelencerData: (param1) => dispatch(AddFreelancerDataAction(param1)),
  };
};

export default AboutScreen;
