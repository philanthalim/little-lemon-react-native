import {View, Text, StyleSheet, TextInput, Pressable, Image} from 'react-native';

export default function SplashScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.centerText}>Little Lemon</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 40,
        fontFamily: 'serif',
        lineHeight: 40,
    },
})
