import { Alert, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CustomText from '../../components/global/CustomText'
import Swiper from 'react-native-swiper'
import { useEffect, useState } from "react";
import { Cell, TableWrapper } from "react-native-table-component";
import { auth, db } from '../../firebase/firebaseconfig';
import { collection, addDoc } from "firebase/firestore";
import { getData, storeData } from "../../utils/storageHelper";
import GradientButton from "../../components/global/GradientButton";
import LoadingScreen from "../global/LoadingScreen";
import i18n from "../../utils/i18";

type Exercise = {
    name: string;
    placement: string;
    repetitionRange: string;
    restTime: string;
    seriesCount: string;
};


const WorkoutInProgress = ({ route, navigation }: { route: any, navigation: any }) => {
    const { session } = route.params;
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [viewWidth, setViewWidth] = useState<number>(0);
    const [workoutData, setWorkoutData] = useState<any[]>(exercises.map(exo => ({ name: exo.name, series: Array.from({ length: Number(exo.seriesCount) }).map(() => ({ reps: 0, feeling: "", note: "" })) })));
    const [loading, setLoading] = useState<boolean>(false)
    const fieldsConfig = [
        { key: "reps", type: "number" },
        { key: "feeling", type: "text" },
        { key: "note", type: "text" }
    ];

    const percentages = [0.5, 0.13, 0.13, 0.14];  // 40%, 10%, 50%
    const widthArr = viewWidth ? percentages.map(percentage => viewWidth * percentage) : [];
    const tableHead = [i18n.t('confirm.exercise'), i18n.t('confirm.reps'), i18n.t('confirm.weight'), i18n.t('confirm.note')];
    const userId = auth.currentUser?.uid;
    const [isEditing, setIsEditing] = useState(false)
    useEffect(() => {
        if (session && session.exercises) {
            setExercises(session.exercises);
        }
    }, [session]);

    const secondsToMinutes = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;

        return `${min} minutes ${sec} secondes`;
    };

    const updateData = (exerciseIndex: number, seriesIndex: number, field: string, value: any) => {
        const updatedWorkoutData = [...workoutData];
        if (!updatedWorkoutData[exerciseIndex]) {
            updatedWorkoutData[exerciseIndex] = { name: exercises[exerciseIndex].name, series: [] };
        }
        if (!updatedWorkoutData[exerciseIndex].series[seriesIndex]) {
            updatedWorkoutData[exerciseIndex].series[seriesIndex] = { reps: 0, feeling: "", note: "" };
        }
        updatedWorkoutData[exerciseIndex].series[seriesIndex][field] = value;
        return updatedWorkoutData;
    };

    const saveCompletedWorkout = async (workoutData: any) => {
        try {
            setLoading(true)

            const sessionName = session.name; // Assurez-vous que 'name' est la clé correcte dans l'objet session
            const currentDate = new Date().toISOString()
            const docRef = await addDoc(collection(db, "doneWorkouts"), {
                ...workoutData,
                sessionName: sessionName, // Ajoutez le nom de la séance
                date: currentDate, // Ajoutez la date actuelle
                userId: userId
            });
            const storedWorkouts = await getData('completedWorkouts') || [];
            console.log(storedWorkouts);

            storedWorkouts.push(workoutData);
            storeData('completedWorkouts', storedWorkouts);
            const emptyData = exercises.map(exo => ({ name: exo.name, series: Array.from({ length: Number(exo.seriesCount) }).map(() => ({ reps: 0, feeling: "", note: "" })) }));
            setWorkoutData(emptyData);
            setLoading(false)
            navigation.replace("HomePage")
        } catch (error) {
            console.error("Error saving workout: ", error);
        }
    };

    const confirmEndWorkout = () => {
        Alert.alert(
            "Terminer la séance",
            "Vosu ne pourrez plus modifier ou changer le contenu de celle-ci",
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Annulé"),
                    style: "cancel"
                },
                { text: "Confirmer", onPress: () => saveCompletedWorkout(workoutData) }
            ],
            { cancelable: false }
        );
    };

    return (
        <>
            {!loading ?
                <SafeAreaView style={styles.container}>
                    <Swiper>
                        {exercises && exercises.map((exo, i) => (
                            <View style={styles.swipeView} key={i}>
                                <CustomText style={styles.title}>{exo.name}</CustomText>
                                <CustomText style={styles.description}>{exo.placement}</CustomText>
                                <CustomText style={styles.rest}>{secondsToMinutes(Number(exo.restTime))}</CustomText>
                                <View style={styles.row}>
                                    {tableHead.map((headerItem: any, index: any) => (
                                        <Cell
                                            key={index}
                                            data={headerItem}
                                            width={widthArr[index]}
                                            textStyle={[
                                                styles.tableText,
                                                index === 0 ? { textAlign: 'left' } : { textAlign: 'center' }
                                            ]}
                                        />
                                    ))}
                                </View>
                                {exo.seriesCount && Array.from({ length: Number(exo.seriesCount) }).map((_, serieIndex) => (
                                    <View key={serieIndex} style={styles.row}>
                                        <Cell
                                            data={`Série ${serieIndex + 1}`}
                                            width={widthArr[0]}
                                            textStyle={[
                                                styles.tableText,
                                                { textAlign: 'left' }
                                            ]}
                                        />
                                        {fieldsConfig.map((fieldConfig, inputIndex) => (
                                            <Cell
                                                key={fieldConfig.key}
                                                data={
                                                    <TextInput
                                                        onFocus={() => setIsEditing(true)}
                                                        onBlur={() => setIsEditing(false)}
                                                        style={styles.input}
                                                        placeholderTextColor={"white"}
                                                        keyboardType={fieldConfig.type === "number" ? "numeric" : "default"}
                                                        onChangeText={(text) => {
                                                            const newData = updateData(i, serieIndex, fieldConfig.key, text);
                                                            setWorkoutData(newData);
                                                        }}
                                                    />
                                                }
                                                width={widthArr[inputIndex + 1]}
                                            />
                                        ))}
                                    </View>
                                ))}
                            </View>
                        ))}

                    </Swiper>
                    {!isEditing && (
                        <GradientButton style={styles.button} onPress={confirmEndWorkout} colors={['#E235DC', '#a6e',]}>
                            <CustomText style={styles.buttonText}>{i18n.t('inprogress.end')}</CustomText>
                        </GradientButton >
                    )}
                </SafeAreaView >
                :
                <LoadingScreen />
            }
        </>
    )
}

export default WorkoutInProgress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingVertical: 50,
        paddingHorizontal: 20,
        justifyContent: "space-between"
    },
    buttonContainer: {
        flexDirection: "row"
    },
    swipeView: {
        alignItems: 'center'
    },
    table: {
        marginTop: 20,
        width: '100%'
    },
    input: {
        padding: 10,
        borderRadius: 5,
        borderBottomColor: "white",
        borderBottomWidth: 2,
        color: "white",
        textAlign: "center"
    },
    tableText: {
        color: "white",
    },
    row: {
        padding: 10,
        flexDirection: "row"
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        fontStyle: "italic",
        opacity: 0.8
    },
    rest: {
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        borderRadius: 10,
    },
    buttonText: {
        padding: 20,
        textAlign: 'center',
        fontSize: 20
    },
})