import {View, Text, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import { useState, useEffect } from 'react';
import {validateEmail, isAlphabetic} from '../utils/index';
import { useDetailsContext } from '../providers/DetailsProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements'
import {
    useFonts,
    MarkaziText_400Regular,
    MarkaziText_500Medium,
    MarkaziText_600SemiBold,
    MarkaziText_700Bold,
  } from '@expo-google-fonts/markazi-text';
import {
    Karla_200ExtraLight,
    Karla_300Light,
    Karla_400Regular,
    Karla_500Medium,
    Karla_600SemiBold,
    Karla_700Bold,
    Karla_800ExtraBold,
    Karla_200ExtraLight_Italic,
    Karla_300Light_Italic,
    Karla_400Regular_Italic,
    Karla_500Medium_Italic,
    Karla_600SemiBold_Italic,
    Karla_700Bold_Italic,
    Karla_800ExtraBold_Italic,
  } from '@expo-google-fonts/karla';
// import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen({ navigation }) {
    const { details, setDetails, isOnboardingCompleted, setIsOnboardingCompleted } = useDetailsContext();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(()=>{setIsDisabled(!(validateEmail(email) && isAlphabetic(userName)));},
        [userName, email]);

        let [fontsLoaded] = useFonts({
            MarkaziText_400Regular,
            MarkaziText_500Medium,
            MarkaziText_600SemiBold,
            MarkaziText_700Bold,
            Karla_200ExtraLight,
            Karla_300Light,
            Karla_400Regular,
            Karla_500Medium,
            Karla_600SemiBold,
            Karla_700Bold,
            Karla_800ExtraBold,
            Karla_200ExtraLight_Italic,
            Karla_300Light_Italic,
            Karla_400Regular_Italic,
            Karla_500Medium_Italic,
            Karla_600SemiBold_Italic,
            Karla_700Bold_Italic,
            Karla_800ExtraBold_Italic,
          });
    
    const height = useHeaderHeight()

    return(
        <SafeAreaView style={styles.container}>
        {!fontsLoaded ? (
            <ActivityIndicator/>
        ) : (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS==='ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={height+30}>
        <ScrollView keyboardDismissMode="on-drag">
            <View style={styles.heroContainer}>
                <Text style={styles.titleText}>Little Lemon</Text>
                <Text style={styles.subTitleText}>Chicago</Text>
                <View style={styles.heroSubContainer}>
                    <Text style={styles.descriptionText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    <Image
                        source={require('../images/HeroImage.png')}
                        style={styles.heroImage}/>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.contentText}>Name *</Text>
                <TextInput
                    style={styles.textInput}
                    value={userName}
                    onChangeText={setUserName}/>
                <Text style={styles.contentText}>Email *</Text>
                <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType={"email-address"}/>
            </View>
            <View style={styles.bottom}>
                <Pressable 
                    style={({ pressed, disabled }) => [
                        styles.button,
                        !isDisabled && { backgroundColor: '#F4CE14' },
                        isDisabled && { backgroundColor: '#495E57' },
                      ]}
                    disabled={isDisabled}
                    onPress={()=>{
                        setDetails((prevState) => ({
                            ...prevState,
                            firstName: userName,
                            email: email,
                        }));
                        setIsOnboardingCompleted(true);
                        const updateDetailsAndVariable = async(details, boolean) => {
                            const keyValues = Object.entries(details).map((entry) => {
                                return [entry[0], String(entry[1])];
                            });
                            try{
                                await AsyncStorage.multiSet(keyValues);
                                await AsyncStorage.setItem('isOnboardingCompleted',JSON.stringify(boolean))
                            } catch (err) {
                                console.log(err);
                            }
                        };
                        const newDetails = {
                            ...details,
                            firstName: userName,
                            email: email,
                        }
                        updateDetailsAndVariable(newDetails, true);
                        navigation.navigate('Home');
                    }}>
                    <Text style={styles.buttonText}>Next</Text>
                </Pressable>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
        )}
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#495E57',
    },
    heroContainer: {
        // flex: 1,
        backgroundColor: '#495E57',
    },
      heroSubContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    heroImage: {
        height: 150,
        width: 150,
        resizeMode: 'cover',
        borderRadius: 16,
    },
    titleText: {
        fontFamily: 'MarkaziText_500Medium',
        fontSize: 64,
        color: '#F4CE14',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    subTitleText: {
        fontFamily: 'MarkaziText_400Regular',
        fontSize: 40,
        color: '#EDEFEE',
        paddingHorizontal: 10,
    },
    descriptionText: {
        fontFamily: 'Karla_500Medium',
        fontSize: 17,
        paddingVertical: 20,
        paddingLeft: 10,
        color: '#EDEFEE',
        width: 200,
    },
    header: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        flexDirection: 'row',
    },
    content: {
        alignItems: 'center',
        backgroundColor: '#EDEFEE',
    },
    bottom: {
        alignItems: 'flex-end',
        backgroundColor: '#EDEFEE',
    },
    button: {
        backgroundColor: '#495E57',
        borderRadius: 10,
        paddingHorizontal: 30,
        paddingVertical: 3,
        marginHorizontal: 10,
        marginVertical: 20,
        fontSize: 10
    },
    headerText: {
        fontSize: 35,
        fontFamily: 'serif',
        lineHeight: 40,
    },
    contentText: {
        fontFamily: 'Karla_500Medium',
        fontSize: 15,
        fontSize: 25,
        marginTop: 20,
        marginBottom: 10,
        flex:1,
    },
    subHeaderText: {
        fontFamily: 'Karla_500Medium',
        fontSize: 20,
        fontSize: 25,
        marginTop: 15,
    },
    buttonText: {
        fontSize: 30,
        color: 'black',
    },
    textInput: {
        backgroundColor: '#EDEFEE',
        height: 40,
        width: 280,
        borderRadius: 8,
        padding: 10,
        borderWidth: 2,
    },
    logo: {
        height: 70,
        width: 70,
        resizeMode: 'cover',
        borderRadius: 20,
    }
})
