import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {booking} from '../../assets/undraw_booking_re_gw4j';
import {allOrders} from '../../assets/allOrders';
import {Colors, Typography} from '../../styles';
import {OrderDetailsContext} from '../../reducers/orderDetails';
import {emptyOrderDetails, initializeOrder} from '../../actions/orderDetails';
import {nanoid} from 'nanoid';
import {emptyOrderStore} from '../../actions/order';
import {OrderContext} from '../../reducers/order';
import {UserContext} from '../../reducers/user';

// import {customAlphabet} from 'nanoid/non-secure';
const MainScreen = ({navigation}: any) => {
  console.log('MainScreen');
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);

  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);
  const {state: userState, dispatch: userDispatch} = useContext(UserContext);
  // console.log(userState, 'userState');

  const onPressOrderBooking = () => {
    emptyOrderStore()(orderDispatch);
    emptyOrderDetails()(orderDetailsDispatch);
    // console.log(userState, 'userState');
    const orderData = {
      USER_ID: '1234',
      ORD_DT: new Date().toDateString(),
      ORD_NO: nanoid(),
      COMP_CD: userState.COMP_CD,
      CLIENT_CD: userState.CLIENT_CD,
      AGENT_ID: userState.AGENT_ID,
    };
    initializeOrder(orderData)(orderDetailsDispatch);
    navigation.navigate('PartyScreen');
  };

  const onPressAllOrders = () => {
    navigation.navigate('AllOrders');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPressOrderBooking}>
        <SvgXml xml={booking} height={'150px'} width={'150px'} />
        <Text style={styles.title}>Book Order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onPressAllOrders}>
        <SvgXml xml={allOrders} height={'150px'} width={'150px'} />
        <Text style={styles.title}>All Orders</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 32,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    width: '80%',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 12,
    marginTop: 32,
    // width: '100%',
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default MainScreen;
