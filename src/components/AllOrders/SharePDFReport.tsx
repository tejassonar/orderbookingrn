import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import RNShareFile from 'react-native-share-pdf';
import {pdf_icon} from '../../assets/pdf_icon';
import {SvgXml} from 'react-native-svg';
import {formatDate} from '../../utils/formatDate';

function SharePDFReport({
  PARTY_NM,
  PARTY_CD,
  ORD_DT,
  ITEMS,
  ADDRESS,
  PLACE,
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);

  const generatePDF = async () => {
    setIsLoading(true);
    checkCachefiles();
    try {
      const html = `
      <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica';
            font-size: 12px;
          }
          header,
          footer {
            height: 50px;
            /* background-color: #fff; */
            color: #3480fa;
            display: flex;
            justify-content: center;
            padding: 0 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th,
          td {
            border: 1px solid #000;
            padding: 5px;
          }
          th {
            background-color: #ccc;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Payment Invoice</h1>
        </header>
        <h1>${PARTY_NM}</h1>
        <table>
          <tr>
            <th>Party Code</th>
            <td>${PARTY_CD}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>${ADDRESS}</td>
          </tr>
          <tr>
            <th>Place</th>
            <td>${PLACE}</td>
          </tr>
          <tr>
            <th>Order Date</th>
            <td>${ORD_DT}</td>
          </tr>
        </table>
        <h1>Bill Details</h1>
        <table>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${ITEMS.map(
            (line: any) => `
          <tr>
            <td>${line.ITEM_NM} - ${line.LORY_NO}</td>
            <td>${line.QTY}</td>
            <td>${line.RATE}</td>
          </tr>
          `,
          ).join('')}
        </table>
        <footer>
          <p>Thank you for your business!</p>
        </footer>
      </body>
    </html>
      `;
      const options = {
        html,
        base64: true,
        fileName: `invoice_${count}`,
      };
      const file = await RNHTMLtoPDF.convert(options);

      const showError = await RNShareFile(file.base64, 'order.pdf');
      if (showError) {
        // Do something with the error
        Alert.alert('Something went wrong');
      }
      // Alert.alert('Success', `PDF saved to ${file.filePath}`);
      setCount(count + 1);
      setIsLoading(false);
    } catch (error) {
      console.log(error, 'error');
      Alert.alert('Error', error.message);
    }
  };

  const checkCachefiles = async () => {
    const path = RNFS.CachesDirectoryPath;

    return (
      RNFS.unlink(path)
        .then(() => {
          console.log('FILE DELETED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch(err => {
          console.log(err.message);
        })
    );
  };
  if (isLoading) {
    return <Text>Generating PDF...</Text>;
  }

  return (
    <Pressable style={styles.button} onPress={() => generatePDF()}>
      <SvgXml
        xml={pdf_icon}
        height={25}
        width={25}
        // style={{position: 'absolute', right: 0}}
        color={'red'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  button: {position: 'absolute', right: 10, top: 10, padding: 10, zIndex: 11},
});

export default SharePDFReport;
