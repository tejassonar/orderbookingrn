import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../Common/Header';
import {Colors, Typography} from '../../styles';
import OutlinedInput from '../Common/OutlinedInput';
import {SvgXml} from 'react-native-svg';
import {noOrder} from '../../assets/noOrder';
import moment from 'moment';
import {getAuthenticatedRequest} from '../../utils/api';
import {Cell, Row, Table, TableWrapper} from 'react-native-table-component';
import DropDown from '../Common/DropDown';
import {formatDate} from '../../utils/formatDate';
import SharePDFReport from './SharePDFReport';

const AllCollection = ({navigation}: any) => {
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [payments, setPayments] = useState();
  const [paymentMethod, setPaymentMethod] = useState('');
  useEffect(() => {
    getOrders();
  }, [date, paymentMethod]);

  async function getOrders() {
    const response = await getAuthenticatedRequest(
      `/payments?date=${date}&payment_method=${paymentMethod}`,
    );
    setPayments(response.data[0]);
  }

  const PaymentMethodOptions = [
    {
      key: '',
      value: 'All',
      disabled: false,
    },
    {
      key: 'upi',
      value: 'UPI',
      disabled: false,
    },
    {
      key: 'bank',
      value: 'Bank ',
      disabled: false,
    },
    {
      key: 'cheque',
      value: 'Cheque',
      disabled: false,
    },
    {
      key: 'cash',
      value: 'Cash',
      disabled: false,
    },
  ];

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.cont}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
            style={{zIndex: 1, flex: 1, display: 'flex'}}>
            <Header
              //   closeIcon
              headingText={'All Collection'}
              subHeadingText={'All the collection saved by you '}
              onBackPress={() => {
                navigation.goBack();
              }}
            />
            <View style={{flex: 1}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPressIn={() => {
                    setShowDate(true);
                  }}
                  style={{marginVertical: 10, width: '48%'}}>
                  <OutlinedInput
                    // value={date?.UTC()}
                    value={moment(date).tz('Asia/Kolkata').format('ll')}
                    onChangeText={(text: string) => setDate(text)}
                    label={'Date'}
                    editable={false}
                    returnKeyType={'next'}
                    onSubmitEditing={() => {}}
                  />
                </TouchableOpacity>
                <DropDown
                  label={'Payment Method'}
                  options={PaymentMethodOptions}
                  onChange={(type: any) => setPaymentMethod(type.key)}
                  defaultValue={PaymentMethodOptions[0]}
                  editable={true}
                  containerStyle={{marginVertical: 10, width: '48%'}}
                  // backgroundLabelColor={'#f2f2f2'}
                  // containerBackgroundColor={'#f2f2f2'}
                />
                {/* <OutlinedInput
                  style={{marginVertical: 10, width: '48%'}}
                  label={'Payment Method'}
                  value={'All'}
                  isDropdown={true}
                /> */}
              </View>
              {payments?.TOTAL_PAYMENT_TYPE_RCV_AMT ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: Colors.PRIMARY,
                      fontWeight: Typography.FONT_WEIGHT_BOLD,
                      fontFamily: Typography.FONT_FAMILY_REGULAR,
                      fontSize: Typography.FONT_SIZE_16,
                    }}>
                    Total Collection: ₹{payments.TOTAL_PAYMENT_TYPE_RCV_AMT}
                  </Text>
                  {paymentMethod ? (
                    <Text style={{color: Colors.TEXT_COLOR}}>
                      {' '}
                      ({paymentMethod})
                    </Text>
                  ) : (
                    []
                  )}
                </View>
              ) : null}
              {payments?.PAYMENTS.length > 0 ? (
                payments?.PAYMENTS.map((payment, index) => (
                  <View style={{marginTop: 20}}>
                    {payment.BILLS && (
                      <View style={styles.cardContainer}>
                        <SharePDFReport
                          PARTY_NM={payment.PARTY_NM}
                          PARTY_CD={payment.PARTY_CD}
                          BILL_DT={formatDate(payment.BILL_DT)}
                          PAYMENT_TYPE={
                            payment.PAYMENT_TYPE.charAt(0).toUpperCase() +
                            payment.PAYMENT_TYPE.slice(1)
                          }
                          TOTAL={payment.TOTAL}
                          BILLS={payment.BILLS}
                        />
                        <Text style={styles.title}>{payment.PARTY_NM}</Text>
                        <Text style={styles.cardText}>
                          Party Code: {payment.PARTY_CD}
                        </Text>
                        <Text style={styles.cardText}>
                          Total Amount: ₹{payment.TOTAL}
                        </Text>
                        <Text style={styles.cardText}>
                          Payment Method:{' '}
                          {payment.PAYMENT_TYPE.charAt(0).toUpperCase() +
                            payment.PAYMENT_TYPE.slice(1)}
                        </Text>
                        <Text style={styles.cardText}>
                          Date: {formatDate(payment.BILL_DT)}
                        </Text>
                        <Table
                          borderStyle={{
                            borderWidth: 2,
                            borderColor: '#c8e1ff',
                          }}>
                          <Row
                            data={[
                              'Doc No.',
                              'Doc Date',
                              'Pending (Total)',
                              'Received',
                            ]}
                            flexArr={[2, 2, 2, 2, 2]}
                            style={styles.head}
                            textStyle={styles.headerText}
                          />
                          {payment.BILLS.map((rowData, index) => {
                            const itemData = [
                              `${rowData.DOC_NO}`,
                              formatDate(rowData.DOC_DT),
                              `${rowData.PND_AMT} (${rowData.BIL_AMT})`,
                              `${rowData.RCV_AMT}`,
                            ];
                            return (
                              <TableWrapper key={index} style={styles.row}>
                                {itemData.map((cellData, cellIndex) => {
                                  return (
                                    <Cell
                                      key={`${cellIndex}-${cellData}`}
                                      data={cellData}
                                      flex={2}
                                      textStyle={styles.text}
                                    />
                                  );
                                })}
                              </TableWrapper>
                            );
                          })}
                        </Table>
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.svgContainer}>
                  <SvgXml xml={noOrder} height={'250px'} width={'250px'} />
                  <Text style={styles.svgText}>No Collection Found</Text>
                  <Text style={styles.svgSubText}>
                    Looks like there aren't any collection for this day
                  </Text>
                </View>
              )}
            </View>
            {
              <DateTimePickerModal
                headerTextIOS={`Pick a Date`}
                cancelTextIOS={`Cancel`}
                confirmTextIOS={`Confirm`}
                isVisible={showDate}
                maximumDate={
                  new Date(new Date().setDate(new Date().getDate() + 1))
                }
                minimumDate={new Date(2006, 0, 1)}
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={330}
                date={new Date()}
                mode={'date'}
                is24Hour={true}
                display="default"
                onConfirm={date => {
                  console.log(date, '==Date==');

                  setShowDate(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setShowDate(false);
                }}
              />
            }
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cont: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  cardContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 10,
  },
  head: {
    height: 60,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
  },
  cardText: {
    fontSize: Typography.FONT_SIZE_14,
    color: Colors.TEXT_COLOR,
    marginBottom: 6,
  },
  title: {
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerText: {
    margin: 6,
    fontWeight: '600',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
  },
  row: {flexDirection: 'row', display: 'flex', flex: 1},
  svgContainer: {
    display: 'flex',
    flex: 1,
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgText: {
    fontFamily: Typography.FONT_FAMILY_EXTRA_BOLD,
    fontSize: Typography.FONT_SIZE_27,
    color: Colors.TEXT_COLOR,
    textAlign: 'center',
  },
  svgSubText: {
    fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
    fontSize: Typography.FONT_SIZE_18,
    lineHeight: Typography.LINE_HEIGHT_24,
    color: Colors.TEXT_COLOR,
    textAlign: 'center',
  },
});
export default AllCollection;
