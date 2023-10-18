import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { THEME, fontFamily } from '../theme/appTheme';

const DrawerContent = ({ navigation }) => {
  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  const MenuTitleView = ({ title, routeName }) => {
    return (
      <View style={styles.direction}>
        <Text style={[styles.menuTitleStyles]}>{title}</Text>
        <Icon name="menu-down" size={24} color={THEME.white} />
      </View>
    )
  }
  return (

    <DrawerContentScrollView style={styles.DrawerContentContainer}>
      {/* Close icon */}
      <SafeAreaView style={{ flex:1}}>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <Icon name="close" size={24} color={THEME.white} />
        </TouchableOpacity>
        <View style={styles.padding}>
          {/* Menu items */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuItem}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <MenuTitleView title={'Home'} routeName={"HomeScreen"} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuItem}
            onPress={() => navigation.navigate('CategoriesScreen')}
          >
            <MenuTitleView title={'Categories'} routeName={"CategoriesScreen"} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuItem}
            onPress={() => navigation.navigate('ListingScreen')}
          >
            <MenuTitleView title={'Listing'} routeName={"ListingScreen"} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuItem}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <MenuTitleView title={'My Account'} routeName={"ProfileScreen"} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* App logo at the bottom */}
      {/* <View style={styles.appLogo}>
        <Image source={require('./app-logo.png')} style={styles.logoImage} />
      </View> */}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 20,
    // top:  StatusBar.currentHeight + 20,
    right: 20,
    zIndex: 1,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: THEME.white,
    justifyContent: "flex-start"
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  appLogo: {
    marginTop: 'auto', // Pushes the logo to the bottom
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  DrawerContentContainer: {
    backgroundColor: THEME.primary
  },
  padding: {
    paddingTop: 60,
    paddingHorizontal: 30,
    width: "90%"
  },
  menuTitleStyles: {
    fontSize: 14,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 16,
    color: THEME.white,
  }
});

export default DrawerContent;
