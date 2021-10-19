import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Share , ImageBackground, ViewBase , Alert } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import StarRating from "react-native-star-rating";
import * as CONSTANT from '../Constants/Constant';
class AddonsServicesCard extends Component {
  state = {
    default_color_badge: "",
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    iconColor: '#dddddd',
    showAlert: false,
    isLoading: false,
  };
  render() {
    return (
              <View style={styles.container}>
                <View style={{paddingLeft:10}}>
                  <Text style={{color:'#767676' , marginTop:15 , fontSize:13}}>{this.props.status}</Text>
                  <Text style={{color:'#323232' , fontWeight:'700' , fontSize:16}}>{this.props.title}</Text>
                  <Text style={{color:'#323232' , fontSize:16}}>{this.props.price}</Text>
                  <Text style={{color:'#767676' , fontSize:13}}>{this.props.description}</Text>
                  </View>
                  <View style={{height:40 , marginTop:15,flexDirection: 'row', borderTopColor:'#ddd', borderTopWidth:0.5}}>
            <TouchableOpacity 
              
              style={{width: "50%" , justifyContent:'center', borderRightWidth:0.5, borderRightColor:'#ddd' }}>
              <AntIcon
                name="edit"
                color={"#323232"}
                size={14}
                style={{ alignSelf: "center" , top:5 }}
              />
            </TouchableOpacity>
            <TouchableOpacity 
          
              style={{width: "50%" , justifyContent:'center' }}>
              <AntIcon
                name="delete"
                color={"#323232"}
                size={14}
                style={{ alignSelf: "center" , top:5 }}
              />
            </TouchableOpacity>
        </View>
              </View>
    );
  }
}
export default AddonsServicesCard;
const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'column', marginHorizontal:10 , marginVertical:2,
        backgroundColor:'#fff',
        borderRadius:5,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "#000",
        shadowOpacity: 0.2,

      },
});
