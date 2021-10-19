import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, AsyncStorage, ScrollView } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
import styles from '../Constants/Styles';
import { WebView } from 'react-native-webview';
import SimpleHeader from "../Header/SimpleHeader";
import HTML from 'react-native-render-html';

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class InvoiceDetailPage extends Component {

  state = {
    invoiceDetail: [],
		isLoading: true,
  };

	componentDidMount() {
    this.fetchInvoicesData();
  }
	fetchInvoicesData = async () => {
    const Uid = await AsyncStorage.getItem('projectUid');
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_invoice_detail?user_id=" + Uid + "&invoice_id=" + params.post_id
    );
		const json = await response.json();
		this.setState({ invoiceDetail: json, isLoading: false });
	};

  render() {
    const {
      isLoading,
      invoiceDetail
    } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.InvoicesHeaderText}/>
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {/* <WebView source={{ uri: params.url }} /> */}
        <ScrollView style={styles.section}>
          <View style={{borderBottomColor:'#ddd', borderBottomWidth:1, marginBottom:20, marginTop:10}}>
            <View style={{flexDirection:'row', alignItems: 'center', justifyContent:'space-between', marginBottom:10}}>
              <Text style={{}}>Invoice #</Text>
              <Text style={{fontWeight:'700', fontSize:16}}>{params.post_id}</Text>
            </View>

            <View style={{flexDirection:'row', alignItems: 'center', justifyContent:'space-between', marginBottom:10}}>
              <Text>Created Date: </Text>
              <Text style={{fontWeight:'700', fontSize:16}}>{invoiceDetail.created_date}</Text>
            </View>

            <View style={{flexDirection:'row', alignItems: 'center', justifyContent:'space-between', marginBottom:10}}>
              <Text style={{}}>
                {`${entities.decode(invoiceDetail.invoice_details ? invoiceDetail.invoice_details.type_title : "")}`}
              </Text>
              <Text style={{fontWeight:'700', fontSize:16}}>
                {`${entities.decode(invoiceDetail.invoice_details ? invoiceDetail.invoice_details.title : "")}`}
              </Text>
            </View>
          </View>

          <View style={{marginBottom:10}}>
            <View style={{marginBottom:10}}>
              <Text style={{fontWeight:'700'}}>To:</Text>
              <HTML
                // containerStyle={{marginRight: 4,}}
                // baseFontStyle={styles.ParagraphTextStyle}
                html={invoiceDetail.billing_address}
              />
            </View>
            {/* <View style={{marginBottom:10}}>
              <Text>From:</Text>
              <Text>{`${entities.decode(invoiceDetail.from_billing_address)}`}</Text>
            </View> */}
          </View>

          <View style={{borderWidth:1, borderColor: '#ddd'}}>
            <View style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor: '#ddd',}}>
              <View style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10}}>
                <Text>Cost</Text>
              </View>
              <Text style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10}}>
                {`${entities.decode(invoiceDetail.invoice_details ? invoiceDetail.invoice_details.cost : "")}`}
              </Text>
            </View>

            <View style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor: '#ddd',}}>
              <View style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10}}>
                <Text>Taxes</Text>
              </View>
              <Text style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10}}>
                {`${entities.decode(invoiceDetail.invoice_details ? invoiceDetail.invoice_details.taxes : "")}`}
              </Text>
            </View>

            <View style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor: '#ddd',}}>
              <View style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10}}>
                <Text>Amount</Text>
              </View>
              <Text style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10}}>
                {`${entities.decode(invoiceDetail.invoice_details ? invoiceDetail.invoice_details.amount : "")}`}
              </Text>
            </View>

            <View style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor: '#ddd',}}>
              <View style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10}}>
                <Text style={{fontWeight:'700'}}>Subtotal</Text>
              </View>
              <Text style={{borderRightWidth:1, borderRightColor:'#ddd', width:'50%', paddingLeft:10, paddingVertical:10, fontWeight:'700'}}>
                {`${entities.decode(invoiceDetail.subtotal)}`}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default InvoiceDetailPage;
