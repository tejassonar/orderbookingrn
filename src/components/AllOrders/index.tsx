import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../Common/Header';
import {Colors, Typography} from '../../styles';
import {getAuthenticatedRequest, getRequest} from '../../utils/api';
import {OrderDetailsContext} from '../../reducers/orderDetails';
import {OrderContext} from '../../reducers/order';
import {addOrderDetails} from '../../actions/orderDetails';
import {addBulkItemsToOrder} from '../../actions/order';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import OutlinedInput from '../Common/OutlinedInput';
import {SvgXml} from 'react-native-svg';
import {noOrder} from '../../assets/noOrder';
import OrderCard from './OrderCard';

const AllOrders = ({navigation}: any) => {
  const [orders, setOrders] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [listView, setListView] = useState(true);
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);
  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    getOrders();
  }, [date]);

  async function getOrders() {
    const response = await getAuthenticatedRequest(`/orders?date=${date}`);
    setOrders(response.data);
  }

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
              headingText={'All Orders'}
              subHeadingText={'All the orders saved by you '}
              onBackPress={() => {
                navigation.goBack();
              }}
              TopRightComponent={() => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setListView(prev => !prev);
                    }}
                    style={{
                      padding: 10,
                      top: 90,
                      right: 10,
                      zIndex: 1,
                    }}>
                    <Text
                      style={{
                        color: Colors.PRIMARY,
                        fontFamily: Typography.FONT_FAMILY_BOLD,
                        fontWeight: Typography.FONT_WEIGHT_BOLD,
                        fontSize: Typography.FONT_SIZE_16,
                      }}>
                      Change View
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPressIn={() => {
                  setShowDate(true);
                }}
                style={{marginVertical: 10}}>
                <OutlinedInput
                  value={date?.toDateString()}
                  onChangeText={(text: string) => setDate(text)}
                  label={'Date'}
                  editable={false}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {}}
                />
              </TouchableOpacity>

              {orders.length > 0 ? (
                orders.map((order, index) =>
                  listView ? (
                    <TouchableOpacity
                      key={index}
                      style={{
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.TEXT_COLOR,
                        minHeight: 80,
                        zIndex: 1,
                      }}
                      onPress={async () => {
                        addBulkItemsToOrder(order.ITEMS)(orderDispatch);
                        const {ITEMS, ...orderDetails} = order;
                        addOrderDetails(orderDetails)(orderDetailsDispatch);
                        navigation.navigate('OrderReview', {
                          savedOrder: true,
                        });
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flex: 1,
                        }}>
                        <Text style={styles.partyCode}>{order.PARTY_CD}</Text>
                        <View style={{flex: 3}}>
                          <Text style={styles.item}>{order.PARTY_NM}</Text>
                          <Text style={styles.subText}>
                            {order.ADD1} {order.PLACE}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <OrderCard data={order} key={index} />
                  ),
                )
              ) : (
                <View
                  style={{
                    display: 'flex',
                    flex: 1,
                    height: '100%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <SvgXml xml={noOrder} height={'250px'} width={'250px'} />
                  <Text
                    style={{
                      fontFamily: Typography.FONT_FAMILY_EXTRA_BOLD,
                      fontSize: Typography.FONT_SIZE_27,
                      color: Colors.TEXT_COLOR,
                      textAlign: 'center',
                    }}>
                    No Orders Found
                  </Text>
                  <Text
                    style={{
                      fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                      fontSize: Typography.FONT_SIZE_18,
                      lineHeight: Typography.LINE_HEIGHT_24,
                      color: Colors.TEXT_COLOR,
                      textAlign: 'center',
                    }}>
                    Looks like there aren't any orders for this day
                  </Text>
                </View>
              )}
            </View>
            {
              <DateTimePickerModal
                headerTextIOS={`i18next.t(
                  'label.inventory_overview_pick_a_date',
                )`}
                cancelTextIOS={`i18next.t('label.inventory_overview_cancel')`}
                confirmTextIOS={`i18next.t('label.inventory_overview_confirm')`}
                isVisible={showDate}
                maximumDate={
                  new Date(new Date().setDate(new Date().getDate() + 1))
                }
                minimumDate={new Date(2006, 0, 1)}
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                date={new Date()}
                mode={'date'}
                is24Hour={true}
                display="default"
                onConfirm={date => {
                  console.log(date, '===');

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
    flex: 3,
    flexDirection: 'row',
    fontSize: Typography.FONT_SIZE_20,
    lineHeight: Typography.LINE_HEIGHT_24,
    color: Colors.TEXT_COLOR,
    fontWeight: '400',
    alignSelf: 'flex-start',
  },
  subText: {
    flex: 3,
    flexDirection: 'row',
    fontSize: Typography.FONT_SIZE_14,
    lineHeight: Typography.LINE_HEIGHT_24,
    color: Colors.TEXT_COLOR,
    fontWeight: '400',
    alignSelf: 'flex-start',
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
  markerText: {
    width: 30,
    height: 43,
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 4,
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
  partyCode: {
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.TEXT_COLOR,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    display: 'flex',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
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
  dropDown: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
  },
  textStyle: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
    color: Colors.TEXT_COLOR,
  },
  dropDownContainerStyle: {
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
  },
  listItemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    // backgroundColor: 'blue',
    height: 'auto',
  },
  listItemLabel: {
    flex: 1,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  itemSeparator: {
    backgroundColor: Colors.GRAY_LIGHT,
    height: 1,
    marginHorizontal: 8,
  },
});
export default AllOrders;
