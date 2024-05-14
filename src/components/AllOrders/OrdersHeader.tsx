import moment from 'moment';
import React, {memo, useCallback, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Colors, Typography} from '../../styles';
import {getAuthenticatedRequest} from '../../utils/api';
import DropDown from '../Common/DropDown';
import OutlinedInput from '../Common/OutlinedInput';
import SearchInput from '../Common/SearchInput';

const OrdersHeader = ({
  date,
  startDate,
  endDate,
  setShowDate,
  setShowFromDate,
  setShowToDate,
  setSearchValue,
}: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<any>();

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
          style={{marginVertical: 10, width: '98%'}}>
          <OutlinedInput
            // value={date?.UTC()}
            value={date ? moment(date).tz('Asia/Kolkata').format('ll') : ''}
            label={'Date'}
            editable={false}
          />
        </TouchableOpacity>
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
    </View>
  );
};

export default memo(OrdersHeader);
