import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { THEME, fontFamily } from '../theme/appTheme'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const BackHeader = ({ title, goBack }) => {
    return (
        <SafeAreaView style={styles.backHeaderContainer}>
            <View style={styles.flexDirection}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => goBack()}>
                    <Icon name={'chevron-left'} size={28} color={THEME.white} />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
            </View>
        </SafeAreaView>
    )
}

export default BackHeader

const styles = StyleSheet.create({
    backHeaderContainer: {
        backgroundColor: THEME.primary,
        paddingTop: StatusBar.currentHeight,
    },
    title: {
        fontSize: 16,
        color: THEME.white,
        fontFamily: fontFamily.poppins_600,
        lineHeight: 18,
        paddingVertical:15
    },
    flexDirection: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "space-between",
        width: '65%',
        paddingHorizontal: 14
    }
})