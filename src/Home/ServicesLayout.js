import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";
import CardView from "react-native-cardview";
import { Card } from "react-native-elements";
class ServicesLayout extends Component {
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: "#ffffff",
            overflow: "hidden",
            borderRadius: 5,
            flexDirection: "row",
            flex: 1,
          },
        ]}
      >
        <View style={{ flex: 0.4 }}>
          <View style={{ backgroundColor: "#fff", padding: 5 }}>
            <Image
              style={{
                height: 110,
                // opacity: 0.6,
                // zIndex: 1,
                padding: 20,
                borderColor: "transparent",
                borderRadius: 10,
              }}
              source={this.props.imageUri_banner}
            ></Image>
          </View>
        </View>
        <View
          style={{
            flex: 0.45,
            height: "100%",
            padding: 5,
          }}
        >
          <Text style={styles.NameTextStyle}>{this.props.service_name}</Text>
          <Text style={[styles.SectionHeadingTextStyle, { marginBottom: 5 }]}>
            {this.props.service_title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              bottom: 0,
              marginBottom: 10,
              marginLeft: 10,
            }}
          >
            <Text style={styles.OtherTextStyle}>
              {this.props.service_rating}/5 {this.props.service_queue}{" "}
              {CONSTANT.HomeServiceinqueue}
            </Text>
          </View>
        </View>
        <View style={{ flex: 0.15 }}>
          <Image
            style={{
              height: 40,
              marginLeft: 5,
              width: 40,
              borderRadius: 20,
              borderColor: "#fff",
              borderWidth: 2,
              // marginTop: -20,
            }}
            source={this.props.imageUri_profile}
          />
          <View style={{ position: "absolute", bottom: 0, marginBottom: 5 }}>
            <Text
              style={[styles.SectionHeadingTextStyle, { color: "#fe736e" }]}
            >
              {this.props.service_price}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
export default ServicesLayout;
