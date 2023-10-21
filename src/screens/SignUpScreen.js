import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Image, ScrollView } from 'react-native';
import { TextInput, Button, Checkbox, Provider } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import { THEME, fontFamily } from '../theme/appTheme';
import axios from 'axios';
import { encode } from 'base-64';
import Toast from 'react-native-toast-message';
import { ACCOUNT_SID, AUTH_TOKEN, SERVICE_SID } from '../services/apiConfig';
import TermsCondition from '../components/TermsCondition';

const SignUpScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ cca2: 'PK', callingCode: '+92' });
    const [isSignUpDisabled, setIsSignUpDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const termRef = useRef();
    const PrivacyRef = useRef();

    const onOpenterms = () => {
        termRef?.current.open();
    }
    const onCloseterms = () => {
        termRef?.current.close();
    }
    const onOpenPrivacy = () => {
        termRef?.current.open();
        if (PrivacyRef.current) {
            // Replace 'textRef' with the ref of the Text element you want to scroll to
            const yOffset = textRef.current;
            PrivacyRef.current.scrollTo({ y: yOffset, animated: true });
        }
    }

    useEffect(() => {
        // Enable the Sign Up button when all form fields are filled
        if (phoneNumber && isChecked) {
            setIsSignUpDisabled(false);
        } else {
            setIsSignUpDisabled(true);
        }
    }, [phoneNumber, username, isChecked]);

// SIGN UP
    const handleSignUp = async () => {
        setLoading(true);
        const base64Credentials = encode(`${ACCOUNT_SID}:${AUTH_TOKEN}`);
        const axiosConfig = {
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
        };
        console.log('sign up with:', `${selectedCountry?.callingCode}${phoneNumber}`);
        axios
            .post(`https://verify.twilio.com/v2/Services/${SERVICE_SID}/Verifications`, {
                "To": `${selectedCountry?.callingCode}${phoneNumber}`,
                "Channel": "sms",
            }, axiosConfig)
            .then(response => {
                console.log('Verification request successful');
                setLoading(false);
                let error = THEME.success;
                Toast.show({
                    type: 'tomatoToast',
                    position: 'bottom',
                    props: { msg: 'Verification code sent to your mobile.', color: error },
                });
                setTimeout(() => {
                    navigation.navigate('OtpLogin', { phoneNumber: `${selectedCountry?.callingCode}${phoneNumber}` });
                }, 600);
                return response;
            })
            .catch(error => {
                if (error.response) {
                    setLoading(false);
                    console.log('error', error?.response);
                    if (error.response?.status == 400) {
                        setLoading(false);
                        let error = THEME.error;
                        Toast.show({
                            type: 'tomatoToast',
                            position: 'bottom',
                            props: { msg: 'Invalid mobile number.', color: error },
                        });
                    }
                } else {
                    setLoading(false);
                    console.error('Error making the request:', error.message);
                }
            });

    };
    return (
        <Provider>
            <ScrollView style={styles.container}>
                <StatusBar backgroundColor={THEME.white} barStyle={'dark-content'} />
                <Image source={require('../assets/signup.png')} style={{
                    width: 300, height: Platform.OS == 'android' ? 170 : 150, resizeMode: 'contain', alignSelf: 'center',  // Rotate the image by 90 degrees
                }} />
                <View style={{ top: 25 }}>
                    <Text style={styles.title}>Create a New Account</Text>
                    <Text style={styles.subtitle}>Let's start to sell</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingTop: 30 }}>
                    <CountryPicker
                        {...{
                            countryCode: selectedCountry.cca2,
                            withFilter: true,
                            withFlag: true,
                            withCallingCode: true,
                            withCallingCodeButton: true,
                            onSelect: (country) => setSelectedCountry(country),
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
                            theme={{
                                colors: {
                                    primary: THEME.primary,
                                    accent: THEME.primary,
                                    text: THEME.black,
                                    placeholder: THEME.black,
                                },
                            }}
                            disabled={loading}
                            returnKeyType='done'
                        />
                    </View>
                </View>
                <View style={styles.checkboxContainer}>
                    <Checkbox.Android
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() => setIsChecked(!isChecked)}
                        color={THEME.primary}
                    />
                    <Text style={styles.checkboxLabel}>
                        I have read the FabApp{' '}
                        <Text onPress={() => onOpenterms()} style={{ color: THEME.primary, textDecorationLine: 'underline' }}>Terms Conditions</Text>{' '}
                        and{' '}
                        <Text onPress={() => onOpenPrivacy()} style={{ color: THEME.primary, textDecorationLine: 'underline' }}>Privacy Policy</Text>
                    </Text>
                </View>
                <Button
                    mode='outlined'
                    onPress={handleSignUp}
                    style={[styles.signUpButton, { backgroundColor: isSignUpDisabled || loading ? THEME.lightGray : THEME.primary }]}
                    disabled={isSignUpDisabled || loading}
                    textColor='#fff'
                >
                    {loading ? "Please wait" : " Sign Up"}
                </Button>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                    <Text style={styles.infoText}>Already have an account?</Text>
                    <TouchableOpacity disabled={loading} onPress={() => navigation.navigate('LoginScreen')} style={{ padding: 2 }}>
                        <Text style={styles.signInText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <TermsCondition PrivacyRef={PrivacyRef} termRef={termRef} onCloseterms={onCloseterms} />
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS == 'android' ? 40 : 100,
        paddingHorizontal: 20,
        backgroundColor: THEME.white,
    },
    signInText: {
        color: THEME.primary,
        fontFamily: fontFamily.poppins_500,
        lineHeight: 16,
        fontSize: 14,
        textDecorationLine: 'underline',
        paddingHorizontal: 4
    },
    infoText: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'Montserrat-Light',
        textAlign: 'center',
        color: THEME.black,
    },
    title: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'Montserrat-Medium',
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
        backgroundColor: THEME.white,
        width: "90%",
        color: THEME.black
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10
    },
    checkboxLabel: {
        fontSize: 12,
        marginHorizontal: 10,
        fontFamily: 'Montserrat-Medium',
        flex: 1,
    },
    signUpButton: {
        marginTop: 20,
        color: THEME.white,
        borderRadius: 8,
        marginHorizontal: 12,
    },
});

export default SignUpScreen;
