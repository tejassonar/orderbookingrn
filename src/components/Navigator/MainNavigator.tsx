// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationOptions,
  TransitionSpecs,
} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {Text} from 'react-native';
import LoginScreen from '../LoginScreen';
import MainScreen from '../MainScreen';
import PartyScreen from '../PartyScreen';
import ItemScreen from '../ItemScreen';
import {ItemDetails} from '../ItemDetails';
import OrderReview from '../OrderReview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AllOrders from '../AllOrders';
// import {} from '../';

const Stack = createStackNavigator();

const MyTransition: StackNavigationOptions = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({current, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

export default function MainNavigator(props: any) {
  return (
    <Stack.Navigator
      initialRouteName={
        props.route.params.isLoggedIn ? 'MainScreen' : 'LoginScreen'
      }
      screenOptions={{
        headerShown: false,
      }}
      //   headerMode="none"
    >
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={MyTransition}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={MyTransition}
      />
      <Stack.Screen
        name="PartyScreen"
        component={PartyScreen}
        options={MyTransition}
      />
      <Stack.Screen
        name="ItemScreen"
        component={ItemScreen}
        options={MyTransition}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetails}
        options={MyTransition}
      />
      <Stack.Screen
        name="OrderReview"
        component={OrderReview}
        options={MyTransition}
      />
      <Stack.Screen
        name="AllOrders"
        component={AllOrders}
        options={MyTransition}
      />
    </Stack.Navigator>
  );
}
