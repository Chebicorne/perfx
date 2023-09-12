import React, { FC, useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import * as Font from 'expo-font';

type FontStyle = 'regular' | 'italic' | 'semibold' | 'bold' | 'boldItalic';

interface CustomTextProps {
    style?: TextStyle;
    fontStyle?: FontStyle;
    children: any;
}

const CustomText: FC<CustomTextProps> = ({ style, children, fontStyle = 'regular' }) => {
    return <Text style={[{ color: '#F0F0F0' }, style]}>{children}</Text>;
};

export default CustomText;
