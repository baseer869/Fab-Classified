import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Image, ScrollView, ToastAndroid } from 'react-native';
import { TextInput, Button, Provider } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal'; // Import the country picker
import { THEME, fontFamily } from '../theme/appTheme';
import { LoggedWithGoogle, Login, SignUp, saveUserInfo, saveUserToken } from '../services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { getDeviceId } from '../services';


const SignInScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState({ cca2: 'US', callingCode: '1' }); // Default country
  const [securePassword, setSecurePassword] = useState(true); // State to control password visibility
  const [loading, setLoading] = useState(false);
  // Somewhere in your code
  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let { user } = userInfo;
      //
      let userProfile = {
        userToken: userInfo?.idToken,
        email: user.email,
        name: user?.name,
        photo: user?.photo,
        socialId: user?.id,
        loggedWith: 'google',
        isLogged: true,
        phonecode : await getDeviceId(),
      }
      let response = await LoggedWithGoogle('api/loggedWithSocial', userProfile);
      let useResponse = await response.json();
      console.log('user profile details', useResponse);
       if(useResponse && useResponse?.status == 200){
        saveUserToken();
        saveUserInfo(useResponse);
        navigation.replace('DrawerMenu');
       } else if(useResponse && useResponse?.status == 400){
        console.log('error',useResponse.errorcode )
       } 
       else {
        console.log('unable  to loggin with google');
      }

    } catch (error) {
      console.log('error', error);
      if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes?.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      GoogleSignin.configure({
        // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '587869193262-cv4tquapv85u9gpoijoa3pg6cdv60uud.apps.googleusercontent.com',
        // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        // hostedDomain: '', // specifies a hosted domain restriction
        // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        // accountName: '', // [Android] specifies an account name on the device that should be used
        iosClientId: '587869193262-vvp6qoo736f6h2hd10hkts5l1en4osaq.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
        // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
        // profileImageSize: 120, /// [iOS] The desired height (and width) of the profile image. Defaults to 120px
      });
    }, 1000);
  }, [])


  const handleSignIn = async () => {
    setLoading(true);

    let response = await Login(`api/login?user_mob=${phoneNumber}&user_pwd=${password}&phonecode=${8898}`, null);
    console.log('regggggg', response);
    let res = await response.json();
    console.log('respomssssssssssss', res);
    // if (response && (response?.status == 200 && res === 'mnf')) {
    //   setLoading(false)
    //   ToastAndroid.show('User does not exist', ToastAndroid.LONG);
    // } else if (response && (response?.status == 200 && res === 'rnc')) {
    //   setLoading(false)
    //   ToastAndroid.show('Please complete your profile to continue', ToastAndroid.LONG);
    //    navigation.replace('AddProfileScreen');
    // } 
    // else if (response && response.status == 200) {
    //   console.log('ssssss', res);
    //   setLoading(false)
    //   // navigation.navigate('OtpLogin', { otpCode: res?.otp });
    // }
  };

  const handleForgotPassword = () => {
    // Implement your "Forgot your password?" logic here
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setSecurePassword(!securePassword);
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor={THEME.white} barStyle={'dark-content'} />
        <Image source={require('../assets/login.png')} style={{
          width: 300, height: 200, resizeMode: 'contain', alignSelf: 'center',  // Rotate the image by 90 degrees
        }} />
        <View style={{ top: 25 }}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Let's start to sell</Text>
        </View>
        <View style={{ paddingTop: 16 }}>
          <CountryPicker
            {...{
              countryCode: country.cca2,
              withFilter: true,
              withFlag: true,
              withCountryNameButton: true,
              withCallingCode: true,
              withCallingCodeButton: true,
              onSelect: (country) => setCountry(country),
            }}
            containerButtonStyle={styles.countryPicker}
          />
          <View style={styles.inputContainer}>
            <TextInput
              mode='flat'
              label="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.input}
              theme={{
                colors: {
                  primary: THEME.primary,
                  accent: THEME.primary,
                  text: THEME.black,
                  placeholder: THEME.lightGray,
                },
              }}
              left={<TextInput.Icon icon="phone" size={24} color={THEME.primary} style={styles.inputIcon} />}

            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              mode='flat'
              label="Password"
              secureTextEntry={securePassword} // Toggle visibility based on the state
              value={password}
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
              right={<TextInput.Icon color={THEME.lightGray} icon={securePassword ? 'eye-off' : 'eye'} onPress={togglePasswordVisibility} />}
              left={<TextInput.Icon icon="lock" size={24} color={THEME.primary} style={styles.inputIcon} />}
            />
          </View>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleSignIn}
            style={[styles.signInButton, { backgroundColor: (phoneNumber && password ? THEME.primary : THEME.lightGray) || (loading && THEME.lightGray) }]}
            disabled={!phoneNumber || !password || loading}
          >
            Sign In
          </Button>
          <View style={styles.createAccountContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={styles.createAccountLink}>Create your account now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', alignSelf: 'center', marginVertical: 20 }}>
          <Text style={styles.ortext}>OR</Text>
          <View style={styles.socialButtonContainer}>
            <Text>Continue with</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <TouchableOpacity style={{ padding: 10, marginHorizontal: 6 }} onPress={() => loginWithFacebook()} activeOpacity={0.8}>
                <Icon name={'facebook'} color={'#078BEA'} size={30} />
              </TouchableOpacity> */}
              <TouchableOpacity style={{ padding: 10, marginHorizontal: 10 }} onPress={() => loginWithGoogle()} >
                <Icon name={'google'} color={'#4071D8'} size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: THEME.black,
  },
  subtitle: {
    fontSize: 14,
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
    flex: 1,
    backgroundColor: THEME.white,
  },
  forgotPassword: {
    fontSize: 14,
    textAlign: 'right',
    color: THEME.primary,
    marginTop: 5,
  },
  signInButton: {
    marginTop: 10,
    backgroundColor: THEME.primary,
    borderRadius: 8,
    height: 44

  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  createAccountLink: {
    textDecorationLine: 'underline',
    color: THEME.primary,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center'
  },
  ortext: {
    fontSize: 18,
    fontFamily: fontFamily.poppins_500,
    color: THEME.black,
    lineHeight: 22,
  }
});

export default SignInScreen;
