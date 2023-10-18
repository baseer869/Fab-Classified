import { SafeAreaView, StyleSheet, Image, Text,  } from 'react-native'
import React, { useEffect } from 'react'
import { THEME,  } from '../theme/appTheme'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const IsUserLogged = async () => {
    try {
      const IsLogged = await AsyncStorage.getItem('IsLogged');
      // Check if the user is logged in (IsLogged === 'true')
      if (IsLogged === 'true') {
        console.log('user logged');
        return navigation.replace('DrawerMenu'); // Navigate to the Home screen
      } else {
        console.log('session expired');
        return navigation.replace('AuthStack'); // Navigate to the Authentication screen
      }
    } catch (error) {
      console.error('Error reading IsLogged from AsyncStorage:', error);
      return 'Auth'; // Handle any errors by defaulting to the Authentication screen
    }
  };

  // navigation.replace('AuthStack')
  useEffect(() => {
    setTimeout(() => {
      IsUserLogged();
    }, 500);
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/fab-logo.jpg')} style={styles.appLogo} />
      <Text style={styles.text}>Please wait...</Text>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.white
  },
  appLogo: {
    width: 200,
    height: 200,
    resizeMode: 'cover'
  },
  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-Italic',
    position: 'absolute',
    bottom: 30
  }
})