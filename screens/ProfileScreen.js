import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDetailsContext } from '../providers/DetailsProvider';
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

export default function ProfileScreen({ navigation }) {
    const { details, setDetails, isOnboardingCompleted, setIsOnboardingCompleted, defaultDetails } = useDetailsContext();
    const [imageUri, setImageUri] = useState(details.imageUri);
    const [firstName, setFirstName] = useState(details.firstName);
    const [lastName, setLastName] = useState(details.lastName);
    const [email, setEmail] = useState(details.email);
    const [phoneNumber, setPhoneNumber] = useState(details.phoneNumber);
    const [orderStatuses, setOrderStatuses] = useState(details.orderStatuses);
    const [passwordChanges, setPasswordChanges] = useState(details.passwordChanges);    
    const [specialOffers, setSpecialOffers] = useState(details.specialOffers);
    const [newsletter, setNewsletter] = useState(details.newsletter);
    
    function updateDetailsOnMemory() {
        setImageUri(details.imageUri);
        setFirstName(details.firstName);
        setLastName(details.lastName);
        setEmail(details.email);
        setPhoneNumber(details.phoneNumber);
        setOrderStatuses(details.orderStatuses);
        setPasswordChanges(details.passwordChanges);
        setSpecialOffers(details.specialOffers);
        setNewsletter(details.newsletter);
    };

    function clearDetailsOnMemory() {
        setImageUri('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setOrderStatuses(false);
        setPasswordChanges(false);
        setSpecialOffers(false);
        setNewsletter(false);
        setDetails(defaultDetails);
        
    };

    const initialMount = useRef(0);
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (initialMount.current<2) {
            initialMount.current += 1;
            setTimeout(() => {
                updateDetailsOnMemory();
                setCount((count) => count + 1);
            }, 100);
        }
    },[details]);
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log(result,'res')
    
        if (!result.canceled) {
        //   setImageUri(result.assets[0].uri);
          setImageUri(result.uri);
        }
      };

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

      console.log(imageUri)

    return(
        <SafeAreaView style={styles.container}>
        { (!fontsLoaded && count<1) ? ( <ActivityIndicator/> ) : (
        <ScrollView style={styles.container}>
            <Text style={styles.headerText}>Personal information</Text>
            <Text style={styles.descriptionText}>Avatar</Text>
            <View style={styles.imageBox}>
                {imageUri? <Image source={{ uri: imageUri }} style={styles.avatarImage} /> :
                 <View style={styles.avatarEmpty}>
                 <Text style={styles.avatarEmptyText}>
                   {firstName && Array.from(firstName)[0]}
                   {lastName && Array.from(lastName)[0]}
                 </Text>
               </View> }
                <Pressable
                    onPress={pickImage}
                    style={styles.buttonGreen}>
                    <Text style={styles.buttonGreenText}>Change</Text>
                </Pressable>
                <Pressable
                    onPress={() => {setImageUri('');}}
                    style={styles.buttonWhite}>
                    <Text style={styles.buttonWhiteText}>Remove</Text>
                </Pressable>
            </View>
            <Text style={styles.descriptionText}>First name</Text>
            <TextInput
                style={styles.inputBox}
                value={firstName}
                onChangeText={setFirstName}/>
            <Text style={styles.descriptionText}>Last name</Text>
            <TextInput
                style={styles.inputBox}
                value={lastName}
                onChangeText={setLastName}/>
            <Text style={styles.descriptionText}>Email</Text>
            <TextInput
                keyboardType={'email-address'}
                style={styles.inputBox}
                value={email}
                onChangeText={setEmail}/>
            <Text style={styles.descriptionText}>Phone Number</Text>
            <TextInput
                keyboardType={'number-pad'}
                style={styles.inputBox}
                value={phoneNumber}
                onChangeText={setPhoneNumber}/>
            {/* <MaskedTextInput
                keyboardType={'number-pad'}
                mask="(999) 999-9999"
                style={styles.inputBox}
                value={phoneNumber}
                onChangeText={(text, rawText) => {
                    setPhoneNumber(rawText);
                }}/> */}
            

            <Text style={styles.headerText}>Email notifications</Text>
            <View style={styles.boxSection}>
                <Checkbox
                    style={styles.checkbox}
                    value={orderStatuses}
                    onValueChange={setOrderStatuses}
                    color={orderStatuses ? '#495E57' : undefined}/>
                <Text style={styles.descriptionText}>Order statuses</Text>
            </View>
            <View style={styles.boxSection}>
                <Checkbox
                    style={styles.checkbox}
                    value={passwordChanges}
                    onValueChange={setPasswordChanges}
                    color={passwordChanges ? '#495E57' : undefined}/>
                <Text style={styles.descriptionText}>Password changes</Text>
            </View>
            <View style={styles.boxSection}>
                <Checkbox
                    style={styles.checkbox}
                    value={specialOffers}
                    onValueChange={setSpecialOffers}
                    color={specialOffers ? '#495E57' : undefined}/>
                <Text style={styles.descriptionText}>Special offers</Text>
            </View>
            <View style={styles.boxSection}>
                <Checkbox
                    style={styles.checkbox}
                    value={newsletter}
                    onValueChange={setNewsletter}
                    color={newsletter ? '#495E57' : undefined}/>
                <Text style={styles.descriptionText}>Newsletter</Text>
            </View>
            <Pressable
                onPress={() => {
                    const clearDetails = async() => {
                        try{
                            await AsyncStorage.clear()
                        } catch (err) {
                            console.log(err.message);
                        }
                    };
                    clearDetails();
                    clearDetailsOnMemory();
                    setIsOnboardingCompleted(false);
                    navigation.navigate('Onboarding');
                }}
                style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log out</Text>
            </Pressable>
            <View style={styles.buttonSection}>
                <Pressable 
                    onPress={() => {
                        updateDetailsOnMemory();
                        navigation.navigate('Home');
                    }}
                    style={styles.buttonWhite}>
                        <Text style={styles.buttonWhiteText}>Discard changes</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        const newDetails = {
                            imageUri: imageUri,
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            phoneNumber: phoneNumber,
                            orderStatuses: orderStatuses,
                            passwordChanges: passwordChanges,
                            specialOffers: specialOffers,
                            newsletter: newsletter,
                        };
                        setDetails(newDetails);
                        const updateDetails = async(details) => {
                            const keyValues = Object.entries(details).map((entry) => {
                                return [entry[0], String(entry[1])];
                            });
                            try{
                                await AsyncStorage.multiSet(keyValues);
                            } catch (err) {
                                console.log(err);
                            }
                        };
                        updateDetails(newDetails);
                        navigation.navigate('Home');
                    }}
                    style={styles.buttonGreen}>
                        <Text style={styles.buttonGreenText}>Save changes</Text>
                </Pressable>
            </View>
        </ScrollView>
        )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // borderRadius: "1px solid #495E57",
        // padding: "10px"
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
      },
    headerText: {
        fontSize: 25,
        fontFamily: 'Karla_700Bold',
        lineHeight: 40,
        paddingLeft: 10,
        paddingTop: 10,
    },
    imageBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonGreen: {
        backgroundColor: '#495E57',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginLeft: 20,
        marginBottom: 25,
    },
    buttonGreenText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Karla_700Bold',
    },
    buttonWhite: {
        backgroundColor: '#EDEFEE',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginLeft: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#495E57'
    },
    buttonWhiteText: {
        fontSize: 16,
        fontFamily: 'Karla_700Bold',
        color: '#666'
    },
    descriptionText: {
        fontSize: 18,
        fontFamily: 'Karla_500Medium',
        paddingLeft: 15,
        paddingTop: 17,
        paddingBottom: 3,
        color: '#666'
    },
    inputBox: {
        backgroundColor: 'white',
        height: 40,
        width: 300,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        marginLeft: 20,
    },
    boxSection: {
        flexDirection: 'row',
    },
    buttonSection: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    checkbox: {
        backgroundColor: '#EDEFEE',
        marginTop: 20,
        marginLeft: 20,
    },
    logoutButton: {
        backgroundColor: '#F4CE14',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginHorizontal: 10,
        marginVertical: 20,
        borderColor: '#EE9972',
        borderWidth: 1,
    },
    logoutButtonText: {
        fontFamily: 'Karla_700Bold',
        fontSize: 20,
        color: 'black',
    },
    avatarEmpty: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#0b9a6a",
        alignItems: "center",
        justifyContent: "center",
      },
      avatarEmptyText: {
        fontSize: 32,
        color: "#FFFFFF",
        fontWeight: "bold",
      },
})
