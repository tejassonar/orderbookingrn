import {
  View,
  Text,
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
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {OrderDetailsContext} from '../../reducers/orderDetails';
import {OrderContext} from '../../reducers/order';
import {postRequest} from '../../utils/api';
import {emptyOrderStore} from '../../actions/order';
import {emptyOrderDetails} from '../../actions/orderDetails';
import {Table, Row} from 'react-native-table-component';

const OrderReview = ({navigation, route}: any) => {
  const scroll = useRef();
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);
  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);

  const [isSavedOrder, setIsSavedOrder] = useState(false);
  console.log(orderState, 'orderState', orderDetailsState);

  useEffect(() => {
    if (route?.params?.savedOrder) {
      setIsSavedOrder(route.params.savedOrder);
    }
  }, []);

  const saveOrder = async () => {
    try {
      const response = await postRequest('/orders', {orders: orderState});
      emptyOrderStore()(orderDispatch);
      emptyOrderDetails()(orderDetailsDispatch);

      navigation.navigate('MainScreen');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        {true ? (
          <View style={styles.cont}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}
              //   ref={scroll}
              //   onScroll={Animated.event(
              //     [{nativeEvent: {contentOffset: {y: scrollPosition}}}],
              //     {useNativeDriver: false},
              //   )}
            >
              <View
              // onLayout={e => {
              //   setLayoutAboveMap(e.nativeEvent.layout.height);
              // }}
              >
                <Header
                  closeIcon
                  headingText={'Order Summary'}
                  onBackPress={async () => {
                    // if (route?.params?.navigateBackToHomeScreen) {
                    //   navigation.navigate('MainScreen');
                    // } else {
                    //   navigation.navigate('TreeInventory');
                    // }
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

              {/* <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginVertical: 15,
                }}>
                <Text style={[styles.itemHeader, {flex: 2}]}>Item</Text>
                <Text style={styles.itemHeader}>Quantity</Text>
                <Text style={styles.itemHeader}>Price</Text>
              </View> */}
              {/* {orderState.map((item: any, index: number) => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginVertical: 10,
                  }}
                  key={`item-${index}`}>
                  <Text style={[styles.item, {flex: 2}]}>
                    {' '}
                    {item.ITEM_NM} - {item.LORY_NO}
                  </Text>
                  <Text style={styles.item}>{item.QTY}</Text>
                  <Text style={styles.item}>{item.RATE}</Text>
                </View>
              ))} */}

              {/* <ExportGeoJSON inventory={inventory} /> */}
              <View style={{marginTop: 20}}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                  <Row
                    data={['Item', 'Quantity', 'Price']}
                    style={styles.head}
                    textStyle={styles.headerText}
                  />
                  {orderState.map((item, index) => (
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
                  ))}
                </Table>
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

      <AlertModal
        visible={false}
        heading={'label.no_species_found'}
        message={'label.at_least_one_species'}
        primaryBtnText={'label.ok'}
        onPressPrimaryBtn={() => console.log('Clicked')}
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
