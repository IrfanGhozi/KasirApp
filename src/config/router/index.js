import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import { Login, Home, Order, Stock, History, Transaction, HistoryStock, Success, TransactionDetails } from '../../pages';
import { AuthContext } from '../services/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const Router = () => {
  const { userInfo, isLogin } = useContext(AuthContext);
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogin === true ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{headerMode: 'none',}} />
            <Stack.Screen name="Order" component={Order} options={{ headerMode: 'none', }} />
            <Stack.Screen name="Stock" component={Stock} options={{ headerMode: 'none', }} />
            <Stack.Screen name="History" component={History} options={{ headerMode: 'none', }} />
            <Stack.Screen name="Transaction" component={Transaction} options={{ headerMode: 'none', }} />
            <Stack.Screen name="HistoryStock" component={HistoryStock} options={{ headerMode: 'none', }} />
            <Stack.Screen name="Success" component={Success} options={{ headerMode: 'none', }} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetails} options={{ headerMode: 'none', }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} options={{headerMode: 'none',}} />
        )}
        </Stack.Navigator>
    </NavigationContainer>
  );
};
   

export default Router;