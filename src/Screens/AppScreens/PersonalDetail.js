import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../../Constants/Styles";
import MessageBoxIcon from "../../Assets/Icons/MessageBox";
import PasswordLockIcon from "../../Assets/Icons/PasswordLockIcon";
import PhoneIcon from "../../Assets/Icons/PhoneIcon";
import ProfileIcon from "../../Assets/Icons/ProfileIcon";
import SquareTextInput from "../../Components/CustomSquareTextInput";
import SquareButton from "../../Components/SquareButton";
import * as CONSTANT from "../../Constants/Constant";

class PersonalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: "",
      LastName: "",
      UserName: "",
      Email: "",
      PhoneNumber: "",
      Password: "",
      RetypePassword: "",
      isProgress: false,
      showPass: true,
    };
  }
  onChangeFirstname = (value) => {
    this.setState({
      FirstName: value,
    });
  };
  onChangeLastname = (value) => {
    this.setState({
      LastName: value,
    });
  };
  onChangeUsername = (value) => {
    this.setState({
      UserName: value,
    });
  };
  onChangeemail = (value) => {
    this.setState({
      Email: value,
    });
  };
  onChangePhoneNumber = (value) => {
    this.setState({
      PhoneNumber: value,
    });
  };
  onChangePassword = (value) => {
    this.setState({
      Password: value,
    });
  };
  onChangeRetypePassword = (value) => {
    this.setState({
      RetypePassword: value,
    });
  };
  render() {
    const { params } = this.props.navigation.state;
    return (
      <ScrollView style={styles.PersonalDetailStyle}>
        <SquareTextInput
          placeHolder="First name"
          leftIcon={<ProfileIcon iconColor="#29AAE1" />}
          value={this.state.FirstName}
          onChangeText={this.onChangeFirstname}
        />
        <SquareTextInput
          placeHolder="Last name"
          leftIcon={<ProfileIcon iconColor="#29AAE1" />}
          value={this.state.LastName}
          onChangeText={this.onChangeLastname}
        />
        {/* {params.RemoveUsername == "no" && ( */}
        <SquareTextInput
          placeHolder="User name"
          leftIcon={<ProfileIcon iconColor="#29AAE1" />}
          value={this.state.UserName}
          onChangeText={this.onChangeUsername}
          editable={true}
        />
        {/* )} */}
        <SquareTextInput
          placeHolder="Email"
          leftIcon={<MessageBoxIcon iconColor="#29AAE1" />}
          value={this.state.Email}
          onChangeText={this.onChangeemail}
          editable={true}
        />
        <SquareTextInput
          placeHolder="Phone"
          leftIcon={<PhoneIcon iconColor="#29AAE1" />}
          value={this.state.PhoneNumber}
          onChangeText={this.onChangePhoneNumber}
          editable={true}
        />
        <SquareTextInput
          placeHolder="Password"
          leftIcon={<PasswordLockIcon iconColor="#29AAE1" />}
          value={this.state.Password}
          onChangeText={this.onChangePassword}
          secureTextEntry={true}
        />
        <SquareTextInput
          placeHolder="Retype Password"
          leftIcon={<PasswordLockIcon iconColor="#29AAE1" />}
          value={this.state.RetypePassword}
          onChangeText={this.onChangeRetypePassword}
          secureTextEntry={true}
        />
        <View style={{ marginBottom: 10 }} />
        {/* <View style={{ marginBottom: 10 }}> */}
        <SquareButton
          title="Next"
          onPress={() => {
            this.props.navigation.navigate("Location", {
              // HideLoaction: params.HideLoaction,
              fname: this.state.FirstName,
              lname: this.state.LastName,
              uname: this.state.UserName,
              email: this.state.Email,
              phone: this.state.PhoneNumber,
              password: this.state.Password,
              retypePass: this.state.RetypePassword,
            });
          }}
          // iconName={<HeartIcon iconColor="#fff" />}
          width="94%"
          type="primary"
        />
        {/* </View> */}
      </ScrollView>
    );
  }
}

export default PersonalDetail;
