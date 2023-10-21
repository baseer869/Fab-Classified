import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, Image, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Provider } from 'react-native-paper';
import { THEME } from '../theme/appTheme';
import { getDeviceId, loggedWithSocial, saveUserInfo, saveUserToken } from '../services/apiUtils';
import axios from 'axios';
import { encode } from 'base-64';
import Toast from 'react-native-toast-message';
import { ACCOUNT_SID, AUTH_TOKEN, SERVICE_SID } from '../services/apiConfig';

const OtpVerificationScreen = ({ navigation, route }) => {
    let { phoneNumber } = route?.params;
    const [otp, setOtp] = useState(['', '', '', '',]);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [isOtpComplete, setIsOtpComplete] = useState(false);
    const [focusedInput, setFocusedInput] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [buttonStatusMsg, setButtonStatusMsg] = useState('Verifying OTP')

    useEffect(() => {
        // Check if all OTP digits are filled
        const isComplete = otp.every(digit => digit.length === 1);
        setIsOtpComplete(isComplete);
    }, [otp]);

    const handleOtpChange = (index, value) => {
        if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current.focus();
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    // Verify OTP
    const onVerifyOTP = async () => {
        // TWILIO OTP
        setLoading(true);
        const base64Credentials = encode(`${ACCOUNT_SID}:${AUTH_TOKEN}`);
        const axiosConfig = {
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
        };
        var code = String(otp);
        code = code.replace(/\,/g, ''); // This removes all commas
        axios
            .post(`https://verify.twilio.com/v2/Services/${SERVICE_SID}/VerificationCheck`, {
                "To": `${phoneNumber}`,
                "Code": `${code}`,
                "Channel": "sms",
            }, axiosConfig)
            .then(async response => {
                console.log('Verification request successful', response);
                if (response && response?.status == 200 && response?.data?.valid == false) {
                    setLoading(false);
                    Toast.show({
                        type: 'tomatoToast',
                        position: 'bottom',
                        props: { msg: 'Invalid OTP', color: THEME.error },
                    });
                } if (response && response?.status == 200 && response?.data?.status == "pending") {
                    setButtonStatusMsg('Creating profile...')
                    let deviceId = await getDeviceId();

                    // Old API

                    // const phoneId = deviceId;
                    // let response = await SignUp(`api/register?user_mob=${phoneNumber}&phonecode=${phoneId}`, null);
                    // let res = await response.json();
                    // if (response?.status == 200) {
                    //     console.log('user registered success');
                    //     setLoading(false);
                    //     navigation.replace('AddProfileScreen', { userid: response?.userid });
                    // } else {
                    //     console.log('user registered failed');
                    //     setLoading(false);
                    //     console.log('response of sign==>', response);
                    // }

                    // New API
                    let userProfile = {
                        phonecode: await getDeviceId(),
                        user_mob: phoneNumber,
                        user_code: code,
                        loggedWith: 'phoneNumber',
                        isLogged: true,
                        userToken: null,
                        email: null,
                        name: null,
                        photo: null,
                        socialId: null,
                    }
                    console.log('user profile payload==>', userProfile);
                    let response = await loggedWithSocial('api/loggedWithSocial', userProfile);
                    let useResponse = await response.json();
                    console.log('user profile creation response', useResponse);
                    if (useResponse && useResponse?.status == 200) {
                        // saveUserToken();
                        // saveUserInfo(useResponse);
                        setLoading(false);
                        navigation.replace('AddProfileScreen', { userid: response?.userid });
                    } else if (useResponse && useResponse?.status == 400) {
                        console.log('error', useResponse.errorcode)
                    }
                    else {
                        console.log('unable  to loggin with google');
                    }

                }
                return response;
            })
            .catch(error => {
                if (error.response) {
                    setLoading(false);
                    if (error.response?.status == 404) {
                        setLoading(false);
                        Toast.show({
                            type: 'tomatoToast',
                            position: 'bottom',
                            props: { msg: 'something went wrong try again.', color: THEME.info },
                        });
                    }
                } else {
                    setLoading(false);
                    console.error('Error making the request:', error.message);
                }
            });
    }
    //  Handle Resend OTP
    const handleResendOTP = async (phoneNumber) => {
        setLoading(true);
        setButtonStatusMsg('Verify')
        const base64Credentials = encode(`${ACCOUNT_SID}:${AUTH_TOKEN}`);
        const axiosConfig = {
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
        };
        // console.log('sign up with:', `${selectedCountry?.callingCode}${phoneNumber}`);
        axios
            .post(`https://verify.twilio.com/v2/Services/${SERVICE_SID}/Verifications`, {
                "To": `$${phoneNumber}`,
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
    const handleInputBlur = (index) => {
        setFocusedInput(-1);
    };
    const handleInputFocus = (index) => {
        setFocusedInput(index);
    };
    return (
        <Provider>
            <ScrollView style={styles.container}>
                <StatusBar backgroundColor={THEME.white} barStyle={'dark-content'} />
                <Image source={require('../assets/otp.png')} style={{
                    width: 300, height: 200, resizeMode: 'contain', alignSelf: 'center',  // Rotate the image by 90 degrees
                }} />
                <View style={{ paddingTop: 20 }}>
                    <Text style={styles.title}>Verify your phone number</Text>
                    <View style={{ paddingTop: 80 }}>
                        <Text style={[styles.subTitle, { textAlign: 'left', top: 20, }]}>Enter 4-digit code to continue</Text>
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={inputRefs[index]}
                                    mode='outlined'
                                    keyboardType='numeric'
                                    value={digit}
                                    onChangeText={(text) => handleOtpChange(index, text)}
                                    style={[
                                        styles.otpInput,
                                        focusedInput === index ? { borderColor: '#FC506B' } : null // Apply the border color when focused
                                    ]}
                                    theme={{
                                        colors: {
                                            primary: THEME.primary,
                                            accent: THEME.primary,
                                            text: THEME.black,
                                            placeholder: THEME.lightGray,
                                        },
                                    }}
                                    maxLength={1}
                                    onBlur={() => handleInputBlur(index)}
                                    onFocus={() => handleInputFocus(index)}
                                    returnKeyType='done'
                                />
                            ))}
                        </View>
                        <TouchableOpacity style={{ padding: 10, alignSelf: 'flex-end' }} activeOpacity={0.5} onPress={() => handleResendOTP(phoneNumber)} >
                            <Text>Resend</Text>
                        </TouchableOpacity>
                    </View>
                    {/* { backgroundColor: isOtpComplete ? THEME.primary : loading ? THEME.lightGray : THEME.lightGray } */}
                    <Button
                        mode="contained"
                        onPress={onVerifyOTP}
                        style={[styles.resendButton, loading ? { backgroundColor: THEME.lightGray } : isOtpComplete ? { backgroundColor: THEME.primary } : { backgroundColor: THEME.lightGray }]}
                        disabled={!isOtpComplete || loading}
                    >
                        {loading ? buttonStatusMsg : "Verify"}
                    </Button>
                </View>
            </ScrollView>
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
    title: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: THEME.black,
        top: 30
    },
    subTitle: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: 'Montserrat-Medium',
        textAlign: 'center',
        color: THEME.lightGray,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
    },
    otpInput: {
        flex: 1,
        aspectRatio: 1.3, // This will make the box square
        marginHorizontal: 4,
        backgroundColor: THEME.white,
        borderWidth: 0.01, // Add border width
        borderColor: THEME.grayRGBA, // Initial border color
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    resendButton: {
        marginTop: 20,
        borderRadius: 8,
        color: THEME.white,
        height: 48,
        justifyContent: 'center',
        fontSize: 16
    },
});

export default OtpVerificationScreen;
