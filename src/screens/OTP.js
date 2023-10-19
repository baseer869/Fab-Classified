import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';

function OTP({navigation}) {
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);

    // verification code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(null)
    // Handle login
    function onAuthStateChanged(user) {
        if (user) {
            // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
            // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
            // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
            // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Handle the button press
    async function signInWithPhoneNumber() {
        console.log('phons', phoneNumber);
        const confirmation = await auth().signInWithPhoneNumber(`+92${phoneNumber}`);
       console.log('confirmation', confirmation);
        setConfirm(confirmation);
        navigation.navigate('SplashScreen')
    }

    async function confirmCode() {
        try {
            await confirm.confirm(code);
            console.log('confired success');
        } catch (error) {
            console.log('Invalid code.');
        }
    }

    if (!confirm) {
        return (
            <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
                <TextInput
                 value={phoneNumber}
                 onChangeText={(text)=> setPhoneNumber(text)}
                 placeholder='Enter phone number'
                />
                <Button
                    title="Phone Number Sign In"
                    onPress={() => signInWithPhoneNumber(`${phoneNumber}`)}
                />
            </SafeAreaView>

        );
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
            <TextInput value={code} onChangeText={text => setCode(text)} />
            <Button title="Confirm Code" onPress={() => confirmCode()} />
        </SafeAreaView>
    );
}

export default OTP