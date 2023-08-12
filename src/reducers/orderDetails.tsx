import React, {createContext, useReducer} from 'react';
import {
  ADD_ITEM_TO_ORDER,
  ADD_PARTY,
  ADD_REMARK,
  INITIALIZE_ORDER,
  REMOVE_ITEM_FROM_ORDER,
  EMPTY_ORDER_DETAILS,
  ADD_ORDER_DETAILS,
} from '../actions/types';

interface OrderDetailsInterface {
  // OrderConstants: {
  USER_ID: String;
  ORD_DT: Date;
  ORD_NO?: Number;
  PARTY_CD?: String;
  REMARK?: String;
  PARTY_NM?: String;
  COMP_CD?: String;
  CLIENT_CD?: String;
  AGENT_ID?: String;
  // };
  // OrderStatus?: String;
}

// stores the initial properties of the species state
const initialState: Array<OrderDetailsInterface> = [];

// Species reducer function which takes the state and action param
const OrderDetailsReducer = (state = initialState, action) => {
  // used to switch between the action types
  switch (action.type) {
    // updates the specie data
    case INITIALIZE_ORDER:
      return {
        ...state,
        ...action.payload,
      };
    case ADD_ORDER_DETAILS:
      return {
        ...state,
        ...action.payload,
      };
    case ADD_PARTY:
      return {
        ...state,
        PARTY_CD: action.payload.partyCode,
        PARTY_NM: action.payload.partyName,
      };
    case ADD_REMARK:
      return {
        ...state,
        REMARK: action.payload.remark,
      };

    case EMPTY_ORDER_DETAILS:
      return initialState;
    // returns the state as is if no type is found
    default:
      return state;
  }
};

// Creates the context object for Species. Used by component to get the state and dispatch function of species
export const OrderDetailsContext = createContext({
  state: initialState,
  dispatch: () => null,
});

// Create a provider for components to consume and subscribe to changes
export const OrderDetailsContextProvider = ({children}) => {
  // stores state and dispatch of species using the reducer and initialState
  const [state, dispatch] = useReducer(OrderDetailsReducer, initialState);

  // returns a provider used by component to access the state and dispatch function of species
  return (
    <OrderDetailsContext.Provider value={{state, dispatch}}>
      {children}
    </OrderDetailsContext.Provider>
  );
};
