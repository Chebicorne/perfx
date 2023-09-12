import { Ionicons } from '@expo/vector-icons';
import React, { FC, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';


const BackNavigation = ({ navigation }: any) => {
    return (
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default BackNavigation;

const styles = StyleSheet.create({
    backContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        borderRadius: 10
    }
})