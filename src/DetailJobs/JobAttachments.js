import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import styles from '../Constants/Styles';
class JobAttachments extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={[styles.JobAttachmentsArea, styles.Elevation]}
        >
          <Image
            style={styles.JobAttachmentsImageStyle}
            source={{ uri: "https://i.postimg.cc/VkzqqNsp/Untitled-1.png" }}
          />
          <Text
            style={[styles.NameTextStyle, {textAlign:'center'}]}
          >
            {this.props.attachmentName}
          </Text>
          <Text
            style={styles.NameTextStyle}
          >
            {this.props.attachmentSize}
          </Text>
        </View>
      </View>
    );
  }
}
export default JobAttachments;
