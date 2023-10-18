// CustomTabBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import your desired icon library
import { THEME, fontFamily } from '../theme/appTheme';

const tabData = [
  { name: 'HomeScreen', title: 'Home', iconName: 'home-outline' },
  { name: 'Listing', title: 'Listing', iconName: 'text-box-outline' },
  { name: 'AddForm', title: 'Sell Now', iconName: 'plus-circle' },
  { name: 'Chat', title: 'Support', iconName: 'chat-outline' },
  { name: 'ProfileScreen', title: 'My Account', iconName: 'account' },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tabInfo = tabData[index];

        const iconName = tabInfo.iconName;
        let iconColor = isFocused ? THEME.primary : THEME.lightGray; // Active and inactive icon color
        let tabSize = 28; // Default icon size
        let iconTopOffset = tabInfo.name === 'AddForm' ? -20 : 0; // Adjust top offset for "plus-circle" icon

        // Customize the color of the "plus-circle" icon
        if (tabInfo.name === 'AddForm') {
          iconColor = isFocused ? THEME.primary : THEME.primary; // Change colors as needed
          tabSize = 55; // Larger icon size for "plus-circle"
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tab, isFocused ? styles.focusedTab : null]}
            onPress={onPress}
          >
            {tabInfo.name === 'AddForm' ? (
              <View style={{ alignItems: 'center' }}>
                <Icon name={iconName} size={tabSize} color={iconColor} style={{ marginTop: iconTopOffset }} />
              </View>
            ) : (
              <Icon name={iconName} size={tabSize} color={iconColor} />
            )}
            <Text style={[styles.tabTitle, isFocused ? { color: THEME.primary, fontFamily: fontFamily.poppins_600 } : { color: THEME.black, opacity:0.7, fontFamily: fontFamily.poppins_500 }]}>{tabInfo.title}</Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: THEME.white,
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedTab: {
    paddingBottom: 5, // Adjust the padding to separate the icon and title
  },
  tabTitle: {
    fontSize: 11,
    color: THEME.black,
    fontFamily: fontFamily.poppins_Light,
  },
});

export default CustomTabBar;
