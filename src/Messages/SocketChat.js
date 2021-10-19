import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ScrollView,
    Alert
  } from 'react-native';
  import { DeviceEventEmitter } from 'react-native';
  
  import Sockets from 'react-native-sockets';
import AntIcon from "react-native-vector-icons/AntDesign";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";
import * as CONSTANT from '../Constants/Constant';
import { Header } from "react-native-elements";
class SocketChat extends Component {
    clientAddr;
    messagecount = 1;
    port = 8080;

    constructor() {
        super();
    
        this.state = {
          clientStatus: 'Disconnected',
          serverStatus: 'Disconnected',
          serverMessage: '',
          clientMessage: '',
          serverError: '',
          clientError: '',
          ipAddress: ''
        };
    
        Sockets.getIpAddress(ip => {
          this.setState({ ipAddress: ip[0] });
        }, err => {
          console.log('getIpAddress_error', err);
        })
    
        //client events
        DeviceEventEmitter.addListener('socketClient_error', (d) => {
          console.log('socketClient_error', d);
          this.setState({ clientError: d.error });
        });
        DeviceEventEmitter.addListener('socketClient_connected', (d) => {
          console.log('socketClient_connected', d);
          this.setState({ clientStatus: 'Connected' })
        });
        DeviceEventEmitter.addListener('socketClient_closed', (d) => {
          console.log('socketClient_closed', d);
          this.setState({ clientStatus: 'Disconnected' })
        });
        DeviceEventEmitter.addListener('socketClient_data', (d) => {
          console.log('socketClient_data', d);
          this.setState({ clientMessage: d.data });
        });
    
        //server events
        DeviceEventEmitter.addListener('socketServer_connected', (d) => {
          console.log('socketServer_connected', d);
          this.setState({ serverStatus: 'Connected' });
        });
        DeviceEventEmitter.addListener('socketServer_error', (d) => {
          console.log('socketServer_error', d);
          this.setState({ serverError: d.error });
        });
        DeviceEventEmitter.addListener('socketServer_clientConnected', (d) => {
          console.log('socketServer_clientConnected', d);
          this.clientAddr = d.id;
        });
        DeviceEventEmitter.addListener('socketServer_data', (d) => {
          console.log('socketServer_data', d);
          this.setState({ serverMessage: d.data });
        });
        DeviceEventEmitter.addListener('socketServer_closed', (d) => {
          console.log('socketServer_closed', d);
          this.setState({ serverStatus: 'Disconnected' });
        });
        DeviceEventEmitter.addListener('socketServer_clientDisconnected', (d) => {
          console.log('socketServer_clientDisconnected', d);
        });
      }
    
      startServer() {
        Sockets.startServer(this.port);
      }
    
      connectClient() {
        Sockets.startClient({
          address: this.state.ipAddress,
          port: this.port,
          reconnect: true
        });
      }
    
      sendServer(isLong) {
        if (!isLong) Sockets.write("message to server: " + this.messagecount++);
        if (isLong) Sockets.write("Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog message!");
      }
    
      sendClient(isLong) {
        if (!isLong) Sockets.emit("message to client: " + this.messagecount++, this.clientAddr);
        if (isLong) Sockets.emit("Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog message!", this.clientAddr);
      }
    
      disconnectServer() {
        Sockets.close();
        this.setState({ serverStatus: 'Disconnected' })
      }
    
      disconnectClient() {
        Sockets.disconnect();
      }
    
      pingServer() {
        let ip = this.state.ipAddress;
        Sockets.isHostAvailable(ip, 500, success => {
          Alert.alert(ip + " is available");
        }, err => {
          Alert.alert(ip + " is not available", e);
        });
      }
    
      serverAvailable() {
        Sockets.isServerAvailable(this.state.ipAddress, this.port, 1000, success => {
          Alert.alert("Socket server is available");
        }, err => {
          Alert.alert("Socket server is not available");
        });
      }
      render() {
        return (
          <View style={[styles.container, { flexDirection: 'column' }]}>
            <Text style={styles.text}>{CONSTANT.SocketChatIP}{this.state.ipAddress}</Text>
            <TouchableHighlight style={styles.button} onPress={() => { this.pingServer() }}>
              <Text style={styles.buttonText}>{CONSTANT.SocketChatPing} {this.state.ipAddress}</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => { this.serverAvailable() }}>
              <Text style={styles.buttonText}>{CONSTANT.SocketChatCheckServerAvailable}</Text>
            </TouchableHighlight>
            <View style={styles.container}>
              <View style={{ flex: 1 }}>
                <Text style={styles.welcome}>{CONSTANT.SocketChatServer}</Text>
                <Text style={styles.text}>{CONSTANT.SocketChatStatus}{this.state.serverStatus}</Text>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.startServer() }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatStart}</Text>
                </TouchableHighlight>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.sendClient() }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatMessageClient}</Text>
                </TouchableHighlight>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.sendClient(true) }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatMessageClientLong}</Text>
                </TouchableHighlight>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.disconnectServer() }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatDisconnect}</Text>
                </TouchableHighlight>
    
                <ScrollView>
                  <Text style={styles.welcome}>{CONSTANT.SocketChatLastMessage}</Text>
                  <Text style={styles.text}>{this.state.serverMessage}</Text>
    
                  <Text style={styles.welcome}>{CONSTANT.SocketChatLastError}</Text>
                  <Text style={styles.text}>{this.state.serverError}</Text>
                </ScrollView>
              </View>
    
              <View style={{ flex: 1 }}>
                <Text style={styles.welcome}>{CONSTANT.SocketChatClient}</Text>
                <Text style={styles.text}>{CONSTANT.SocketChatStatus}{this.state.clientStatus}</Text>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.connectClient() }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatConnect}</Text>
                </TouchableHighlight>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.sendServer() }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatMessageServer}</Text>
                </TouchableHighlight>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.sendServer(true) }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatMessageServerLong}</Text>
                </TouchableHighlight>
    
                <TouchableHighlight style={styles.button} onPress={() => { this.disconnectClient() }}>
                  <Text style={styles.buttonText}>{CONSTANT.SocketChatDisconnect}</Text>
                </TouchableHighlight>
    
                <ScrollView>
                  <Text style={styles.welcome}>{CONSTANT.SocketChatLastMessage}</Text>
                  <Text style={styles.text}>{this.state.clientMessage}</Text>
    
                  <Text style={styles.welcome}>{CONSTANT.SocketChatLastError}</Text>
                  <Text style={styles.text}>{this.state.clientError}</Text>
                </ScrollView>
              </View>
            </View>
          </View>
        );
      }
}
export default SocketChat;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flexDirection: 'row'
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      text: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
      },
      buttonText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
      },
      button: {
        margin: 5,
        borderWidth: 1
      },
});
