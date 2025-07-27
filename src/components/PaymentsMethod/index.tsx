import {
  Button,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
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
import {
  addPaymentDetails,
  emptyBillPaymentStore,
} from '../../actions/billPayments';
import Modal from '../Common/Modal';
import SharePDFReport from '../AllCollection/SharePDFReport';
import {formatDate} from '../../utils/formatDate';
import Ionicon from 'react-native-vector-icons/Ionicons';

const PaymentMethod = ({navigation, route}: {navigation: any; route: any}) => {
  const [remark, setRemark] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [updatedPaymentData, setUpdatedPaymentData] = useState(null);
  const [transactionCode, setTransactionCode] = useState('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      // setIsSaving(true);
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
        console.log(createPayment?.data, 'createPayments');
        const updatedBills = createPayment?.data?.map(singleBill => {
          return {
            DOC_NO: singleBill.DOC_NO,
            DOC_DT: singleBill.DOC_DT,
            BIL_AMT: singleBill.BIL_AMT,
            PND_AMT: singleBill.PND_AMT,
            RCV_AMT: singleBill.RCV_AMT,
          };
        });
        // await initiateBillPayment(payload)(billPaymentDispatch);

        const payload = {
          ...paymentDetails,
          TOTAL: route.params?.totalPayment,
          BILLS: updatedBills,
        };
        console.log(updatedBills, 'updatedBills');

        await addPaymentDetails(payload)(billPaymentDispatch);
        // Set the updated data in a local state variable
        setUpdatedPaymentData({
          ...payload,
          PARTY_NM: billPaymentState.PARTY_NM,
          PARTY_CD: billPaymentState.PARTY_CD,
          BILL_DT: billPaymentState.BILL_DT,
          BILLS: updatedBills,
        });
        setShowSuccess(true);

        // navigation.navigate('MainScreen');
      } catch (err) {
        setErrorModal(true);
      } finally {
        setIsSaving(false);
      }
      //   billPaymentDispatch();
    }
  };

  const handleSharePDF = () => {
    const shareOptions = {
      title: 'Share PDF',
      url: 'file:///path/to/your/pdf/document.pdf', // Replace with the actual path to your PDF
      type: 'application/pdf',
    };

    // Share.open(shareOptions)
    //   .then(res => console.log(res))
    //   .catch(err => {
    //     err && console.log(err);
    //   });
  };

  console.log(isSaving, 'isSaving');

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
            <View
              style={styles.bottomButtonContainer}
              onTouchStart={() => {
                setIsSaving(true);
              }}>
              <PrimaryButton
                onPress={() => {
                  onPressSavePayment();
                }}
                btnText={'Save Payment'}
                style={{marginTop: 10}}
                disabled={isSaving}
              />
            </View>
            <Modal visible={showSuccess}>
              <View style={styles.successContainer}>
                <Text style={styles.successText}>Success!</Text>
                <Ionicon
                  name="checkmark-circle-outline"
                  size={80}
                  style={{color: 'green', paddingBottom: 20}}
                />
                {updatedPaymentData && (
                  <SharePDFReport
                    PARTY_NM={updatedPaymentData?.PARTY_NM}
                    PARTY_CD={updatedPaymentData?.PARTY_CD}
                    BILL_DT={formatDate(updatedPaymentData?.BILL_DT)}
                    PAYMENT_TYPE={
                      updatedPaymentData?.PAYMENT_TYPE?.charAt(
                        0,
                      )?.toUpperCase() +
                        updatedPaymentData?.PAYMENT_TYPE?.slice(1) ?? ''
                    }
                    TOTAL={updatedPaymentData?.TOTAL}
                    BILLS={updatedPaymentData?.BILLS}
                    TRANSACTION_NO={updatedPaymentData?.TRANSACTION_NO}
                    CHQ_DT={formatDate(updatedPaymentData?.CHQ_DT)}
                  />
                )}
                <PrimaryButton
                  btnText="Home"
                  onPress={() => {
                    setShowSuccess(false);
                    setUpdatedPaymentData(null);
                    navigation.navigate('MainScreen');
                  }}
                />
              </View>
            </Modal>
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
  successContainer: {
    marginTop: 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  successText: {
    fontSize: 24,
    color: 'green',
    marginBottom: 20,
  },
});
