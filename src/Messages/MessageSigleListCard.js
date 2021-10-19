import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  Alert,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import * as CONSTANT from '../Constants/Constant';
import {Header} from 'react-native-elements';
class MessageSingleListCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            padding: 10,
          }}>
          <View style={{width: '10%'}}>
            <View style={styles.circle} />
          </View>

          <View style={styles.MainTopRatedStyle}>
            <View style={styles.ImageLayoutStyle}>
              <Image
                resizeMode="contain"
                style={styles.ImageStyle}
                source={this.props.image}
              />
            </View>
            <View style={styles.docContentstyle}>
              <View style={{flexDirection: 'row', marginTop: 2}}>
                <Text numberOfLines={1} style={styles.DocName}>
                  {this.props.name}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.titleStyle}>
                {this.props.message}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: CONSTANT.primaryColor,
                width: 25,
                height: 25,
                borderRadius: 12.5,
                justifyContent: 'center',
                alignSelf: 'center',
                alignContent: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{color: '#fff', alignSelf: 'center'}}>
                {this.props.count}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default MessageSingleListCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',

    width: '100%',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
  },
  MainTopRatedStyle: {
    width: '80%',
    flexDirection: 'row',
  },
  ImageStyle: {
    height: 60,
    width: 60,
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 30,
  },
  docContentstyle: {
    flexDirection: 'column',
    marginLeft: 10,
    width: '80%',
  },
  titleStyle: {
    color: '#6cb7f0',
    fontSize: 13,
  },
  ImageLayoutStyle: {
    elevation: 4,
    shadowColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  DocName: {
    color: '#3d4461',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#fe736e',
    marginRight: 5,
  },
});
