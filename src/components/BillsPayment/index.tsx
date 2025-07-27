import {View, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Header from '../Common/Header';
import {Colors, Typography} from '../../styles';
import PrimaryButton from '../Common/PrimaryButton';
import AlertModal from '../Common/AlertModal';
import Label from '../Common/Label';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
} from '../../utils/api';
import {emptyOrderStore, removeItemFromOrder} from '../../actions/order';
import {emptyOrderDetails} from '../../actions/orderDetails';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import EditableInput from './EditableInput';
import CheckBox from './CheckBox';
import {BillPaymentContext} from '../../reducers/billPayments';
import {initiateBillPayment} from '../../actions/billPayments';
import {nanoid} from 'nanoid';
import {UserContext} from '../../reducers/user';
import {formatDate} from '../../utils/formatDate';

const BillsPayment = ({navigation, route}: any) => {
  const [disableButton, setDisableButton] = useState(false);
  const [allBills, setAllBills] = useState();
  const {state: billPaymentState, dispatch: billPaymentDispatch} =
    useContext(BillPaymentContext);
  const {state: userState, dispatch: userDispatch} = useContext(UserContext);
  const partyCode = route.params?.partyCode;

  useEffect(() => {
    if (partyCode) {
      getBills();
    }
  }, [route?.params]);

  const totalPay = useCallback(() => {
    return countTotalPay();
  }, [allBills]);

  function countTotalPay() {
    let total = 0;
    if (allBills) {
      allBills.bills.forEach(bill => {
        if (bill.RCV_AMT) {
          total += Number(bill.RCV_AMT);
        }
      });
    }
    return total;
  }
  const getBills = async () => {
    try {
      const response = await getAuthenticatedRequest(`/bills/${partyCode}`);
      setAllBills(response.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const addBillPayment = async () => {
    try {
      setDisableButton(true);
      const bills = allBills.bills;
      const payload = {
        BILL_DT: new Date().toISOString().split('T')[0],
        BILL_NO: nanoid(5),
        PARTY_CD: partyCode,
        PARTY_NM: route.params?.partyName,
        BILLS: bills.filter(bill => {
          return bill.RCV_AMT;
        }),
        CLIENT_CD: userState.CLIENT_CD,
        COMP_CD: userState.COMP_CD,
        AGENT_CD: userState?.AGENT_CD,
      };
      await initiateBillPayment(payload)(billPaymentDispatch);
      navigation.navigate('PaymentMethod', {
        totalPayment: totalPay(),
      });
      // await removeItemFromOrder(deleteItemId)(orderDispatch);
      // setDeleteItemId('');
    } catch (err) {
      console.log(err);
    }
  };

  const onClickCheckBox = (index: number) => {
    setAllBills((prevBills: any) => {
      const newBills = {...prevBills};
      if (newBills.bills.length > 0) {
        if (newBills.bills[index].RCV_AMT) {
          delete newBills.bills[index].RCV_AMT;
        } else {
          newBills.bills[index].RCV_AMT = newBills.bills[index].PND_AMT;
        }
        return newBills;
      }
    });
  };

  const editPayAmount = (index: number, value: number) => {
    setAllBills((prevBills: any) => {
      const newBills = {...prevBills};
      newBills.bills[index].RCV_AMT = value;

      return newBills;
    });
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
                  headingText={'Collection'}
                  onBackPress={async () => {
                    // await emptyOrderStore()(orderDispatch);
                    // await emptyOrderDetails()(orderDetailsDispatch);
                    navigation.goBack();
                  }}
                />

                <Label
                  leftText={'Payment Date'}
                  rightText={new Date().toDateString()}
                  rightTextStyle={{color: Colors.TEXT_COLOR}}
                />
                <Label
                  leftText={'Party Name'}
                  rightText={route.params?.partyName}
                  rightTextStyle={{color: Colors.TEXT_COLOR}}
                />
                <Label
                  leftText={'Pending Amount'}
                  rightText={`₹${allBills?.totalPendingAmount ?? 0}`}
                  rightTextStyle={{color: Colors.TEXT_COLOR}}
                />
              </View>

              <View style={{marginTop: 20}}>
                {allBills?.bills && (
                  <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row
                      data={['', 'Doc No.', 'Date', 'Pending (Total)', 'Pay']}
                      flexArr={[1, 2, 2, 2, 2]}
                      style={styles.head}
                      textStyle={styles.headerText}
                    />
                    {allBills?.bills.map((rowData, index) => {
                      const itemData = [
                        '',
                        `${rowData.DOC_NO}`,
                        // new Date(rowData.DOC_DT).toISOString().split('T')[0],
                        formatDate(rowData.DOC_DT),
                        `${rowData.PND_AMT} (${rowData.BIL_AMT})`,
                        `${rowData.BIL_AMT}`,
                      ];
                      return rowData.PND_AMT ? (
                        <TableWrapper key={index} style={styles.row}>
                          {itemData.map((cellData, cellIndex) => {
                            return (
                              <Cell
                                key={`${cellIndex}-${cellData}`}
                                data={
                                  cellIndex === 0 ? (
                                    <CheckBox
                                      index={index}
                                      onPress={onClickCheckBox}
                                      cellData={rowData?.RCV_AMT}
                                    />
                                  ) : cellIndex === 4 ? (
                                    <EditableInput
                                      cellData={rowData?.RCV_AMT}
                                      onChange={editPayAmount}
                                      index={index}
                                    />
                                  ) : (
                                    cellData
                                  )
                                }
                                flex={cellIndex === 0 ? 1 : 2}
                                textStyle={styles.text}
                              />
                            );
                          })}
                        </TableWrapper>
                      ) : (
                        <TableWrapper
                          key={index}
                          style={styles.row}></TableWrapper>
                      );
                    })}
                    {/* {orderState.map((item, index) => (
                      <Row
                        key={`item-${index}`}
                        data={[
                          `${item.ITEM_NM} - ${item.LORY_NO}`,
                          item.QTY,
                          item.RATE,
                        ]}
                        // style={styles.text}
                        textStyle={styles.text}
                      />
                    ))} */}
                  </Table>
                )}
              </View>
            </ScrollView>
            <View style={styles.bottomButtonContainer}>
              <PrimaryButton
                onPress={() => {
                  addBillPayment();
                }}
                btnText={'Add Payment of ₹' + totalPay()}
                style={{marginTop: 10}}
                disabled={!totalPay() || disableButton}
              />
            </View>
          </View>
        ) : null}
      </View>

      {/* <AlertModal
          visible={false}
          heading={'label.no_species_found'}
          message={'label.at_least_one_species'}
          primaryBtnText={'label.ok'}
          onPressPrimaryBtn={() => console.log('Clicked')}
        /> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
  headerText: {
    margin: 6,
    fontWeight: '600',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemHeader: {
    flex: 1,
    flexDirection: 'row',
    // fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_20,
    lineHeight: Typography.LINE_HEIGHT_24,
    color: Colors.TEXT_COLOR,
    fontWeight: '500',
    alignSelf: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    fontSize: Typography.FONT_SIZE_20,
    lineHeight: Typography.LINE_HEIGHT_24,
    color: Colors.TEXT_COLOR,
    fontWeight: '400',
    alignSelf: 'center',
  },
  row: {flexDirection: 'row', display: 'flex', flex: 1},
  editButton: {
    // backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    fontSize: Typography.FONT_SIZE_20,
    fontWeight: '400',
  },
  deleteButton: {
    // backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    fontSize: Typography.FONT_SIZE_20,
    fontWeight: '400',
  },
  cont: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  markerContainer: {
    width: 30,
    height: 43,
    paddingBottom: 85,
  },
  screenMargin: {
    marginHorizontal: 25,
  },
  plantSpeciesText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_20,
    lineHeight: Typography.LINE_HEIGHT_24,
    color: Colors.TEXT_COLOR,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
  },
  detailText: {
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.TEXT_COLOR,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  mapContainer: {
    backgroundColor: Colors.WHITE,
    height: 380,
    marginVertical: 25,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  fixNeededContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E86F5620',
    marginVertical: 24,
  },
  fixNeededText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
    color: 'red',
  },
});
export default BillsPayment;
