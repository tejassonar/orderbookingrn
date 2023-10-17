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
import AllOrders from '../AllOrders';
import {EditItemDetails} from '../ItemDetails/EditItemDetails';
import BillsPayment from '../BillsPayment';
import UploadData from '../UploadData';
import PaymentMethod from '../PaymentsMethod';
import AllCollection from '../AllCollection';
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
        name="EditItemDetails"
        component={EditItemDetails}
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
      <Stack.Screen
        name="BillsPayment"
        component={BillsPayment}
        options={MyTransition}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={MyTransition}
      />
      <Stack.Screen
        name="AllCollection"
        component={AllCollection}
        options={MyTransition}
      />
      <Stack.Screen
        name="CollectionOverview"
        component={AllCollection}
        options={MyTransition}
      />
      <Stack.Screen
        name="UploadData"
        component={UploadData}
        options={MyTransition}
      />
    </Stack.Navigator>
  );
}
