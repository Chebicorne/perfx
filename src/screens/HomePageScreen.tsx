import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import CustomText from "../components/global/CustomText";
import { auth, db } from '../firebase/firebaseconfig'; // Assurez-vous que le chemin est correct
import { collection, getDocs, query, where } from 'firebase/firestore';
import { storeData, getData } from '../utils/storageHelper'; // Assurez-vous que le chemin est correct
import { Ionicons } from '@expo/vector-icons';
import i18n from '../utils/i18';

const HomePageScreen = ({ navigation }: any) => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSessions = async () => {
        try {
            if (auth.currentUser) {
                const currentUserId = auth.currentUser.uid; // Récupérez l'ID de l'utilisateur connecté

                const sessionsRef = collection(db, 'workoutsSchemas'); // Assurez-vous que c'est la bonne collection

                // Créez une requête pour filtrer les workoutsSchemas en fonction de l'ID de l'utilisateur
                const filteredQuery = query(sessionsRef, where("userId", "==", currentUserId));

                const sessionsSnapshot = await getDocs(filteredQuery);

                const sessionsData = sessionsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setSessions(sessionsData);
                storeData('sessions', sessionsData);
            }
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
                <CustomText style={styles.title}>{i18n.t("homepage.welcome")}</CustomText>

                <View style={styles.workoutsContainer}>
                    <CustomText style={styles.containerTitle}>{i18n.t("homepage.todayWorkout")}</CustomText>

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
                    <CustomText style={styles.containerTitle}>{i18n.t("homepage.progress")}</CustomText>
                    <CustomText>{i18n.t("homepage.soon")}</CustomText>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => { navigation.navigate("Profile") }} style={styles.settingButton}>
                <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
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
    },
    settingButton: {
        padding: 10,
        position: 'absolute',
        top: 50,
        right: 20
    }
})