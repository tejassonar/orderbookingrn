import React, {useContext, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {booking} from '../../assets/booking';
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
import {upload} from '../../assets/upload';
import {billPayemnts} from '../../assets/billPayments';
import Header from '../Common/Header';
import avatar from '../../assets/avatar.png';
import SearchInput from '../Common/SearchInput';
import moment from 'moment';
// import {customAlphabet} from 'nanoid/non-secure';
const MainScreen = ({navigation}: any) => {
  const [partiesUploading, setPartiesUploading] = useState(false);
  const [itemsUploading, setItemsUploading] = useState(false);
  const [billsUploading, setBillsUploading] = useState(false);
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
      ORDER_STATUS: 'PENDING',
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

      if (response.status === 200) {
        Alert.alert('Upload Successful');
      }
      // const response = await postAuthenticatedRequest('/parties/bulk', data, {
      //   'Content-Type': 'multipart/form-data',
      // });

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

      if (response.status === 200) {
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
  const uploadBills = async () => {
    try {
      const response = await uploadFileToAPI({
        route: 'bills/bulk',
        key: 'bulkBills',
        setUploading: setBillsUploading,
      });

      if (response.status === 200) {
        Alert.alert('Upload Successful');
      }
      // const response = await postAuthenticatedRequest('/parties/bulk', data, {
      //   'Content-Type': 'multipart/form-data',
      // });

      setBillsUploading(false);
    } catch (err) {
      setBillsUploading(false);
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

  const onClickBillsPayment = () => {
    navigation.navigate('PartyScreen', {isBillsPayment: true});
  };
  const onClickUploadData = () => {
    navigation.navigate('AllCollection');
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        // closeIcon
        hideBackIcon={true}
        headingText={`Hi ${userState.FIRST_NAME},`}
        style={{paddingTop: 20}}
        TopRightComponent={() => {
          return (
            <View>
              <Image source={avatar} style={styles.avatar}></Image>
            </View>
          );
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPressOrderBooking}>
          <SvgXml xml={booking} height={'90px'} width={'90px'} />
          <Text style={styles.title}>Book Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressAllOrders}>
          <SvgXml xml={allOrders} height={'90px'} width={'90px'} />
          <Text style={styles.title}>All Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClickBillsPayment}>
          <SvgXml xml={billPayemnts} height={'90px'} width={'90px'} />
          <Text style={styles.title}>Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClickUploadData}>
          <SvgXml xml={upload} height={'90px'} width={'90px'} />
          <Text style={styles.title}>All Collection</Text>
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
            <PrimaryButton
              btnText={billsUploading ? 'Uploading...' : 'Upload Bills'}
              onPress={uploadBills}
              halfWidth={true}
              disabled={billsUploading}
            />
          </>
        ) : (
          []
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
  },
  avatar: {
    height: 36,
    width: 36,
    borderWidth: 1,
    borderColor: '#bebebe',
    borderRadius: 18,
    padding: 5,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    bottom: 44,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: Typography.FONT_SIZE_22,
    fontWeight: 'bold',
    marginTop: 5,
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
    // flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    // height: '45%',
    aspectRatio: 1 / 1,
    width: '45%',
    padding: 5,
    marginTop: 32,
    // width: '100%',
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
  },
});
export default MainScreen;
