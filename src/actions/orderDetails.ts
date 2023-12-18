import {
  ADD_PARTY,
  EMPTY_ORDER_DETAILS,
  INITIALIZE_ORDER,
  ADD_ORDER_DETAILS,
  ADD_REMARK,
} from './types';

export const initializeOrder =
  (orderDetails: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: INITIALIZE_ORDER,
      payload: orderDetails,
    });
  };

export const addParty =
  ({partyCode, partyName, address, place, remark}: any) =>
  (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: ADD_PARTY,
      payload: {partyCode, partyName, address, place, remark},
    });
  };

export const addRemark =
  ({partyCode, remark}: any) =>
  (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: ADD_REMARK,
      payload: {partyCode, remark},
    });
  };

export const addOrderDetails =
  (orderDetails: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: ADD_ORDER_DETAILS,
      payload: orderDetails,
    });
  };

export const emptyOrderDetails = () => (dispatch: React.Dispatch<any>) => {
  dispatch({
    type: EMPTY_ORDER_DETAILS,
  });
};
