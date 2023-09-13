import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import CustomText from "../components/global/CustomText";
import { db } from '../firebase/firebaseconfig'; // Assurez-vous que le chemin est correct
import { collection, getDocs } from 'firebase/firestore';
import { storeData, getData } from '../utils/storageHelper'; // Assurez-vous que le chemin est correct

const HomePageScreen = ({ navigation }: any) => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSessions = async () => {
        try {
            const sessionsRef = collection(db, 'workoutsSchemas'); // Assurez-vous que c'est la bonne collection
            const sessionsSnapshot = await getDocs(sessionsRef);

            const sessionsData = sessionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setSessions(sessionsData);
            storeData('sessions', sessionsData);
        } catch (error) {
            console.error("Erreur lors de la récupération des séances:", error);
        }
    };

    useEffect(() => {
        const fetchSessionsFromStorage = async () => {
            const storedSessions = await getData('sessions');
            if (storedSessions) {
                setSessions(storedSessions);
            } else {
                fetchSessions();
            }
        };

        fetchSessionsFromStorage();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSessions();  // Récupérer les séances
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <CustomText style={styles.title}>Salut, Lenny</CustomText>

                <View style={styles.workoutsContainer}>
                    <CustomText style={styles.containerTitle}>On fait quoi aujourd'hui ?</CustomText>

                    <FlatList
                        data={sessions}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('ConfirmWorkout', { session: item })} style={styles.workoutButton}>
                                <CustomText>{item.name}</CustomText>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                        horizontal={true}
                    />
                </View>

                <View style={styles.workoutsContainer}>
                    <CustomText style={styles.containerTitle}>Ma progression :</CustomText>
                    <CustomText>Prochainement..</CustomText>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

};

export default HomePageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingVertical: 50,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 30,
        textAlign: 'center'
    },
    workoutButton: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 140,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 10,
        marginRight: 30
    },
    containerTitle: {
        fontSize: 20,
        marginBottom: 20
    },
    workoutsContainer: {
        marginTop: 50
    }
})