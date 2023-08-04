import React, {createContext, useReducer} from 'react';
import {
  ADD_ITEM_TO_ORDER,
  REMOVE_ITEM_FROM_ORDER,
  EMPTY_ORDER_STORE,
  ADD_BULK_ITEMS_TO_ORDER,
} from '../actions/types';

interface OrderInterface {
  USER_ID: String;
  ORD_DT: Date;
  ORD_NO: Number;
  PARTY_CD: String;
  PARTY_NM: String;
  LORY_CD: String;
  LORY_NO: String;
  QTY: Number;
  RATE: Number;
  BRAND_CD?: String;
  REMARK?: String;
}

// stores the initial properties of the species state
const initialState: OrderInterface[] = [];

// Species reducer function which takes the state and action param
const OrderReducer = (state = initialState, action) => {
  console.log(state, 'state');
  // used to switch between the action types
  switch (action.type) {
    // updates the specie data
    case ADD_ITEM_TO_ORDER:
      return [...state, action.payload];

    // const order = state.push(action.payload);
    // console.log(order, 'orderrrrrr', action.payload);

    case ADD_BULK_ITEMS_TO_ORDER:
      console.log(action.payload, 'action.payload');

      return [...action.payload];
    // return order;
    // clears the specie from the state
    case REMOVE_ITEM_FROM_ORDER:
      return {
        ...state,
        specie: null,
      };

    case EMPTY_ORDER_STORE:
      return initialState;

    // returns the state as is if no type is found
    default:
      return state;
  }
};

// Creates the context object for Species. Used by component to get the state and dispatch function of species
export const OrderContext = createContext({
  state: initialState,
  dispatch: () => null,
});

// Create a provider for components to consume and subscribe to changes
export const OrderContextProvider = ({children}) => {
  // stores state and dispatch of species using the reducer and initialState
  const [state, dispatch] = useReducer(OrderReducer, initialState);

  // returns a provider used by component to access the state and dispatch function of species
  return (
    <OrderContext.Provider value={{state, dispatch}}>
      {children}
    </OrderContext.Provider>
  );
};
