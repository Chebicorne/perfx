import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
    colors: string[]; // Les couleurs du dégradé
    children?: React.ReactNode;
    style?: object;
    onPress?: () => void;
}

const GradientButton: React.FC<GradientButtonProps> = ({
    colors,
    children,
    style,
    onPress,
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[style]}>
            <LinearGradient
                style={style}
                colors={colors}
                start={[0, 0]}
                end={[1, 0]}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
});

export default GradientButton;
