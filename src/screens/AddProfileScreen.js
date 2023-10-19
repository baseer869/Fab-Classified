import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Checkbox, HelperText, Provider } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import { THEME, fontFamily } from '../theme/appTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDeviceId, onCompleteProfile } from '../services';
import { API_BASE_URL } from '../services/apiConfig';

const AddProfileScreen = ({ navigation, route }) => {
  let { userid} = route?.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isSignUpDisabled, setIsSignUpDisabled] = useState(true);
  const [securePassword, setSecurePassword] = useState(true); // State to control password visibility
  const [confirmSecurePassword, setConfirmSecurePassword] = useState(true); // State to control password visibility

  useEffect(() => {
    // Enable the Sign Up button when all form fields are filled
    if (username && password && confirmPassword) {
      setIsSignUpDisabled(false);
    } else {
      setIsSignUpDisabled(true);
    }
  }, [ username, password, confirmPassword,]);

  const onSubmit = async () => {
    let response = await onCompleteProfile(`api/complete-profile?name=${username}&pwd=${password}&confirmpwd=${confirmPassword}&uid=${userid}`, null);
    console.log('response of complete', response);
    let res = await response.json();
    console.log('resss', res);
    if (response && response.status == 200) {
      navigation.navigate('DrawerMenu');
    }

    // You can access the form data: phoneNumber, username, password, isChecked, and selectedCountry
    // Example password validation
    // if (password !== confirmPassword) {
    //     setPasswordError(true);
    //     return;
    // }
    // Reset password error state
    // setPasswordError(false);
    // Proceed with sign-up
  };
  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setSecurePassword(!securePassword);
  };

  // Function to toggle password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmSecurePassword(!confirmSecurePassword);
  };
  return (
    <Provider>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEME.white} barStyle={'dark-content'} />
        <View style={{ top: 25 }}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Complete your profile to continue</Text>
        </View>
        <View style={{ paddingTop: 40 }}>
          <View style={styles.inputContainer}>
            <TextInput
              mode='flat'
              label="Full Name"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              theme={{
                colors: {
                  primary: THEME.primary,
                  accent: THEME.primary,
                  text: THEME.black,
                  placeholder: THEME.lightGray,
                },
              }}
              left={<TextInput.Icon icon="account" size={24} color={THEME.primary} style={styles.inputIcon} />}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              mode='flat'
              label="Password"
              value={password}
              secureTextEntry={securePassword} // Toggle visibility based on the state
              onChangeText={setPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: THEME.primary,
                  accent: THEME.primary,
                  text: THEME.black,
                  placeholder: THEME.lightGray,
                },
              }}
              left={<TextInput.Icon icon="lock" size={24} color={THEME.primary} style={styles.inputIcon} />}
              right={<TextInput.Icon color={THEME.lightGray} icon={securePassword ? 'eye-off' : 'eye'} onPress={togglePasswordVisibility} />}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              mode='flat'
              label="Confirm Password"
              secureTextEntry={confirmSecurePassword} // Toggle visibility based on the state
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: THEME.primary,
                  accent: THEME.primary,
                  text: THEME.black,
                  placeholder: THEME.lightGray,
                },
              }}
              left={<TextInput.Icon icon="lock" size={24} color={THEME.primary} style={styles.inputIcon} />}
              right={<TextInput.Icon color={THEME.lightGray} icon={confirmSecurePassword ? 'eye-off' : 'eye'} onPress={toggleConfirmPasswordVisibility} />}
            />
          </View>
        </View>
        <HelperText type="error" visible={passwordError}>
          Passwords do not match.
        </HelperText>
        <Button
          mode='outlined'
          onPress={onSubmit}
          style={[styles.signUpButton, { backgroundColor: isSignUpDisabled ? THEME.lightGray : THEME.primary }]}
          disabled={isSignUpDisabled}
          textColor='#fff'
        >
          Save
        </Button>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == 'android' ? 40 : 100,
    paddingHorizontal: 20,
    backgroundColor: THEME.white,
  },
  signInText: {
    color: THEME.primary,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 16,
    fontSize: 14,
    textDecorationLine: 'underline',
    paddingHorizontal: 4
  },
  infoText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Montserrat-Light',
    textAlign: 'center',
    color: THEME.black,
  },
  title: {
    fontSize: 22,
    lineHeight: 22,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    color: THEME.black,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: THEME.lightGray,
    fontFamily: 'Montserrat-Medium',
  },
  countryPicker: {
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: THEME.white,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    backgroundColor: THEME.white,
    width: "95%",
    alignSelf: 'center',
    justifyContent: 'center'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10
  },
  checkboxLabel: {
    fontSize: 12,
    marginLeft: 10,
    fontFamily: 'Montserrat-Medium'
  },
  signUpButton: {
    marginTop: 20,
    color: THEME.white,
    borderRadius: 8,
    marginHorizontal: 12,
  },
});

export default AddProfileScreen;
