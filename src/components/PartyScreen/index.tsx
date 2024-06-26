import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Colors, Typography} from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getAuthenticatedRequest, getRequest} from '../../utils/api';
import Header from '../Common/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import useDebounce from '../../hooks/useDebounce';
import PrimaryButton from '../Common/PrimaryButton';
import {OrderDetailsContext} from '../../reducers/orderDetails';
import {addParty} from '../../actions/orderDetails';
import AlertModal from '../Common/AlertModal';
import SimpleModal from '../Common/Modal';
import OutlinedInput from '../Common/OutlinedInput';

const Search = ({navigation, ...props}: any) => {
  const [searchText, setSearchText] = useState('');
  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [showSearchParties, setShowSearchParties] = useState(false);
  const [selectedParty, setSelectedParty] = useState({});
  const [noPartyModal, setNoPartyModal] = useState(false);
  const [showAddCashNote, setShowAddCashNote] = useState(false);
  const [note, setNote] = useState(``);
  const {state: orderDetailsState, dispatch} = useContext(OrderDetailsContext);

  const debouncedSearch = useDebounce(searchText, 700);

  useEffect(() => {
    getAllParties();
  }, []);

  useEffect(() => {
    if (searchText) {
      setShowSearchParties(true);
      getSearchedParties();
    } else {
      setShowSearchParties(false);
    }
  }, [debouncedSearch]);

  const getSearchedParties = async () => {
    const searchedParties = await getAuthenticatedRequest(
      `/parties/search/?name=${searchText}`,
    );

    setSearchList(searchedParties.data);
  };

  const getAllParties = async () => {
    try {
      const parties = await getAuthenticatedRequest('/parties');
      setList(parties.data);
    } catch (err) {
      console.log(err, 'Error');
    }

    setShowSearchParties(false);
  };

  const renderListHeader = React.useMemo(() => {
    return (
      <>
        <Header
          closeIcon
          headingText={'Select Party'}
          style={{
            // paddingLeft: 25,
            paddingRight: 25,
          }}
        />
        <View style={styles.container}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={20}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchText}
              placeholder={'Search Party'}
              onChangeText={data => setSearchText(data)}
              value={searchText}
              returnKeyType={'search'}
              autoCorrect={false}
              placeholderTextColor={Colors.GRAY_LIGHTEST}
            />
            {searchText ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                }}>
                <Ionicons name="close" size={25} style={styles.closeIcon} />
              </TouchableOpacity>
            ) : (
              []
            )}
          </View>
          {showSearchParties && searchText.length < 3 ? (
            <Text style={styles.notPresentText}>
              Search with at least 3 characters
            </Text>
          ) : (
            []
          )}
        </View>
      </>
    );
  }, [searchText]);

  const continueOrder = async ({remark}: {remark?: string}) => {
    if (selectedParty.PARTY_CD) {
      await addParty({
        partyCode: selectedParty.PARTY_CD,
        partyName: selectedParty.PARTY_NM,
        address: selectedParty.ADD1,
        place: selectedParty.PLACE,
        remark: remark ?? '',
      })(dispatch);

      navigation.navigate('ItemScreen');
    } else {
      setNoPartyModal(true);
    }
  };

  const continueBillsPayment = () => {
    if (selectedParty.PARTY_CD) {
      navigation.navigate('BillsPayment', {
        partyCode: selectedParty.PARTY_CD,
        partyName: selectedParty.PARTY_NM,
      });
    } else {
      setNoPartyModal(true);
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <DismissKeyBoard> */}
      <FlatList
        style={{flex: 1}}
        data={showSearchParties ? searchList : list}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={{}}
        renderItem={(props: any) => {
          return (
            <View style={[styles.container]}>
              {showSearchParties &&
              searchList &&
              searchList.length > 0 &&
              searchText.length > 2 ? (
                <TouchableOpacity
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    marginTop: 4,
                    borderBottomWidth: 1,
                    borderWidth:
                      props.item.PARTY_CD === selectedParty.PARTY_CD ? 2 : 1,
                    borderColor:
                      props.item.PARTY_CD === selectedParty.PARTY_CD
                        ? Colors.PRIMARY
                        : '#dedede',
                    borderRadius: 10,
                    backgroundColor: Colors.WHITE,
                  }}
                  onPress={() => {
                    setSelectedParty(props.item);
                  }}>
                  <Text
                    style={{
                      fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                      fontSize: Typography.FONT_SIZE_14,
                      color: Colors.TEXT_COLOR,
                    }}>
                    {props.item.PARTY_NM}{' '}
                    {props.item.PLACE || props.item.ADD1 ? '-' : ' '}{' '}
                    {props.item.ADD1 || ''}
                    {props.item.PLACE ? ',' : ''} {props.item.PLACE}
                  </Text>
                </TouchableOpacity>
              ) : // memoizedRenderSearchSpecieCard(props)
              !showSearchParties ? (
                <TouchableOpacity
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    marginTop: 4,
                    borderBottomWidth: 1,
                    borderWidth:
                      props.item.PARTY_CD === selectedParty.PARTY_CD ? 2 : 1,
                    borderColor:
                      props.item.PARTY_CD === selectedParty.PARTY_CD
                        ? Colors.PRIMARY
                        : '#dedede',
                    borderRadius: 10,
                    backgroundColor: Colors.WHITE,
                  }}
                  onPress={() => {
                    setSelectedParty(props.item);
                  }}>
                  <Text
                    style={{
                      fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                      fontSize: Typography.FONT_SIZE_14,
                      color: Colors.TEXT_COLOR,
                    }}>
                    {props.item.PARTY_NM}{' '}
                    {props.item.PLACE || props.item.ADD1 ? '-' : ' '}
                    {props.item.ADD1 || ''}
                    {props.item.ADD1 ? ',' : ''} {props.item.PLACE}
                  </Text>
                </TouchableOpacity>
              ) : (
                // renderSpecieCard(props)
                <></>
              )}
            </View>
          );
        }}
      />
      <PrimaryButton
        btnText="Continue"
        onPress={
          props.route.params?.isBillsPayment
            ? continueBillsPayment
            : selectedParty.PARTY_NM == 'CASH'
            ? () => {
                setShowAddCashNote(true);
              }
            : continueOrder
        }
        disabled={selectedParty ? false : true}
      />
      <SimpleModal visible={showAddCashNote} key={'cashNote'}>
        <Text
          style={{
            fontFamily: Typography.FONT_FAMILY_BOLD,
            fontSize: Typography.FONT_SIZE_20,
            lineHeight: Typography.LINE_HEIGHT_24,
            color: Colors.BLACK,
          }}>
          Add a Cash Note
        </Text>
        <OutlinedInput
          onChangeText={(text: string) => {
            setNote(text);
          }}
          style={{marginTop: 20}}
          label={'Cash Note'}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <PrimaryButton
            style={{marginTop: 20}}
            btnText="cancel"
            theme={'white'}
            halfWidth={true}
            onPress={() => {
              setShowAddCashNote(false);
            }}
          />
          <PrimaryButton
            style={{marginTop: 20}}
            btnText="Continue"
            halfWidth={true}
            onPress={() => {
              continueOrder({remark: note});
            }}
          />
        </View>
      </SimpleModal>
      <AlertModal
        visible={noPartyModal}
        heading={'No Party selected'}
        message={`Please select a Party to continue`}
        primaryBtnText={'Sure'}
        onPressPrimaryBtn={() => {
          setNoPartyModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
    // backgroundColor: 'red',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 25,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '98%',
    alignSelf: 'center',
    height: 48,
    borderRadius: 5,
    marginTop: 24,
    marginBottom: 12,
    backgroundColor: Colors.WHITE,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 6,
  },
  searchIcon: {
    color: '#949596',
    paddingLeft: 19,
  },
  searchText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
    paddingLeft: 12,
    flex: 1,
    color: Colors.BLACK,
  },
  specieListItem: {
    paddingVertical: 20,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: '#E1E0E061',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notPresentText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
    paddingVertical: 20,
    alignSelf: 'center',
    // color: Colors.PLANET_BLACK,
  },
  closeIcon: {
    justifyContent: 'flex-end',
    color: Colors.TEXT_COLOR,
    paddingRight: 20,
  },
  headerText: {
    fontFamily: Typography.FONT_FAMILY_EXTRA_BOLD,
    fontSize: Typography.FONT_SIZE_27,
    lineHeight: Typography.LINE_HEIGHT_40,
    // color: Colors.TEXT_COLOR,
    paddingTop: 10,
    paddingBottom: 15,
  },
  subHeadingText: {
    fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
    fontSize: Typography.FONT_SIZE_18,
    lineHeight: Typography.LINE_HEIGHT_24,
    // color: Colors.TEXT_COLOR,
    paddingLeft: 25,
    paddingRight: 25,
    textAlign: 'center',
  },
  listTitle: {
    paddingTop: 25,
    paddingBottom: 15,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_16,
    // color: Colors.PLANET_BLACK,
  },
});
export default Search;
