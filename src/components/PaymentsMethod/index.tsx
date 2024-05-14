import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {BillPaymentContext} from '../../reducers/billPayments';
import PrimaryButton from '../Common/PrimaryButton';
import Label from '../Common/Label';
import Header from '../Common/Header';
import {Colors} from '../../styles';
import {upi_icon} from '../../assets/upi_icon';
import OutlinedInput from '../Common/OutlinedInput';
import PaymentOption from './PaymentOption';
import {bank_icon} from '../../assets/bank_icon';
import {checque_icon} from '../../assets/cheque_icon';
import {cash_icon} from '../../assets/cash_icon';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {postAuthenticatedRequest} from '../../utils/api';
import AlertModal from '../Common/AlertModal';
import {emptyBillPaymentStore} from '../../actions/billPayments';

const PaymentMethod = ({navigation, route}: {navigation: any; route: any}) => {
  const [remark, setRemark] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const {state: billPaymentState, dispatch: billPaymentDispatch} =
    useContext(BillPaymentContext);

  const paymentOptions = [
    {
      key: 'upi',
      label: 'UPI',
      icon: upi_icon,
      InputElement: (
        <OutlinedInput
          style={{marginVertical: 5}}
          label="Transaction Id"
          value={transactionCode}
          onChangeText={(text: string) => setTransactionCode(text)}
        />
      ),
    },
    {
      key: 'bank',
      label: 'Bank Transfer',
      icon: bank_icon,
      InputElement: (
        <OutlinedInput
          style={{marginVertical: 5}}
          label="UTR No."
          value={transactionCode}
          onChangeText={(text: string) => setTransactionCode(text)}
        />
      ),
    },
    {
      key: 'cheque',
      label: 'Cheque Payment',
      icon: checque_icon,
      InputElement: (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <OutlinedInput
            value={transactionCode}
            onChangeText={(text: string) => setTransactionCode(text)}
            keyboardType={'numeric'}
            style={{marginVertical: 5, width: '48%'}}
            label="Cheque Number"
          />
          <TouchableOpacity
            onPressIn={() => {
              setShowDate(true);
            }}
            style={{width: '48%'}}>
            <OutlinedInput
              value={date.toDateString()}
              // value={}
              label={'Date'}
              style={{marginVertical: 5}}
              editable={false}
              returnKeyType={'next'}
              onSubmitEditing={() => {}}
            />
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: 'cash',
      label: 'Cash',
      icon: cash_icon,
      InputElement: <></>,
    },
  ];

  const onPressSavePayment = async () => {
    if (selectedPaymentOption) {
      const paymentDetails = {
        PAYMENT_TYPE: selectedPaymentOption,
        REMARK: remark,
        CHQ_DT: selectedPaymentOption === 'cheque' ? date : null,
        TRANSACTION_NO: transactionCode,
      };
      //   await addBill(payload)(billPaymentDispatch);
      const {BILLS, ...billPaymentData} = billPaymentState;

      const data = await billPaymentState.BILLS?.map((bill: any) => {
        return {
          ...bill,
          ...billPaymentData,
          ...paymentDetails,
        };
      });

      try {
        const createPayment = await postAuthenticatedRequest('/payments', {
          bills: data,
        });
        await emptyBillPaymentStore()(billPaymentDispatch);
        navigation.navigate('MainScreen');
      } catch (err) {
        setErrorModal(true);
      }
      //   billPaymentDispatch();
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        {true ? (
          <View style={styles.cont}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}>
              <View>
                <Header
                  headingText={'Add Payment Method'}
                  onBackPress={async () => {
                    // await emptyOrderStore()(orderDispatch);
                    // await emptyOrderDetails()(orderDetailsDispatch);
                    navigation.goBack();
                  }}
                />
                <Label
                  leftText={'Total Payment'}
                  rightText={`₹${route.params?.totalPayment}`}
                  rightTextStyle={{color: Colors.TEXT_COLOR}}
                />
                {paymentOptions.map((option, index) => {
                  return (
                    <PaymentOption
                      key={option.key}
                      option={option.key}
                      setSelectedPaymentOption={setSelectedPaymentOption}
                      selectedPaymentOption={selectedPaymentOption}
                      icon={option.icon}
                      InputElement={option.InputElement}
                      label={option.label}
                    />
                  );
                })}
              </View>
              <OutlinedInput
                label={'Remark'}
                style={{marginVertical: 28}}
                value={remark}
                onChangeText={(text: string) => {
                  setRemark(text);
                }}
              />
            </ScrollView>
            <View style={styles.bottomButtonContainer}>
              <PrimaryButton
                onPress={() => {
                  onPressSavePayment();
                }}
                btnText={'Save Payment'}
                style={{marginTop: 10}}
                // disabled={!totalPay()}
              />
            </View>
          </View>
        ) : null}
      </View>
      <DateTimePickerModal
        headerTextIOS={`Pick a Date`}
        cancelTextIOS={`Cancel`}
        confirmTextIOS={`Confirm`}
        isVisible={showDate}
        // maximumDate={new Date(new Date().setDate(new Date().getDate() + 1))}
        minimumDate={new Date(2006, 0, 1)}
        testID="dateTimePicker"
        timeZoneOffsetInMinutes={330}
        date={new Date()}
        mode={'date'}
        is24Hour={true}
        display="default"
        onConfirm={date => {
          setShowDate(false);
          setDate(date);
        }}
        onCancel={() => {
          setShowDate(false);
        }}
      />
      <AlertModal
        visible={errorModal}
        heading={'Something went wrong'}
        message={'Please report the error to developer'}
        primaryBtnText={'Okay'}
        onPressPrimaryBtn={() => {
          setErrorModal(false);
        }}
      />
    </SafeAreaView>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cont: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
