import { StyleSheet, Text, Image, TouchableOpacity, Platform, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { THEME } from '../theme/appTheme';


const MenuHeader = ({ onMenuClick , onNotificationClick}) => {
    return (
        <SafeAreaView style={styles.headerContainer}>
            <TouchableOpacity onPress={()=> onMenuClick()} activeOpacity={0.8}  style={styles.menuItemStyle} >
                <Icon name={'menu'} size={22} color={THEME.white} />
            </TouchableOpacity>
            <Image  source={require('../assets/fab.png')}  style={{  width:100, height:30, left:100 }}/>
            {/* <TouchableOpacity  onPress={()=> onNotificationClick()} activeOpacity={0.8} style={styles.menuItemStyle} >
                <Icon name={'bell'} size={22} color={THEME.white} />
            </TouchableOpacity> */}
        </SafeAreaView>
    )
}

export default MenuHeader

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection:"row",
        alignItems:'center',
        // justifyContent:'space-between',
        backgroundColor:"rgba(255, 0, 0, 0.41)",
    },
    menuItemStyle :{
        padding: 10
    }
})