import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  FlatList,
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
// import moment from 'moment';
import moment from 'moment-timezone';
import OrdersHeader from './OrdersHeader';
import DateTimePicker from '../Common/DateTimePicker';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

const AllOrders = ({navigation}: any) => {
  const [orders, setOrders] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [listView, setListView] = useState(true);
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);
  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  useEffect(() => {
    getOrders();
  }, [date, orderState, searchValue, startDate, endDate]);

  const getOrders = useCallback(async () => {
    let filters = ``;
    if (date) {
      filters = filters + `&date=${date}`;
    }
    if (startDate && endDate) {
      filters = filters + `&from=${startDate}&to=${endDate}`;
    }
    if (searchValue) {
      filters = filters + `&partyCode=${searchValue}`;
    }
    const response = await getAuthenticatedRequest(`/orders?${filters}`);
    setOrders(response.data);
  }, [date, searchValue, startDate, endDate]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.cont}>
          <View
            // showsVerticalScrollIndicator={false}
            // keyboardShouldPersistTaps={'always'}
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
                    <FA5Icon
                      name={listView ? 'th-large' : 'list'}
                      color={Colors.TEXT_COLOR}
                      size={20}
                    />
                  </TouchableOpacity>
                );
              }}
            />
            <View style={{flex: 1}}>
              <FlatList
                data={orders}
                renderItem={order => (
                  <View>
                    {listView ? (
                      <TouchableOpacity
                        // key={index}
                        style={{
                          paddingVertical: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: Colors.TEXT_COLOR,
                          minHeight: 80,
                          zIndex: 1,
                        }}
                        onPress={async () => {
                          addBulkItemsToOrder(order.item.ITEMS)(orderDispatch);
                          const {ITEMS, ...orderDetails} = order.item;
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
                          <Text style={styles.partyCode}>
                            {order.item.PARTY_CD}
                          </Text>
                          <View style={{flex: 3}}>
                            <Text style={styles.item}>
                              {order.item.PARTY_NM}
                            </Text>
                            <Text style={styles.subText}>
                              {order.item.ADD1} {order.item.PLACE}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      order.item && <OrderCard data={order.item} />
                    )}
                  </View>
                )}
                keyExtractor={(order, index) => order?._id || index.toString()}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                  <View style={styles.svgContainer}>
                    <SvgXml xml={noOrder} height="250px" width="250px" />
                    <Text style={styles.svgText}>No Orders Found</Text>
                    <Text style={styles.svgSubText}>
                      Looks like there aren't any orders for this day
                    </Text>
                  </View>
                )}
                ListHeaderComponent={
                  <OrdersHeader
                    date={date}
                    startDate={startDate}
                    endDate={endDate}
                    setShowDate={setShowDate}
                    setShowFromDate={setShowFromDate}
                    setShowToDate={setShowToDate}
                    setSearchValue={setSearchValue}
                  />
                }
              />
            </View>
            <DateTimePicker
              date={date}
              // setDate={setDate}
              showDate={showDate}
              setShowDate={setShowDate}
              key={'date'}
              id={'date'}
              onConfirm={(date: Date) => {
                setDate(date);
                setStartDate(undefined);
                setEndDate(undefined);
                setShowDate(false);
              }}
            />
            <DateTimePicker
              date={startDate}
              // setDate={setStartDate}
              showDate={showFromDate}
              setShowDate={setShowFromDate}
              key={'fromDate'}
              id={'fromDate'}
              onConfirm={(date: Date) => {
                setStartDate(date);
                setDate(undefined);
                setShowFromDate(false);
              }}
            />
            <DateTimePicker
              date={endDate}
              // setDate={setEndDate}
              showDate={showToDate}
              setShowDate={setShowToDate}
              key={'toDate'}
              id={'toDate'}
              onConfirm={(date: Date) => {
                setEndDate(date);
                setDate(undefined);
                setShowToDate(false);
              }}
            />
          </View>
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
export default AllOrders;
