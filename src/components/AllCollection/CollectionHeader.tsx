import moment from 'moment-timezone';
import React, {memo, useCallback, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Colors, Typography} from '../../styles';
import {getAuthenticatedRequest} from '../../utils/api';
import DropDown from '../Common/DropDown';
import OutlinedInput from '../Common/OutlinedInput';
import SearchInput from '../Common/SearchInput';

const CollectionHeader = ({
  date,
  startDate,
  endDate,
  setShowDate,
  setShowFromDate,
  setShowToDate,
  setPaymentMethod,
  setSearchValue,
  paymentMethod,
  totalCollection,
}: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<any>();

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

  return (
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
            value={date ? moment(date).tz('Asia/Kolkata').format('ll') : ''}
            // onChangeText={(text: string) => setDate(text)}
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
      {showFilters ? (
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
                    ? moment(startDate).tz('Asia/Kolkata').format('ll')
                    : ''
                }
                // onChangeText={(text: string) =>
                //   setStartDate(text)
                // }
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
                  endDate ? moment(endDate).tz('Asia/Kolkata').format('ll') : ''
                }
                // onChangeText={(text: string) => setEndDate(text)}
                label={'End Date'}
                editable={false}
              />
            </TouchableOpacity>
          </View>
          <SearchInput
            label={'Party Name'}
            style={{marginVertical: 10, zIndex: 1}}
            searchFunction={searchParties}
            SelectOptionFunc={setSearchValue}
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
      {totalCollection ? (
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
            Total Collection: ₹{totalCollection}
          </Text>
          {paymentMethod ? (
            <Text style={{color: Colors.TEXT_COLOR}}> ({paymentMethod})</Text>
          ) : (
            []
          )}
        </View>
      ) : null}
    </View>
  );
};

export default memo(CollectionHeader);
