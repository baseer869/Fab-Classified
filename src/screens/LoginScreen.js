import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Image, ScrollView, } from 'react-native';
import { TextInput, Button, } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal'; // Import the country picker
import { THEME, fontFamily } from '../theme/appTheme';
import { loggedWithSocial, Login, saveUserInfo, saveUserToken } from '../services';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { getDeviceId } from '../services';
import Toast from 'react-native-toast-message';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import ModalLoader from '../components/ModalLoader';

const SignInScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState({ cca2: 'PK', callingCode: '92' }); // Default country
  const [securePassword, setSecurePassword] = useState(true); // State to control password visibility
  const [loading, setLoading] = useState(false);
  // Login With Google 
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
        phonecode: await getDeviceId(),
      }
      let response = await loggedWithSocial('api/loggedWithSocial', userProfile);
      let useResponse = await response.json();
      console.log('user profile details', useResponse);
      if (useResponse && useResponse?.status == 200) {
        saveUserToken();
        saveUserInfo(useResponse);
        navigation.replace('DrawerMenu');
      } else if (useResponse && useResponse?.status == 400) {
        console.log('error', useResponse.errorcode)
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
  // Login with Apple 
  async function onLoginWithApple() {
    // Start the sign-in request
    let appleAuthRequestResponse;
    let AppleResponse
    try {
      appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      // Sign the user in with the credential
      AppleResponse = await auth().signInWithCredential(appleCredential);
    } catch (error) {
      Toast.show({
        type: 'tomatoToast',
        position: 'bottom',
        props: { msg: 'User cancelled the login with apple.', color: THEME.error },
      });
    }
    // Ensure Apple returned a user identityToken
    if (appleAuthRequestResponse && !appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
    if (AppleResponse) {
      setLoading(true);
      try {
        let userProfile = {
          userToken: AppleResponse?.user?.refreshToken,
          email: AppleResponse?.user.email,
          name: AppleResponse?.user?.displayName,
          photo: AppleResponse?.user?.photoURL || null,
          socialId: AppleResponse?.user?.uid,
          loggedWith: 'apple',
          user_mob: AppleResponse?.user?.phoneNumber,
          isLogged: true,
          phonecode: await getDeviceId(),
        }
        let response = await loggedWithSocial('api/loggedWithSocial', userProfile);
        let useResponse = await response.json();
        if (useResponse && useResponse?.status == 200) {
          saveUserToken();
          saveUserInfo(useResponse);
          setLoading(false);
          navigation.replace('DrawerMenu');
        } else if (useResponse && useResponse?.status == 400) {
          setLoading(false);
        }
        else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
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
    }
    return AppleResponse;
  }

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
    let deviceId = await getDeviceId();
    let payload = {
      user_mob: `+${country?.callingCode}${phoneNumber}`,
      user_pwd: password,
      phonecode: `${deviceId}`
    }
    let response = await Login(`api/login`, payload);
    let res = await response?.json();
    if (response && (response?.status == 200 && res?.code === 'mnf')) {
      setLoading(false)
      let error = THEME.error;
      Toast.show({
        type: 'tomatoToast',
        position: 'bottom',
        props: { msg: 'User does not exist.', color: error },
      });
      return
    } else if (response && (response?.status == 200 && res?.code === 'rnc')) {
      setLoading(false)
      let error = THEME.error;
      Toast.show({
        type: 'tomatoToast',
        position: 'bottom',
        props: { msg: 'Please complete your profile to continue.', color: error },
      });
      navigation.replace('AddProfileScreen');
      return
    }
    else if (response && (response?.status == 200 && res?.code === 'anv')) {
      setLoading(false)
      let error = THEME.info;
      Toast.show({
        type: 'tomatoToast',
        position: 'bottom',
        props: { msg: 'Your profile is in verification process, please wait.', color: error },
      });
      return
    } else if (res && res?.code == 'wrongpwd') {
      setLoading(false);
      let error = THEME.error;
      Toast.show({
        type: 'tomatoToast',
        position: 'bottom',
        props: { msg: res?.message, color: error },
      });
      return
    }
    else if (response && response.status == 200) {
      console.log('latest login===>', res);
      let userProfile = {
        data: res
      }
      saveUserToken();
      saveUserInfo(userProfile);
      setLoading(false)
      navigation.navigate('DrawerMenu');
      return;
    }
  };

  const handleForgotPassword = () => {
    // Implement your "Forgot your password?" logic here
  };
  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setSecurePassword(!securePassword);
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor={THEME.white} barStyle={'dark-content'} />
        <Image source={require('../assets/login.png')} style={{
          width: 300, height: Platform.OS == 'android' ? 170 : 150, resizeMode: 'contain', alignSelf: 'center',  // Rotate the image by 90 degrees
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
              placeholderTextColor={THEME.black}
              theme={{
                colors: {
                  primary: THEME.primary,
                  accent: THEME.primary,
                  text: THEME.black,
                  placeholder: THEME.black,
                },
              }}
              left={<TextInput.Icon icon="phone" size={24} color={THEME.primary} style={styles.inputIcon} />}
              returnKeyType='done'
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
                  placeholder: THEME.bla,
                },
              }}
              right={<TextInput.Icon color={THEME.lightGray} icon={securePassword ? 'eye-off' : 'eye'} onPress={togglePasswordVisibility} />}
              left={<TextInput.Icon icon="lock" size={24} color={THEME.primary} style={styles.inputIcon} />}
              placeholderTextColor={THEME.black}
           />
          </View>
          {/* <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity> */}
          <Button
            mode="contained"
            onPress={handleSignIn}
            style={[styles.signInButton, loading ? { backgroundColor: THEME.lightGray } : { backgroundColor: (phoneNumber && password ? THEME.primary : THEME.lightGray) }]}
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
          <TouchableOpacity onPress={() => loginWithGoogle()} activeOpacity={0.8} style={styles.socialButtonContainer}>
            <Image style={styles.googleIcon} source={require('../assets/google3×.png')} />
            <Text style={styles.googleTex}>Continue with Google</Text>
          </TouchableOpacity>
          {/* Continue with Apple */}
          {Platform.OS == 'ios' && <TouchableOpacity onPress={() => onLoginWithApple()} activeOpacity={0.8} style={[styles.socialButtonContainer, { bottom: 20 }]}>
            <Image style={styles.googleIcon} source={require('../assets/apple.png')} />
            <Text style={styles.googleTex}>Sign In with Apple</Text>
          </TouchableOpacity>}
        </View>
      </ScrollView>
      <ModalLoader visible={loading} title={'Profile is in process...'} />
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == 'android' ? 40 : 80,
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
    color: THEME.black,
    fontFamily: fontFamily.poppins_600,
    fontSize: 16,
    lineHeight: 18
  },
  forgotPassword: {
    fontSize: 14,
    textAlign: 'right',
    color: THEME.primary,
    marginTop: 5,
  },
  signInButton: {
    marginTop: 20,
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
    alignItems: 'center',
    backgroundColor: THEME.grayRGBA,
    paddingVertical: 8,
    paddingHorizontal: 27,
    borderRadius: 30,
  },
  ortext: {
    fontSize: 18,
    fontFamily: fontFamily.poppins_500,
    color: THEME.black,
    lineHeight: 22,
  },
  googleIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain'
  },
  googleTex: {
    fontSize: 13,
    fontFamily: fontFamily.poppins_600,
    lineHeight: 15,
    color: THEME.black,
    paddingLeft: 6
  }
});

export default SignInScreen;
