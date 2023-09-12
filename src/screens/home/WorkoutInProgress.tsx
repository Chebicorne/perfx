import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CustomText from '../../components/global/CustomText'
import Swiper from 'react-native-swiper'
import { useEffect, useState } from "react";
import { Cell, TableWrapper } from "react-native-table-component";

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
    const [tableBody, setTableBody] = useState<any[]>([]); // Contiendra les données du tableau
    const [viewWidth, setViewWidth] = useState<number>(0);

    const percentages = [0.5, 0.13, 0.13, 0.14];  // 40%, 10%, 50%
    const widthArr = viewWidth ? percentages.map(percentage => viewWidth * percentage) : [];
    const tableHead = ['Série', 'Reps', 'Ressenti', "Note"];

    useEffect(() => {
        if (session && session.exercises) {
            setExercises(session.exercises);
            console.log(session.exercises);

        }
    }, [session]);

    const secondsToMinutes = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;

        return `${min} minutes ${sec} secondes`;
    };

    return (
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
                                {["Reps", "Ressenti", "Note"].map((inputLabel, inputIndex) => (
                                    <Cell
                                        key={inputLabel}
                                        data={
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor={"white"}
                                            ></TextInput>
                                        }
                                        width={widthArr[inputIndex + 1]}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                ))}

            </Swiper>
        </SafeAreaView>
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
    }
})