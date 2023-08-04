import {SET_USER_DETAILS} from './types';

export const setUserDetails =
  (userDetails: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: SET_USER_DETAILS,
      payload: userDetails,
    });
  };

export const updateUserDetails =
  (userDetails: any) => (dispatch: React.Dispatch<any>) => {
    dispatch({
      type: SET_USER_DETAILS,
      payload: userDetails,
    });
  };
