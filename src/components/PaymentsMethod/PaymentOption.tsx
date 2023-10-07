import {View, Text, TouchableWithoutFeedback} from 'react-native';
import React, {useState} from 'react';
import {SvgXml} from 'react-native-svg';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import OutlinedInput from '../Common/OutlinedInput';
import {Colors, Typography} from '../../styles';

const PaymentOption = ({
  option,
  setSelectedPaymentOption,
  selectedPaymentOption,
  icon,
  InputElement,
  label,
}: any) => {
  const [checkboxState, setCheckboxState] = useState(false);

  console.log(option, '==key==');

  const isChecked = selectedPaymentOption === option;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setCheckboxState(!checkboxState);
        setSelectedPaymentOption(option);
      }}>
      <View
        style={{
          flex: 1,
          marginTop: label == 'UPI' ? 8 : 24,
          padding: 16,
          paddingVertical: 8,
          borderWidth: isChecked ? 2 : 1,
          borderColor: isChecked ? Colors.PRIMARY : Colors.GRAY_LIGHTEST,
          borderRadius: 10,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 6,
            borderRadius: 10,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: 10,
            }}>
            <SvgXml
              xml={icon}
              height={label == 'UPI' ? '50px' : '42px'}
              width={label == 'UPI' ? '50px' : '42px'}
            />
            <Text
              style={{
                color: Colors.TEXT_COLOR,
                fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
                fontSize: Typography.FONT_SIZE_20,
                fontWeight: Typography.FONT_WEIGHT_MEDIUM,
              }}>
              {label}
            </Text>
          </View>
          <BouncyCheckbox
            //   key={index}
            disableText={true}
            style={{alignSelf: 'center'}}
            fillColor={Colors.PRIMARY}
            // ref={(ref: any) => bouncyCheckboxRef}
            isChecked={isChecked}
            disableBuiltInState
            onPress={() => {
              setCheckboxState(!checkboxState);
              setSelectedPaymentOption(option);
            }}
          />
        </View>
        {isChecked && InputElement}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PaymentOption;
