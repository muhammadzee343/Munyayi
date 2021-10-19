import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
class AwardCard extends Component {
  render() {
    return (
      <View style={styles.section}>
        <View
          style={[styles.AwardandProjectMainArea, styles.Elevation]}
        >
          <Image
            style={styles.AwardandProjectImageStyle}
            source={this.props.AwardImage}
          />
          <View
            style={styles.AwardandProjectInfoArea}
          >
            <Text
              style={styles.ParagraphTextStyle}
            >
              {this.props.AwardDate}
            </Text>
            <Text style={styles.NameTextStyle}>{this.props.AwardTitle}</Text>
          </View>
        </View>
      </View>
    );
  }
}
export default AwardCard;
