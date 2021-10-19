import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, AsyncStorage, Alert, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import styles from '../Constants/Styles';
import * as CONSTANT from '../Constants/Constant';
import axios from "axios";
import AntIcon from "react-native-vector-icons/AntDesign";
import DocumentPicker from "react-native-document-picker";
import ImagePicker from 'react-native-image-crop-picker';

class Brochures extends Component {
  state = {
    isLoading: true,
		Gallery_Data: [],
    galleryArrey: [],
		images: [],
    galleryImageNew: [],
    GalleryRefresh: false,
		themeSettingsMaxGallery: '',
  };

	componentDidMount() {
		this.ApplicationThemeSettings();
    this.fetchGalleryData();
  }

	ApplicationThemeSettings = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'user/get_theme_settings');
    const json = await response.json();
    this.setState({themeSettingsMaxGallery: json.freelancers_settings.portfolio.enable.others});
	}

  fetchGalleryData = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/setting?id=" + Uid
    );
		const json = await response.json();
    this.setState({Gallery_Data: json.freelancer_gallery != "" ? json.freelancer_gallery : [], isLoading: false, galleryArrey: []});
    console.log('Gallery_Data', this.state.Gallery_Data)

    for(let i=0; i< this.state.Gallery_Data.length; i++){
      this.state.galleryArrey.push({
        file_name: this.state.Gallery_Data[i].file_name,
        file_size: this.state.Gallery_Data[i].file_size,
				attachment_id: this.state.Gallery_Data[i].attachment_id.toString(),
        url: this.state.Gallery_Data[i].attachment_url,
      })
    }
    console.log('galleryArrey', this.state.galleryArrey)
  };

	HandleGalleryDeleteForm = (index, item) => {
    // this.state.Gallery_Data.splice(index, 1);
		// this.state.galleryArrey.splice(index, 1);

		console.log('index', index)
		var newName= item.file_name
		console.log('newName', newName)
    var newId= item.attachment_id
		console.log('newId', newId)

		let newIndex1 = this.state.Gallery_Data.findIndex(
			item => item.attachment_id === newId
		);
		console.log('newIndex1', newIndex1)
		if (newIndex1 > -1) {
			this.state.Gallery_Data.splice(newIndex1, 1);
		}

		let newIndex2 = this.state.galleryArrey.findIndex(
			item => item.attachment_id === newId
		);
		console.log('newIndex2', newIndex2)
		if (newIndex2 > -1) {
			this.state.galleryArrey.splice(newIndex2, 1);
		}
		
		let newIndex3 = this.state.galleryImageNew.findIndex(
			item => item.name === newName
		);
		console.log('newIndex3', newIndex3)
		if (newIndex3 > -1) {
			this.state.galleryImageNew.splice(newIndex3, 1);
		}

    this.setState({
      GalleryRefresh: true
    });

    console.log('Gallery_Data 2', this.state.Gallery_Data)
    console.log('galleryArrey 2', this.state.galleryArrey)
  };

  pickMultiple() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      compressImageQuality: 0.1,
      // cropping: true,
      multiple: true,
      // includeBase64: true,
      // includeExif: true,
    })
    .then(images => {
      this.setState({
        images: images
      });
      console.log('img & doc', images)
      for(let i = 0; i < images.length; i++){
        this.state.Gallery_Data.push({
          attachment_url: images[i].path,
          file_name: Platform.OS === 'ios' ? images[i].filename : images[i].path.slice(76),
          type: images[i].mime,
          file_size: images[i].size,
        })
      }
      console.log('New_Gallery_Data', this.state.Gallery_Data)

      for(let i = 0; i < images.length; i++){
        this.state.galleryImageNew.push({
          url: images[i].path,
          name: Platform.OS === 'ios' ? images[i].filename : images[i].path.slice(76),
          type: images[i].mime,
        })
      }
      console.log('galleryImageNew', this.state.galleryImageNew)
      this.setState({ GalleryRefresh : true})
    })
    .catch(e => alert(e));
  }

  // pickMultiple() {
  //   try {
  //     DocumentPicker.pickMultiple({
  //       type: [DocumentPicker.types.images],
  //     })
  //       .then(images => {
  //         this.setState({
  //           image: null,
  //           images: images
  //         });
  //         console.log('img & doc', images)
  //         for(let i = 0; i < images.length; i++){
  //           this.state.Gallery_Data.push({
  //             attachment_url: images[i].uri,
  //             file_name: images[i].name,
  //             type: images[i].type,
	// 						file_size: images[i].size,
  //           })
  //         }
  //         console.log('New_Gallery_Data', this.state.Gallery_Data)

  //         for(let i = 0; i < images.length; i++){
  //           this.state.galleryImageNew.push({
  //             url: images[i].uri,
  //             name: images[i].name,
  //             type: images[i].type,
  //           })
  //         }
  //         console.log('galleryImageNew', this.state.galleryImageNew)
  //         this.setState({ GalleryRefresh : true})
  //       })
  //       .catch(e => alert(e));
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //     } else {
  //       throw err;
  //     }
  //   }
  // }

  updateGallery = async () => {
    this.setState({ isLoading: true });
    const Uid = await AsyncStorage.getItem("projectUid");
    const {
      galleryArrey,
      galleryImageNew
    } = this.state;
    console.log(
      Uid,
      JSON.stringify(galleryArrey),
      galleryImageNew.length,
      galleryImageNew,
      
    );
    const formData = new FormData();

    formData.append("user_id", Uid);
    formData.append("images_gallery", JSON.stringify(galleryArrey));
    formData.append("images_gallery_new", galleryImageNew.length);
    if( galleryImageNew != null){
      galleryImageNew.forEach((item, i) => {
        formData.append("gallery_images" + i, {
          uri: item.url,
          type: item.type,
          name: item.name, //|| `filename${i}.jpg`,
        });
      });
    };
    
    console.log("formData", formData);

    axios
      .post(CONSTANT.BaseUrl + 'profile/update_tabe_settings?edit_type=gallery',formData,{
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    .then(async response => {
      if (response.status == 200) {
        this.setState({ isLoading: false })
        console.log("in 200" , response)
        Alert.alert("Success", response.data.message)
        this.fetchGalleryData()
      } else if (response.status == 203) {
        this.setState({ isLoading: false })
        console.log("in 203" , response)
        Alert.alert("Error", response.data.message)
      }
    }).catch(error => {
        this.setState({ isLoading: false })
        console.log(error)
    })

    // fetch(CONSTANT.BaseUrl + 'profile/update_tabe_settings?edit_type=gallery',{
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: formData
    // })
    // .then(resp => {
    //     if (resp.status == 200) {
    //       this.setState({ isLoading: false });
    //       console.log("in 200" , resp)
    //       Alert.alert("Success", resp);
    //       this.fetchGalleryData();
    //   } else if (resp.status == 203) {
    //     this.setState({ isLoading: false });
    //     console.log("in 203" , resp)
    //     Alert.alert("Error", resp);
    //   }
    // }).catch(err => {
    //     //Alert.alert("Success", "Data Posted Successfully");
    //     Alert.alert(err);
    //     console.log(err)
    // })


    // fetch(CONSTANT.BaseUrl + 'profile/update_tabe_settings?edit_type=gallery',{
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: formData
    //   }).then((response) => {
    //     this.setState({ isLoading: false });
    //     console.log("image uploaded", response)
    //     alert("image uploaded")
    //     this.fetchGalleryData()
    //   }).catch(err => {
    //     this.setState({ isLoading: false });
    //     console.log('in catch', err)
    //   })
  };

  render() {
    const {
			isLoading,
    } = this.state;
    return (
      <View style={styles.container}>
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
					{this.state.themeSettingsMaxGallery == 'no' &&
            <>
              <View style={styles.profileBorderBottom} />
                <View style={styles.section}>
                  <Text style={styles.MainHeadingTextStyle}>
                    Gallery
                  </Text>
                </View>
              <View style={styles.profileBorderBottom} />
              <View style={{
                backgroundColor: '#fff',
                elevation: 3,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowColor: '#000',
                marginBottom: 10
              }}>
                <View style={[styles.PersonalDetailSectionArea, {marginTop:10}]}>
                  <TouchableOpacity
                    onPress={() => this.pickMultiple()}
                    style={[styles.PersonalDetailDownloadArea, {width:'100%'}]}
                  >
                    <AntIcon name="plus" color={"#767676"} size={27} />
                    <Text style={styles.PersonalDetailDownloadText}>
                      {CONSTANT.ProfileAddImages}
                    </Text>
                  </TouchableOpacity>
                  <View>
                    <FlatList
                      numColumns={2}
                      data={this.state.Gallery_Data}
                      extraData={this.state.GalleryRefresh}
                      renderItem={({ item, index }) => (
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
                            source={{ uri: item.attachment_url }}
                            resizeMode={"cover"}
                            style={{ height: 120, width: "100%" }}
                          />
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexDirection: "row"
                            }}
                          >
														<View style={{padding: 5, width:'80%'}}>
															<Text style={{ marginBottom: 5 }}>
																{item.file_name}
															</Text>
															<Text style={styles.ParagraphTextStyle}>
																File Size:{' '}
																{item.file_size >= 1073741824 ? (item.file_size / 1073741824).toFixed(2) + " GB" :
																item.file_size >= 1048576 ? (item.file_size / 1048576).toFixed(2) + " MB" :
																item.file_size >= 1024 ? (item.file_size / 1024).toFixed(2) + " KB" : 
																item.file_size > 1 ? item.file_size + " bytes" : "0 bytes"
																}
															</Text>
														</View>
                            <TouchableOpacity
                              onPress={() => this.HandleGalleryDeleteForm(index, item)}
                              style={{ padding: 5, width: "20%"}}
                            >
                              <AntIcon name="close" color={"red"} size={20} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    />
                    {/* {this.state.galleryArrey != null ? (
                      <FlatList
                        numColumns={2}
                        data={this.state.galleryArrey}
                        keyExtractor={(y, z) => z.toString()}
                        renderItem={({ item }) => (
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
                            source={{ uri: item.url }}
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
                    ) : null} */}
                  </View>
                </View>
              </View>
            </>
          }
					<TouchableOpacity
						onPress={this.updateGallery}
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

export default Brochures;
