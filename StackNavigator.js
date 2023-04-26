
import { StyleSheet, Text, View, Image, Pressable, Button } from 'react-native';
import OnboardingScreen from './screens/OnboardingScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDetailsContext } from './providers/DetailsProvider';

const Stack = createNativeStackNavigator();

export default function StackNavigator({isOnboardingCompleted}) {

    return (
        <Stack.Navigator>
        {isOnboardingCompleted ? (
          <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={HomeScreen.navigationOptions}/>
          ) : (
          <Stack.Screen 
            name="Onboarding"
            component={OnboardingScreen}
            options={OnboardingScreen.navigationOptions}/>
          )}
          {isOnboardingCompleted && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={OnboardingScreen.navigationOptions}/>
          )}
          {!isOnboardingCompleted && (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={HomeScreen.navigationOptions}/>
          )}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={ProfileScreen.navigationOptions}/>
        </Stack.Navigator>
    );
}


console.log('');



HomeScreen.navigationOptions = ({ navigation }) => {
    const { details } = useDetailsContext();
    return {
        headerLeft: () => {
            return null;
        },
        headerTitle: () =>  (
            <Image
                source={require(`./images/logo.png`)}
                style={{ width: 185, height: 40, marginLeft: 60 }}
                resizeMode='contain'/>),
        headerTitleStyle: { flex: 1, textAlign: 'center' },
        headerRight: () =>  (
            <Pressable
                onPress={() => {
                    navigation.navigate('Profile');
                }}>
                    {details.imageUri? <Image
                    //   source={require('./images/Profile.png')}
                    source={{uri: details.imageUri}}
                      style={{ width: 45, height: 45 }}
                      resizeMode='contain'/> :
                 <View style={styles.avatarEmpty}>
                 <Text style={styles.avatarEmptyText}>
                   {details.firstName && Array.from(details.firstName)[0]}
                   {details.lastName && Array.from(details.lastName)[0]}
                 </Text>
               </View> }
                   
                    {/* <UserAvatar size={30} name={'fn'} src={require('./images/logo_1.png')} resizeMode='contain'/> */}
            </Pressable>),
          headerRightStyle: { textAlign: 'center' },
    };
  };

OnboardingScreen.navigationOptions = ({ navigation }) => {
    return {
        headerLeft: () => (null),
        headerTitle: () =>  (
          <Image
              source={require(`./images/logo.png`)}
              style={{ width: 185, height: 40, marginLeft: 60 }}
              resizeMode='contain'/>),
        headerTitleStyle: { flex: 1, textAlign: 'center' },
    }
};

ProfileScreen.navigationOptions = ({ navigation }) => {
  return {
      headerTitle: () =>  (
        <Image
            source={require(`./images/logo.png`)}
            style={{ width: 185, height: 40, marginLeft: 10 }}
            resizeMode='contain'/>),
      headerTitleStyle: { flex: 1, textAlign: 'center' },
  }
};

const styles = StyleSheet.create({
    avatarEmpty: {
        width: 45,
        height: 45,
        borderRadius: 40,
        backgroundColor: "#0b9a6a",
        alignItems: "center",
        justifyContent: "center",
      },
      avatarEmptyText: {
        fontSize: 26,
        color: "#FFFFFF",
        fontWeight: "bold",
      },
})

