import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Checkbox, HelperText, Provider } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import { THEME, fontFamily } from '../theme/appTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SignUp, getDeviceId } from '../services';
import { API_BASE_URL } from '../services/apiConfig';

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

    useEffect(() => {
        // Enable the Sign Up button when all form fields are filled
        if (phoneNumber && isChecked) {
            setIsSignUpDisabled(false);
        } else {
            setIsSignUpDisabled(true);
        }
    }, [phoneNumber, username, password, confirmPassword, isChecked]);

    const handleSignUp = async () => {
        let deviceId = await  getDeviceId();
        const phoneId = deviceId.substring(0, 4);
        console.log('phoneId', phoneId);
        let response = await SignUp(`api/register?user_mob=${phoneNumber}&phonecode=${phoneId}`, null);
        let res = await response.json();
        if (response && response.status == 200) {
            navigation.navigate('OtpLogin', { otpCode: res?.otp, phoneNumber });
        }

        // You can access the form data: phoneNumber, username, password, isChecked, and selectedCountry
        // Example password validation
        // if (password !== confirmPassword) {
        //     setPasswordError(true);
        //     return;
        // }
        // Reset password error state
        // setPasswordError(false);
        // Proceed with sign-up
    };
    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setSecurePassword(!securePassword);
    };

    // Function to toggle password visibility
    const toggleConfirmPasswordVisibility = () => {
        setConfirmSecurePassword(!confirmSecurePassword);
    };
    return (
        <Provider>
            <View style={styles.container}>
                <StatusBar backgroundColor={THEME.white} barStyle={'dark-content'} />
                <Image source={require('../assets/signup.png')} style={{
                    width: 300, height: 200, resizeMode: 'contain', alignSelf: 'center',  // Rotate the image by 90 degrees
                }} />
                <View style={{ top: 25}}>
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
                        // left={<TextInput.Icon icon="phone" size={24} color={THEME.primary} style={styles.inputIcon} />}
                        />
                    </View>
                </View>

                {/* <View style={styles.inputContainer}>
                    <TextInput
                        mode='flat'
                        label="Full Name"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        theme={{
                            colors: {
                                primary: THEME.primary,
                                accent: THEME.primary,
                                text: THEME.black,
                                placeholder: THEME.lightGray,
                            },
                        }}
                        left={<TextInput.Icon icon="account" size={24} color={THEME.primary} style={styles.inputIcon} />}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        mode='flat'
                        label="Password"
                        value={password}
                         secureTextEntry={securePassword} // Toggle visibility based on the state
                        onChangeText={setPassword}
                        style={styles.input}
                        theme={{
                            colors: {
                                primary: THEME.primary,
                                accent: THEME.primary,
                                text: THEME.black,
                                placeholder: THEME.lightGray,
                            },
                        }}
                        left={<TextInput.Icon icon="lock" size={24} color={THEME.primary} style={styles.inputIcon} />}
                        right={<TextInput.Icon color={THEME.lightGray} icon={securePassword ? 'eye-off' : 'eye'}  onPress={togglePasswordVisibility}/>}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        mode='flat'
                        label="Confirm Password"
                        secureTextEntry={confirmSecurePassword} // Toggle visibility based on the state
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={styles.input}
                        theme={{
                            colors: {
                                primary: THEME.primary,
                                accent: THEME.primary,
                                text: THEME.black,
                                placeholder: THEME.lightGray,
                            },
                        }}
                        left={<TextInput.Icon icon="lock" size={24} color={THEME.primary} style={styles.inputIcon} />}
                        right={<TextInput.Icon color={THEME.lightGray} icon={confirmSecurePassword ? 'eye-off' : 'eye'}  onPress={toggleConfirmPasswordVisibility}/>}
                    />
                </View>

                <HelperText type="error" visible={passwordError}>
                    Passwords do not match.
                </HelperText> */}

                <View style={styles.checkboxContainer}>
                    <Checkbox.Android
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() => setIsChecked(!isChecked)}
                        color={THEME.primary}
                    />
                    <Text style={styles.checkboxLabel}>
                        I have read the FabApp{' '}
                        <Text onPress={()=> navigation.navigate('TermsCondition')} style={{ color: THEME.primary, textDecorationLine: 'underline' }}>Terms Conditions</Text>{' '}
                        and{' '}
                        <Text onPress={()=> navigation.navigate('TermsCondition')} style={{ color: THEME.primary, textDecorationLine: 'underline' }}>Privacy Policy</Text>
                    </Text>
                </View>
                <Button
                    mode='outlined'
                    onPress={handleSignUp}
                    style={[styles.signUpButton, { backgroundColor: isSignUpDisabled ? THEME.lightGray : THEME.primary }]}
                    disabled={isSignUpDisabled}
                    textColor='#fff'
                >
                    Sign Up
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
        marginHorizontal:12,
    },
});

export default SignUpScreen;
