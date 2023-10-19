import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Checkbox, HelperText, Provider } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import { THEME, fontFamily } from '../theme/appTheme';
import { SignUp, getDeviceId } from '../services';
import axios from 'axios';
import { encode } from 'base-64';
// import querystring from 'querystring';
import Toast from 'react-native-toast-message';

const SignUpScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ cca2: 'US', callingCode: '1' });
    const [passwordError, setPasswordError] = useState(false);
    const [isSignUpDisabled, setIsSignUpDisabled] = useState(true);
    const [securePassword, setSecurePassword] = useState(true); // State to control password visibility
    const [confirmSecurePassword, setConfirmSecurePassword] = useState(true); // State to control password visibility
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Enable the Sign Up button when all form fields are filled
        if (phoneNumber && isChecked) {
            setIsSignUpDisabled(false);
        } else {
            setIsSignUpDisabled(true);
        }
    }, [phoneNumber, username, password, confirmPassword, isChecked]);


    const getTwilioOTPCode = async (phoneNumber) => {


    };

    const handleSignUp = async () => {
        setLoading(true);
        // let deviceId = await getDeviceId();
        // const phoneId = deviceId;
        // let response = await SignUp(`api/register?user_mob=${phoneNumber}&phonecode=${phoneId}`, null);
        // let res = await response.json();
        // if (response && response.status == 200) {

        // TWILIO OTP
        const accountSid = 'AC2614c158a71c453e081884d57aa818ec';
        const authToken = '9572e984473c190550a96a71de627e98';
        const serviceSid = 'VA11b7f786f210e0efdfc150f49bfaddac';  // Service SID for your Verify service
        // Encode the credentials with base-64
        const base64Credentials = encode(`${accountSid}:${authToken}`);
        const axiosConfig = {
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
        };
        console.log('phoneNumber', `+${selectedCountry?.callingCode[0]}${phoneNumber}`);
        axios
            .post(`https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`, {
                "To": `+${selectedCountry?.callingCode[0]}${phoneNumber}`,
                "Channel": "sms",
            }, axiosConfig)
            .then(response => {
                console.log('Verification request successful');
                console.log('Response data:', response.data);
                setLoading(false);
                let error = THEME.success;
                Toast.show({
                    type: 'tomatoToast',
                    position: 'bottom', // 'top', 'center', 'bottom'
                    // And I can pass any custom props I want
                    props: { msg: 'Verification code sent to your mobile.', color:  error  },
                });
                setTimeout(() => {
                    navigation.navigate('OtpLogin', { phoneNumber: `+${selectedCountry?.callingCode[0]}${phoneNumber}` });
                }, 600);
                // Handle the response or verification code as needed
                return response;
            })
            .catch(error => {
                if (error.response) {
                    setLoading(false);
                    if (error.response?.status == 400) {
                        setLoading(false);
                        let error = THEME.error;
                        Toast.show({
                            type: 'tomatoToast',
                            position: 'bottom', // 'top', 'center', 'bottom'
                            // And I can pass any custom props I want
                            props: { msg: 'Invalid mobile number.', color:  error  },
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
            <View style={styles.container}>
                <StatusBar backgroundColor={THEME.white} barStyle={'dark-content'} />
                <Image source={require('../assets/signup.png')} style={{
                    width: 300, height: 200, resizeMode: 'contain', alignSelf: 'center',  // Rotate the image by 90 degrees
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
                            // withCountryNameButton: true,
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
                                    placeholder: THEME.lightGray,
                                },
                            }}
                            disabled={loading}
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
                        <Text onPress={() => navigation.navigate('TermsCondition')} style={{ color: THEME.primary, textDecorationLine: 'underline' }}>Terms Conditions</Text>{' '}
                        and{' '}
                        <Text onPress={() => navigation.navigate('TermsCondition')} style={{ color: THEME.primary, textDecorationLine: 'underline' }}>Privacy Policy</Text>
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
                    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={{ padding: 2 }}>
                        <Text style={styles.signInText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        width: "90%"
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10
    },
    checkboxLabel: {
        fontSize: 12,
        marginLeft: 10,
        fontFamily: 'Montserrat-Medium'
    },
    signUpButton: {
        marginTop: 20,
        color: THEME.white,
        borderRadius: 8,
        marginHorizontal: 12,
    },
});

export default SignUpScreen;
