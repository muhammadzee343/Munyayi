import React, { Component } from 'react';
import {
	View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  PanResponder,
  Alert,
  Dimensions,
  AsyncStorage,
	KeyboardAvoidingView
} from 'react-native';
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import SimpleHeader from '../Header/SimpleHeader';
import MultiSelect from 'react-native-multiple-select';
import AntIcon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import DocumentPicker from "react-native-document-picker";

class AddPortfolio extends Component {

	state={
		isLoading: true,

		title: '',
		customLink: '',
		categoriesKnown: [], 
		tagsKnown: [],
		desc: '',
		images: null,
		document: null,

		ProfileVideosData: [],
    ProfileVideosRefresh: false,
    NewProfileVideosData:[],
    url: '',
    urlEdit:'',
	}

	componentDidMount() {
		this.categoriesSpinner();
		this.tagsSpinner();		
  }

	categoriesSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=portfolio_categories",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let categories_data = responseJson;
        this.setState({
					categories_data,
					isLoading: false
				});
      })
      .catch(error => {
        console.error(error);
      });
	};
	
	tagsSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=portfolio_tags",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let tags_data = responseJson;
        this.setState({
					tags_data, 
					isLoading: false
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  addProfileVideosData = () => {
    if (
      this.state.url == "" 
    ) {
      Alert.alert(CONSTANT.OopsText, CONSTANT.PleaseEnterDataProperly);
    } else {
      const {
        ProfileVideosData,
        url,
        NewProfileVideosData,
      } = this.state;
      //console.log('profile', this.state.NewProfileVideosData)

      NewProfileVideosData.push({
        link: url,
      });
      this.setState({
        ProfileVideosRefresh: true,
        url: '',
      });
      console.log('After add arrey', NewProfileVideosData)
    }
    this.state.ProfileVideosData.push(this.state.url);
    console.log("This is my url" , this.state.url)
    console.log("This is my final sending array" , this.state.ProfileVideosData)
	};
	ProfileVideosEditForm = index => {
    this.state.ProfileVideosData[index] = this.state.urlEdit 
    this.state.NewProfileVideosData[index] = {link: this.state.urlEdit}
    this.setState({ProfileVideosRefresh: true})
    console.log(this.state.ProfileVideosData[index])
    console.log(this.state.NewProfileVideosData[index])
  }
  ProfileVideosDeleteForm = index => {
    this.state.NewProfileVideosData.splice(index, 1);
    this.state.ProfileVideosData.splice(index, 1);
    this.setState({
      ProfileVideosRefresh: true
    });
	};
	
	pickMultipleImages() {
    try {
      DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images]
      })
        .then(images => {
          this.setState({
            images: images,
          });
          console.log(this.state.images)
        })
        .catch(e => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
	}
	
	HandleGalleryDeleteForm = index => {
    this.state.images.splice(index, 1);
    this.setState({
      GalleryRefresh: true
		});
		console.log('del', this.state.images)
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

  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const Uid = await AsyncStorage.getItem('projectUid');
    const {
			title,
			customLink,
			categoriesKnown,
			tagsKnown,
			ProfileVideosData,
			desc,
			images,
			document
    } = this.state;
    console.log(
      Uid,
			title,
			customLink,
			categoriesKnown,
			tagsKnown,
			ProfileVideosData,
			desc,
			images,
			document
    );
    
    const formData = new FormData();
    formData.append('submit_type', 'add');
    formData.append('user_id', Uid);
    formData.append('title', title);
    formData.append('custom_link', customLink);
    formData.append('categories', JSON.stringify(categoriesKnown));
    formData.append('tags', JSON.stringify(tagsKnown));
    formData.append('videos', JSON.stringify(ProfileVideosData));
    formData.append('description', desc);
    if (images != null) {
      images.forEach((item, i) => {
        formData.append("gallery_imgs" + i, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    formData.append("gallery_size", images != null ? images.length : "0");
    if (document != null) {
      document.forEach((item, i) => {
        formData.append("documents" + i, {
          //uri: Platform.OS === 'android' ? `file://${item.uri}` : `/private${item.uri}`,
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    formData.append("documents_size", document != null ? document.length : "0");
    
    axios
      .post(CONSTANT.BaseUrl + "portfolios/update_portfolio", formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(async response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ 
            isLoading: false,
            title: '',
            customLink: '',
            categoriesKnown: [], 
            tagsKnown: [],
            desc: '',
            images: null,
            document: null,
            ProfileVideosData: [],
            NewProfileVideosData:[],
          });
          Alert.alert(CONSTANT.Success, response.data.message);
          console.log("Success", response.data.message)
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert(CONSTANT.Error, response.data.message);
          console.log("Error", response.data.message)
        }
      })
      .catch(error => {
        //Alert.alert(error.message);
        console.log(error);
      });
  };

  render() {
		const {isLoading} = this.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={'Add Portfolio'} />
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView>
          <View>
            <View style={styles.PersonalDetailSectionsStyle}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                  marginHorizontal:10
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PortfolioDescription}
                </Text>
              </View>

              <View style={styles.PersonalDetailSectionArea}>
                <View>
								<TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder={CONSTANT.PortfolioTitle}
                    onChangeText={title =>
                      this.setState({ title })
                    }
                    style={styles.TextInputLayoutStyle}
                    value={this.state.title}
                  />
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder={CONSTANT.PortfolioCustomLink}
                    onChangeText={customLink =>
                      this.setState({ customLink })
                    }
                    style={styles.TextInputLayoutStyle}
                    value={this.state.customLink}
                  />
                </View>
							</View>
						</View>
						<View style={styles.PersonalDetailSectionsStyle}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                  marginHorizontal:10
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PortfolioCategories}
                </Text>
              </View>
							<View
								style={[styles.MultiSelectArea, {marginHorizontal: 10}]}>
								<MultiSelect
									ref={component => {
										this.multiSelect = component;
									}}
									onSelectedItemsChange={value =>
										this.setState({ categoriesKnown: value })
									}
									uniqueKey="id"
									items={this.state.categories_data}
									selectedItems={this.state.categoriesKnown}
									borderBottomWidth={0}
									//single={true}
									searchInputPlaceholderText={CONSTANT.PortfolioSelectCategories}
									selectText={CONSTANT.PortfolioSelectCategories}
									styleMainWrapper={styles.MultiSelectstyleMainWrapper}
									styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
									onChangeInput={text => console.log(text)}
									displayKey="name"
									submitButtonText={CONSTANT.Submit}
								/>
							</View>
						</View>
						<View style={styles.PersonalDetailSectionsStyle}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                  marginHorizontal:10
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PortfolioTags}
                </Text>
              </View>
							<View
								style={[styles.MultiSelectArea, {marginHorizontal: 10}]}>
								<MultiSelect
									ref={component => {
										this.multiSelect = component;
									}}
									onSelectedItemsChange={value =>
										this.setState({ tagsKnown: value })
									}
									uniqueKey="id"
									items={this.state.tags_data}
									selectedItems={this.state.tagsKnown}
									borderBottomWidth={0}
									//single={true}
									searchInputPlaceholderText={CONSTANT.PortfolioSelectTags}
									selectText={CONSTANT.PortfolioSelectTags}
									styleMainWrapper={styles.MultiSelectstyleMainWrapper}
									styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
									onChangeInput={text => console.log(text)}
									displayKey="name"
									submitButtonText={CONSTANT.Submit}
								/>
							</View>
						</View>
						<View style={styles.PersonalDetailSectionsStyle}>
							<View
								style={{
									height: 50,
									justifyContent: 'center',
									paddingHorizontal:10,
									marginVertical:10,
									backgroundColor: "#fcfcfc",
									borderLeftWidth: 5,
									borderLeftColor: CONSTANT.primaryColor,
									marginHorizontal:10
								}}
							>
								<Text style={styles.MainHeadingTextStyle}>
									{CONSTANT.ProfileProfileVideos}
								</Text>
							</View>

							<View style={styles.PersonalDetailSectionArea}>
								<View>
									<TextInput
										underlineColorAndroid="transparent"
										placeholderTextColor="#7F7F7F"
										placeholder={CONSTANT.ProfileVideoURL}
										onChangeText={url =>
											this.setState({ url })
										}
										style={styles.TextInputLayoutStyle}
										value={this.state.url}
									/>
									<TouchableOpacity
										onPress={this.addProfileVideosData}
										style={[styles.MainButtonArea, {alignSelf:'flex-start'}]}>
										<Text style={styles.ButtonText}>
											{CONSTANT.ProfileAdd}
										</Text>
									</TouchableOpacity>
								</View>
								{/* {this.state.NewProfileVideosData ? ( */}
									<FlatList
										data={this.state.NewProfileVideosData}
										extraData={this.state.ProfileVideosRefresh}
										renderItem={({ item, index }) => (
											<View
												style={[styles.PersonalDetailCollapseHeaderArea, {borderWidth:0}]}
											>
												<TextInput
													multiline={true}
													defaultValue={item.link} 
													underlineColorAndroid="transparent"
													placeholderTextColor="#7F7F7F"
													placeholder={CONSTANT.ProfileVideoURL}
													onEndEditing={() => this.ProfileVideosEditForm(index)}
													onChangeText={urlEdit =>
														this.setState({ urlEdit })
													}
													style={[styles.TextInputLayoutStyle, {width:'85%', borderTopRightRadius:0, borderBottomRightRadius:0}]}
												/>
												{/* <TouchableOpacity
													onPress={() => this.ProfileVideosEditForm(index)}
													style={styles.PersonalDetailEditBTN}
												>
													<AntIcon
														name="check"
														color={"#fff"}
														size={20}
													/>
												</TouchableOpacity> */}
												<TouchableOpacity
													onPress={() => this.ProfileVideosDeleteForm(index)}
													style={styles.PersonalDetailDeleteBTN}
												>
													<AntIcon
														name="delete"
														color={"#fff"}
														size={20}
													/>
												</TouchableOpacity>
											</View>
										)}
									/>
								{/* ) : null} */}
							</View>
						</View>
						<View style={styles.PersonalDetailSectionsStyle}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                  marginHorizontal:10
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PortfolioDetail}
                </Text>
              </View>

              <View style={styles.PersonalDetailSectionArea}>
                <View>
								<TextInput
										multiline={true}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder={CONSTANT.PortfolioTitle}
                    onChangeText={desc =>
                      this.setState({ desc })
                    }
                    style={styles.TextInputLayoutStyleForDetail}
                    value={this.state.desc}
                  />
                </View>
							</View>
						</View>
						<View style={[styles.PersonalDetailSectionsStyle, {paddingHorizontal: 10}]}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                  marginHorizontal:10
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PortfolioUploadImages}
                </Text>
              </View>
							<TouchableOpacity
								onPress={() => this.pickMultipleImages()}
								style={[styles.PersonalDetailDownloadArea, {width: '100%'}]}
							>
								<AntIcon name="plus" color={"#767676"} size={27} />
								<Text style={styles.PersonalDetailDownloadText}>
									{CONSTANT.PortfolioSelectFile}
								</Text>
							</TouchableOpacity>
							<View>
                {this.state.images != null ? (
                  <FlatList
                    numColumns={2}
                    data={this.state.images}
                    keyExtractor={(y, z) => z.toString()}
                    renderItem={({ item, index}) => (
                      <View
                      style={{
                        width: "45%",
                        borderColor: "#ddd",
                        borderWidth: 1,
                        margin: "2.5%",
                        borderRadius: 5,
                        overflow: "hidden"
                      }}
                    >
                      <Image
                        source={{ uri: item.uri }}
                        resizeMode={"cover"}
                        style={{ height: 120, width: "100%", borderTopRadius: 5 }}
                      />
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexDirection: "row"
                        }}
                      >
                        <Text style={{ width: "80%", padding: 5 }}>
                          {item.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.HandleGalleryDeleteForm(index)}
                          style={{ padding: 5, width: "20%" }}
                        >
                          <AntIcon name="close" color={"red"} size={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    )}
                  />
                ) : null}
              </View>
						</View>
						<View style={[styles.PersonalDetailSectionsStyle, {paddingHorizontal: 10}]}>
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginVertical:10,
                  backgroundColor: "#fcfcfc",
                  borderLeftWidth: 5,
                  borderLeftColor: CONSTANT.primaryColor,
                }}
              >
                <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PortfolioUploadDocuments}
                </Text>
              </View>
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
						onPress={this.UpdateProfileData}
						style={styles.MainButtonArea}>
						<Text style={styles.ButtonText}>
							{CONSTANT.ProfileSave}
						</Text>
					</TouchableOpacity>
				</ScrollView>
      </View>
    );
  }
}

export default AddPortfolio;
