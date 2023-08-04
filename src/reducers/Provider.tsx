import React from 'react';
// import {DataContextProvider} from './data';
import {UserContextProvider} from './user';
import {OrderContextProvider} from './order';
import {OrderDetailsContextProvider} from './orderDetails';

export default function Provider({children}: {children: any}) {
  return (
    // <DataContextProvider>

    <UserContextProvider>
      <OrderDetailsContextProvider>
        <OrderContextProvider>{children}</OrderContextProvider>
      </OrderDetailsContextProvider>
    </UserContextProvider>
    // </DataContextProvider>
  );
}
