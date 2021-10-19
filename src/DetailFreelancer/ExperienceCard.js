import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import HTML from 'react-native-render-html';
class ExperienceCard extends Component {
  render() {
    return (
      <View style={styles.section}>
        <View
          style={[styles.EducationandExperienceMainArea, styles.Elevation]}
        >
          <Text style={styles.SectionHeadingTextStyle}>{this.props.title}</Text>
          <View style={[styles.EducationandExperienceIconArea, {marginBottom:10}]}>
            <AntIcon
              name="home"
              color={"#323232"}
              size={13}
            />
            <Text style={[styles.OtherTextStyle, {marginLeft: 5, marginRight:10}]}>
              {this.props.company}
            </Text>
            <AntIcon
              name="calendar"
              color={"#323232"}
              size={13}
            />
            <Text style={[styles.OtherTextStyle, {marginLeft: 5, marginRight:10}]}>
              {this.props.date}
            </Text>
          </View>
          <View>
            <HTML baseFontStyle={styles.NameTextStyle} html={this.props.content} />
          </View>
          {/* <Text style={{ fontSize: 13, paddingTop: 17 }}>
            {this.props.content}
          </Text> */}
        </View>
      </View>
    );
  }
}
export default ExperienceCard;
