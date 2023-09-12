import { SafeAreaView, StyleSheet, Text } from "react-native";
import CustomText from "../components/global/CustomText";
import GradientButton from "../components/global/GradientButton"
import { logout } from "../firebase/firebaseconfig";

const Profile = () => {
    return (
        <SafeAreaView style={styles.container}>
            <CustomText style={styles.title}>Profile</CustomText>
            <GradientButton style={styles.button} colors={['#E235DC', '#a6e',]} onPress={logout}>
                <CustomText style={styles.buttonText}>Déconnexion</CustomText>
            </GradientButton>
        </SafeAreaView>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 50,
    },
    button: {
        borderRadius: 10,
    },
    buttonText: {
        padding: 20,
        textAlign: 'center',
        fontSize: 20
    }
})