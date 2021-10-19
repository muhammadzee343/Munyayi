import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewBase } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
class LatestJobsCard extends Component {
  render() {
    return (
        <View >
      <View style={styles.shadow}>
          <View
              style={{
                
                flexDirection: "row",
                paddingLeft: 10,
                paddingRight: 10,
                alignItems: "center"
              }}>
              <AntIcon
                name="checkcircle"
                color={"#02CC65"}
                size={13}
                style={{ alignItems: "center" }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  overflow: "hidden",
                  marginTop: 1,
                  marginLeft: 10,
                  color: "#323232",
                  textAlign: "left",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                {CONSTANT.LatestJobsCardEmeraldMorison}
              </Text>
            </View>

            <View
                style={{
                
                  alignSelf: "auto"
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    height: 22,
                    fontWeight: "700",
                    overflow: "hidden",
                    textAlign: "left",
                    color: "#323232",
                    marginBottom: 10,
                    marginLeft:10,
                    top:5,
                  }}
                >
                  {CONSTANT.LatestJobsCardForestPathologyProfessor}
                </Text>
              </View>
              <View style={{ flexDirection: "row",
              marginBottom:5,
                paddingLeft: 10,
                paddingRight: 10,
                alignItems: "center" , justifyContent:'space-between'}}>
                 <View style={{flexDirection:'row' , justifyContent:'center' , alignItems:"center"}}>
                 <AntIcon
                name="mail"
                color={"#02CC65"}
                size={13}
                style={{ alignItems: "center" }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  overflow: "hidden",
                  marginTop: 1,
                  marginLeft: 10,
                  color: "#323232",
                  textAlign: "left",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
               {CONSTANT.LatestJobsCardMediumlevel}
              </Text>
                 </View>
                 <View  style={{flexDirection:'row' , justifyContent:'center' , alignItems:"center"}}>
                 <AntIcon
                name="checkcircle"
                color={"#02CC65"}
                size={13}
                style={{ alignItems: "center" }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  overflow: "hidden",
                  marginTop: 1,
                  marginLeft: 10,
                  color: "#323232",
                  textAlign: "left",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                {CONSTANT.LatestJobsCardEmeraldMorison}
              </Text>
                 </View>

              </View>
              <View  style={{flexDirection:'row', alignItems:"center" , marginLeft:10 , marginBottom:5}}>
                 <AntIcon
                name="checkcircle"
                color={"#02CC65"}
                size={13}
                style={{ alignItems: "center" }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  overflow: "hidden",
                  marginTop: 1,
                  marginLeft: 10,
                  color: "#323232",
                  textAlign: "left",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                {CONSTANT.LatestJobsCardEmeraldMorison}
              </Text>
                 </View>
                 <View  style={{flexDirection:'row', alignItems:"center" , marginLeft:10 , marginBottom:5 }}>
                     <View style={{flexDirection:'row'}}>

                     <Image
                     style={{height:30 , width:30 , borderRadius:15 , borderColor:"#fff" , borderWidth:4}}
                            source={require('../Images/slidethree.jpg')}
                        />
                        <Image
                     style={{height:30 , width:30 , borderRadius:15 , borderColor:"#fff" , borderWidth:4 , marginLeft: -13}}
                            source={require('../Images/slidetwo.jpg')}
                        />
                        <Image
                     style={{height:30 , width:30 , borderRadius:15 , borderColor:"#fff" , borderWidth:4 , marginLeft: -13}}
                            source={require('../Images/slideone.jpg')}
                        />
                        <Image
                     style={{height:30 , width:30 , borderRadius:15 , borderColor:"#fff" , borderWidth:4 , marginLeft: -13}}
                            source={require('../Images/guest.png')}
                        />
                        </View>
                         <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  overflow: "hidden",
                  marginTop: 1,
                  marginLeft: 10,
                  color: "#323232",
                  textAlign: "left",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                {CONSTANT.LatestJobsCardProposals} 
              </Text>
                 </View>
              <View style={{height:40,flexDirection: 'row', borderTopColor:'#ddd', borderTopWidth:0.5}}>
            
            
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate("ForgetPassword")}
              style={{width: "100%" }}>
              <Text style={{ color: "#323232", alignSelf: 'center', fontSize: 12, top: 12 }}>{CONSTANT.LatestJobsCardEditJob}</Text>
            </TouchableOpacity>
          </View>
      </View>
      </View>
    );
  }
}
export default LatestJobsCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  shadow: {
      paddingTop:10,
    display: "flex",
    margin: 5,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    flexDirection: "column",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "transparent",
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "#000",
    shadowOpacity: 0.1,
  }
});
