import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useNetInfo} from '@react-native-community/netinfo';
import React, {useEffect, useContext, useState} from 'react';
import {StatusBar, Platform, Text, View} from 'react-native';
import {Colors} from '../../styles';
import MainNavigator from './MainNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import {getAuthenticatedRequest} from '../../utils/api';
import {UserContext} from '../../reducers/user';
import {updateUserDetails} from '../../actions/user';

const Stack = createNativeStackNavigator();
const isAndroid = Platform.OS === 'android';

function DetailsScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
    </View>
  );
}

export default function AppNavigator() {
  const netInfo = useNetInfo();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {state: userState, dispatch: userDispatch} = useContext(UserContext);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const user = await AsyncStorage.getItem('User');

      if (user !== null) {
        const userObject = await JSON.parse(user);

        if (userObject.accessToken) {
          // We have data!!
          const decodedToken = jwtDecode(userObject.accessToken);
          if (jwtDecode(userObject.accessToken).exp > Date.now() / 1000) {
            const user = await getAuthenticatedRequest('/users');
            updateUserDetails(user.data)(userDispatch);
            setIsLoggedIn(true);
          } else {
          }
        }
      } else {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      // Error retrieving data
    } finally {
      // Whether the token retrieval is successful or not, mark loading as complete
      setIsLoading(false);
    }
  };

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={Colors.PRIMARY}
        barStyle={isAndroid ? 'light-content' : 'dark-content'}
      />
      {isLoading ? (
        <Text
          style={{
            display: 'flex',
            alignSelf: 'center',
            // justifyContent: 'center',
          }}>
          Loading...
        </Text>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="MainNavigator"
            component={MainNavigator}
            initialParams={{isLoggedIn}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
