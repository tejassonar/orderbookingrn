import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Typography} from '../../styles';
import {Row, Table} from 'react-native-table-component';
import SharePDFReport from './SharePDFReport';

const OrderCard = ({data}) => {
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <SharePDFReport
        PARTY_NM={data.PARTY_NM}
        PARTY_CD={data.PARTY_CD}
        ORD_DT={formatDate(data.ORD_DT)}
        ITEMS={data.ITEMS}
        ADDRESS={data.ADD1}
        PLACE={data.PLACE}
      />
      <Text style={styles.title}>{data.PARTY_NM}</Text>
      <Text style={styles.text}>Party Code: {data.PARTY_CD}</Text>
      <Text style={styles.text}>Address: {data.ADD1}</Text>
      <Text style={styles.text}>Place: {data.PLACE}</Text>
      <Text style={styles.text}>Date: {formatDate(data.ORD_DT)}</Text>
      <Table
        borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}
        style={{marginTop: 10}}>
        <Row
          data={['Item', 'Quantity', 'Price']}
          style={styles.head}
          textStyle={styles.headerText}
        />
        {data.ITEMS.map((item, index) => (
          <Row
            key={`item-${index}`}
            data={[`${item.ITEM_NM} - ${item.LORY_NO}`, item.QTY, item.RATE]}
            // style={styles.text}
            textStyle={styles.rowText}
          />
        ))}
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 10,
    margin: 8,
  },
  title: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerText: {
    margin: 6,
    fontWeight: '600',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {
    fontSize: 14,
    color: Colors.TEXT_COLOR,
    marginBottom: 6,
  },
  rowText: {
    margin: 6,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.TEXT_COLOR,
  },
  itemContainer: {
    paddingLeft: 10,
    marginBottom: 6,
  },
});

export default OrderCard;
