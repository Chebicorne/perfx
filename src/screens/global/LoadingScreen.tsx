import { SafeAreaView, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LottieView
                autoPlay
                style={styles.loading}
                source={require('../../../assets/animations/loading.json')}
            />
        </SafeAreaView>
    )
}

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
    },
    loading: {
        width: 200,
        height: 200
    }
})