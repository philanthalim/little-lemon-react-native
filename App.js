import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailsProvider from './providers/DetailsProvider';
import StackNavigator from './StackNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const getVariable = async() => {
    try {
      const prevValue = await AsyncStorage.getItem('isOnboardingCompleted');
      setIsOnboardingCompleted(prevValue!=null ? JSON.parse(prevValue) : false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(()=>{getVariable();},[])
  if (isLoading) {
    return <SplashScreen />;
  };
  
  return (
    <NavigationContainer>
    <DetailsProvider>
      <StackNavigator isOnboardingCompleted={isOnboardingCompleted}/>
    </DetailsProvider>
  </NavigationContainer>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    //alignItems: 'center',
    //justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 20
  },
});
