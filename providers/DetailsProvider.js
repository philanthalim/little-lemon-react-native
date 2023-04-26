import React, { useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsContext = React.createContext();

const defaultDetails = {
    imageUri: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
};

async function getDetails(details, setDetails) {
    try {
        const values = await AsyncStorage.multiGet(Object.keys(details));
        const initialState = values.reduce((acc,curr) => {
            if (curr[1] == "false" || curr[1] == "true" || curr[1] == "null") {
                acc[curr[0]] = JSON.parse(curr[1]);
            } else {
                acc[curr[0]] = curr[1];
            }
            return acc;
        },{})
        
    setDetails(initialState);
    
    // setIsLoading(false);
    } catch (err) {
        Alert.alert(err.message);
    }
};



export default function DetailsProvider ({children}) {
    const [isOnboardingCompleted, setIsOnboardingCompleted] = React.useState(false);
    const [details, setDetails] = React.useState(defaultDetails);
    // const [isLoading, setIsLoading] = React.useState(true);

    const getVariable = async() => {
        try {
          const prevValue = await AsyncStorage.getItem('isOnboardingCompleted');
          setIsOnboardingCompleted(prevValue!=null ? JSON.parse(prevValue) : false);
        } catch (err) {
          console.error(err);
        }
    }

    useEffect(()=>{getVariable();},[])

    useEffect(() => {getDetails(details,setDetails);},[])

    return(
        <DetailsContext.Provider value = {{details, setDetails, isOnboardingCompleted, setIsOnboardingCompleted, defaultDetails}}>
            {children}
        </DetailsContext.Provider>
    )
}

export const useDetailsContext = () => {return React.useContext(DetailsContext)}