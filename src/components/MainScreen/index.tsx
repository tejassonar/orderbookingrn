import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import DocumentPicker from 'react-native-document-picker';
import PrimaryButton from '../Common/PrimaryButton';
import {uploadFileToAPI} from '../../utils/uploadFIletoAPI';

// import {customAlphabet} from 'nanoid/non-secure';
const MainScreen = ({navigation}: any) => {
  console.log('MainScreen');
  const [partiesUploading, setPartiesUploading] = useState(false);
  const [itemsUploading, setItemsUploading] = useState(false);
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);

  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);
  const {state: userState, dispatch: userDispatch} = useContext(UserContext);

  const onPressOrderBooking = () => {
    emptyOrderStore()(orderDispatch);
    emptyOrderDetails()(orderDetailsDispatch);
    // console.log(userState, 'userState');
    const orderData = {
      USER_ID: '1234',
      ORD_DT: new Date().toDateString(),
      ORD_NO: nanoid(5),
      COMP_CD: userState.COMP_CD,
      CLIENT_CD: userState.CLIENT_CD,
      AGENT_CD: userState.AGENT_CD,
    };
    initializeOrder(orderData)(orderDetailsDispatch);
    navigation.navigate('PartyScreen');
  };

  const onPressAllOrders = () => {
    navigation.navigate('AllOrders');
  };

  const uploadItems = async () => {
    // Opening Document Picker to select one file
    try {
      const response = await uploadFileToAPI({
        route: 'items/bulk',
        key: 'bulkItems',
        setUploading: setItemsUploading,
      });

      if (response.status == 200) {
        Alert.alert('Upload Successful');
      }
      // const response = await postAuthenticatedRequest('/parties/bulk', data, {
      //   'Content-Type': 'multipart/form-data',
      // });

      console.log(response, 'response');

      // Setting the state to show single file attributes
      setItemsUploading(false);
    } catch (err) {
      setItemsUploading(false);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        Alert.alert('Canceled');
      } else {
        // For Unknown Error
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const uploadParties = async () => {
    try {
      const response = await uploadFileToAPI({
        route: 'parties/bulk',
        key: 'bulkParties',
        setUploading: setPartiesUploading,
      });

      if (response.status == 200) {
        Alert.alert('Upload Successful');
      }
      // const response = await postAuthenticatedRequest('/parties/bulk', data, {
      //   'Content-Type': 'multipart/form-data',
      // });

      setPartiesUploading(false);
    } catch (err) {
      setPartiesUploading(false);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        Alert.alert('Canceled');
      } else {
        // For Unknown Error
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
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
      {userState.ADMIN ? (
        <>
          <PrimaryButton
            btnText={partiesUploading ? 'Uploading...' : 'Upload Parties'}
            onPress={uploadParties}
            halfWidth={true}
            style={{marginTop: 25}}
            disabled={partiesUploading}
          />
          <PrimaryButton
            btnText={itemsUploading ? 'Uploading...' : 'Upload Items'}
            onPress={uploadItems}
            halfWidth={true}
            disabled={itemsUploading}
          />
        </>
      ) : (
        []
      )}
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
