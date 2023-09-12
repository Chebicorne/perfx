import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebase/firebaseconfig';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import CustomText from '../../components/global/CustomText';
import Label from '../../components/workouts/Label';
import GradientButton from '../../components/global/GradientButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import NavigationBack from "../../components/global/BackNavigation"

const AddWorkoutScreen: React.FC = ({ route, navigation }: any) => {
    const workoutData = route.params?.workoutData;

    const [sessionName, setSessionName] = useState(workoutData ? workoutData.name : '');
    const [description, setDescription] = useState(workoutData ? workoutData.description : '');
    const [exercises, setExercises] = useState<any[]>(workoutData ? workoutData.exercises : []);

    const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
    const [showExerciseForm, setShowExerciseForm] = useState(false);

    const handleEditExercise = (index: number) => {
        setCurrentExercise(exercises[index]);
        setEditingExerciseIndex(index);
        setShowExerciseForm(true);
    };


    const handleDeleteExercise = (index: number) => {
        const updatedExercises = [...exercises];
        updatedExercises.splice(index, 1);
        setExercises(updatedExercises);
    };

    const handleSaveSession = async () => {
        // Vérifiez si l'utilisateur est connecté
        if (!auth.currentUser) {
            alert('Veuillez vous connecter pour enregistrer la séance.');
            return;
        }

        // Construire l'objet séance
        const sessionData = {
            userId: auth.currentUser.uid,
            name: sessionName,
            description: description,
            exercises: exercises.map(exercise => ({
                name: exercise.name,
                placement: exercise.placement,
                repetitionRange: exercise.repetitionRange,
                restTime: exercise.restTime,
                seriesCount: exercise.seriesCount,
                // ... tout autre détail de l'exercice ...
            })),
        };

        const workoutsSchemasRef = collection(db, 'workoutsSchemas');

        try {

            // Ajouter la séance à la collection
            console.log(sessionData);

            if (workoutData) {
                const workoutRef = doc(workoutsSchemasRef, workoutData.id);
                await updateDoc(workoutRef, sessionData);
            } else {
                // Sinon, ajoutez une nouvelle séance
                await addDoc(workoutsSchemasRef, sessionData);
            }
            setSessionName('');
            setDescription('');
            setExercises([]);

        } catch (error) {
            console.log(error);
            alert('Erreur lors de l\'enregistrement de la séance: ' + error);
        }
    };

    const initialExerciseState = {
        name: '',
        placement: '',
        repetitionRange: '',
        restTime: '',
        seriesCount: ''
    };
    const [currentExercise, setCurrentExercise] = useState(initialExerciseState);

    const handleCancelExercise = () => {
        setCurrentExercise(initialExerciseState);
        setShowExerciseForm(false);
        setEditingExerciseIndex(null);
    };


    const addOrUpdateExerciseToList = () => {
        if (editingExerciseIndex !== null) {
            const updatedExercises = [...exercises];
            updatedExercises[editingExerciseIndex] = currentExercise;
            setExercises(updatedExercises);
        } else {
            setExercises([...exercises, currentExercise]);
        }

        setCurrentExercise(initialExerciseState);
        setShowExerciseForm(false);
        setEditingExerciseIndex(null);
    };
    const handleAddExercice = () => {
        setShowExerciseForm(true);
        setEditingExerciseIndex(null);
    }

    return (
        <View style={styles.container}>
            <CustomText style={styles.title}>{workoutData ? "Modifier une séance" : "Ajouter une séance"}</CustomText>
            <ScrollView style={styles.viewContainer}>
                <Label>Nom de la séance</Label>
                <TextInput
                    placeholderTextColor={"white"}
                    style={styles.input}
                    placeholder="ex : Push"
                    value={sessionName}
                    onChangeText={setSessionName}
                />
                <Label>Description</Label>
                <TextInput
                    placeholderTextColor={"white"}
                    style={styles.input}
                    placeholder="ex : Pour des pecs aussi gros que des tétés"
                    value={description}
                    onChangeText={setDescription}
                />

                {!showExerciseForm && exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                        <CustomText>{exercise.name}</CustomText>
                        {!showExerciseForm &&
                            <View style={styles.editButtonsContainer}>
                                <TouchableOpacity style={styles.editButtons} onPress={() => handleEditExercise(index)}>
                                    <Ionicons name="create-outline" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.editButtons} onPress={() => handleDeleteExercise(index)} >
                                    <Ionicons name="trash-outline" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                ))}

                {showExerciseForm && (
                    <View style={styles.exerciseForm}>
                        <Label>Exercice</Label>
                        <TextInput
                            placeholderTextColor={"white"}
                            style={styles.input}
                            placeholder="ex : Développé couché"
                            value={currentExercise.name}
                            onChangeText={(text) => setCurrentExercise({ ...currentExercise, name: text })}
                        />
                        <Label>Placement</Label>
                        <TextInput
                            placeholderTextColor={"white"}
                            style={styles.input}
                            placeholder="ex : Cran 8 sur la poulie"
                            value={currentExercise.placement}
                            onChangeText={(text) => setCurrentExercise({ ...currentExercise, placement: text })}
                        />
                        <Label>Fourchette de reps</Label>
                        <TextInput
                            placeholderTextColor={"white"}
                            style={styles.input}
                            placeholder="ex : 8-12"
                            value={currentExercise.repetitionRange}
                            onChangeText={(text) => setCurrentExercise({ ...currentExercise, repetitionRange: text })}
                        />
                        <Label>Nombre de séries</Label>
                        <TextInput
                            placeholderTextColor={"white"}
                            style={styles.input}
                            placeholder="ex : 2"
                            inputMode='numeric'
                            value={currentExercise.seriesCount}
                            onChangeText={(text) => setCurrentExercise({ ...currentExercise, seriesCount: text })}
                        />
                        <Label>Repos (en s)</Label>
                        <TextInput
                            placeholderTextColor={"white"}
                            style={styles.input}
                            placeholder="120 (2min)"
                            inputMode='numeric'
                            value={currentExercise.restTime}
                            onChangeText={(text) => setCurrentExercise({ ...currentExercise, restTime: text })}
                        />
                        <View style={styles.exitButtonContainer}>
                            <TouchableOpacity style={[styles.exitButtons]} onPress={handleCancelExercise} >
                                <Ionicons name="arrow-undo-outline" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.exitButtons, { backgroundColor: 'green' }]} onPress={addOrUpdateExerciseToList} >
                                <Ionicons name="save-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {!showExerciseForm &&
                    <TouchableOpacity style={styles.addExerciceButton} onPress={handleAddExercice}>
                        <CustomText style={styles.addExerciceButtonText}>
                            Ajouter exercice
                        </CustomText>
                    </TouchableOpacity>
                }

                <View style={{ height: 40 }}></View>
            </ScrollView>
            {!showExerciseForm &&
                <GradientButton style={[styles.button]} colors={['#E235DC', '#a6e']} onPress={handleSaveSession}>
                    <CustomText style={styles.buttonText}>
                        {workoutData ? "Sauvegarder" : "Ajouter une séance"}
                    </CustomText>
                </GradientButton>
            }

            <NavigationBack navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#1E1E1E',
        paddingTop: 100,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    viewContainer: {
        paddingTop: 20,
        marginBottom: 20,
        backgroundColor: '#1E1E1E',
    },
    input: {
        height: 50,
        color: 'white',
        fontStyle: "italic",
        borderBottomColor: "white",
        borderBottomWidth: 0.3,
        marginBottom: 10,
    },
    exerciseForm: {
        marginTop: 20,
        marginBottom: 20
    },
    exerciseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    button: {
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
        marginBottom: 50,
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
    saveButton: {
        width: "100%"
    },
    addExerciceButton: {
        backgroundColor: "white",
        borderRadius: 10
    },
    addExerciceButtonText: {
        padding: 10,
        color: "#000",
        textAlign: "center"
    },
    exitButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: "100%"
    },
    exitButtons: {
        padding: 5,
        backgroundColor: "white",
        width: "45%",
        borderRadius: 5,
        alignItems: 'center'
    }
});

export default AddWorkoutScreen;
