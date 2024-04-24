import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Colors, Typography} from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getAuthenticatedRequest, getRequest} from '../../utils/api';
import Header from '../Common/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import useDebounce from '../../hooks/useDebounce';
import PrimaryButton from '../Common/PrimaryButton';
import {OrderDetailsContext} from '../../reducers/orderDetails';
import AlertModal from '../Common/AlertModal';
import {OrderContext} from '../../reducers/order';
import {UserContext} from '../../reducers/user';

const Search = ({navigation}: any) => {
  const [searchText, setSearchText] = useState('');
  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [showSearchItems, setShowSearchItems] = useState(false);
  const [noItemModal, setNoItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const {state: orderDetailsState, dispatch} = useContext(OrderDetailsContext);
  const {state: orderState, dispatch: orderDispatch} = useContext(OrderContext);
  const {state: userState} = useContext(UserContext);

  const debouncedSearch = useDebounce(searchText, 700);

  useEffect(() => {
    console.log(orderDetailsState, 'orderDetailsState');
    getAllItems();
  }, []);

  useEffect(() => {
    if (searchText) {
      setShowSearchItems(true);
      getSearchedItems();
    } else {
      setShowSearchItems(false);
    }
  }, [debouncedSearch]);

  const getSearchedItems = async () => {
    const searchedItems = await getAuthenticatedRequest(
      `/items/search/?name=${searchText}`,
    );
    setSearchList(searchedItems.data);
  };

  const getAllItems = async () => {
    const items = await getAuthenticatedRequest('/items');
    setList(items.data);
    setShowSearchItems(false);
  };

  const renderListHeader = React.useMemo(() => {
    return (
      <>
        <Header
          closeIcon
          headingText={'Select Item'}
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
              placeholder={'Search Item'}
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
          {showSearchItems && searchText.length < 3 ? (
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

  const onPressContinue = () => {
    if (selectedItem.LORY_CD) {
      navigation.navigate('ItemDetails', {
        brandCode: selectedItem.LORY_CD,
        itemNumber: selectedItem.LORY_NO,
        itemName: selectedItem.ITEM_NM,
        itemRate: selectedItem.RATE,
        itemCode: selectedItem.ITEM_CD,
      });
    } else {
      setNoItemModal(true);
    }
  };
  console.log(orderState.length, 'orderState.length');

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <DismissKeyBoard> */}
      <FlatList
        style={{flex: 1}}
        data={showSearchItems ? searchList : list}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => {
          return index;
        }}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={{}}
        renderItem={(props: any) => {
          return (
            <View style={[styles.container, {marginTop: 5}]}>
              {showSearchItems &&
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
                      props.item.LORY_CD === selectedItem?.LORY_CD ? 2 : 1,
                    borderColor:
                      props.item.LORY_CD === selectedItem?.LORY_CD
                        ? Colors.PRIMARY
                        : '#dedede',
                    borderRadius: 10,
                    backgroundColor: Colors.WHITE,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setSelectedItem(props.item);
                  }}>
                  <Text
                    style={{
                      flex: 3,
                      fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                      fontSize: Typography.FONT_SIZE_14,
                      color: Colors.TEXT_COLOR,
                    }}>
                    {props.item.ITEM_NM} - {props.item.LORY_NO}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                      fontSize: Typography.FONT_SIZE_14,
                      color: Colors.TEXT_COLOR,
                      paddingRight: 10,
                    }}>
                    QTY {props.item.BALQTY}
                  </Text>
                </TouchableOpacity>
              ) : // memoizedRenderSearchSpecieCard(props)
              !showSearchItems ? (
                <TouchableOpacity
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    marginTop: 4,
                    borderBottomWidth: 1,
                    borderWidth:
                      props.item.LORY_CD === selectedItem?.LORY_CD ? 2 : 1,
                    borderColor:
                      props.item.LORY_CD === selectedItem?.LORY_CD
                        ? Colors.PRIMARY
                        : '#dedede',
                    borderRadius: 10,
                    backgroundColor: Colors.WHITE,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 24,
                  }}
                  onPress={() => {
                    setSelectedItem(props.item);
                  }}>
                  <Text
                    style={{
                      flex: 3,
                      fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                      fontSize: Typography.FONT_SIZE_14,
                      color: Colors.TEXT_COLOR,
                    }}>
                    {props.item.ITEM_NM} {props.item.LORY_NO ? '-' : ''}
                    {props.item.LORY_NO} {props.item.PKG ? '-' : ' '}{' '}
                    {`${props.item.PKG} PKG`}
                  </Text>
                  {!userState.BROKER ? (
                    <Text
                      style={{
                        fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                        fontSize: Typography.FONT_SIZE_14,
                        color: Colors.TEXT_COLOR,
                        paddingRight: 10,
                      }}>
                      QTY {props.item.BALQTY}
                    </Text>
                  ) : (
                    []
                  )}
                </TouchableOpacity>
              ) : (
                // renderSpecieCard(props)
                <></>
              )}
            </View>
          );
        }}
      />
      {orderState.length ? (
        <View style={styles.floatingButton}>
          <Text
            style={{
              fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
              fontSize: Typography.FONT_SIZE_16,
              color: Colors.TEXT_COLOR,
            }}>
            {orderState.length} Items added
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate('OrderReview');
            }}>
            <Text style={styles.viewOrder}>View Order</Text>
          </Pressable>
        </View>
      ) : (
        []
      )}
      <PrimaryButton
        btnText="Continue"
        onPress={onPressContinue}
        disabled={selectedItem ? false : true}
      />
      <AlertModal
        visible={noItemModal}
        heading={'No Item selected'}
        message={`Please select an Item to continue`}
        primaryBtnText={'Sure'}
        onPressPrimaryBtn={() => {
          setNoItemModal(false);
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
    height: 48,
    borderRadius: 5,
    marginTop: 24,
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
  viewOrder: {
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
    fontSize: Typography.FONT_SIZE_16,
    padding: 10,
    borderRadius: 5,
    left: 10,
  },
  floatingButton: {
    backgroundColor: 'white',
    width: '100%',
    height: 60,
    marginBottom: 15,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
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
    color: Colors.BLACK,
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
