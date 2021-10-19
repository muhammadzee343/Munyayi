import React, { Component } from "react";
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
  Platform
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Header } from "react-native-elements";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
class CustomHeader extends Component {
  state = {
    NotificationCount: '',
  };
  // componentDidMount() {
  //   this.CheckNotificationCount();
  // }
  // CheckNotificationCount = async () => {
  //   const Uid = await AsyncStorage.getItem('projectUid');
  //   const response = await fetch(CONSTANT.BaseUrl + 'user/notification_count?user_id=' + Uid);
  //   const json = await response.json();
  //   this.setState({NotificationCount: json.unread_notification_count});
  //   console.log('NotificationCount', this.state.NotificationCount)
  // };
  showSearch = () => {
    this.props.navigation.navigate("SearchScreen");
  };
  showNotification = () => {
    this.props.navigation.navigate("Notification");
  };
  toggleDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer())
  }
  render() {
    return (
      <View>
        {/* {Platform.OS === "android" ? */}
          <StatusBar backgroundColor={CONSTANT.statusBarColor} barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} />
           {/* : 
          <StatusBar hidden /> */}
        {/* } */}
        <View
          style={styles.HeaderMainArea}
        >
          <View
            style={styles.HeaderSection1}
          >
            <AntIcon name="menufold" size={25} color={"#fff"} onPress={this.toggleDrawer} />
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.showSearch}
            style={styles.HeaderSection2}
          >
            <Text
              style={[styles.SectionHeadingTextStyle,{color:CONSTANT.TextColorLight, fontWeight:'500'}]}
            >
              {CONSTANT.searchHeader}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            //onPress={this.showNotification}
            onPress={this.showSearch}
            style={styles.HeaderSection1}
          >
            <AntIcon name="search1" size={25} color={"#fff"} />
            { (this.state.NotificationCount != 0 ) &&
              <View style={{backgroundColor:'#000', marginRight:10, borderRadius:50, justifyContent: 'center', alignItems: 'center', position:'absolute', bottom:0, right: 5}}>
                <Text numberOfLines={1} NotificationCount={2} style={{color: '#fff', fontWeight:'700', paddingHorizontal: 5, paddingVertical: 2, fontSize:10, maxWidth:31}}>{this.state.NotificationCount <= 99 ? this.state.NotificationCount: '99+'}</Text> 
                {/* {this.state.NotificationCount} */}
              </View>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default withNavigation(CustomHeader);
