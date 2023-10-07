import React, {createContext, useEffect, useReducer} from 'react';
import {
  ADD_ITEM_TO_ORDER,
  REMOVE_ITEM_FROM_ORDER,
  EMPTY_ORDER_STORE,
  ADD_BULK_ITEMS_TO_ORDER,
  EDIT_ITEM_IN_ORDER,
} from '../actions/types';

interface OrderInterface {
  USER_ID: String;
  ORD_DT: Date;
  ORD_NO: Number;
  PARTY_CD: String;
  PARTY_NM: String;
  LORY_CD: String;
  LORY_NO: String;
  ITEM_NM: String;
  QTY: Number;
  RATE: Number;
  BRAND_CD?: String;
  REMARK?: String;
}

// stores the initial properties of the species state
const initialState: OrderInterface[] = [];

// Species reducer function which takes the state and action param
const OrderReducer = (state = initialState, action) => {
  // used to switch between the action types
  switch (action.type) {
    // updates the specie data
    case ADD_ITEM_TO_ORDER:
      return [...state, action.payload];

    // const order = state.push(action.payload);
    // console.log(order, 'orderrrrrr', action.payload);

    case ADD_BULK_ITEMS_TO_ORDER:
      return [...action.payload];
    // return order;
    // clears the specie from the state

    case EDIT_ITEM_IN_ORDER: {
      const newState = [...state];
      newState[action.payload.index] = {
        ...newState[action.payload.index],
        ...action.payload.data,
      };
      return newState;
    }

    // clears the specie from the state
    case REMOVE_ITEM_FROM_ORDER:
      // const newState = [...state];
      const newState = state.filter(
        order => order.orderItemId !== action.payload.deleteItemId,
      );

      return newState;

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

  useEffect(() => {
    console.log(state, '==state==');
  }, [state]);

  // returns a provider used by component to access the state and dispatch function of species
  return (
    <OrderContext.Provider value={{state, dispatch}}>
      {children}
    </OrderContext.Provider>
  );
};
