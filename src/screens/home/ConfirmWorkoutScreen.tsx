import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import CustomText from '../../components/global/CustomText';
import GradientButton from '../../components/global/GradientButton';
import { Table, Row, Rows, Cell, TableWrapper, Col } from 'react-native-table-component';
import { Dimensions } from 'react-native';
import BackNavigation from '../../components/global/BackNavigation';
import i18n from '../../utils/i18';
const screenWidth = Dimensions.get('window').width;

const ConfirmWorkoutScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const [viewWidth, setViewWidth] = useState<number>(0);

  // Récupérer les détails de la séance passés en paramètres
  const { session } = route.params;

  function exercisesToTable(input: any) {
    // Création d'un tableau vide pour stocker les résultats
    let result = [];

    // Boucle à travers chaque objet d'exercice dans l'input
    for (let exercise of input) {
      // Extraire uniquement les propriétés d'intérêt en suivant l'ordre souhaité
      let row = [
        exercise.name,
        exercise.seriesCount,
        exercise.repetitionRange,
        exercise.restTime,
      ];
      result.push(row);
    }

    return result;
  }

  const percentages = [0.5, 0.13, 0.13, 0.14];  // 40%, 10%, 50%
  const widthArr = viewWidth ? percentages.map(percentage => viewWidth * percentage) : [];
  const tableHead = [i18n.t('confirm.exercise'), i18n.t('confirm.sets'), i18n.t('confirm.reps'), i18n.t('confirm.rest')];
  const tableBody = exercisesToTable(session.exercises);

  return (
    <View style={styles.container} onLayout={(event) => {
      const width = event.nativeEvent.layout.width;
      setViewWidth(width)
    }}
    >
      <View>
        <CustomText style={styles.title}>{session.name}</CustomText>
        <CustomText style={styles.description}>{session.description}</CustomText>

        <View>
          <CustomText style={{marginBottom: 20}}>{i18n.t('confirm.workoutContent')} :</CustomText>
          <Table>
            <View style={styles.row}>
              {tableHead.map((headerItem, index) => (
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

            <TableWrapper>
              {tableBody.map((rowData, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={cellData}
                      width={widthArr[cellIndex]}
                      textStyle={[
                        styles.tableText,
                        cellIndex === 0 ? { textAlign: 'left' } : { textAlign: 'center' }
                      ]}
                    />
                  ))}
                </View>
              ))}
            </TableWrapper>
          </Table>
        </View>
      </View >
      <GradientButton style={styles.button} onPress={() => navigation.replace('WorkoutInProgress', { session })} colors={['#E235DC', '#a6e',]}>
        <CustomText style={styles.buttonText}>{i18n.t('confirm.start')}</CustomText>
      </GradientButton>
      <BackNavigation navigation={navigation} />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 100,
    paddingBottom: 30,
    paddingHorizontal: 20,
    justifyContent: "space-between"
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: "italic",
    opacity: 0.8
  },
  button: {
    borderRadius: 10,
  },
  buttonText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 20
  },
  tableText: {
    color: "white",
  },
  row: {
    padding: 10,
    flexDirection: "row"
  }
});

export default ConfirmWorkoutScreen;
