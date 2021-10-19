import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from "rn-fetch-blob";
import * as CONSTANT from '../Constants/Constant';
import { withNavigation, } from 'react-navigation';
class LatestProposalCard extends Component {
  state = {
    data: [],
    fetchFiles:[],
    isLoading: true,
  };
  FileDownload = async() => {
    const response = await fetch(
      CONSTANT.BaseUrl + "dashboard/get_attachments?id=" + this.props.ID
    );
    const json = await response.json();
    this.setState({ fetchFiles: json[0].attachment, isLoading: false },
    this.fetchfile.bind(this)
    );
 }
 fetchfile= ()=>{
   if(this.state.fetchFiles != ""){
    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: this.state.title,
      path: `${dirs.DownloadDir}/`+ this.props.title,
      },
    })
      .fetch('GET', this.state.fetchFiles, {})
      .then((res) => {
      })
      .catch((e) => {
        console.log(e)
    });
   }else{
     Alert.alert("Sorry" , "No Attachment Available")
   }
 }
  downloadFile = async()=> {
    try {
      const granted_permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE ,
        {
          title: "Storage Permission",
          message: "App needs access to memory to download the file "
        });
      if (granted_permission === PermissionsAndroid.RESULTS.GRANTED) {
        this.FileDownload();
      } else {
        Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
      }
    } catch (err) {
      console.warn(err);
    } 
  }
  render() {
    return (
      <View>
        <View style={styles.shadow}>
          <View style={{flexDirection:'row' , width:'100%'}}>
          <View
            style={{
              borderRadius: 5,
              paddingHorizontal:10,
              alignItems: 'center',
              paddingVertical: 8,
              margin: 10,
              borderColor: '#ddd',
              borderWidth: 1,
              textAlign:'center',
            }}>
            <Text>{this.props.status}</Text>
          </View>
          {
            this.props.proposal_milestone == "yes" &&
            <TouchableOpacity
            onPress={()=> this.props.navigation.navigate("ManageMilestones" , {
              id: this.props.ID,
              title: this.props.title,
              job_type: this.props.job_type,
              duration: this.props.duration,
              price: this.props.price,
            })}
              style={{
                borderRadius: 5,
                paddingHorizontal:10,
                alignItems: 'center',
                paddingVertical: 8,
                margin: 10,
                borderColor: '#ddd',
                borderWidth: 1,
                textAlign:'center',
                backgroundColor:CONSTANT.primaryColor,
              }}>
              <Text style={{color:'#fff'}}>{CONSTANT.LatestProposalCardAcceptMilestones}</Text>
            </TouchableOpacity>
          }
          
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <AntIcon
              name="checkcircle"
              color={'#02CC65'}
              size={13}
              style={{alignItems: 'center'}}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '300',
                overflow: 'hidden',
                marginTop: 1,
                marginLeft: 10,
                color: '#323232',
                textAlign: 'left',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              {this.props.title}
            </Text>
          </View>
          <View
            style={{
              alignSelf: 'auto',
            }}>
            <Text
             numberOfLines={5}
              style={{
                fontSize: 17,
                marginRight:10,
                fontWeight: '700',
                overflow: 'hidden',
                textAlign: 'left',
                color: '#323232',
                marginBottom: 10,
                marginLeft: 10,
                top: 5,
              }}>
              {this.props.job_title}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 20,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <Text
              style={{
                fontSize: 21,
                fontWeight: '700',
                overflow: 'hidden',
                marginTop: 1,
                color: '#02CC65',
                textAlign: 'left',
               
              }}>
              {this.props.price}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '300',
                overflow: 'hidden',
                marginTop: 1,
                color: '#323232',
                textAlign: 'left',
              }}>
              ( {this.props.duration} )
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '300',
                overflow: 'hidden',
                marginTop: 5,
                marginBottom: 10,
                color: '#323232',
                textAlign: 'left',
              }}>
              {this.props.cover}
            </Text>
          </View>  
            <View
              style={{
                height: 40,
                flexDirection: 'row',
                borderTopColor: '#ddd',
                borderTopWidth: 0.5,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              
              }}>
              <Text style={{ marginRight:10 , color:'#767676'}}>
                {this.props.proposal_documents} {CONSTANT.LatestProposalCardFileAttached}
              </Text>
              <TouchableOpacity>
                <AntIcon
                  name="link"
                  color={'#323232'}
                  size={15}
                  style={{alignItems: 'center'}}
                />
              </TouchableOpacity>
              
            </View>
        </View>
      </View>
    );
  }
}
export default withNavigation(LatestProposalCard);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  shadow: {
    display: 'flex',
    marginVertical: 5,
    marginHorizontal:10,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    borderRadius: 4,
    borderWidth: 0,
    borderColor: 'transparent',
    elevation: 3,
    shadowOffset: {width: 0, height: 1},
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
});
