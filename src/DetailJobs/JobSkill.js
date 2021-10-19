import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import styles from '../Constants/Styles';
class JobSkill extends Component {
  render() {
    return (
      <View style={{paddingHorizontal:20}}>
        <Text style={[styles.NameTextStyle, {marginBottom:10}]}>
          {this.props.skillName}
        </Text>
      </View>
    );
  }
}
export default JobSkill;
