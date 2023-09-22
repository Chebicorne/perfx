import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from '../../components/global/CustomText'
import GradientButton from "../../components/global/GradientButton";
import AnimatedLottieView from "lottie-react-native";
import i18n from "../../utils/i18";

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
                <AnimatedLottieView
                    autoPlay
                    style={styles.loading}
                    source={require('../../../assets/animations/gym.json')}
                />
                <CustomText style={styles.title}>
                    {i18n.t('landing.welcomeMessage')}
                </CustomText>
                <CustomText style={styles.description}>{i18n.t('landing.desc')}</CustomText>
            </View>
            <View style={styles.buttonContainer}>
                <GradientButton style={styles.button} onPress={handleLogin} colors={['#E235DC', '#a6e',]}>
                    <CustomText style={styles.buttonText}>{i18n.t('landing.connexion')}</CustomText>
                </GradientButton>
                <GradientButton style={styles.button} onPress={handleSignUp} colors={['#E235DC', '#a6e',]}>
                    <CustomText style={styles.buttonText}>{i18n.t('landing.signup')}</CustomText>
                </GradientButton>
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
        justifyContent: "center",
        paddingTop: 100,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        width: "100%"
    },
    button: {
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
    description: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        fontStyle: "italic",
        opacity: 0.8
    },
    loading: {
        width: 300,
        height: 300
    }
})