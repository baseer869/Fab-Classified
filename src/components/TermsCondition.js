import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import React, { useEffect, useRef } from 'react'
import { THEME, fontFamily } from '../theme/appTheme';
import { Introduction, acceptance } from '../services/constantData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TermsCondition = ({ termRef, onCloseterms, PrivacyRef }) => {
    return (
        <RBSheet
            ref={termRef}
            height={Dimensions.get('window').height}
            customStyles={{
                container: {
                    paddingVertical: 20,
                    paddingHorizontal: 15,
                    height: Dimensions.get('window').height
                },
            }}
        >
            <ScrollView showsVerticalScrollIndicator={false} style={[styles.sheetContent, {  marginTop:15 }]}>
                    <Text style={[styles.title, { textAlign: 'center' }]}>Terms and conditions</Text>
                    <TouchableOpacity style={{ position:'absolute', top:0, right:0}} onPress={() => onCloseterms()}>
                        <Icon name={'close'} size={30} color={THEME.lightGray} />
                    </TouchableOpacity>
                <View style={{ paddingVertical: 20 }}>
                    <Text style={[styles.title, { fontSize: 18, paddingVertical: 12 }]}>Introduction</Text>
                    <Text style={styles.IntroductionTerms}>{Introduction}</Text>
                    <Text ref={PrivacyRef} style={[styles.title, { fontSize: 18, paddingVertical: 12 }]}>Acceptance of the Terms of Use</Text>
                    <Text style={styles.IntroductionTerms}>{acceptance}</Text>
                </View>
            </ScrollView>
        </RBSheet>
    )
}

export default TermsCondition

const styles = StyleSheet.create({
    sheetContent: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 20,
        fontFamily: fontFamily.poppins_600,
        lineHeight: 24,
        color: THEME.black,
    },
    IntroductionTerms: {
        fontSize: 14,
        fontFamily: fontFamily.poppins_400,
        lineHeight: 17,
        color: THEME.black
    }
})