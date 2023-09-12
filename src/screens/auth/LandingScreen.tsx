import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from '../../components/global/CustomText'

const LandingScreen = ({ navigation }: { navigation: any }) => {
    const handleSignUp = () => {
        navigation.navigate("SignUp")
    }

    const handleLogin = () => {
        navigation.navigate("Login")
    }
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <CustomText>
                    Bienvenue sur PerfX
                </CustomText>
                <CustomText>L'app qui te permet de tracker tes performances en musculation</CustomText>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSignUp}>
                    <CustomText>S'inscrire</CustomText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogin}>
                    <CustomText>Se connecter</CustomText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default LandingScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        flexDirection: "row"
    }
})