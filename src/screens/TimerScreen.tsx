import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../components/global/CustomText';
import NavigationBack from "../components/global/BackNavigation"
import GradientButton from '../components/global/GradientButton';

const TimerScreen = ({ navigation }: any) => {
    const [milliseconds, setMilliseconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const startTime = useRef<number | null>(null);
    useEffect(() => {
        if (isActive) {
            startTime.current = Date.now() - milliseconds;
            interval.current = setInterval(() => {
                setMilliseconds(Date.now() - (startTime.current || 0));
            }, 10);
        } else {
            if (interval.current) {
                clearInterval(interval.current);
            }
        }
        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    }, [isActive]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${centiseconds < 10 ? '0' : ''}${centiseconds}`;
    };


    return (
        <View style={styles.container}>
            <CustomText style={styles.title}>Chronomètre</CustomText>
            <CustomText style={styles.timerText}>{formatTime(milliseconds)}</CustomText>
            <View style={{width: "100%"}}>
                <GradientButton colors={['#E235DC', '#a6e']} onPress={() => setIsActive(!isActive)} style={styles.button}>
                    <CustomText style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</CustomText>
                </GradientButton>
                {!isActive ?
                    <GradientButton colors={['#E235DC', '#a6e']} onPress={() => setMilliseconds(0)} style={styles.button}>
                        <CustomText style={styles.buttonText}>Reset</CustomText>
                    </GradientButton>
                    :
                    <></>}

            </View>
            <NavigationBack navigation={navigation} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingVertical: 50,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
    },
    timerText: {
        fontSize: 70,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        width: "100%",
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        textAlign: "center"
    },
});

export default TimerScreen;
