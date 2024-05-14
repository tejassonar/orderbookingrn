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
import CollectionHeader from './CollectionHeader';

const AllCollection = ({navigation}: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showDate, setShowDate] = useState(false);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [payments, setPayments] = useState();
  const [paymentMethod, setPaymentMethod] = useState('');
  // const [searchedParties, setSearchedParties] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const searchInputRef = useRef<any>();

  useEffect(() => {
    getOrders();
  }, [date, paymentMethod, searchValue, startDate, endDate]);

  const getOrders = useCallback(
    async (partyCode?: string) => {
      let filters = `payment_method=${paymentMethod}`;
      if (date) {
        filters = filters + `&date=${date}`;
      }
      if (startDate && endDate) {
        filters = filters + `&from=${startDate}&to=${endDate}`;
      }
      if (searchValue) {
        filters = filters + `&partyCode=${searchValue}`;
      }

      const response = await getAuthenticatedRequest(`/payments?${filters}`);

      setPayments(response.data[0]);
    },
    [date, paymentMethod, searchValue, startDate, endDate],
  );

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
                ListHeaderComponent={
                  <CollectionHeader
                    date={date}
                    startDate={startDate}
                    endDate={endDate}
                    setShowDate={setShowDate}
                    setShowFromDate={setShowFromDate}
                    setShowToDate={setShowToDate}
                    setPaymentMethod={setPaymentMethod}
                    setSearchValue={setSearchValue}
                    paymentMethod={paymentMethod}
                    totalCollection={payments?.TOTAL_PAYMENT_TYPE_RCV_AMT}
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
