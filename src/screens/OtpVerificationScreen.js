import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, Image, ScrollView } from 'react-native';
import { TextInput, Button, Provider } from 'react-native-paper';
import { THEME } from '../theme/appTheme';
import { getDeviceId, verifyOTP } from '../services/apiUtils';

const OtpVerificationScreen = ({ navigation, route }) => {
    let { otpCode, phoneNumber } = route?.params
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [isOtpComplete, setIsOtpComplete] = useState(false);
    const [focusedInput, setFocusedInput] = useState(-1);

    const handleOtpChange = (index, value) => {
        if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current.focus();
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    useEffect(() => {
        // Check if all OTP digits are filled
        const isComplete = otp.every(digit => digit.length === 1);
        setIsOtpComplete(isComplete);
    }, [otp]);

    const onVerifyOTP = async () => {
        let deviceId = await getDeviceId();
        var a = String(otp);
        a = a.replace(/\,/g, ''); // This removes all commas
        const phoneId = deviceId.substring(0, 4);
        console.log('phoneId', phoneId);
        let response = await verifyOTP(`api/verify?vcode=${parseInt(a)}&user_mob=${phoneNumber}&phonecode=${phoneId}`);
        let otpResponse = await response?.json();
        console.log('otp response', otpResponse);
        if (response && response?.status == 200 && otpResponse == 'success') {
            console.log('success otp');
            navigation.replace('AddProfileScreen');
        } else if (response && response?.status == 200 && response == 'wvc') {
            console.log('show  toast  for wrong code');
        }
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
                        <Text style={[styles.title, { textAlign: 'left', top: 20, fontSize: 20 }]}>{`Verification Code: ${otpCode}`}</Text>
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
                                />
                            ))}
                        </View>
                    </View>
                    <Button
                        mode="contained"
                        onPress={onVerifyOTP}
                        style={[styles.resendButton, { backgroundColor: isOtpComplete ? THEME.primary : THEME.lightGray }]}
                        disabled={!isOtpComplete} // Disable the button if OTP is not complete
                    >
                        Verify
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
