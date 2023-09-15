import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextStyle, View } from 'react-native';
import CustomText from '../../components/global/CustomText';
import Swiper from 'react-native-swiper';
import { Cell } from 'react-native-table-component';
import NavigationBack from "../../components/global/BackNavigation"

const WorkoutView = ({ route, navigation }: any) => {
    const workoutDetails = route.params?.workoutDetails;
    const exercisesArray = Object.values(workoutDetails).filter(item =>
        item !== null && typeof item === 'object' && 'name' in item && 'series' in item
    );

    const [viewWidth, setViewWidth] = useState<number>(0);

    const tableHead = ['Série', 'Reps', 'Ressenti', "Note"];
    const percentages = [0.5, 0.13, 0.13, 0.14];  // 40%, 10%, 50%
    const widthArr = viewWidth ? percentages.map(percentage => viewWidth * percentage) : [];
    const fieldsConfig = [
        { key: "reps", type: "number" },
        { key: "feeling", type: "text" },
        { key: "note", type: "text" }
    ];

    if (!exercisesArray) {
        return (
            <SafeAreaView style={styles.container}>
                <CustomText style={styles.errorText}>Aucune information sur la séance disponible.</CustomText>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Swiper>

                {exercisesArray && exercisesArray.map((exo: any, i: any) => (
                    <>
                        <View key={i} style={styles.swipeView}>
                            <CustomText style={styles.title}>{exo.name}</CustomText>
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
                            {exo.series && exo.series.map((exo: any, i: any) => (
                                <View key={i} style={styles.row}>
                                    <Cell width={widthArr[i]} data={
                                        <CustomText style={{ textAlign: "left" }}>{i + 1}</CustomText>
                                    } />
                                    <Cell width={widthArr[i]} data={
                                        <CustomText style={{ textAlign: "center" }}>{exo.reps}</CustomText>
                                    } />
                                    <Cell width={widthArr[i]} data={
                                        <CustomText style={{ textAlign: "center" }}>{exo.feeling}</CustomText>
                                    } />
                                    <Cell width={widthArr[i]} data={
                                        <CustomText style={{ textAlign: "center" }}>{exo.note}</CustomText>
                                    } />
                                </View>
                            ))}
                        </View>
                    </>
                ))}
            </Swiper>
            <NavigationBack navigation={navigation} />
        </SafeAreaView>
    )
};

export default WorkoutView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#1E1E1E',
        paddingTop: 100,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    swipeView: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 50,
    },
    exerciseContainer: {
        marginBottom: 20,
    },
    exerciseTitle: {
        fontSize: 24,
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 10,
    },
    rest: {
        fontSize: 16,
        marginBottom: 10,
    },
    seriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 20,
        color: 'red',
        textAlign: 'center',
    },
    tableText: {
        color: "white",
    },
    row: {
        padding: 10,
        flexDirection: "row"
    },
});
