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
import {addItemToOrder, emptyOrderStore} from '../../actions/order';
import {getRequest} from '../../utils/api';
import {emptyOrderDetails} from '../../actions/orderDetails';

export const ItemDetails = ({navigation, route}: any) => {
  const [singleTreeSpecie, setSingleTreeSpecie] = useState('');
  const [diameter, setDiameter] = useState('');
  const [diameterError, setDiameterError] = useState('');
  const [height, setHeight] = useState('');
  const [heightError, setHeightError] = useState('');
  const [tagId, setTagId] = useState('');
  const [qty, setQty] = useState<any>(0);
  const [countryCode, setCountryCode] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tagIdError, setTagIdError] = useState('');
  const [skipAndAddModal, setSkipAndAddModal] = useState(false);
  const [skipAndReviewModal, setSkipAndReviewModal] = useState(false);
  const [noItemsModal, setNoItemsModal] = useState(false);
  const [diameterLabel, setDiameterLabel] = useState<string>(
    'label.measurement_basal_diameter',
  );
  const [showIncorrectRatioAlert, setShowIncorrectRatioAlert] =
    useState<boolean>(false);
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);
  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);

  const diameterRef = React.createRef();
  const tagIdRef = React.createRef();

  useEffect(() => {
    console.log(orderState, 'orderState');
  }, []);

  const checkQuantity = async () => {
    setHeightError('');
    const response = await getRequest(`/items/${route.params.itemCode}`);
    console.log(
      response,
      response.data.balanceQuantity,
      Number(height),
      'response.balanceQuantity < Number(height)',
    );

    if (response.data.balanceQuantity < Number(height)) {
      setHeightError(`Only ${response.data.balanceQuantity} QTY available!`);
    }
  };

  console.log(heightError, 'heightError');

  const addItem = async () => {
    setIsDisabled(true);
    const item = {
      ...orderDetailsState,
      RATE: diameter,
      QTY: height,
      LORY_CD: route.params.itemCode,
      LORY_NO: route.params.itemName,
    };
    addItemToOrder(item)(orderDispatch);
  };

  const onClickAddItem = () => {
    if (heightError) {
      setSkipAndAddModal(true);
    } else {
      addItem();
      navigation.navigate('ItemScreen');
    }
  };

  const onClickOrderReview = () => {
    if (heightError) {
      if (orderState.length > 0) {
        setSkipAndReviewModal(true);
      } else {
        setNoItemsModal(true);
      }
    } else {
      addItem();
      navigation.navigate('OrderReview');
    }
  };
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Header
              headingText={'Add Item Details'}
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
                      onEndEditing={() => {
                        checkQuantity();
                      }}
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
                      onSubmitEditing={() => tagIdRef.current.focus()}
                      //   showInfo={true}
                      //   infoText={'label.measurement_diameter_info'}
                    />
                  </View>
                </View>

                {/* <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    {'label.select_species_tagged_for_identification'}
                  </Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#d4e7b1'}}
                    thumbColor={isTagIdPresent ? Colors.PRIMARY : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setIsTagIdPresent(!isTagIdPresent)}
                    value={isTagIdPresent}
                  />
                </View> */}

                {/* {isTagIdPresent ? (
                  <>
                    <View style={styles.inputBox}>
                      <View>
                        <OutlinedInput
                          value={tagId}
                          label={'Note'}
                          onChangeText={(text: string) => {
                            setTagIdError('');
                            setTagId(text);
                          }}
                          error={tagIdError}
                          ref={tagIdRef}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  []
                )} */}
              </View>

              <View style={styles.bottomBtnsContainer}>
                <PrimaryButton
                  onPress={onClickAddItem}
                  btnText={'Add Item'}
                  halfWidth
                  theme={'white'}
                  disabled={isDisabled}
                />
                <PrimaryButton
                  onPress={onClickOrderReview}
                  btnText={'Review'}
                  halfWidth
                  disabled={isDisabled}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
        {/* //Skip and Add Modal */}
        <AlertModal
          visible={skipAndAddModal}
          heading={'Skip current Item?'}
          message={`Do you want to skip the current item and add another?`}
          primaryBtnText={'Yes, Please'}
          secondaryBtnText={'No, Wait'}
          onPressPrimaryBtn={() => {
            setSkipAndAddModal(false);
            navigation.goBack();
          }}
          onPressSecondaryBtn={() => setSkipAndAddModal(false)}
        />
        {/* //Skip and Review Modal */}
        <AlertModal
          visible={skipAndReviewModal}
          heading={'Skip current Item?'}
          message={`Do you want to skip the current item and review the order?`}
          primaryBtnText={'Yes, Please'}
          secondaryBtnText={'No, Wait'}
          onPressPrimaryBtn={() => {
            setSkipAndAddModal(false);
            navigation.navigate('OrderReview');
          }}
          onPressSecondaryBtn={() => setSkipAndReviewModal(false)}
        />
        {/* //No Items modal */}
        <AlertModal
          visible={noItemsModal}
          heading={'Oops, No items'}
          message={`There are no items in the order to review.`}
          primaryBtnText={'Add Item'}
          secondaryBtnText={'Cancel Order'}
          onPressPrimaryBtn={() => {
            setNoItemsModal(false);
            navigation.goBack();
          }}
          onPressSecondaryBtn={async () => {
            await emptyOrderStore()(orderDispatch);
            await emptyOrderDetails()(orderDetailsDispatch);

            setNoItemsModal(false);
            navigation.navigate('MainScreen');
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
