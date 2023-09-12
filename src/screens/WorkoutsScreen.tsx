import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, FlatList, RefreshControl, View, Alert } from "react-native";
import CustomText from "../components/global/CustomText";
import { auth, db } from '../firebase/firebaseconfig';
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"; // Ajoutez doc, deleteDoc ici
import { Ionicons } from '@expo/vector-icons';

const WorkoutsScreen = ({ navigation }: any) => {
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWorkouts = async () => {
        if (auth.currentUser) {
            const workoutsSchemasRef = collection(db, 'workoutsSchemas');
            const q = query(workoutsSchemasRef, where("userId", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const workoutsData: any[] = [];
            querySnapshot.forEach((doc) => {
                workoutsData.push({ id: doc.id, ...doc.data() });
            });
            setWorkouts(workoutsData);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchWorkouts().then(() => setRefreshing(false));
    }, []);

    const handleEditExercise = (item: any) => {
        navigation.navigate("AddWorkout", { workoutData: item })
    }

    const handleDeleteExercise = async (itemId: string) => {
        // Pop-up de confirmation
        Alert.alert(
            "Suppression de séance",
            "Êtes-vous sûr de vouloir supprimer cette séance ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Oui", onPress: async () => {
                        const workoutDoc = doc(db, 'workoutsSchemas', itemId);
                        await deleteDoc(workoutDoc);
                        fetchWorkouts(); // Rafraîchir la liste après suppression
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomText style={styles.title}>Mes séances</CustomText>
            <FlatList
                data={workouts}
                style={styles.workoutsContainer}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.workoutButton}
                    >
                        <CustomText>{item.name}</CustomText>
                        <View style={styles.editButtonsContainer}>
                            <TouchableOpacity style={styles.editButtons} onPress={() => handleEditExercise(item)}>
                                <Ionicons name="create-outline" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.editButtons} onPress={() => handleDeleteExercise(item.id)} >
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            <TouchableOpacity onPress={() => navigation.navigate("AddWorkout")} style={styles.addButton}>
                <CustomText>+</CustomText>
            </TouchableOpacity>
        </SafeAreaView >
    )
}

export default WorkoutsScreen;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 50,
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        borderWidth: 2,
        borderColor: "#a6e",
        borderStyle: "dashed",
        borderRadius: 10
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
        marginBottom: 50,
    },
    workoutsContainer: {
        width: "100%",
        height: "auto"
    },
    editButtons: {
        padding: 5,
        backgroundColor: "white",
        borderRadius: 5
    },
    editButtonsContainer: {
        flexDirection: "row",
        width: "25%",
        justifyContent: "space-between",
    },
})
