import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Typography} from '../../styles';

const Label = ({
  leftText,
  rightText,
  onPressRightText,
  leftTextStyle,
  rightTextStyle,
  style,
}: any) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.leftText, leftTextStyle]}>{leftText}</Text>
      <TouchableOpacity onPress={onPressRightText} style={{flex: 1}}>
        <Text
          style={[styles.rightText, rightTextStyle]}
          accessibilityLabel="Label Button"
          accessible={true}
          testID="label_btn">
          {rightText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Label;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    flex: 1,
  },
  headerText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_27,
    color: Colors.TEXT_COLOR,
  },
  leftText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_20,
    color: Colors.TEXT_COLOR,
    flex: 1,
  },
  rightText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_18,
    color: Colors.PRIMARY,
  },
  backArrow: {},
});
