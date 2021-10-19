import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
class SelectedDocLayout extends Component {
  renderExpandor = () => {
    return (<Text>
      {CONSTANT.SelectedDocLayoutReadMore}
    </Text>);
  }
  renderCollapsar = () => {
    return (<Text>
      {CONSTANT.SelectedDocLayoutReadLess}
    </Text>);
  }
  render() {
    return (
      <TouchableOpacity elevation={5} style={styles.container}>
        <View style={{ padding: 10, backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, borderRadius: 10, marginBottom: 10 }}>
          <View style={{}}>
            {/* <TextTruncate
              style={{ fontSize: 13, fontWeight: '200', color: 'black', width: '100%' }}
              numberOfLines={1}
              renderExpandor={this.renderExpandor}
              renderCollapsar={this.renderCollapsar}> */}
              <Text style={{ width: '80%' }} >{this.props.docName}</Text>
            {/* </TextTruncate> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default SelectedDocLayout;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
