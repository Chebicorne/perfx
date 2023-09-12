import React, { FC, useEffect } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface CustomTextProps {
    style?: TextStyle;
    children: any;
}

const Label: FC<CustomTextProps> = ({ style, children }) => {
    return <Text style={[style, styles.label]}>{children}</Text>;
};

export default Label;

const styles = StyleSheet.create({
    label: {
        color: "white",
        fontSize: 20
    }
})