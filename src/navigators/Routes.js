import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MyCart from '../screens/MyCart';
import Home from '../screens/Home';
import ProductInfo from '../screens/ProductInfo';


export default function Routes() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='MyCart' component={MyCart} />
            <Stack.Screen name='ProductInfo' component={ProductInfo} />
        </Stack.Navigator>
    )
}