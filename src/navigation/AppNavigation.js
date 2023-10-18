import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AdsReelScreen from '../screens/AdsReelScreen';
import SplashScreen from '../screens/SplashScreen';
import DrawerContent from './DrawerMenu';
import CategoryScreen from '../screens/CategoryScreen';
import AdsListingScreen from '../screens/AdsListingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTabBar from './TabMenu';
import AddAdsScreen from '../screens/AddAdsScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import AddProfileScreen from '../screens/AddProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CategorySelectionScreen from '../screens/CategorieStack/CategoriesSelectionScreen';
import SubCategories1 from '../screens/CategorieStack/SubCategories1';
import SubCategories2 from '../screens/CategorieStack/SubCategories2';
import SubCategories3 from '../screens/CategorieStack/SubCategories3';
import SubCategories4 from '../screens/CategorieStack/SubCategories4';
import SubCategories5 from '../screens/CategorieStack/SubCategories5';
import SubCategories6 from '../screens/CategorieStack/SubCategories6';
import AdsFormScreen from '../screens/CategorieStack/AdsFormScreen';
import UserAdScreen from '../screens/UserAdScreen';
import { AdFileUploadScreen} from '../screens/AdUploadFileScreen';
import UserFavouriteScreen from '../screens/UserFavouriteScreen';
import OTP from '../screens/OTP';
import ViewUserAdScreen from '../screens/ViewUserAdScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

const AppTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
    <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ tabBarIconName: 'home-outline' }} />
    <Tab.Screen name="Listing" component={AdsListingScreen} options={{ tabBarIconName: 'text-box-outline' }} />
    <Tab.Screen name="AddForm" component={AddAdsScreen} options={{ tabBarIconName: 'plus-circle' }} />
    <Tab.Screen name="Support" component={ChatScreen} options={{ tabBarIconName: 'chat-outline' }} />
    <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ tabBarIconName: 'account' }} />
  </Tab.Navigator>
);

const AppDrawer = () => (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="AppTabs">
      <Drawer.Screen name="AppTabs" component={AppTabs} />
      <Drawer.Screen name="AdsReelScreen" component={AdsReelScreen} />
      <Drawer.Screen name="CategoriesScreen" component={CategoryScreen} />
      <Drawer.Screen name="ListingScreen" component={AdsListingScreen} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>

);

function AppAuthStack() {
  return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }} >
        <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
        <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
        <AuthStack.Screen name="OtpLogin" component={OtpVerificationScreen} />
        <AuthStack.Screen name="AddProfileScreen" component={AddProfileScreen} />
      </AuthStack.Navigator>
  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
      {/* <Stack.Screen name="OTP" component={OTP} /> */}

        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="AuthStack" component={AppAuthStack} />
         <Stack.Screen name="DrawerMenu" component={AppDrawer} />
        <Stack.Screen name ={'DetailsScreen'} component={DetailsScreen} />
        <Stack.Screen name ={'CategorySelectionScreen'} component={CategorySelectionScreen} /> 
        <Stack.Screen name ={'SubCategories1'} component={SubCategories1} /> 
        <Stack.Screen name ={'AdsFormScreen'} component={AdsFormScreen} /> 
        <Stack.Screen name="AdFileUploadScreen" component={AdFileUploadScreen} />
        <Stack.Screen name ={'UserAdScreen'} component={UserAdScreen} />
        <Stack.Screen name ={'UserFavouriteScreen'} component={UserFavouriteScreen} />  
        <Stack.Screen name="AdsReelScreen" component={AdsReelScreen} />
        <Stack.Screen name="ViewUserAdScreen" component={ViewUserAdScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default AppNavigation;