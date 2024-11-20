import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const ScreenLayout = () => {
    return (
       <>
        <Stack>
            <Stack.Screen
                name = "booking"
                options = {{headerShown : false}}
            />

            <Stack.Screen
                name = "confirmation"
                options = {{headerShown : false}}
            />

            <Stack.Screen
                name = "payment"
                options = {{headerShown : false}}
            />

            <Stack.Screen
                name = "placeDetails"
                options = {{headerShown : false}}
            />

            <Stack.Screen
                name = "profileEdit"
                options = {{headerShown : false}}
            />

            <Stack.Screen
                name = "admin"
                options = {{headerShown : false}}
            />
               
        </Stack>

        <StatusBar backgroundColor = "#161622" style = "light"/>
       </>
    )
}

export default ScreenLayout