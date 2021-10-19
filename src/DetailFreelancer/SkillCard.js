import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
class SkillCard extends Component {
  render() {
    const barWidth = Dimensions.get('screen').width - 45;
    const progressCustomStyles = {
      backgroundColor: CONSTANT.primaryColor,
      borderRadius: 4,
      borderColor: '#fff',
    };
    return (
      <View>
        <View
          style={styles.SkillCardInfoArea}
        >
          <Text style={styles.NameTextStyle}>{this.props.skillname}</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.NameTextStyle}>{this.props.skillValue}</Text>
            {this.props.skillDisplayType != 'year' ? 
              <Text> %</Text> :
              <Text>{this.props.skillValue == 1 ? ' year' : ' years'}</Text> 
            }
          </View>
        </View>
        <View style={styles.SkillCardProgressBarStyle}>
          <ProgressBarAnimated
            {...progressCustomStyles}
            width={barWidth}
            height={7}
            value={this.props.skillValue}
            backgroundColorOnComplete="#6CC644"
          />
        </View>
      </View>
    );
  }
}
export default SkillCard;
