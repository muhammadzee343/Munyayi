import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
} from 'react-native';
import {withNavigation, DrawerActions} from 'react-navigation';
import SimpleHeader from "../Header/SimpleHeader";
import * as CONSTANT from "../Constants/Constant";
import styles from "../Constants/Styles";

class AboutUs extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SimpleHeader HeaderText={CONSTANT.AboutUs} />
        <ScrollView>
          <View>
            <Text style={styles.aboutUsMainText}>
              {CONSTANT.AboutUsMain}
            </Text>
            <View style={styles.aboutUsView}>
                <View style={styles.aboutUsTextArea}>
                  <Text style={styles.aboutUsTextRegular}>{CONSTANT.AboutUsCompany}</Text>
                  <Text style={styles.aboutUsTextRegular}>:</Text>
                </View>
                <Text style={styles.aboutUsTextBold}>{CONSTANT.AboutUsCompanyName}</Text>
            </View>
            <View style={styles.aboutUsView}>
                <View style={styles.aboutUsTextArea}>
                  <Text style={styles.aboutUsTextRegular}>{CONSTANT.AboutUsAPPversionText}</Text>
                  <Text style={styles.aboutUsTextRegular}>:</Text>
                </View>
                <Text style={styles.aboutUsTextBold}>{CONSTANT.AboutUsAppVersion}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(AboutUs);
