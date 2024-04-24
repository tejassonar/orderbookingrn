import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Header from '../Common/Header';
import {Colors, Typography} from '../../styles';
import OutlinedInput from '../Common/OutlinedInput';
import {SvgXml} from 'react-native-svg';
import {noOrder} from '../../assets/noOrder';
import moment from 'moment';
import {getAuthenticatedRequest} from '../../utils/api';
import DropDown from '../Common/DropDown';
import {formatDate} from '../../utils/formatDate';
import SearchInput from '../Common/SearchInput';
import CollectionCard from './CollectionCard';
import DateTimePicker from '../Common/DateTimePicker';

const AllCollection = ({navigation}: any) => {
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showDate, setShowDate] = useState(false);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [payments, setPayments] = useState();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchedParties, setSearchedParties] = useState<any>([]);
  // const [searchValue, setSearchValue] = useState<string>('');
  const searchInputRef = useRef<any>();

  useEffect(() => {
    getOrders();
  }, [date, paymentMethod]);

  const getOrders = useCallback(
    async (partyCode?: string) => {
      console.log(partyCode, date, paymentMethod, 'partyCode');

      const response = await getAuthenticatedRequest(
        `/payments?date=${date}&payment_method=${paymentMethod}&partyCode=${
          partyCode ?? ''
        }`,
      );
      setPayments(response.data[0]);
    },
    [date, paymentMethod],
  );

  const searchParties = useCallback(async (searchQuery: string) => {
    try {
      const parties: any = await getAuthenticatedRequest(
        `/parties/search/?name=${searchQuery}&limit=5`,
      );
      // let partyNames;

      if (parties.data.length > 0) {
        const partyNames = parties.data.map((party: any) => {
          return {name: party.PARTY_NM, id: party.PARTY_CD};
        });
        return partyNames;
      }
    } catch (err) {
      console.log(err, '==Error==');
    }
  }, []);

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

  const SelectOptionFunc = useCallback((id: string) => {
    getOrders(id);
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.cont}>
          <View
            // nestedScrollEnabled
            // showsVerticalScrollIndicator={false}
            // keyboardShouldPersistTaps={'always'}
            style={{flex: 1, display: 'flex'}}>
            <Header
              headingText={'All Collection'}
              subHeadingText={'All the collection saved by you '}
              onBackPress={() => {
                navigation.goBack();
              }}
            />
            <View style={{flex: 1}}>
              <FlatList
                data={payments?.PAYMENTS}
                renderItem={payment => (
                  <View style={{zIndex: -100}}>
                    <CollectionCard payment={payment?.item} />
                  </View>
                )}
                keyExtractor={payment => payment?._id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponentStyle={{zIndex: 100}}
                removeClippedSubviews={false}
                keyboardShouldPersistTaps="always"
                ListEmptyComponent={() => (
                  <View style={styles.svgContainer}>
                    <SvgXml xml={noOrder} height={'250px'} width={'250px'} />
                    <Text style={styles.svgText}>No Collection Found</Text>
                    <Text style={styles.svgSubText}>
                      Looks like there aren't any collection for this day
                    </Text>
                  </View>
                )}
                ListHeaderComponent={() => (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
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
                        />
                      </TouchableOpacity>
                      <DropDown
                        label={'Payment Method'}
                        options={PaymentMethodOptions}
                        onChange={(type: any) => setPaymentMethod(type.key)}
                        defaultValue={PaymentMethodOptions[0]}
                        editable={true}
                        containerStyle={{marginVertical: 10, width: '48%'}}
                      />
                    </View>
                    {true ? (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            onPressIn={() => {
                              setShowFromDate(true);
                            }}
                            style={{marginVertical: 10, width: '48%'}}>
                            <OutlinedInput
                              // value={date?.UTC()}
                              value={
                                startDate
                                  ? moment(startDate)
                                      .tz('Asia/Kolkata')
                                      .format('ll')
                                  : ''
                              }
                              onChangeText={(text: string) =>
                                setStartDate(text)
                              }
                              label={'Start Date'}
                              editable={false}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPressIn={() => {
                              setShowToDate(true);
                            }}
                            style={{marginVertical: 10, width: '48%'}}>
                            <OutlinedInput
                              // value={date?.UTC()}
                              value={
                                endDate
                                  ? moment(endDate)
                                      .tz('Asia/Kolkata')
                                      .format('ll')
                                  : ''
                              }
                              onChangeText={(text: string) => setEndDate(text)}
                              label={'End Date'}
                              editable={false}
                            />
                          </TouchableOpacity>
                        </View>
                        <SearchInput
                          label={'Party Name'}
                          style={{marginVertical: 10, zIndex: 1}}
                          searchFunction={searchParties}
                          SelectOptionFunc={SelectOptionFunc}
                          ref={searchInputRef}
                          // value={searchValue}
                          // setValue={setSearchValue}
                          // options={searchedParties}
                          // onFocusFunction={() => setElevation(100)}
                        />
                      </>
                    ) : (
                      []
                    )}
                    <TouchableOpacity
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        paddingRight: 10,
                      }}
                      onPress={() => setShowFilters(!showFilters)}>
                      <Text
                        style={{
                          color: Colors.PRIMARY,
                          fontWeight: Typography.FONT_WEIGHT_BOLD,
                        }}>
                        {showFilters ? 'Less Filters' : 'More Filters'}
                      </Text>
                    </TouchableOpacity>
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
                          Total Collection: ₹
                          {payments.TOTAL_PAYMENT_TYPE_RCV_AMT}
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
                  </View>
                )}
              />
            </View>
            <DateTimePicker
              date={date}
              setDate={setDate}
              showDate={showDate}
              setShowDate={setShowDate}
              key={'date'}
              id={'date'}
            />
            <DateTimePicker
              date={startDate}
              setDate={setStartDate}
              showDate={showFromDate}
              setShowDate={setShowFromDate}
              key={'fromDate'}
              id={'fromDate'}
            />
            <DateTimePicker
              date={endDate}
              setDate={setEndDate}
              showDate={showToDate}
              setShowDate={setShowToDate}
              key={'toDate'}
              id={'toDate'}
            />
          </View>
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
export default memo(AllCollection);
