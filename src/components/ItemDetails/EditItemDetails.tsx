import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Switch,
  Text,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';

import {Colors, Typography} from '../../styles';
// import {AlertModal, Header, PrimaryButton} from '../Common';

import OutlinedInput from '../Common/OutlinedInput';
import {CommonActions, useNavigation} from '@react-navigation/native';

import AlertModal from '../Common/AlertModal';
import PrimaryButton from '../Common/PrimaryButton';
import Header from '../Common/Header';
import {OrderDetailsContext} from '../../reducers/orderDetails';
import {OrderContext} from '../../reducers/order';
import {
  addItemToOrder,
  editItemInOrder,
  emptyOrderStore,
} from '../../actions/order';
import {getRequest, putAuthenticatedRequest} from '../../utils/api';
import {addOrderDetails, emptyOrderDetails} from '../../actions/orderDetails';
import {UserContext} from '../../reducers/user';

export const EditItemDetails = ({navigation, route}: any) => {
  const [diameter, setDiameter] = useState(`${route.params.rate}`);
  const [diameterError, setDiameterError] = useState('');
  const [schemeError, setSchemeError] = useState('');
  const [height, setHeight] = useState(`${route.params.quantity}`);
  const [scheme, setScheme] = useState(`${route.params.schemePrice}`);
  const [heightError, setHeightError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [skipAndAddModal, setSkipAndAddModal] = useState(false);
  const [skipAndReviewModal, setSkipAndReviewModal] = useState(false);
  const [insufficientQuantityModal, setInsufficientQuantityModal] =
    useState(false);

  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);
  const {state: userState} = useContext(UserContext);

  const diameterRef = React.createRef();
  const schemeRef = React.createRef();

  //   useEffect(() => {
  //     console.log(orderState, 'orderState');
  //   }, []);

  //   const checkQuantity = async () => {
  //     console.log('checkQuantity');
  //     setHeightError('');
  //     const response = await getRequest(`/items/${route.params.itemCode}`);

  //     if (response.data.balanceQuantity < Number(height)) {
  //       setHeightError(`Only ${response.data.balanceQuantity} QTY available!`);
  //     }
  //   };

  const editItem = async () => {
    try {
      setIsDisabled(true);
      const data: {RATE: number; QTY: number; SCHEME_PRICE?: number} = {
        QTY: height,
        RATE: diameter,
      };
      if (userState.AGENCY) {
        data.SCHEME_PRICE = scheme;
      }
      if (route.params.orderItemId) {
        const response = await putAuthenticatedRequest(
          `/orders/${route.params.orderItemId}`,
          data,
        );
      }

      const payload = {
        index: route.params.index,
        data: data,
      };
      // addItemToOrder(item)(orderDispatch);
      const res = await editItemInOrder(payload)(orderDispatch);
      navigation.navigate('OrderReview', {savedOrder: true});
    } catch (err) {
      console.log(err, 'Error');
      setInsufficientQuantityModal(true);
    }
  };

  const onClickAddItem = () => {
    if (heightError) {
      setSkipAndAddModal(true);
    } else {
      editItem();
    }
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Header
              headingText={'Edit Item Details'}
              onBackPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : undefined}
            style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View>
                <View style={styles.inputBox}>
                  <View>
                    <OutlinedInput
                      value={height}
                      onChangeText={(text: string) => setHeight(text)}
                      label={'Quantity'}
                      keyboardType={'decimal-pad'}
                      //   rightText={'m'}
                      error={heightError}
                      autoFocus
                      returnKeyType={'next'}
                      //   onEndEditing={() => {
                      //     console.log('PPPPPPP');

                      //     checkQuantity();
                      //   }}
                      onSubmitEditing={() => {
                        diameterRef.current.focus();
                      }}
                    />
                  </View>
                </View>

                <View style={[styles.inputBox, {zIndex: 1}]}>
                  <View>
                    <OutlinedInput
                      value={diameter}
                      onChangeText={(text: string) => {
                        setDiameterError('');
                        // setDiameter(
                        //   text.replace(/,/g, '.').replace(/[^0-9.]/g, ''),
                        // );
                        setDiameter(text);
                      }}
                      label={'Rate'}
                      keyboardType={'decimal-pad'}
                      error={diameterError}
                      ref={diameterRef}
                      returnKeyType={'default'}
                      //   onSubmitEditing={() => tagIdRef.current.focus()}
                    />
                  </View>
                </View>
                {userState.AGENCY ? (
                  <View style={[styles.inputBox, {zIndex: 1}]}>
                    <View>
                      <OutlinedInput
                        value={scheme}
                        onChangeText={(text: string) => {
                          setSchemeError('');
                          setScheme(text);
                        }}
                        label={'Scheme Price'}
                        keyboardType={'decimal-pad'}
                        error={schemeError}
                        ref={schemeRef}
                        returnKeyType={'default'}
                        // onSubmitEditing={() => tagIdRef.current.focus()}
                      />
                    </View>
                  </View>
                ) : (
                  []
                )}
              </View>

              <View style={styles.bottomBtnsContainer}>
                <PrimaryButton
                  onPress={onClickAddItem}
                  btnText={'Save'}
                  disabled={isDisabled}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
        {/* //Skip and Add Modal */}
        <AlertModal
          visible={insufficientQuantityModal}
          heading={'Insufficient quantity'}
          message={`Can't Edit the quantity due to insufficient supply.`}
          primaryBtnText={'Okay'}
          onPressPrimaryBtn={() => {
            setInsufficientQuantityModal(false);
            navigation.navigate('OrderReview', {
              savedOrder: true,
            });
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
    flexDirection: 'column',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  inputBox: {
    marginTop: 24,
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    color: Colors.TEXT_COLOR,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    marginRight: 10,
    flex: 1,
  },
  bottomBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
