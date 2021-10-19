import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, AsyncStorage, Alert, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../Constants/Styles';
import * as CONSTANT from '../Constants/Constant';
import axios from "axios";
import AntIcon from "react-native-vector-icons/AntDesign";
import DocumentPicker from "react-native-document-picker";

class Brochures extends Component {
  state = {
    isLoading: true,
    brochuresData:[],
    brochures: [],
    refBrochuresData:false,
    brochuresDataPicker: []
  };

	componentDidMount() {
    this.fetchBrochuresData();
  }

  fetchBrochuresData = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_employer_profle?user_id=" + Uid
    );
		const json = await response.json();
    this.setState({ brochuresData: json.brochures, isLoading: false, brochures: [] });
    console.log('initial arrey from server', this.state.brochuresData)

    for(let i=0; i< this.state.brochuresData.length; i++){
      this.state.brochures.push({
        attachment_id: this.state.brochuresData[i].attachment_id.toString(),
        url: this.state.brochuresData[i].url
      })
    }
    console.log('brochures', this.state.brochures)
  };

  pickMultiple() {
    try {
      DocumentPicker.pickMultiple({
      })
        .then(images => {
          this.setState({
            image: null,
            images: images
          });
          console.log('img & doc', images)
          for(let i = 0; i < images.length; i++){
            this.state.brochuresData.push({
              url: images[i].uri,
              name: images[i].name,
              type: images[i].type,
              size: images[i].size,
            })
          }
          console.log('brochuresData', this.state.brochuresData)

          for(let i = 0; i < images.length; i++){
            this.state.brochuresDataPicker.push({
              url: images[i].uri,
              name: images[i].name,
              type: images[i].type,
            })
          }
          console.log('brochuresData in picker', this.state.brochuresDataPicker)
          this.setState({ refBrochuresData : true})
        })
        .catch(e => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }

  updateBrochures = async () => {
    this.setState({ isLoading: true });
    const Uid = await AsyncStorage.getItem("projectUid");
    const {
      brochures,
      brochuresDataPicker
    } = this.state;
    console.log(
      Uid,
      brochures,
      brochuresDataPicker.length,
      brochuresDataPicker,
      
    );
    const formData = new FormData();
    formData.append('id', Uid);
    formData.append('brochures', JSON.stringify(brochures));
    formData.append('size', brochuresDataPicker.length);
    if( brochuresDataPicker != null){
      brochuresDataPicker.forEach((item, i) => {
        formData.append("brochures_files" + i, {
          uri: item.url,
          type: item.type,
          name: item.name //|| `filename${i}.jpg`,
        });
      });
    }
    
    console.log('formData', formData);
    axios
      .post(CONSTANT.BaseUrl + 'profile/update_brochures_setting',formData,
    )
    .then(resp => {
        if (resp.status == 200) {
          this.setState({ isLoading: false });
          console.log("in 200" , resp.data.message)
          Alert.alert("Success", resp.data.message);
          this.fetchBrochuresData();
      } else if (resp.status == 203) {
        this.setState({ isLoading: false });
        console.log("in 203" , resp.data.message)
        Alert.alert("Error", resp.data.message);
      }
    }).catch(err => {
        this.setState({ isLoading: false });
        //Alert.alert("Success", "Data Posted Successfully");
        //Alert.alert(err);
        console.log(err)
    })
  }

  deleteBrochures = (index) => {
    this.state.brochuresData.splice(index, 1);
    this.setState({ refBrochuresData : true});
  }

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
                marginHorizontal:10,
              }}
            >
              <Text style={styles.MainHeadingTextStyle}>{CONSTANT.Brochures}</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.pickMultiple()}
              style={[styles.PersonalDetailDownloadArea, {width: '100%'}]}
            >
              <AntIcon name="plus" color={"#767676"} size={27} />
              <Text style={styles.PersonalDetailDownloadText}>
                {CONSTANT.BrochuresProfileAddFile}
              </Text>
            </TouchableOpacity>
            { this.state.brochuresData.length >= 1 &&
              <FlatList
                style={{
                  marginHorizontal:10,
                  marginBottom:10,
                  borderColor:'#ddd', 
                  borderTopWidth:1,
                  borderLeftWidth:1, 
                  borderRightWidth:1,  
                  borderRadius:5, 
              }}
                showsVerticalScrollIndicator={false}
                data={this.state.brochuresData}
                extraData={this.state.refBrochuresData}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <View style={{
                    borderColor:'#ddd', 
                    borderBottomWidth:1,
                    height:40, 
                    flexDirection:'row', 
                    alignItems:'center',
                    paddingHorizontal:10,
                    justifyContent: 'space-between',
                    }}>
                    <View style={{width:'90%', flexDirection:'column' }}>
                      <Text>{item.name}</Text>
                      {item.size != '' && <Text style={styles.ParagraphTextStyle}>File Size: {item.size}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => this.deleteBrochures(index)} style={{padding:5}}>
                      <AntIcon name="close" color={"red"} size={16} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            }
          </View>
					<TouchableOpacity
						onPress={this.updateBrochures}
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
