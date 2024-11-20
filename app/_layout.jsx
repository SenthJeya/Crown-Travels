import { SplashScreen, Stack } from 'expo-router';    
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { BackHandler } from 'react-native'; // Import BackHandler
import { StripeProvider } from '@stripe/stripe-react-native'; // Import StripeProvider

SplashScreen.preventAutoHideAsync();

const RooyLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) SplashScreen.hideAsync();

        // Disable back button action
        const backAction = () => {
            return true; // Disable the default back button behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(); // Clean up the event listener
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) return null;

    return (
        <StripeProvider publishableKey="pk_test_51PwQobP2nA8oNDSibF5Twf9UTdtwJIc9QDNpSbt8Ip8ry2JxkFjI5RpLlFFqEZoR4vqgag5yxjoBnUK2rncZXZ4G00yZJIxZ5Wey"> 
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="tabs" options={{ headerShown: false }} />
                <Stack.Screen name="screens" options={{ headerShown: false }} />
            </Stack>
        </StripeProvider>
    );
}

export default RooyLayout;