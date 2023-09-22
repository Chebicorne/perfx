// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebaseconfig';

import I18n from '../../utils/i18';
import CustomText from '../../components/global/CustomText';
import GradientButton from '../../components/global/GradientButton';
import AnimatedLottieView from 'lottie-react-native';

const LoginScreen: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // Navigate to the main screen or handle the user login
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <AnimatedLottieView
                autoPlay
                style={styles.loading}
                source={require('../../../assets/animations/signup.json')}
            />
            <CustomText style={styles.title}>
                {I18n.t('login.connect')}
            </CustomText>
            <View style={{ width: "100%" }}>
                <TextInput
                    placeholderTextColor={"white"}
                    style={styles.input}
                    placeholder={I18n.t('login.email')}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    placeholderTextColor={"white"}
                    style={styles.input}
                    placeholder={I18n.t('login.password')}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                <GradientButton style={styles.button} onPress={handleLogin} colors={['#E235DC', '#a6e',]}>
                    <CustomText style={styles.buttonText}>{I18n.t('login.login')}</CustomText>
                </GradientButton>
            </View>
            <Text></Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 100,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    input: {
        width: "100%",
        height: 50,
        color: 'white',
        fontStyle: "italic",
        borderBottomColor: "white",
        borderBottomWidth: 0.3,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    },
    button: {
        width: "100%",
        marginTop: 10,
        borderRadius: 10,
    },
    buttonText: {
        padding: 20,
        textAlign: 'center',
        fontSize: 20
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
    },
    loading: {
        width: 300,
        height: 300
    }
});

export default LoginScreen;
