import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import StarRating from "react-native-star-rating";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
class FeedbackCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5
    };
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  render() {
    return (
      <View style={styles.section}>
        <View
          style={[styles.FeedbackCardMainArea, styles.Elevation]}
        >
          <View style={styles.FeedbackCardInfoArea}>
            <Image
              style={styles.FeedbackCardImageStyle}
              source={this.props.ReviewImage}
            />
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text
                style={styles.NameTextStyle}
              >
                {this.props.Reviewname}
              </Text>
              <Text style={styles.SectionHeadingTextStyle}>{this.props.Reviewtitle}</Text>
            </View>
          </View>
          <View
            style={styles.FeedbackCardDetailArea}
          >
            <View
              style={styles.FeedbackCardDetailSection}
            >
              <AntIcon
                name="staro"
                color={"#323232"}
                size={14}
              />
              <Text style={[styles.NameTextStyle, {fontSize:10}]}>{this.props.Reviewlevel}</Text>
            </View>
            <View
              style={styles.FeedbackCardDetailSection}
            >
              <AntIcon
                name="flag"
                color={"#323232"}
                size={14}
              />
              <Text style={[styles.NameTextStyle, {fontSize:10}]}>{this.props.ReviewLocation}</Text>
            </View>
            <View
              style={styles.FeedbackCardDetailSection}
            >
              <AntIcon
                name="carryout"
                color={"#323232"}
                size={14}
              />
              <Text style={[styles.NameTextStyle, {fontSize:10}]}>{this.props.ReviewDate}</Text>
            </View>
            <View
              style={styles.FeedbackCardDetailSection}
            >
              <AntIcon
                name="staro"
                color={"#323232"}
                size={14}
              />
              <StarRating
                disabled={true}
                maxStars={5}
                starSize={12}
                fullStarColor={"#fecb02"}
                emptyStarColor={"#fecb02"}
                rating={this.props.ReviewRating}
                selectedStar={rating => this.onStarRatingPress(rating)}
              />
            </View>
          </View>
          <Text
            style={[styles.NameTextStyle, {paddingHorizontal: 10,}]}
          >
            {this.props.ReviewContent}
          </Text>
        </View>
      </View>
    );
  }
}

export default FeedbackCard;
