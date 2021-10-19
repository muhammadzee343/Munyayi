import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, AsyncStorage, Alert, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import styles from '../Constants/Styles';
import * as CONSTANT from '../Constants/Constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleHeader from '../Header/SimpleHeader';
import { WebView } from 'react-native-webview';

class Invoices extends Component {

	state = {
    data: [],
		isLoading: true,
  };

	componentDidMount() {
    this.fetchInvoicesData();
  }
	fetchInvoicesData = async () => {
		const Uid = await AsyncStorage.getItem('projectUid');
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_invoice_listings?user_id=" + Uid
    );
		const json = await response.json();
		if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ data: [], isLoading: false }); // empty data set
    } else {
      this.setState({ data: json, isLoading: false });
    }
		
		console.log("data" , JSON.stringify(this.state.data));
	};

	
  render() {
		const {
      storedType,
			isLoading,
    } = this.state;
    return (
      <View style={styles.container}>
				<SimpleHeader HeaderText={CONSTANT.DrawerInvoices} />
        {isLoading && storedType !== "" ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {this.state.data.length >= 1 ? 
          <View>
            <View style={styles.section}>
              <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.DrawerInvoices}
              </Text>
            </View>
            <FlatList
              style={styles.section}
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item }) => (
                <View
                  // onPress = {() => Linking.canOpenURL('https://google.com').then(() => {
                  // 		Linking.openURL('https://google.com');
                  // })}
                  style={{
                    borderColor: "#ddd",
                    borderWidth: 1,
                    borderRadius: 5,
                    marginBottom: 10,
                    backgroundColor: "#fff",
                    paddingHorizontal:10,
                    paddingVertical:10
                  }}
                >
                  <View style={{flex:1, flexDirection:'row', width:'100%', justifyContent:'space-between', paddingVertical:5, paddingHorizontal:5}}>
                    <Text style={styles.SectionHeadingTextStyle}>{CONSTANT.InvoicesOrderId}</Text>
                    <Text style={styles.ParagraphTextStyle}>{item.post_id}</Text>
                  </View>
                  <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'100%', paddingVertical:5, paddingHorizontal:5}}>
                    <Text style={styles.SectionHeadingTextStyle}>{CONSTANT.InvoicesCreatedDate}</Text>
                    <Text style={styles.ParagraphTextStyle}>{item.created_date}</Text>
                  </View>
                  <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'100%', paddingVertical:5, paddingHorizontal:5}}>
                    <Text style={styles.SectionHeadingTextStyle}>{CONSTANT.InvoicesAmount}</Text>
                    <Text style={styles.ParagraphTextStyle}>{item.price}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={ () => {this.props.navigation.navigate("InvoiceDetailPage", { post_id: item.post_id })}}
                    style={styles.MainButtonArea}>
                    <Text style={styles.ButtonText}>
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          :
          <View style={styles.NoDataMainArea}>
            <Image style={styles.NoDataImageStyle}
              source={require('../Images/nodata.png')}
            />
          </View>
        }
      </View>
    );
  }
}

export default Invoices;
