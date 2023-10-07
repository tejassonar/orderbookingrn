import React from 'react';
// import {DataContextProvider} from './data';
import {UserContextProvider} from './user';
import {OrderContextProvider} from './order';
import {OrderDetailsContextProvider} from './orderDetails';
import {BillPaymentContextProvider} from './billPayments';

export default function Provider({children}: {children: any}) {
  return (
    // <DataContextProvider>

    <UserContextProvider>
      <OrderDetailsContextProvider>
        <OrderContextProvider>
          <BillPaymentContextProvider>{children}</BillPaymentContextProvider>
        </OrderContextProvider>
      </OrderDetailsContextProvider>
    </UserContextProvider>
    // </DataContextProvider>
  );
}
