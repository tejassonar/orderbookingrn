import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {Colors, Typography} from '../../styles';
import {SvgXml} from 'react-native-svg';
import {businessman} from '../../assets/businessman';
import {postRequest} from '../../utils/api';
import {ActivityIndicator} from 'react-native';
import {login} from '../../utils/login';
import {updateUserDetails} from '../../actions/user';
import {UserContext} from '../../reducers/user';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {state: userState, dispatch: userDispatch} = useContext(UserContext);
  const handleEmailChange = (email: any) => {
    setEmail(email);
  };

  const handlePasswordChange = (password: any) => {
    setPassword(password);
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!email) {
      Alert.alert('Please enter your email');
      setLoading(false);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Please enter a valid email address');
      setLoading(false);
    } else if (!password) {
      Alert.alert('Please enter your password');
      setLoading(false);
    } else {
      const data = await login(email, password);
      updateUserDetails(data)(userDispatch);
      setLoading(false);
      navigation.navigate('MainScreen');

      console.log('Login successful');
    }
    console.log('Loading false');
  };

  return (
    <View style={styles.container}>
      <Text style={{paddingBottom: 50, color: Colors.TEXT_COLOR}}>
        Soft-Touch Order-Booking App
      </Text>
      <SvgXml xml={businessman} height={'200px'} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.GRAY_LIGHTEST}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.GRAY_LIGHTEST}
        secureTextEntry={true}
        value={password}
        onChangeText={handlePasswordChange}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}>
        {loading ? (
          // <Text style={styles.buttonText}>Loading</Text>
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 32,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    width: '80%',
    color: Colors.TEXT_COLOR,
    fontSize: Typography.FONT_SIZE_18,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
    padding: 12,
    marginTop: 32,
    minWidth: 120,
    minHeight: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
