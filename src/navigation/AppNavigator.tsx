import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import NFCReaderScreen from '../screens/NFCReaderScreen';
import HigienizacaoScreen from '../screens/HigienizacaoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#007AFF',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Scanner"
                    component={ScannerScreen}
                    options={{ title: 'Escanear QR Code' }}
                />
                <Stack.Screen
                    name="NFCReader"
                    component={NFCReaderScreen}
                    options={{ title: 'Ler NFC/RFID' }}
                />
                <Stack.Screen
                    name="Higienizacao"
                    component={HigienizacaoScreen}
                    options={{ title: 'Higienização' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
