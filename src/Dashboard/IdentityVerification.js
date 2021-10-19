import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  TextInput,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  NativeModules,
  FlatList
} from 'react-native';
import CustomHeader from '../Header/CustomHeader';
//import MapView from 'react-native-maps';
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import axios from 'axios';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from "react-native-document-picker";
import SimpleHeader from '../Header/SimpleHeader';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';

class IdentityVerification extends Component {

	state={
		isLoading: true,
		document: null,
		Verification_file: '',
		name: '',
		number: '',
		idNumber: '',
		address: '',
	}

	componentDidMount() {
    this.CheckIdentityVerify();
	}
	
  CheckIdentityVerify = async () => {
    const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(CONSTANT.BaseUrl + 'profile/verification_request?user_id=' + Uid);
    const json = await response.json();
    this.setState({
			IdentityVerify: json.identity_verified,
			Verification_file: json.verification_files[0] != undefined ? json.verification_files[0].url : '',
			isLoading: false
		});
		console.log('IdentityVerify', this.state.IdentityVerify)
		console.log('Verification_file', this.state.Verification_file)
  };

	pickMultipleDocument() {
    try {
      DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles]
      })
        .then(images => {
          this.setState({
            document: images,
          });
          console.log(this.state.document)
        })
        .catch(e => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
	}
	HandleDocumentDeleteForm = index => {
    this.state.document.splice(index, 1);
    this.setState({
      GalleryRefresh: true
		});
		console.log('del', this.state.images)
	};

	UpdateIdVerify = async () => {
    this.setState({ isLoading: true });
    const Uid = await AsyncStorage.getItem('projectUid');
    const {
			name,
			number,
			idNumber,
			address,
			document,
    } = this.state;
    console.log(
      Uid,
			name,
			number,
			idNumber,
			address,
			document
    );
    
    const formData = new FormData();
    formData.append('user_id', Uid);
		formData.append('name', name);
		formData.append('contact_number', number);
		formData.append('verification_number', idNumber);
		formData.append('address', address);
    if (document != null) {
      document.forEach((item, i) => {
        formData.append("documents_documents" + i, {
          //uri: Platform.OS === 'android' ? `file://${item.uri}` : `/private${item.uri}`,
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    formData.append("document_size", document != null ? document.length : "0");

		console.log('formData', formData)
    
    axios
      .post(CONSTANT.BaseUrl + "profile/send_verification_request", formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          Alert.alert(CONSTANT.Success, response.data.message);
					console.log("Success", response.data.message);
					this.CheckIdentityVerify();
					this.setState({ isLoading: false, document: null});
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
				this.setState({ isLoading: false });
        console.log(error);
      });
	};
	
	CancelIdVerify = async () => {
    this.setState({ isLoading: true });
    const Uid = await AsyncStorage.getItem('projectUid');
    console.log(
      Uid,
    );
    axios
      .post(CONSTANT.BaseUrl + "profile/cancel_verification_request?user_id=" + Uid,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          Alert.alert(CONSTANT.Success, response.data.message);
					console.log("Success", response.data.message);
					this.CheckIdentityVerify();
          this.setState({ 
            isLoading: false,
          });
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
				this.setState({ isLoading: false });
        Alert.alert(error.message);
        console.log(error);
      });
  };

  render() {
		const {isLoading} = this.state;
    return (
      <View style={styles.container}>
				<SimpleHeader HeaderText={CONSTANT.IdentityVerificationHeaderText} />
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {	(this.state.Verification_file == '' 
					// && this.state.IdentityVerify == '0'
				) &&
					<ScrollView>
						<View style={styles.PersonalDetailSectionsStyle}>
							<View style={styles.PersonalDetailSectionArea}>
								<Text style={styles.MainHeadingTextStyle}>{CONSTANT.IdentityVerificationUpload}</Text>
								<Text style={styles.ParagraphTextStyle}>{CONSTANT.IdentityVerificationUploadParagraph}</Text>
							</View>
							<View style={styles.PersonalDetailSectionArea}>
								<TextInput
									underlineColorAndroid="transparent"
									style={styles.TextInputLayoutStyle}
									placeholder={'Your name'}
									placeholderTextColor="#807f7f"
									onChangeText={name => this.setState({ name })}
									value={this.state.name}
								/>
								<TextInput
									underlineColorAndroid="transparent"
									style={styles.TextInputLayoutStyle}
									placeholder={'Contact number'}
									placeholderTextColor="#807f7f"
									onChangeText={number => this.setState({ number })}
									value={this.state.number}
								/>
								<TextInput
									underlineColorAndroid="transparent"
									style={styles.TextInputLayoutStyle}
									placeholder={'National identity card, passport or driving license number'}
									placeholderTextColor="#807f7f"
									onChangeText={idNumber => this.setState({ idNumber })}
									value={this.state.idNumber}
								/>
								<TextInput
									underlineColorAndroid="transparent"
									style={styles.TextInputLayoutStyle}
									placeholder={'Add address'}
									placeholderTextColor="#807f7f"
									onChangeText={address => this.setState({ address })}
									value={this.state.address}
								/>
								<TouchableOpacity
									onPress={() => this.pickMultipleDocument()}
									style={[styles.PersonalDetailDownloadArea, {width:'100%'}]}
								>
									<AntIcon name="plus" color={"#767676"} size={27} />
									<Text style={styles.PersonalDetailDownloadText}>
										{CONSTANT.PortfolioSelectFile}
									</Text>
								</TouchableOpacity>
								<View>
									{this.state.document != null ? (
										<FlatList
											data={this.state.document}
											keyExtractor={(y, z) => z.toString()}
											renderItem={({ item, index}) => (
												<View style={{
													height: 50,
													flexDirection: 'row',
													justifyContent:'space-between',
													backgroundColor: '#f7f7f7',
													marginHorizontal:10,
													marginBottom:5,
													borderWidth: 0.6,
													borderColor: '#dddddd',
													borderRadius: 2,
													overflow:'hidden',
												}}>
													<View
														style={{
															width:'90%',
															flexDirection:'column',
															justifyContent:'center'
														}}
													>
														<Text
															style={{
																paddingLeft: 10,
																textAlignVertical: 'center',
															}}
														>
															{item.name} {"\n"}
															{item.size >= 1073741824 ? (item.size / 1073741824).toFixed(2) + " GB" :
															item.size >= 1048576 ? (item.size / 1048576).toFixed(2) + " MB" :
															item.size >= 1024 ? (item.size / 1024).toFixed(2) + " KB" : 
															item.size > 1 ? item.size + " bytes" : "0 bytes"
															}
														</Text>
													</View>

													<TouchableOpacity
														onPress={() => this.HandleDocumentDeleteForm(index)}
														style={{width: "10%", justifyContent: 'center', alignItems:'center' }}
													>
														<AntIcon name="close" color={"red"} size={20} />
													</TouchableOpacity>
											</View>
											)}
										/>
									) : null}
								</View>
							</View>
						</View>
						<TouchableOpacity
							onPress={this.UpdateIdVerify}
							style={styles.MainButtonArea}>
							<Text style={styles.ButtonText}>
								{CONSTANT.ProfileSave}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				}
				{	(this.state.Verification_file != '' && this.state.IdentityVerify == '0') &&
					<ScrollView>
						<View style={styles.PersonalDetailSectionsStyle}>
							<View style={[styles.PersonalDetailSectionArea, {marginBottom:20}]}>
								<Text style={styles.MainHeadingTextStyle}>{CONSTANT.IdentityVerificationInProgress}</Text>
								<Text style={styles.ParagraphTextStyle}>{CONSTANT.IdentityVerificationInProgressParagraph}</Text>
							</View>
						</View>
						<TouchableOpacity
							onPress={this.CancelIdVerify}
							style={styles.MainButtonArea}>
							<Text style={styles.ButtonText}>
								{CONSTANT.IdentityVerificationCancel}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				}
				{	(this.state.Verification_file != '' && this.state.IdentityVerify == '1') &&
					<View style={{justifyContent: 'center', alignItems:'center', flex: 1, padding: 10}}>
							<Image
								resizeMode={"contain"}
								style={{ width: 140, height: 100, marginBottom:10 }}
								source={require("../Images/identity_verified_color-01.png")}
							/>
							<Text style={[styles.ParagraphTextStyle, {textAlign:'center', fontSize:18}]}>{CONSTANT.IdentityVerificationInSuccessParagraph}</Text>
					</View>
				}
      </View>
    );
  }
}

export default IdentityVerification;
