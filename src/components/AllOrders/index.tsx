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

const AllOrders = ({navigation}: any) => {
  const [orders, setOrders] = useState([]);
  const {state: orderDetailsState, dispatch: orderDetailsDispatch} =
    useContext(OrderDetailsContext);
  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);

  useEffect(() => {
    async function getOrders() {
      const response = await getAuthenticatedRequest('/orders');
      setOrders(response.data);
    }
    getOrders();
  }, []);

  console.log(orders, 'orders');

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.cont}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}>
            <Header
              //   closeIcon
              headingText={'All Orders'}
              subHeadingText={'All the orders saved by you today'}
              onBackPress={() => {
                navigation.goBack();
              }}
              //   onPressFunction={() => console.log('Pressed')}
            />
            {orders.length > 0
              ? orders.map((order, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.TEXT_COLOR,
                        minHeight: 80,
                      }}
                      onPress={async () => {
                        addBulkItemsToOrder(order.ITEMS)(orderDispatch);
                        const {ITEMS, ...orderDetails} = order;
                        addOrderDetails(orderDetails)(orderDetailsDispatch);
                        navigation.navigate('OrderReview', {savedOrder: true});
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
                  );
                })
              : []}
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
});
export default AllOrders;
