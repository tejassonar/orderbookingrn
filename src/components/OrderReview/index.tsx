import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Header from '../Common/Header';
import {Colors, Typography} from '../../styles';
import PrimaryButton from '../Common/PrimaryButton';
import AlertModal from '../Common/AlertModal';
import Label from '../Common/Label';
import {OrderDetailsContext} from '../../reducers/orderDetails';
import {OrderContext} from '../../reducers/order';
import {deleteAuthenticatedRequest, postRequest} from '../../utils/api';
import {emptyOrderStore, removeItemFromOrder} from '../../actions/order';
import {emptyOrderDetails} from '../../actions/orderDetails';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const OrderReview = ({navigation, route}: any) => {
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);

  const [isSavedOrder, setIsSavedOrder] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);

  console.log(orderState, 'orderState', orderDetailsState);

  useEffect(() => {
    if (route?.params?.savedOrder) {
      setIsSavedOrder(route.params.savedOrder);
    }
  }, [route?.params]);

  const saveOrder = async () => {
    console.log(orderState, 'orderState');

    try {
      const response = await postRequest('/orders', {orders: orderState});
      emptyOrderStore()(orderDispatch);
      emptyOrderDetails()(orderDetailsDispatch);

      navigation.navigate('MainScreen');
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async () => {
    try {
      const response = await deleteAuthenticatedRequest(
        `/orders/${deleteItemId}`,
      );
      const res = await removeItemFromOrder(deleteItemId)(orderDispatch);
      setDeleteItemId('');
    } catch (err) {
      console.log(err);
    }
  };
  const editButton = (cellData: any, index: number) => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditItemDetails', {
              quantity: orderState[index].QTY,
              rate: orderState[index].RATE,
              orderItemId: cellData,
              index,
            });
          }}>
          <MaterialIcon name="edit" size={25} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDeleteItemId(orderState[index].orderItemId);
            setShowDeleteModal(true);
          }}>
          <MaterialIcon name="delete" size={25} color="gray" />
        </TouchableOpacity>
      </View>
    );
  };

  console.log(orderState, 'orderState');

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
                  closeIcon
                  headingText={'Order Summary'}
                  onBackPress={async () => {
                    await emptyOrderStore()(orderDispatch);
                    await emptyOrderDetails()(orderDetailsDispatch);
                    navigation.goBack();
                  }}
                  rightText={isSavedOrder ? '' : 'Delete'}
                  onPressFunction={() => console.log('Pressed')}
                />

                <Label
                  leftText={'Order Date'}
                  rightText={new Date(orderDetailsState.ORD_DT).toDateString()}
                  onPressRightText={() => console.log('Pressed')}
                  rightTextStyle={{color: Colors.TEXT_COLOR}}
                />
                <Label
                  leftText={'Party Name'}
                  rightText={orderDetailsState.PARTY_NM}
                  onPressRightText={() => console.log('Pressed')}
                  rightTextStyle={{color: Colors.TEXT_COLOR}}
                />
                <Label
                  leftText={'Address'}
                  rightText={`${orderDetailsState.ADD1} ${
                    orderDetailsState.ADD1 ? ',' : ''
                  } ${orderDetailsState.PLACE}`}
                  onPressRightText={() => console.log('Pressed')}
                  rightTextStyle={{color: Colors.TEXT_COLOR}}
                />
              </View>

              <View style={{marginTop: 20}}>
                {orderState && (
                  <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row
                      data={['Item', 'Quantity', 'Price', 'Action']}
                      style={styles.head}
                      textStyle={styles.headerText}
                    />
                    {orderState.map((rowData, index) => {
                      const itemData = [
                        `${rowData.ITEM_NM} - ${rowData.LORY_NO}`,
                        rowData.QTY,
                        rowData.RATE,
                        rowData.orderItemId,
                      ];
                      return (
                        <TableWrapper key={index} style={styles.row}>
                          {itemData.map((cellData, cellIndex) => {
                            return (
                              <Cell
                                key={`${cellIndex}-${cellData}`}
                                data={
                                  cellIndex === 3
                                    ? editButton(cellData, index)
                                    : cellData
                                }
                                textStyle={styles.text}
                              />
                            );
                          })}
                        </TableWrapper>
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
            {!isSavedOrder && (
              <View style={styles.bottomButtonContainer}>
                <PrimaryButton
                  onPress={saveOrder}
                  btnText={'Save Order'}
                  style={{marginTop: 10}}
                />
              </View>
            )}
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
      <AlertModal
        visible={showDeleteModal}
        heading={'Delete Item?'}
        message={`Are you sure you want to delete this item permanently?`}
        primaryBtnText={'No wait'}
        secondaryBtnText={'Yes, delete'}
        onPressPrimaryBtn={() => {
          setShowDeleteModal(false);
        }}
        onPressSecondaryBtn={() => {
          setShowDeleteModal(false);
          deleteOrder();
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {
    margin: 6,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
  },
  headerText: {
    margin: 6,
    fontWeight: '600',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
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
  row: {flexDirection: 'row'},
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
export default OrderReview;
