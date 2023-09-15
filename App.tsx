import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoadingScreen from './src/screens/global/LoadingScreen'

import LoginScreen from './src/screens/auth/LoginScreen';
import LandingScreen from './src/screens/auth/LandingScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import AddWorkoutScreen from './src/screens/workouts/AddWorkoutScreen';
import HomePageScreen from './src/screens/HomePageScreen';
import TimerScreen from './src/screens/TimerScreen';
import WorkoutViewScreen from './src/screens/workouts/WorkoutView';
import ConfirmWorkoutScreen from './src/screens/home/ConfirmWorkoutScreen';
import WorkoutInProgress from './src/screens/home/WorkoutInProgress';
import { auth } from './src/firebase/firebaseconfig';

const AuthStack = createNativeStackNavigator();
const AppTab = createBottomTabNavigator();
const WorkoutsStack = createNativeStackNavigator();
const HomeScreenStack = createNativeStackNavigator();

function WorkoutsStackNavigator() {
  return (
    <WorkoutsStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkoutsStack.Screen name="WorkoutsMain" component={WorkoutsScreen} />
      <WorkoutsStack.Screen name="AddWorkout" component={AddWorkoutScreen} />
    </WorkoutsStack.Navigator>
  );
}
function HomeScreenStackNavigator() {
  return (
    <HomeScreenStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeScreenStack.Screen name="HomePage" component={HomePageScreen} />
      <HomeScreenStack.Screen name="ConfirmWorkout" component={ConfirmWorkoutScreen} />
      <HomeScreenStack.Screen name="WorkoutInProgress" component={WorkoutInProgress} />
    </HomeScreenStack.Navigator>
  );
}

function HistoryStackNavigator() {
  return (
    <HomeScreenStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeScreenStack.Screen name="HistoryMain" component={HistoryScreen} />
      <HomeScreenStack.Screen name="WorkoutView" component={WorkoutViewScreen} />
    </HomeScreenStack.Navigator>
  );
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();  // Se désinscrire de l'écouteur d'authentification à l'arrêt du composant
  }, []);

  if (isAuthenticated === null) {
    return <LoadingScreen />;  // Afficher un écran de chargement tant que l'authentification n'est pas déterminée
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppTab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: { backgroundColor: '#171717', height: 80 },
            tabBarIconStyle: { backgroundColor: '#a6e' },
            tabBarOptions: {
              showLabel: false
            },
            tabBarActiveTintColor: '#a6e',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Workouts') {
                iconName = focused ? 'barbell' : 'barbell-outline';
              } else if (route.name === 'Timer') {
                iconName = focused ? 'timer' : 'timer-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'document-text' : 'document-text-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
          })}

        >
          <AppTab.Screen name="Home" component={HomeScreenStackNavigator} />
          <AppTab.Screen name="Workouts" component={WorkoutsStackNavigator} />
          <AppTab.Screen name="Timer" component={TimerScreen} />
          <AppTab.Screen name="History" component={HistoryStackNavigator} />
        </AppTab.Navigator>

      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false
          }}
          initialRouteName='Landing'
        >
          <AuthStack.Screen name="Landing" component={LandingScreen} />
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;