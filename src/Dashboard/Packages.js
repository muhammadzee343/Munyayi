import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  FlatList,
  Dimensions,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Carousel from "react-native-snap-carousel";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from "../Constants/Constant";
import HTML from "react-native-render-html";
import axios from "axios";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
const { width: viewportWidth } = Dimensions.get("window");
class Packages extends Component {
  state = {
    data: [],
    default_color: "#fff",
    storedValue: "",
    storedType: "",
    profileImg: "",
    type: "",
    id: "",
    Pid: "",
    isLoading: true,
    fetchPackages: [],
    Name: "",
    address: "",
    location: "",
    Notes: "",
    Customerid: "",
    S_address1: "",
    S_city: "",
    S_company: "",
    S_country: "",
    S_first_name: "",
    S_last_name: "",
    S_state: "",
    B_address1: "",
    B_city: "",
    B_conpany: "",
    B_country: "",
    B_email: "",
    B_first_name: "",
    B_last_name: "",
    B_phone: "",
    B_state: "",
  };
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.getPacakage();
    this.getUser();
  }
  getPacakage= async()=>{
    const User_Type = await AsyncStorage.getItem("user_type");
    if(User_Type == "freelancer"){
      const response = await fetch(
        CONSTANT.BaseUrl + "dashboard/get_packages?user_type=freelancer"
      );
      const json = await response.json();
      this.setState({ fetchPackages: json.pakcages, isLoading: false });
    }else{
      const response = await fetch(
        CONSTANT.BaseUrl + "dashboard/get_packages?user_type=employer"
      );
      const json = await response.json();
      this.setState({ fetchPackages: json.pakcages, isLoading: false });
    }
  }
  getUser = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const type = await AsyncStorage.getItem("profileType");
      const id = await AsyncStorage.getItem("projectUid");
      const Address = await AsyncStorage.getItem("Address");
      const Location = await AsyncStorage.getItem("Location");
      const s_address1 = await AsyncStorage.getItem("shipping_address1");
      const s_city = await AsyncStorage.getItem("shipping_city");
      const s_company = await AsyncStorage.getItem("shipping_company");
      const s_country = await AsyncStorage.getItem("shipping_country");
      const s_first_name = await AsyncStorage.getItem("shipping_first_name");
      const s_last_name = await AsyncStorage.getItem("shipping_last_name");
      const s_state = await AsyncStorage.getItem("shipping_state");
      const b_address1 = await AsyncStorage.getItem("billing_address_1");
      const b_city = await AsyncStorage.getItem("billing_city");
      const b_conpany = await AsyncStorage.getItem("billing_company");
      const b_country = await AsyncStorage.getItem("billing_country");
      const b_email = await AsyncStorage.getItem("billing_email");
      const b_first_name = await AsyncStorage.getItem("billing_first_name");
      const b_last_name = await AsyncStorage.getItem("billing_last_name");
      const b_phone = await AsyncStorage.getItem("billing_phone");
      const b_state = await AsyncStorage.getItem("billing_state");
      if (storedValue !== null) {
        this.setState({ Name: storedValue });
      } else {
        // alert('something wrong')
      }
      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
      if (profileImg !== null) {
        this.setState({ profileImg });
      } else {
        //  alert('something wrong')
      }
      if (type !== null) {
        this.setState({ type });
      } else {
        //  alert('something wrong')
      }
      if (id !== null) {
        this.setState({ Customerid: id });
      } else {
        //  alert('something wrong')
      }
      if (Address !== null) {
        this.setState({ address: Address });
      } else {
        //  alert('something wrong')
      }
      if (Location !== null) {
        this.setState({ location: Location });
      } else {
        //  alert('something wrong')
      }
      if (s_address1 !== null) {
        this.setState({ S_address1: s_address1 });
      } else {
        //  alert('something wrong')
      }
      if (s_city !== null) {
        this.setState({ S_city: s_city });
      } else {
        //  alert('something wrong')
      }
      if (s_company !== null) {
        this.setState({ S_company: s_company });
      } else {
        //  alert('something wrong')
      }
      if (s_country !== null) {
        this.setState({ S_country: s_country });
      } else {
        //  alert('something wrong')
      }
      if (s_first_name !== null) {
        this.setState({ S_first_name: s_first_name });
      } else {
        //  alert('something wrong')
      }
      if (s_last_name !== null) {
        this.setState({ S_last_name: s_last_name });
      } else {
        //  alert('something wrong')
      }
      if (s_state !== null) {
        this.setState({ S_state: s_state });
      } else {
        //  alert('something wrong')
      }
      if (b_address1 !== null) {
        this.setState({ B_address1: b_address1 });
      } else {
        //  alert('something wrong')
      }
      if (b_city !== null) {
        this.setState({ B_city: b_city });
      } else {
        //  alert('something wrong')
      }
      if (b_conpany !== null) {
        this.setState({ B_conpany: b_conpany });
      } else {
        //  alert('something wrong')
      }
      if (b_country !== null) {
        this.setState({ B_country: b_country });
      } else {
        //  alert('something wrong')
      }
      if (b_email !== null) {
        this.setState({ B_email: b_email });
      } else {
        //  alert('something wrong')
      }
      if (b_first_name !== null) {
        this.setState({ B_first_name: b_first_name });
      } else {
        //  alert('something wrong')
      }
      if (b_last_name !== null) {
        this.setState({ B_last_name: b_last_name });
      } else {
        //  alert('something wrong')
      }
      if (b_phone !== null) {
        this.setState({ B_phone: b_phone });
      } else {
        //  alert('something wrong')
      }
      if (b_state !== null) {
        this.setState({ B_state: b_state });
      } else {
        //  alert('something wrong')
      }
    } catch (error) {
      // Error saving data
      // alert(error)
      console.log(error);
    }
  };
  updatePackage = async (id)=>{
    this.setState({ isLoading: true });
    const { params } = this.props.navigation.state;
    const {
      Uid,
      Notes,
      Customerid,
      S_address1,
      S_city,
      S_company,
      S_country,
      S_first_name,
      S_last_name,
      S_state,
      B_address1,
      B_city,
      B_conpany,
      B_country,
      B_email,
      B_first_name,
      B_last_name,
      B_phone,
      B_state,
    } = this.state;
    var billing_info_map = {};
    billing_info_map["address_1"] = B_address1;
    billing_info_map["city"] = B_city;
    billing_info_map["company"] = B_conpany;
    billing_info_map["country"] = B_country;
    billing_info_map["email"] = B_email;
    billing_info_map["first_name"] = B_first_name;
    billing_info_map["last_name"] = B_last_name;
    billing_info_map["phone"] = B_phone;
    billing_info_map["state"] = B_state;
    var shipping_info_map = {};
    shipping_info_map["address_1"] = S_address1;
    shipping_info_map["city"] = S_city;
    shipping_info_map["company"] = S_company;
    shipping_info_map["country"] = S_country;
    shipping_info_map["first_name"] = S_first_name;
    shipping_info_map["last_name"] = S_last_name;
    shipping_info_map["state"] = S_state;
    var payment_data_map_array = {};
    payment_data_map_array["order_type"] = "package";
    payment_data_map_array["product_id"] = id;
    payment_data_map_array["customer_id"] = Customerid;
    payment_data_map_array["customer_note"] = Notes;
    payment_data_map_array["shipping_methods"] = "stripe";
    payment_data_map_array["sameAddress"] = "1";
    payment_data_map_array["billing_info"] = billing_info_map;
    payment_data_map_array["shipping_info"] = shipping_info_map;
    var payment_data = JSON.stringify(payment_data_map_array);
    axios
      .post(
        CONSTANT.BaseUrl + "dashboard/create_checkout_page",
        {
          payment_data: payment_data
        }
      )
      .then(async response => {
        if (response.status === 200) {
          Alert.alert(response.data.message);
          this.setState({ isLoading: false });
          this.props.navigation.navigate("BuyServiceWebview", { url: response.data.url });
          console.log('url package', response.data.url)
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert("Error", response.data.message);
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={style_pakages.container}>
        <View style={style_pakages.pakagetitle}>
          <Text style={style_pakages.titletext}>{item.title}</Text>
        </View>
        <View style={style_pakages.cardmain}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {/* <Image
              style={style_pakages.pakage_image}
              source={require("../../Assets/Images/package_bgimage2.png")}
              /> */}

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={style_pakages.price}>{CONSTANT.PackagesPrice} {item.price}</Text>
              <HTML
                html={item.symbol}
                style={{ color: "#323232", fontSize: 25 }}
              />
            </View>
              <Text style={style_pakages.taxes}>
              {CONSTANT.Packagesincludealltaxes}{" "}
              <Text>
                {" "}
                <FontAwesome
                  name="question-circle-o"
                  size={14}
                  color={"#b4b4b4"}
                />
              </Text>{" "}
            </Text>
          </View>
        </View>
        
        <View style={style_pakages.featured}>
         
          <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ paddingLeft: 5, marginTop: 8 , marginBottom:15 }}
              data={this.state.fetchPackages[index].features}
              extraData={this.state}
              renderItem={({ item, index }) => (
                <TouchableOpacity>

            
                {
                  index % 2 === 0 ? 
                  <View
                  style={{
                    flexDirection: "row",
                    marginRight: 10,
                    padding: 10,
                    backgroundColor:'#f7f7f7'
                  }}
                  >
                  <Text
                    style={{ flex: 6, fontWeight: "700", color: "#767676"  ,   fontFamily:CONSTANT.PoppinsRegular,}}>
                    {item.title}:
                  </Text>
                  <HTML html={item.value} imagesMaxWidth={Dimensions.get('window').width} />
                  {/* <Text
                    style={{
                      flex: 1,
                      fontFamily:CONSTANT.PoppinsRegular,
                      color: CONSTANT.primaryColor
                    }}
                  >
                    {entities.decode(item.value)}
                  </Text> */}
                </View>
                  :
                  <View
                  style={{
                    flexDirection: "row",
                    marginRight: 10,
                    padding: 10,
                    backgroundColor:'#fff'
                  }}
                >
                  <Text
                    style={{ flex: 6, fontWeight: "700", color: "#767676"  ,   fontFamily:CONSTANT.PoppinsRegular,}}
                  >
                    {item.title}:
                  </Text>
                  <HTML html={item.value} imagesMaxWidth={Dimensions.get('window').width} />
                  {/* <Text
                    style={{
                      flex: 1,
                      fontFamily:CONSTANT.PoppinsRegular,
                      color: CONSTANT.primaryColor
                    }}
                  >
                    {entities.decode(item.value)}
                  </Text> */}
                </View>
                }
              
              </TouchableOpacity>
               )}
            />
            <TouchableOpacity
              onPress={() =>
                this.updatePackage(
                  JSON.stringify(this.state.fetchPackages[index].ID)
                )
              }
              style={{
                alignItems: "center",
                height: 40,
                margin: 10,
                borderRadius: 4,
                width: "50%",
                alignSelf: "center",
                backgroundColor: CONSTANT.primaryColor,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#fff",
                  paddingTop: 10,
                  fontFamily:CONSTANT.PoppinsMedium,
                }}
              >
                {CONSTANT.PackagesBuyNow}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };
  render() {
    const { isLoading } = this.state;
    return (
      <SafeAreaView style={{ backgroundColor: "#f7f7f7", flex: 1 }}>
        <View
          style={{
            height: 60,
            paddingLeft: 15,
            paddingRight: 15,
            width: "100%",
            backgroundColor: CONSTANT.primaryColor,
            flexDirection: "row",
            shadowOffset: { width: 0, height: 2 },
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 10
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack(null)}
            style={{
              flexDirection: "column",
              width: "20%",
              display: "flex",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <AntIcon name="back" size={25} color={"#fff"} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "column",
              width: "60%",
              display: "flex",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignSelf: "center"
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: "#fff",
                  height: 30,
                  marginTop: 9
                }}
              >
                {CONSTANT.Packages}
              </Text>
            </View>
          </View>
        </View>
        {isLoading ? (
          <View style={{ justifyContent: "center", height: "100%" }}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={{
                height: 30,
                width: 30,
                borderRadius: 60,
                alignContent: "center",
                alignSelf: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                elevation: 5
              }}
            />
          </View>
        ) : null}
        {this.state.fetchPackages && (
          <Carousel
            layoutCardOffset={`100`}
            layout={"stack"}
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.fetchPackages}
            renderItem={this._renderItem}
            sliderWidth={viewportWidth}
            itemWidth={350}
            // loop={true}
            // autoplay={true}
            // autoplayDelay={500}
            // autoplayInterval={1500}
          />
        )}
      </SafeAreaView>
    );
  }
}
export default Packages;

