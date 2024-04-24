import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Cell, Row, Table, TableWrapper} from 'react-native-table-component';
import {Colors, Typography} from '../../styles';
import {formatDate} from '../../utils/formatDate';
import SharePDFReport from './SharePDFReport';

const CollectionCard = ({payment}: any) => {
  return (
    <View style={{marginTop: 20}}>
      {payment.BILLS && (
        <View style={styles.cardContainer}>
          <SharePDFReport
            PARTY_NM={payment.PARTY_NM}
            PARTY_CD={payment.PARTY_CD}
            BILL_DT={formatDate(payment.BILL_DT)}
            PAYMENT_TYPE={
              payment.PAYMENT_TYPE.charAt(0).toUpperCase() +
              payment.PAYMENT_TYPE.slice(1)
            }
            TOTAL={payment.TOTAL}
            BILLS={payment.BILLS}
            TRANSACTION_NO={payment.TRANSACTION_NO}
            CHQ_DT={formatDate(payment.CHQ_DT)}
          />
          <Text style={styles.title}>{payment.PARTY_NM}</Text>
          <Text style={styles.cardText}>Party Code: {payment.PARTY_CD}</Text>
          <Text style={styles.cardText}>Total Amount: ₹{payment.TOTAL}</Text>
          <Text style={styles.cardText}>
            Payment Method:{' '}
            {payment.PAYMENT_TYPE.charAt(0).toUpperCase() +
              payment.PAYMENT_TYPE.slice(1)}
          </Text>
          <Text style={styles.cardText}>
            Date: {formatDate(payment.BILL_DT)}
          </Text>
          <Table
            borderStyle={{
              borderWidth: 2,
              borderColor: '#c8e1ff',
            }}>
            <Row
              data={['Doc No.', 'Doc Date', 'Pending (Total)', 'Received']}
              flexArr={[2, 2, 2, 2, 2]}
              style={styles.head}
              textStyle={styles.headerText}
            />
            {payment.BILLS.map((rowData, index) => {
              const itemData = [
                `${rowData.DOC_NO}`,
                formatDate(rowData.DOC_DT),
                `${rowData.PND_AMT} (${rowData.BIL_AMT})`,
                `${rowData.RCV_AMT}`,
              ];
              return (
                <TableWrapper key={index} style={styles.row}>
                  {itemData.map((cellData, cellIndex) => {
                    return (
                      <Cell
                        key={`${cellIndex}-${cellData}`}
                        data={cellData}
                        flex={2}
                        textStyle={styles.text}
                      />
                    );
                  })}
                </TableWrapper>
              );
            })}
          </Table>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  head: {
    height: 60,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
  },
  cardText: {
    fontSize: Typography.FONT_SIZE_14,
    color: Colors.TEXT_COLOR,
    marginBottom: 6,
  },
  title: {
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerText: {
    margin: 6,
    fontWeight: '600',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
  },
  row: {flexDirection: 'row', display: 'flex', flex: 1},
});

export default CollectionCard;
