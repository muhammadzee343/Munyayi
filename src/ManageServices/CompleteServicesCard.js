import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Share,
  ImageBackground,
  ViewBase,
  Alert,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import StarRating from "react-native-star-rating";
import * as CONSTANT from "../Constants/Constant";
import styles from '../Constants/Styles';
import RBSheet from 'react-native-raw-bottom-sheet';
class CompletedServicesCard extends Component {
  state = {
    default_color_badge: "",
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    iconColor: "#dddddd",
    showAlert: false,
    isLoading: false,
  };

  render() {
    // Alert.alert("data" , JSON.stringify(this.props.service_title))
    return (
      <View style={{
        flex: 1,
        margin: 10,
        backgroundColor:'#fff',
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "#000",
        shadowOpacity: 0.2,
      }}>
        <View style={{ flexDirection: "row", padding: 10, flex: 4 }}>
          <View style={{ flexDirection: "row", flex: 3 }}>
            <View>
              <Image
                style={{ height: 70, width: 70, borderRadius: 5 }}
                source={this.props.featured_img}
              />
            </View>
            <View style={{ flexDirection: "column", marginLeft: 10, justifyContent:'center', width:'80%' }}>
              {this.props.is_featured == "yes" && (
                <Text
                  //numberOfLines={1}
                  style={{ fontSize: 10, color: "#767676" }}
                >
                  {CONSTANT.ManageServicesFeatured}
                </Text>
              )}

              <Text
                //numberOfLines={1}
                style={{
                  fontSize: 17,
                  marginRight: 10,
                  fontWeight: "700",
                  color: "#323232",
                }}
              >
                {this.props.service_title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 10, color: "#767676" }}
                >
                  {CONSTANT.ManageServicesStartingfrom}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: CONSTANT.primaryColor,
                  }}
                >
                  {" "}
                  {this.props.price}
                </Text>
              </View>
            </View>
          </View>
          
        </View>

        <Text style={{ marginLeft: 10, fontWeight: "700" }}>
          {CONSTANT.ManageServicesOrderBy}
        </Text>
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            padding: 10,
            backgroundColor: "#f7f7f7",
            alignItems: "center",
          }}
        >
          <View>
            <Image
              style={{height:40 , width:40 , borderRadius:20, borderColor:'#ddd', borderWidth:1}}
              source={this.props.employer_avatar}
            />
          </View>
          <View style={{ flexDirection: "column", marginLeft: 10 }}>
            <Text numberOfLines={1} style={{ fontSize: 13, color: "#767676" }}>
              {this.props.employer_title}
            </Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: 13, fontWeight: "700", color: "#323232" }}
            >
              {this.props.employertagline}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          activeOpacity={1}
          style={{marginHorizontal:10, marginVertical:10, flexDirection:'row', justifyContent: 'space-between',}}>
          <View
            style={{
              width:'49%',
              alignItems: 'center',
              // borderWidth:1,
              // borderColor:'#ddd',
              justifyContent: 'center',
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 14, textAlign: "center", bottom: 5 }}>
                {CONSTANT.ManageServicesRating}
              </Text>
              <View style={{flexDirection:'row', alignItems: 'center',}}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={14}
                  fullStarColor={"#fecb02"}
                  emptyStarColor={"#fecb02"}
                  rating={this.props.service_ratings}
                  selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
                <AntIcon
                  name="infocirlceo"
                  color={"#323232"}
                  size={14}
                  style={{marginLeft:10}}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => this.RBSheet.open()}
            style={{borderWidth:1, borderColor:'#ddd', width:'49%', height:40, borderRadius:5, backgroundColor:CONSTANT.primaryColor, justifyContent: 'center', alignItems: 'center',}}>
            <Text style={{color: "#ffffff", fontSize: 14, fontWeight:'700', textAlign:"center"}}>{CONSTANT.ManageServicesRating}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: 'transparent',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            },
          }}>
          <View style={{
              width: '100%',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              backgroundColor: CONSTANT.primaryColor,
              height: 55,
              justifyContent: 'center',
              fontWeight: '700',
            }}>
            <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
             {CONSTANT.ManageServicesServiceFeedback}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              width: '100%',
              overflow: 'hidden',
            }}>
            <View style={{padding:10, marginBottom:10}}>
              <Text>{this.props.feedback}</Text>
            </View>
            <FlatList
              data={this.props.rating_data}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={{flex: 1,}}>
                  <View style={{flexDirection:'row', alignItems: 'center', marginHorizontal:10}}>
                    <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'#f7f7f7', padding:10, marginRight:10, marginVertical:5, borderRadius:5}}>
                      <View style={{borderColor:'#ddd', borderWidth:1, borderRadius:5, width:30, height:30, justifyContent: 'center', alignItems:'center', backgroundColor:CONSTANT.primaryColor, marginRight:5}}>
                        <Text style={[styles.SectionHeadingTextStyle,{color: CONSTANT.TextColorLight}]}>{item.score}</Text>
                      </View>
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        starSize={14}
                        fullStarColor={"#fecb02"}
                        emptyStarColor={"#fecb02"}
                        rating={item.score}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                      />
                    </View>
                    <View style={{flex: 1,}}>
                      <Text style={styles.NameTextStyle}>{item.title}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </ScrollView>
          <View style={{width:'100%', backgroundColor:'#fff'}}>
            <TouchableOpacity 
              onPress={() => this.RBSheet.close()}
              style={styles.MainButtonArea}>
              <Text style={styles.ButtonText}>{CONSTANT.ManageServicesCardOK}</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    );
  }
}
export default CompletedServicesCard;
