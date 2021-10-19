import * as React from "react";
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
  Button,
} from "react-native";
import * as CONSTANT from "../../Constants/Constant";
import MultiSelect from "react-native-multiple-select";
import { RadioGroup } from "react-native-btr";
import SquareButton from "../../Components/SquareButton";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import StartTypeCustomButton from "../../Components/StartTypeCustomButton";
import Ripple from "react-native-material-ripple";

class StartUsScreen extends React.Component {
  constructor(props) {
    super(props);
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
      startType: "freelancer",
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
    if (params) {
      if (
        params.fname == "" ||
        params.lname == "" ||
        params.email == "" ||
        params.phone == "" ||
        params.password == ""
      ) {
        alert("Please enter Complete Detail");
        //this.setState({ email: "Please enter Complete Detail" });
      } else if (reg.test(params.email) === false) {
        alert("Email is Not Correct");
        //this.setState({ email: "Email is Not Correct" });
        return false;
      } else if (params.password !== params.retypePass) {
        alert("Passwords don't match");
      } else if (params.phone == "") {
        alert("Please Enter Phone Number");
      } else if (this.state.termsCheck !== true) {
        alert("Please Select Terms & Conditions");
      } else {
        this.setState({ btnLoading: true });
        axios
          .post(CONSTANT.BaseUrl + "user/signup", {
            //gender: selectedItemgender,
            username: params.uname,
            user_phone_number: params.phone,
            email: params.email,
            first_name: params.fname,
            last_name: params.lname,
            location: params.projectLocationKnown,
            password: params.password,
            verify_password: params.retypePass,
            department: DepartmentKnown[0],
            employees: EmployeeKnown[0],
            user_type: this.state.startType,
            termsconditions: this.state.termsCheck,
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
    } else {
      alert("Please provide valid data");
    }
  };

  render() {
    console.log("type", this.state.startType);
    const { params } = this.props.navigation.state;
    let selectedItem = this.state.radioButtons.find((e) => e.checked == true);
    selectedItem = selectedItem
      ? selectedItem.value
      : this.state.radioButtons[0].value;
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      (e) => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const {
      FirstName,
      LastName,
      UserName,
      PhoneNumber,
      Email,
      Password,
      RetypePassword,
      termsCheck,
    } = this.state;
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", marginLeft: 10 }}>
          <Ripple
            rippleColor="gray"
            rippleDuration={1000}
            rippleOpacity={0.87}
            style={
              this.state.startType === "freelancer"
                ? styles.primaryButtonStyle
                : styles.secondryButtonStyle
            }
            onPress={() => {
              this.setState({ startType: "freelancer" });
            }}
          >
            {/* {props.iconName ? props.iconName : null} */}
            <Text style={[styles.buttonStyle]}>Freelancer</Text>
          </Ripple>
          <Ripple
            rippleColor="gray"
            rippleDuration={1000}
            rippleOpacity={0.87}
            style={
              this.state.startType === "company"
                ? styles.primaryButtonStyle
                : styles.secondryButtonStyle
            }
            onPress={() => {
              this.setState({ startType: "company" });
            }}
          >
            {/* {props.iconName ? props.iconName : null} */}
            <Text style={[styles.buttonStyle]}>Company</Text>
          </Ripple>
        </View>

        <Text
          style={{
            marginLeft: 20,
            textAlign: "left",
            fontSize: 13,
            fontWeight: "500",
            marginTop: 20,
            color: CONSTANT.primaryColor,
          }}
        >
          {CONSTANT.SignupNoEmp}
        </Text>
        <View style={{ marginLeft: 20, marginRight: 20, marginTop: 5 }}>
          <MultiSelect
            ref={(component) => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={(value) =>
              this.setState({ EmployeeKnown: value })
            }
            uniqueKey="value"
            items={this.state.NoEmployee_data}
            selectedItems={this.state.EmployeeKnown}
            borderBottomWidth={0}
            single={true}
            searchInputPlaceholderText={CONSTANT.SignupSearchEmployees}
            selectText={CONSTANT.SignupPickEmployees}
            styleMainWrapper={{
              backgroundColor: "#fff",
              borderRadius: 4,
              marginTop: 10,
            }}
            styleDropdownMenuSubsection={{
              backgroundColor: "#fff",
              paddingRight: -7,
              height: 60,
              paddingLeft: 10,
              borderWidth: 0.6,
              borderColor: "#fff",
              borderColor: "#dddddd",
              borderRadius: 4,
            }}
            onChangeInput={(text) => console.log(text)}
            displayKey="title"
            submitButtonText={CONSTANT.Submit}
          />
        </View>

        {this.state.startType == "company" ? (
          <View>
            <Text
              style={{
                marginLeft: 20,
                textAlign: "left",
                fontSize: 13,
                fontWeight: "500",
                marginTop: 10,
                color: CONSTANT.primaryColor,
              }}
            >
              {CONSTANT.SignupDepartment}
            </Text>
            <View style={{ marginLeft: 20, marginRight: 20, marginTop: 5 }}>
              <MultiSelect
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={(value) =>
                  this.setState({ DepartmentKnown: value })
                }
                uniqueKey="slug"
                items={this.state.TotaolDepartments}
                selectedItems={this.state.DepartmentKnown}
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText={CONSTANT.SignupSearchDepartment}
                selectText={CONSTANT.SignupPickDepartment}
                styleMainWrapper={{
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  marginTop: 10,
                }}
                styleDropdownMenuSubsection={{
                  backgroundColor: "#fff",
                  paddingRight: -7,
                  height: 60,
                  paddingLeft: 10,
                  borderWidth: 0.6,
                  borderColor: "#fff",
                  borderColor: "#dddddd",
                  borderRadius: 4,
                }}
                onChangeInput={(text) => console.log(text)}
                displayKey="name"
                submitButtonText={CONSTANT.Submit}
              />
            </View>
            {/* <View
              style={{
                marginTop: 20,
                marginHorizontal: 10,
                marginBottom: 10,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ termsCheck: !termsCheck })}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor:
                    termsCheck == false ? "#fff" : CONSTANT.primaryColor,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#323232",
                  borderRadius: 5,
                  marginRight: 5,
                }}
              >
                <FontAwesome name="check" size={15} color={"#fff"} />
              </TouchableOpacity>
              <Text style={{ width: "90%", color: "#767676" }}>
                {params.TermText}
              </Text>
            </View> */}
          </View>
        ) : null}
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 10,
            marginBottom: 10,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ termsCheck: !termsCheck })}
            style={{
              width: 20,
              height: 20,
              backgroundColor:
                termsCheck == false ? "#fff" : CONSTANT.primaryColor,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#323232",
              borderRadius: 5,
              marginRight: 5,
            }}
          >
            <FontAwesome name="check" size={15} color={"#fff"} />
          </TouchableOpacity>
          <Text style={{ width: "90%", color: "#767676" }}>
            Terms & Conditions
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.CreateAccount}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            margin: 10,
            borderRadius: 4,
            width: "50%",
            alignSelf: "center",
            backgroundColor: CONSTANT.primaryColor,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#fff",
            }}
          >
            {CONSTANT.SignupContinue}
          </Text>
          {this.state.btnLoading == true ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  primaryButtonStyle: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#29AAE1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    marginLeft: 10,
    width: "45%",
    marginRight: 10,
    borderColor: "#546ae8",
    borderRadius: 10,
    borderWidth: 3,
  },
  secondryButtonStyle: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#29AAE1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    width: "45%",
  },
  buttonStyle: {
    alignSelf: "center",
    textTransform: "uppercase",
    fontSize: 17,
    color: "#fff",
    marginLeft: 10,
  },
});

export default StartUsScreen;
