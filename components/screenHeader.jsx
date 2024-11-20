import { View, Text, TouchableOpacity,StyleSheet,StatusBar,Platform } from 'react-native';
import React from 'react';
import { useRouter} from 'expo-router';


const ScreenHeader = ({ title, path}) => {
    
    const router = useRouter();

    const back = () => {
        router.push(path);
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={back} style={styles.button}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.name}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 30,
        backgroundColor: '#DAA621',
        height: 80,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    button: {
        backgroundColor: '#662483',
        width: 80,
        height: 47,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        paddingLeft: 10,
        paddingTop: 10,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        paddingLeft: 70,
        paddingTop: 8,
    },
})
export default ScreenHeader;
