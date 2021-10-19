import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import { WebView } from 'react-native-webview';
import SimpleHeader from "../Header/SimpleHeader";
class BuyServiceWebview extends Component {
  render() {
    const { params } = this.props.navigation.state;
    console.log('params url', params.url)
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.BuyServiceScreenBuyNow}/>
        <WebView source={{ uri: params.url }} />
      </View>
    );
  }
}
export default BuyServiceWebview;
