import AsyncStorage from '@react-native-async-storage/async-storage';
import {postRequest} from './api';

export const login = async (email: string, password: string) => {
  //   new Promise(async (resolve, reject) => {
  console.log(email, password, 'email, password');
  const response = await postRequest('/users/login', {
    email: email,
    password: password,
  });
  console.log(response, 'ress');

  const userData = {
    userId: response.data._id,
    email: response.data.EMAIl,
    accessToken: response.data.token,
  };

  await AsyncStorage.setItem('User', JSON.stringify(userData));
  return response.data;
  //   });
};
