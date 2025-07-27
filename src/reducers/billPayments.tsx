import React, {createContext, useEffect, useReducer} from 'react';
import {
  INITIATE_BILL_PAYMENT,
  ADD_BILLS,
  EMPTY_BILL_PAYMENT_STORE,
  ADD_PAYMENT_DETAILS,
} from '../actions/types';

interface BillPaymentInterface {
  BILL_DT: Date;
  BILL_NO: string;
  PARTY_CD: string;
  PARTY_NM: string;
  REMARK?: string;
  BILLS?: [
    {
      DOC_NO: string;
      DOC_DT: Date;
      BIL_AMT: number;
      PND_AMT: number;
      RCV_AMT?: number;
    },
  ];
  CLIENT_CD: string;
  COMP_CD: string;
  AGENT_CD: string;
  TRANSACTION_NO?: string;
  CHQ_DT?: Date;
  TOTAL?: number;
  PAYMENT_TYPE?: string;
}

// stores the initial properties of the species state
const initialState: BillPaymentInterface | {} = {};

// Species reducer function which takes the state and action param
const BillPaymentReducer = (state = initialState, action: any) => {
  // used to switch between the action types
  switch (action.type) {
    case INITIATE_BILL_PAYMENT:
      return action.payload;

    case ADD_BILLS:
      //   const newState = [...state];
      //   newState.BILLS.push(action.payload);
      return {...state, ...action.payload};

    case ADD_PAYMENT_DETAILS:
      return {
        ...state,
        ...action.payload,
      };

    case EMPTY_BILL_PAYMENT_STORE:
      return initialState;
    // return [..state, BILLS: action.payload];
    // returns the state as is if no type is found
    default:
      return state;
  }
};

// Creates the context object for Species. Used by component to get the state and dispatch function of species
export const BillPaymentContext = createContext({
  state: initialState,
  dispatch: () => null,
});

// Create a provider for components to consume and subscribe to changes
export const BillPaymentContextProvider = ({children}) => {
  // stores state and dispatch of species using the reducer and initialState
  const [state, dispatch] = useReducer(BillPaymentReducer, initialState);

  // returns a provider used by component to access the state and dispatch function of species
  return (
    <BillPaymentContext.Provider value={{state, dispatch}}>
      {children}
    </BillPaymentContext.Provider>
  );
};
