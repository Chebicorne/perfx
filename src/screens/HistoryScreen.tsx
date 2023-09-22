import { SafeAreaView, FlatList, View, StyleSheet, RefreshControl, TouchableOpacity, Text } from "react-native";
import CustomText from "../components/global/CustomText";
import { getData, storeData } from "../utils/storageHelper";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { auth, db } from '../firebase/firebaseconfig'
import i18n from "../utils/i18";

const HistoryScreen = ({ navigation }: any) => {
    const [doneWorkouts, setDoneWorkouts] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDoneWorkouts = async () => {
        try {
            if (auth.currentUser) {
                const currentUserId = auth.currentUser.uid; // Récupérez l'ID de l'utilisateur connecté
    
                const workoutsRef = collection(db, 'doneWorkouts');
                
                // Créez une requête pour filtrer les doneWorkouts en fonction de l'ID de l'utilisateur
                const filteredQuery = query(workoutsRef, where("userId", "==", currentUserId));
    
                const workoutsSnapshot = await getDocs(filteredQuery);
    
                const workoutsData = workoutsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                setDoneWorkouts(workoutsData);
                storeData('doneWorkouts', workoutsData);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des doneWorkouts:", error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true)
        fetchDoneWorkouts()
        setRefreshing(false)
        console.log(doneWorkouts);
    }

    useEffect(() => {
        const fetchDoneWorkoutsFromStorage = async () => {
            const storedWorkouts = await getData('doneWorkouts');
            if (storedWorkouts) {
                setDoneWorkouts(storedWorkouts);
            } else {
                fetchDoneWorkouts();
            }
        };
        console.log(doneWorkouts);

        fetchDoneWorkoutsFromStorage();
    }, []);

    function formatDate(isoString: any) {
        const date = new Date(isoString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }


    return (
        <SafeAreaView style={styles.container}>
            <CustomText style={styles.title}>{i18n.t("workouts.history")}</CustomText>
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={doneWorkouts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    const sessionName = item.sessionName

                    return (
                        <TouchableOpacity style={styles.workoutButton} onPress={() => navigation.navigate('WorkoutView', { workoutDetails: item })}
                        >
                            <CustomText>{sessionName}</CustomText>
                            <CustomText>{formatDate(item.date)}</CustomText>
                        </TouchableOpacity>
                    );
                }}
            />

        </SafeAreaView>
    );
}

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingVertical: 50,
        paddingHorizontal: 20
    },
    workoutButton: {
        backgroundColor: '#2A2A32',
        width: "100%",
        borderRadius: 10,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
    },
})