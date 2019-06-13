import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Dimensions, TextInput } from 'react-native';
import { Text, Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';

// Style
const { width } = Dimensions.get('window');
const pillHeight = 50;
const pillWidth = width * 0.9;
const pillFontSize = pillWidth / 20;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    flexDirection: 'column',
  },
  titleText: {
    marginTop: 50,
    fontSize: 36,
    color: '#606060',
  },
  titleText1: {
    marginTop: 10,
    fontSize: 16,
    color: '#606060',
  },
  text1: {
    marginTop: 10,
    fontSize: 14,
    color: '#606060',
  },
  textInput: {
    marginTop: 30,
    fontSize: pillFontSize,
    flex: 0.1,
    borderBottomWidth: 2,
    borderBottomColor: 'red',
    width: '100%',
    paddingBottom: 0,
  },
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    borderRadius: 50,
    height: pillHeight,
    width: pillWidth,
    backgroundColor: 'orangered',
  },
});

// Component
export default function PhoneConfirmationScreen(props) {
  // Initial State
  const [codeInput, setCodeInput] = useState('');
  const [message, setMessage] = useState(''); // TO DO integrate into error
  const [phoneNumber, setPhoneNumber] = useState(
    props.navigation.getParam('phoneNumber', null),
  );
  const [confirmResult, setConfirmResult] = useState(
    props.navigation.getParam('confirmResult', null),
  );

  // Event Handlers
  const handleSubmitButtonPress = () => {
    confirmCode();
  };

  const confirmCode = () => {
    const verifyRef = firebase
      .database()
      .ref('people/')
      .child('users');

    if (confirmResult && codeInput.length) {
      confirmResult
        .confirm(codeInput)
        .then(user => {
          setMessage('Code Confirmed!');
          console.log('user.uid: ', user.uid);
          verifyRef
            .orderByChild('userID')
            .equalTo(user.uid)
            .once('value', snapshot => {
              if (!snapshot.val()) {
                verifyRef
                  .push({
                    userID: user.uid,
                    username: user.displayName,
                    userPhoto: user.photoURL,
                    userPhoneNumber: user.phoneNumber,
                  })
                  .then(data => {
                    props.navigation.navigate('Create', {
                      dataKey: data.key,
                    });
                  })
                  .catch(error => {
                    console.log('error ', error);
                  });
              } else {
                snapshot.forEach(data => {
                  console.log(data.key);
                  props.navigation.navigate('Home');
                });
              }
            });
        })
        .catch(error => setMessage(error.message));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>My code is</Text>
      <Text style={styles.titleText1}>
        Enter it below to verify {phoneNumber}
      </Text>
      <TextInput
        placeholder="Enter verification code"
        style={styles.textInput}
        onChangeText={input => setCodeInput(input)}
      />
      <Text style={{ marginTop: 7, fontSize: 14, color: 'orangered' }}>
        Didn't receive SMS?
      </Text>
      <Button
        onPress={handleSubmitButtonPress}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#f12711', '#f5af19'],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        title="Verify Code"
        fontSize={38}
      />
      <Text style={{ marginTop: 10, fontSize: 12 }}>{message}</Text>
    </SafeAreaView>
  );
}
