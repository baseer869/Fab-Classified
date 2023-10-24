// api/apiUtils.js
import { API_BASE_URL, AUTH_TOKEN } from './apiConfig';
import DeviceInfo from 'react-native-device-info';
import { getUniqueId } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const handleError = (error) => {
  // Handle server errors or internet connectivity issues here
  // throw new Error('Server Error or Internet Issue');
};

// Helper function to create headers with or without authentication token
const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return headers;
};

// Generic function to make API requests
async function Api(url, method = 'GET', data = null, token = false) {

  const requestOptions = {
    method,
    headers: getHeaders(token),
  };

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }
  console.log('Request URl:', url, "method:", method, "data:", data, "token:", token);
  try {
    console.log('REQUEST URL:', `${API_BASE_URL}${url}`);
    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
    return response;
  } catch (error) {
    return handleError(error);
  }
}




//=============//

export const getDeviceId = () => {
  const deviceId = DeviceInfo.getUniqueId();
  return deviceId;
}


//--------------------------------------------------------//
// GET request
export async function fetchCategories(url, token = false) {
  return Api(url, 'GET', null, token);
}

// POST request Sign Up
export async function SignUp(url, data, token = false) {
  return Api(url, 'POST', data, token);
}

// POST request To Verify User
export async function VerifyLgin(url, data, token = false) {
  return Api(url, 'POST', data, token);
}

// POST request Sign Up
export async function Login(url, data, token = false) {
  return Api(url, 'POST', data, token);
}

// GET request Classified Ads
export async function classifiedAds(url, data, token = false) {
  return Api(url, 'GET', data, token);
}

// GET request Classified Ads
export async function verifyOTP(url, data, token = false) {
  return Api(url, 'POST', data, token);
}

// GET request Classified Ads
export async function onCompleteProfile(url, data, token = false) {
  return Api(url, 'POST', data, token);
}

// GET request Classified Ads
export async function subCategories(url, data, token = false) {
  return Api(url, 'POST', data, token);
}

// GET request Car makes
export async function listCarMakes(url, data, token = false) {
  return Api(url, 'GET', data, token);
}

// GET request Car models
export async function listCarModels(url, data, token = false) {
  return Api(url, 'GET', data, token);
}

// GET request Ask Supprt
export async function AskSupport(url, data, token = false) {
  return Api(url, 'POST', data, token);
}
// GET request Load Ask Messages
export async function LoadAskSupportMessages(url, data, token = false) {
  return Api(url, 'POST', data, token);
}
// POST request Ads Post
export async function PosAds(url, data, token = false) {
  return Api(url, 'POST', data, token);
}
// POST request for google login
export async function loggedWithSocial(url, data, token = false) {
  return Api(url, 'POST', data, token);
}
// POST request for google login
export async function onAddToFavourite(url, data, token = false) {
  return Api(url, 'POST', data, token);
}

// POST request for google login
export async function onfetchReels(url, data, token = false) {
  return Api(url, 'GET', data, token);
}
// POST request for google login
export async function fetchUserAds(url, data, token = false) {
  return Api(url, 'GET', data, token);
}


// Function to save the user's token
export const saveUserToken = async (logged) => {
  try {
    // await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('IsLogged', 'true');
    console.log('User token and login status saved successfully');
  } catch (error) {
    console.error('Error saving user token and login status:', error);
  }
};
// Function to save user information
export const saveUserInfo = async (userInfo) => {
  try {
    // Convert the user info object to a JSON string before saving it
    const userInfoString = JSON.stringify(userInfo);
    await AsyncStorage.setItem('userInfo', userInfoString);
    console.log('User information saved successfully');
  } catch (error) {
    console.error('Error saving user information:', error);
  }
};

// Function to read user information
export const readUserInfo = async () => {
  try {
    const userInfoString = await AsyncStorage.getItem('userInfo');
    if (userInfoString) {
      // Convert the JSON string back to an object
      const userInfo = JSON.parse(userInfoString);
      return userInfo;
    }
    return null; // User information not found
  } catch (error) {
    console.error('Error reading user information:', error);
    return null;
  }
};

// Function to remove the user token
export const removeUserToken = async () => {
  try {
    await AsyncStorage.removeItem('IsLogged');
    console.log('User token and login status removed successfully');
  } catch (error) {
    console.error('Error removing user token and login status:', error);
  }
};


export const onWhatsAppNow = (phoneNumber) => {
  const url = `https://wa.me/${phoneNumber}`;
  Linking.openURL(url)
    .catch((err) => console.error('An error occurred: ', err));
};


export const onCallNow = (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url)
    .catch((err) => console.error('An error occurred: ', err));
};
