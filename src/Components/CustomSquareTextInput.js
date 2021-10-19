import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const SquareTextInput = props => {
  return (
    <View style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
      <View
        style={[styles.container, {height: props.height ? props.height : 50}]}>
        <View style={styles.leftIconContainer}>
          {props.leftIcon ? props.leftIcon : null}
        </View>
        <View style={{height: 50, width: '80%'}}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              props.onChangeText(text);
            }}
            placeholder={props.placeHolder}
            placeholderTextColor="#000"
            keyboardType={props.keyboardType ? props.keyboardType : 'default'}
            value={props.value}
            editable={props.isEditable ? props.isEditable : true}
            autoCapitalize={
              props.autoCapitalize ? props.autoCapitalize : 'sentences'
            }
            autoCorrect={props.autoCorrect ? props.autoCorrect : true}
            autoFocus={props.autoFocus ? props.autoFocus : false}
            clearTextOnFocus={
              props.clearTextOnFocus ? props.clearTextOnFocus : false
            }
            keyboardAppearance={
              props.keyboardAppearance ? props.keyboardAppearance : 'default'
            }
            secureTextEntry={
              props.secureTextEntry ? props.secureTextEntry : false
            }
            textAlign={props.textAlign ? props.textAlign : 'left'}
          />
        </View>

        <View
          style={{
            alignItems: 'flex-end',
            width: '15%',
          }}>
          <View style={styles.rightIconContainer}>
            {props.rightIcon ? props.rightIcon : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    // color: 'gray',
  },
  container: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor:"gray",
     borderWidth: 0.3
  },
  leftIconContainer: {
    height: 50,
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SquareTextInput;
