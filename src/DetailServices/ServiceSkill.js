import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
class ServiceSkill extends Component {
  render() {
    return (
      <View style={styles.ServiceSkillContainer}>
        <Text style={styles.OtherTextStyle}>{this.props.serviceskillName}</Text>
      </View>
    );
  }
}
export default ServiceSkill;
