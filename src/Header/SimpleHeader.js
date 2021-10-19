import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Button,
  StatusBar,
  TextInput,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {withNavigation, DrawerActions} from 'react-navigation';
import {I18nManager} from 'react-native';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';

class SimpleHeader extends Component {
  render() {
    return (
      <View>
        {/* {Platform.OS === 'ios' && <StatusBar hidden />} */}
        <StatusBar backgroundColor={CONSTANT.statusBarColor} barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} />
        <View
          style={[styles.HeaderMainArea,styles.Elevation]}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack(null)}
            style={styles.HeaderSection1}
          >
            <AntIcon name="back" size={25} color={"#fff"} 
              style={{
                transform:I18nManager.isRTL ? [{rotateY: '180deg'}] : [{rotateY: '0deg'}]
              }} />
          </TouchableOpacity>
          <View
            style={[styles.HeaderSection2,{backgroundColor:CONSTANT.primaryColor}]}>
            <Text
              style={[styles.SectionHeadingTextStyle,{color:CONSTANT.TextColorLight, fontWeight:'500'}]}
            >  
              {this.props.HeaderText}
            </Text>
          </View>
          <TouchableOpacity style={styles.HeaderSection1}/>
        </View>
      </View>
      // </TouchableOpacity>
    );
  }
}
export default withNavigation(SimpleHeader);
