import {
  ADD_ITEM_TO_ORDER,
  EMPTY_ORDER_STORE,
  REMOVE_ITEM_FROM_ORDER,
  ADD_BULK_ITEMS_TO_ORDER,
  EDIT_ITEM_IN_ORDER,
} from './types';

export const addItemToOrder =
  (itemData: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: ADD_ITEM_TO_ORDER,
      payload: itemData,
    });
  };

export const addBulkItemsToOrder =
  (itemData: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: ADD_BULK_ITEMS_TO_ORDER,
      payload: itemData,
    });
  };
export const editItemInOrder =
  (itemData: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: EDIT_ITEM_IN_ORDER,
      payload: itemData,
    });
  };

export const removeItemFromOrder =
  (deleteItemId: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: REMOVE_ITEM_FROM_ORDER,
      payload: {deleteItemId},
    });
  };

export const emptyOrderStore = () => (dispatch: React.Dispatch<any>) => {
  dispatch({
    type: EMPTY_ORDER_STORE,
  });
};
