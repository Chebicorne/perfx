import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebaseconfig';

import I18n from '../../utils/i18';
import CustomText from '../../components/global/CustomText';

const SignUpScreen: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setErrorMessage(I18n.t('signUp.passwordsDoNotMatch'));
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    };

    return (
        <View style={styles.container}>
            <CustomText>
                Inscription
            </CustomText>
            <TextInput
                style={styles.input}
                placeholder={I18n.t('signUp.email')}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder={I18n.t('signUp.password')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder={I18n.t('signUp.confirmPassword')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <Button title={I18n.t('signUp.signUp')} onPress={handleSignUp} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
});

export default SignUpScreen;
