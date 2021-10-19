import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
class CompanyJobCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 25,
            borderTopWidth: 25,
            borderTopLeftRadius: 4,
            borderRightColor: "transparent",
            borderTopColor: this.props.featuredColor
          }}
        />
        <View style={styles.shadow}>
          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignSelf: "auto"
            }}
          >
            <Text
              style={{
                fontSize: 14,
                height: 20,
                fontWeight: "300",
                overflow: "hidden",
                textAlign: "left",
                color: "#323232"
              }}>
              {this.props.Completejobname}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignSelf: "auto"
            }}
          >
            <Text
              style={{
                fontSize: 17,
                height: 25,
                fontWeight: "300",
                overflow: "hidden",
                textAlign: "left",
                color: "#323232",
                marginBottom: 10
              }}
            >
              {" "}
              {this.props.Completejobtitle}{" "}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              textAlign: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#00cc8d", size: 20 }}>$</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "300",
                overflow: "hidden",
                color: "#323232",
                marginLeft: 5,
                textAlign: "left"
              }}
            >
              {" "}
              {this.props.Completejoblevel}{" "}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              textAlign: "center",
              alignItems: "center"
            }}
          >
            <Image
              style={{
                resizeMode: "cover",
                paddingLeft: 10,
                height: 8,
                width: 15,
                marginTop: 15,
                alignItems: "center",
                alignItems: "center"
              }}
              source={this.props.jobflagimageUri}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "300",
                marginTop: 10,
                overflow: "hidden",
                marginLeft: 5,
                color: "#323232",
                textAlign: "left"
              }}
            >
              {" "}
              {this.props.Completejobcountry}{" "}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              textAlign: "center",
              alignItems: "center"
            }}
          >
            <AntIcon
              name="folder1"
              color={"#3498db"}
              size={13}
              style={{ marginTop: 10, alignItems: "center" }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "300",
                overflow: "hidden",
                marginTop: 10,
                marginLeft: 5,
                color: "#323232",
                textAlign: "left"
              }}
            >
              {" "}
              {this.props.Completejobrate}{" "}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              textAlign: "center",
              alignItems: "center"
            }}
          >
            <AntIcon
              name="clockcircleo"
              color={CONSTANT.primaryColor}
              size={13}
              style={{ marginTop: 10, alignItems: "center" }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "300",
                overflow: "hidden",
                marginTop: 10,
                marginLeft: 5,
                color: "#323232",
                textAlign: "left"
              }}
            >
              {" "}
              {this.props.Completejobduration}{" "}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#ffffff",
            alignSelf: "center",
            overflow: "visible",
            right: -12,
            top: 80,
            borderRadius: 50,
            borderWidth: 1,
            padding: 4,
            borderColor: "#dddddd"
          }}
        >
          <AntIcon
            name="heart"
            color={"#dddddd"}
            size={13}
            style={{
              alignSelf: "center",
              textAlign: "center",
              marginTop: 2,
              marginLeft: 1,
              marginRight: 1
            }}
          />
        </View>
      </View>
    );
  }
}
export default CompanyJobCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5
  }
});
