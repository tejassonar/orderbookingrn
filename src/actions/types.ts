// used when user is successfully logged in into the app this type is used to add tokens and set user as logged in
export const SET_INITIAL_USER_STATE = 'SET_INITIAL_USER_STATE';

// Type to set user details in user state of app. Used when the app starts and when there is no user data available in DB.
export const SET_USER_DETAILS = 'SET_USER_DETAILS';

// Type to reset the user state to initialState. Used when user is logged out or no user data is present
export const CLEAR_USER_DETAILS = 'CLEAR_USER_DETAILS';

export const ADD_ITEM_TO_ORDER = 'ADD_ITEM_TO_ORDER';
export const ADD_BULK_ITEMS_TO_ORDER = 'ADD_BULK_ITEMS_TO_ORDER';

export const REMOVE_ITEM_FROM_ORDER = 'REMOVE_ITEM_FROM_ORDER';
export const EMPTY_ORDER_STORE = 'EMPTY_ORDER_STORE';
export const ADD_ORDER_DETAILS = 'ADD_ORDER_DETAILS';
export const EMPTY_ORDER_DETAILS = 'EMPTY_ORDER_DETAILS';

export const INITIALIZE_ORDER = 'INITIALIZE_ORDER';
export const ADD_PARTY = 'ADD_PARTY';
export const ADD_REMARK = 'ADD_REMARK';