const style_pakages = StyleSheet.create({
  main: {
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  pakages_Head: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopWidth: 0
  },
  pakages_Heading: {
    color: "#24355a",
    fontWeight: "600",
    fontSize: 18
  },
  container: {
    flex: 1,
    margin: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#dddddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    overflow: "hidden",
    paddingBottom: 10
  },
  pakage_image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10
  },
  pakagetitle: {
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: CONSTANT.primaryColor,
    padding: 15
  },
  titletext: {
    fontFamily:CONSTANT.PoppinsBold,
    fontSize: 20,
    color: "#fff",
    textAlign: "center"
  },
  cardmain: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  price: {
    fontSize: 35,
    color: "#24355a",
    fontFamily:CONSTANT.PoppinsBold,
    marginBottom: 3
  },
  taxes: {
    color: "#767676",
    fontStyle: "italic",
    fontFamily:CONSTANT.PoppinsMedium,
  },
  buyButton: {
    marginTop: 10
  },
  buyButtonText: {
    backgroundColor: "#f7395a",
    color: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    fontWeight: "600"
  },
  featured: {
    marginTop: 15,
    flex: 1,
    paddingBottom: 10
  },
  featuretittle: {
    color: CONSTANT.primaryColor,
    fontSize: 18,
    fontFamily:CONSTANT.PoppinsMedium,
    marginBottom: 5,
    marginLeft: 15
  },
  featureddetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingVertical: 3
  },
  featurenames: {
    color: "#767676",
    fontSize: 13
  },
  number: {
    color: "#24355a",
    fontSize: 13,
    fontWeight: "700"
  }
});
