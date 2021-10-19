import * as React from "react";
import { View, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as CONSTANT from "../../Constants/Constant";
import MultiSelect from "react-native-multiple-select";
import SquareButton from "../../Components/SquareButton";

class LocationScreen extends React.Component {
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
      startType: "",
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
  }
  onChangeFirstname = (value) => {
    this.setState({
      firstName: value,
    });
  };
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

  render() {
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

    return (
      <View style={{ margin: 10 }}>
        {/* {params.HideLoaction == "no" &&
        params.LoginSignupType != "single_step" ? ( */}
        <>
          <View style={{ marginLeft: 15, marginRight: 15 }}>
            <MultiSelect
              ref={(component) => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={(value) =>
                this.setState({ projectLocationKnown: value })
              }
              uniqueKey="slug"
              items={this.state.projectLocation}
              selectedItems={this.state.projectLocationKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText={CONSTANT.SignupSearchProjectLocation}
              selectText={CONSTANT.SignupPickLocation}
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
              underlineColorAndroid="transparent"
            />
          </View>
        </>
        {/* ) : (
          <View>
            <Text>No Location Found</Text>
          </View>
        )} */}
        <SquareButton
          title="Next"
          onPress={() => {
            this.props.navigation.navigate("StartUs", {
              fname: params.fname,
              lname: params.lname,
              uname: params.uname,
              email: params.email,
              phone: params.phone,
              password: params.password,
              retypePass: params.retypePass,
              projectLocationKnown: this.state.projectLocationKnown,
            });
          }}
          // iconName={<HeartIcon iconColor="#fff" />}
          width="94%"
          type="primary"
        />
      </View>
    );
  }
}

export default LocationScreen;
