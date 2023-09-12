// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebaseconfig';

import I18n from '../../utils/i18';
import CustomText from '../../components/global/CustomText';

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
            <CustomText>
                Connexion
            </CustomText>
            <TextInput
                style={styles.input}
                placeholder={I18n.t('login.email')}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder={I18n.t('login.password')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <Button title={I18n.t('login.login')} onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    }
});

export default LoginScreen;
