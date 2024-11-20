import {View,Text, Image} from 'react-native'
import {Tabs} from 'expo-router';
import { StatusBar } from 'expo-status-bar'
import {icons} from '../../constants';

const TabIcon = ({icon,color,name,focused}) => {
    return(
        <View className = "items-center justify-center gap-2">
            <Image
                source = {icon}
                resizeMode = "contain"
                tintcolor = {color}
                className = "w-7 h-7"
            />
            <Text className = {`${focused ? 'font-pextrabold text-xm' : 'font-psemibold text-xs'}`} style = {{color : color}}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel : false,
                    tabBarActiveTintColor : '#662483', 
                    tabBarInactiveTintColor : '#000000', //#000000  #DAA621
                    tabBarStyle : {
                        backgroundColor : '#D4AF37',
                        borderTopWidth : 1,
                        borderTopColor : '#000000',
                        height : 65,
                    }
                }}
            >
                <Tabs.Screen
                    name = 'home'
                    options = {{
                        title : 'Home',
                        headerShown : false,
                        tabBarIcon : ({color,focused}) => (
                            <TabIcon
                                icon = {icons.home}
                                color = {color}
                                name = "Home"
                                focused = {focused}
                            />

                        )
                    }}
                />

                <Tabs.Screen
                    name = 'vehicle'
                    options = {{
                        title : 'Vehicle',
                        headerShown : false,
                        tabBarIcon : ({color,focused}) => (
                            <TabIcon
                                icon = {icons.vehicle}
                                color = {color}
                                name = "Vehicles"
                                focused = {focused}
                            />

                        )
                    }}
                />

                <Tabs.Screen 
                    name = 'location'
                    options = {{
                        title : 'location',
                        headerShown : false,
                        tabBarIcon : ({color,focused}) => (
                            <TabIcon
                                icon = {icons.location}
                                color = {color}
                                name = "Places"
                                focused = {focused}
                            />

                        )
                    }}
                />

                <Tabs.Screen
                    name = 'profile'
                    options = {{
                        title : 'Profile',
                        headerShown : false,
                        tabBarIcon : ({color,focused}) => (
                            <TabIcon
                                icon = {icons.profile}
                                color = {color}
                                name = "Profile"
                                focused = {focused}
                            />

                        )
                    }}
                />
            </Tabs>
        <StatusBar backgroundColor = "#161622" style = "light"/>
            
        </>
    )
}

export default TabsLayout