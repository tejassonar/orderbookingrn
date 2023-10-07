import {
  INITIATE_BILL_PAYMENT,
  ADD_BILLS,
  EMPTY_BILL_PAYMENT_STORE,
} from './types';

export const initiateBillPayment =
  (billPaymentData: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: INITIATE_BILL_PAYMENT,
      payload: billPaymentData,
    });
  };

export const addBill = (billData: any) => (dispatch: React.Dispatch<any>) => {
  dispatch({
    type: ADD_BILLS,
    payload: billData,
  });
};

export const emptyBillPaymentStore = () => (dispatch: React.Dispatch<any>) => {
  dispatch({
    type: EMPTY_BILL_PAYMENT_STORE,
  });
};
