import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME, fontFamily } from "../theme/appTheme";

const styles = StyleSheet.create({
    buttonContainer :{
        height: 25,
        borderRadius: 4,
        backgroundColor: THEME.white,
        justifyContent:'space-evenly',
        alignItems:'center',
        flexDirection:'row',
        marginVertical:5
    },
    title:{
        fontSize: 10,
        fontFamily: fontFamily.poppins_600,
        lineHeight:10,
        color: THEME.black,
        paddingHorizontal:10,
    }
})


const PhoneButton = ({ title, onButtonPress, icon,color, }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => onButtonPress()} style={styles.buttonContainer}>
            <Icon name={icon} size={18} color={color} />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};


export { PhoneButton };