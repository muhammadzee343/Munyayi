import React, { Component } from "react";
import {
  View,
  StyleSheet,
  WebView,
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Image,
  CheckBox,
  ActivityIndicator,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from "../Constants/Constant";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import BottomNav from "../Screens/BottomNav";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class Signup extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
      projectLocationKnown: "",
      DepartmentKnown: "",
      EmployeeKnown: "",
      FirstName: "",
      LastName: "",
      UserName: "",
      PhoneNumber: "",
      Email: "",
      Password: "",
      RetypePassword: "",
      termsCheck: false,
      btnLoading: false,
      radioButtons: [
        {
          label: CONSTANT.SignupMale,
          value: "male",
          checked: true,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7,
        },
        {
          label: CONSTANT.SignupFemale,
          value: "female",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7,
        },
      ],
      radioButtonsforStartAs: [
        {
          label: CONSTANT.SignupFreelancer,
          value: "freelancer",
          checked: true,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7,
        },
        {
          label: CONSTANT.SignupCompany,
          value: "company",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7,
        },
      ],
    };
    this.showFilters = true;
  }
  componentDidMount() {
    this.ProjectLocationSpinner();
    this.NoEmployeeSpinner();
    this.Departments();
  }
  ProjectLocationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=locations",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let projectLocation = responseJson;
        this.setState({
          projectLocation,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  NoEmployeeSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=no_of_employes", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let NoEmployee_data = responseJson;
        this.setState({
          NoEmployee_data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Departments = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=department",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let TotaolDepartments = responseJson;
        this.setState({
          TotaolDepartments,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  CreateAccount = () => {
    const { params } = this.props.navigation.state;
    let selectedItemgender = this.state.radioButtons.find(
      (e) => e.checked == true
    );
    let selectedItemtype = this.state.radioButtonsforStartAs.find(
      (e) => e.checked == true
    );
    const {
      projectLocationKnown,
      DepartmentKnown,
      EmployeeKnown,
      FirstName,
      LastName,
      UserName,
      PhoneNumber,
      Email,
      Password,
      RetypePassword,
      termsCheck,
    } = this.state;
    console.log(
      projectLocationKnown,
      DepartmentKnown,
      EmployeeKnown,
      FirstName,
      LastName,
      UserName,
      PhoneNumber,
      Email,
      Password,
      RetypePassword,
      termsCheck,
      selectedItemtype.value
    );
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      FirstName == "" ||
      LastName == "" ||
      Email == "" ||
      Password == "" ||
      RetypePassword == ""
    ) {
      alert("Please enter Complete Detail");
      //this.setState({ email: "Please enter Complete Detail" });
    } else if (reg.test(Email) === false) {
      alert("Email is Not Correct");
      //this.setState({ email: "Email is Not Correct" });
      return false;
    } else if (Password !== RetypePassword) {
      alert("Passwords don't match");
    } else if (params.PhoneMandatory != "disable" && PhoneNumber == "") {
      alert("Please Enter Phone Number");
    } else if (termsCheck !== true) {
      alert("Please Select Terms & Conditions");
    } else {
      this.setState({ btnLoading: true });
      axios
        .post(CONSTANT.BaseUrl + "user/signup", {
          //gender: selectedItemgender,
          username: UserName,
          user_phone_number: PhoneNumber,
          email: Email,
          first_name: FirstName,
          last_name: LastName,
          location: projectLocationKnown[0],
          password: Password,
          verify_password: RetypePassword,
          department: DepartmentKnown[0],
          employees: EmployeeKnown[0],
          user_type: selectedItemtype.value,
          termsconditions: termsCheck,
        })
        .then(async (response) => {
          if (response.status === 200) {
            if (response.data.verify_user === "verified") {
              this.setState({ btnLoading: false });
              Alert.alert(response.data.message);
              this.props.navigation.navigate("VerificationAccount", {
                user_id: response.data.user_id,
              });
            } else {
              this.setState({ btnLoading: false });
              Alert.alert(response.data.message);
            }
          } else if (response.status === 203) {
            this.setState({ btnLoading: false });
            Alert.alert("Error", response.data.message);
          }
        })
        .catch((error) => {
          this.setState({ btnLoading: false });
          console.log(error);
        });
    }
  };
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={CONSTANT.statusBarColor}
          barStyle="light-content"
        />
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
            elevation: 10,
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
              justifyContent: "center",
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
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: "#fff",
                  height: 30,
                  marginTop: 9,
                }}
              >
                {CONSTANT.SignupHeader}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <Image
            resizeMode={"contain"}
            style={{
              width: 130,
              resizeMode: "center",
              alignSelf: "center",
              marginTop: 25,
            }}
            source={require("../Images/logologin.png")}
          />
          <Text
            style={{
              textAlign: "center",
              alignSelf: "center",
              color: "#000",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10
            }}
          >
            {CONSTANT.Signupmain}
          </Text>

          <BottomNav />
          {/* <PersonalDetail navigation={this.props.navigation} /> */}
          {/* <LocationScreen navigation={this.props.navigation} />  */}
          {/* <StartUsScreen navigation={this.props.navigation} /> */}

          <View
            style={{
              backgroundColor: CONSTANT.primaryColor,
              height: 45,
              width: "100%",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                alignSelf: "center",
                fontSize: 17,
                top: 12,
              }}
            >
              {CONSTANT.SignupMoveSignin}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default Signup;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
