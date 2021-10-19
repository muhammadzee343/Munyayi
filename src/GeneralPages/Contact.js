import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { withNavigation, DrawerActions } from 'react-navigation';
import SimpleHeader from "../Header/SimpleHeader";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";

class Contact extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.ContactNumberContactSupport} />
          <View style={styles.contactMainArea}>
            <View style={styles.contactTextArea}>
              <Text style={styles.contactHeadingText}>
                  {CONSTANT.ContactNumberHeader}
              </Text>
              <Text style={styles.contactInfoText}>
                  {CONSTANT.ContactNumberOne}
              </Text>
              <Text style={styles.contactInfoText}>
                {CONSTANT.ContactNumberTwo}
              </Text>
            </View>
            
            <View style={styles.contactTextArea}>
              <Text style={styles.contactHeadingText}>
                {CONSTANT.ContactEmailHeader}
              </Text>
              <Text style={styles.contactInfoText}>
                {CONSTANT.ContactEmailOne}
              </Text>
              <Text style={styles.contactInfoText}>
                {CONSTANT.ContactEmailTwo}
              </Text>
            </View>
          </View>
      </View>
    );
  }
}
export default withNavigation(Contact);
