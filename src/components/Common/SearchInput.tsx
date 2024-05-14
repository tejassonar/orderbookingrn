import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  EasingFunction,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useDebounce from '../../hooks/useDebounce';
import {Colors, Typography} from '../../styles';
import IconSwitcher from './IconSwitcher';

type autoCapitalizeType = 'characters' | 'words' | 'sentences' | 'none';

interface PropTypes {
  label?: string;
  onChangeText?: any;
  value?: string;
  autoCapitalize?: autoCapitalizeType;
  fontSize?: number;
  height?: number;
  duration?: number;
  easing?: EasingFunction;
  activeValueColor?: string;
  passiveValueColor?: string;
  activeLabelColor?: string;
  passiveLabelColor?: string;
  activeBorderColor?: string;
  passiveBorderColor?: string;
  fontFamily?: string;
  keyboardType?: string;
  returnKeyType?: string;
  blurOnSubmit?: boolean;
  onSubmitEditing?: any;
  onEndEditing?: any;
  onFocusFunction?: any;
  ref?: any;
  editable?: boolean;
  style?: any;
  backgroundLabelColor?: string;
  containerBackgroundColor?: string;
  autoFocus?: boolean;
  searchFunction?: Function;
  // options?: Array<string>;
  SelectOptionFunc?: Function;
}

interface CommonAnimatedPropsTypes {
  duration: number;
  useNativeDriver: boolean;
  easing: EasingFunction;
}

interface LabelStylePropTypes {
  isFocused: boolean;
  initialTopValue: number;
  activeLabelColor: string;
  passiveLabelColor: string;
  backgroundLabelColor: string;
}

interface InputStyleProps {
  padding: number;
  height: number;
  fontSize: number;
  isFocused: boolean;
  activeValueColor: string;
  passiveValueColor: string;
}

const SearchInput = React.forwardRef(
  (
    {
      label,
      onChangeText,
      value,
      autoCapitalize = 'none',
      fontSize = Typography.FONT_SIZE_16,
      height = 50,
      duration = 300,
      easing = Easing.inOut(Easing.ease),
      activeValueColor = Colors.TEXT_COLOR,
      passiveValueColor = Colors.TEXT_COLOR,
      activeLabelColor = Colors.PRIMARY,
      passiveLabelColor = Colors.GRAY_LIGHTEST,
      backgroundLabelColor = Colors.WHITE,
      activeBorderColor = Colors.PRIMARY,
      passiveBorderColor = Colors.TEXT_COLOR,
      containerBackgroundColor = Colors.WHITE,
      fontFamily = Typography.FONT_FAMILY_REGULAR,
      keyboardType = 'default',
      returnKeyType = 'done',
      blurOnSubmit,
      onSubmitEditing,
      onEndEditing,
      editable = true,
      style = {},
      autoFocus = false,
      onFocusFunction = () => {},
      searchFunction = () => {},
      // options = [],
      SelectOptionFunc = () => {},
    }: //
    PropTypes,
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [borderColor, setBorderColor] = useState<string>(
      Colors.GRAY_LIGHTEST,
    );
    const [showInfoIconText, setShowInfoIconText] = useState<boolean>(false);
    const [isInitial, setIsInitial] = useState<boolean>(true);
    const [rightContainerWidth, setRightContainerWidth] = useState<number>(0);
    const [inputWidth, setInputWidth] = useState<number>(0);
    const [labelWidth, setLabelWidth] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>('');
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>('');

    const lineHeightValue: number = fontSize + 2;
    const initialTopValue: number = (height - lineHeightValue) / 2;
    const labelPositionEmptyValue: number = 0;
    const inputValueFontSize: number = fontSize;
    const padding: number = 8;
    const labelPositionFillValue: number =
      lineHeightValue / 2 + initialTopValue;
    const inputHeight: number = height;
    const errorColor = Colors.ALERT;

    const labelPositionRef = useRef(
      new Animated.Value(
        searchText ? labelPositionFillValue : labelPositionEmptyValue,
      ),
    ).current;
    const fontSizeRef = useRef(
      new Animated.Value(searchText ? fontSize - 2 : fontSize),
    ).current;
    const lineHeightRef = useRef(
      new Animated.Value(searchText ? lineHeightValue - 2 : lineHeightValue),
    ).current;
    const zIndexRef = useRef(new Animated.Value(searchText ? 2 : -1)).current;
    const debouncedSearch = useDebounce(searchText, 500);

    const commonAnimatedProps: CommonAnimatedPropsTypes = {
      duration,
      useNativeDriver: false,
      easing,
    };

    useEffect(() => {
      if (isFocused) {
        setBorderColor(activeBorderColor);
      } else if (searchText) {
        setBorderColor(passiveValueColor);
      } else {
        setBorderColor(passiveBorderColor);
      }
    }, [isFocused, searchText]);

    useEffect(() => {
      if (!!searchText || isFocused) {
        onFocus();
        if (isInitial) {
          setIsFocused(false);
        }
      } else {
        onBlur();
      }
    }, [searchText]);

    useEffect(() => {
      if (searchText) {
        const options = searchForOptions(debouncedSearch);
      }
    }, [debouncedSearch]);

    const searchForOptions = useCallback(
      async (searchQuery: string) => {
        if (!selectedOption) {
          const results = await searchFunction(searchQuery);
          setOptions(results);
        }
      },
      [selectedOption],
    );

    const onBlur: () => void = useCallback(() => {
      setIsFocused(false);
      if (!searchText) {
        Animated.parallel([
          Animated.timing(labelPositionRef, {
            toValue: labelPositionEmptyValue,
            ...commonAnimatedProps,
          }),
          Animated.timing(fontSizeRef, {
            toValue: fontSize,
            ...commonAnimatedProps,
          }),
          Animated.timing(lineHeightRef, {
            toValue: lineHeightValue,
            ...commonAnimatedProps,
          }),
          Animated.timing(zIndexRef, {
            toValue: -1,
            ...commonAnimatedProps,
          }),
        ]).start();
      }
    }, [!!searchText]);

    const onFocus: () => void = useCallback(() => {
      setIsFocused(true);
      setSelectedOption('');
      // onFocusFunction();
      Animated.parallel([
        Animated.timing(labelPositionRef, {
          toValue: labelPositionFillValue,
          ...commonAnimatedProps,
        }),
        Animated.timing(fontSizeRef, {
          toValue: fontSize - 2,
          ...commonAnimatedProps,
        }),
        Animated.timing(lineHeightRef, {
          toValue: lineHeightValue - 2,
          ...commonAnimatedProps,
        }),
        Animated.timing(zIndexRef, {
          toValue: 2,
          ...commonAnimatedProps,
        }),
      ]).start();
    }, [!!searchText]);

    const animatedViewInitialStyle: any = {
      position: 'absolute',
      bottom: labelPositionRef,
      left: 10,
      zIndex: zIndexRef,
      height,
    };

    const animatedViewProps = {
      style: animatedViewInitialStyle,
      onLayout: (event: LayoutChangeEvent) => {
        if (isInitial) {
          setLabelWidth(event.nativeEvent.layout.width);
          setIsInitial(false);
        }
      },
    };

    const animatedTextProps = {
      style: [
        LabelStyle({
          isFocused,
          initialTopValue,
          activeLabelColor,
          passiveLabelColor,
          backgroundLabelColor,
        }),
        {fontSize: fontSizeRef, lineHeight: lineHeightRef, fontFamily},
      ],
      numberOfLines: 1,
      ellipsizeMode: 'tail',
    };

    if (!isInitial) {
      if (!isFocused && !searchText) {
        animatedViewProps.style = {
          ...animatedViewInitialStyle,
          right: rightContainerWidth + 10,
        };
      } else if (labelWidth + 20 >= inputWidth) {
        animatedViewProps.style = {...animatedViewInitialStyle, right: 10};
      } else {
        animatedViewProps.style = animatedViewInitialStyle;
      }
    }

    const inputProps = {
      value,
      // onChangeText,
      onFocus,
      onBlur,
      autoCapitalize,
      isFocused,
      height: inputHeight,
      padding,
      paddingLeft: 15,
      fontSize: inputValueFontSize,
      returnKeyType,
      keyboardType,
      blurOnSubmit,
      onSubmitEditing,
      onEndEditing,
      ref,
      editable,
      autoFocus,
      style: [
        {fontFamily, flex: 1, width: '85%'},
        InputStyle({
          padding,
          height,
          fontSize,
          isFocused,
          activeValueColor,
          passiveValueColor,
        }),
      ],
    };

    return (
      <View
        style={style}
        onLayout={(event: LayoutChangeEvent) =>
          setInputWidth(event.nativeEvent.layout.width)
        }>
        <View
          style={[
            styles.container,
            {backgroundColor: containerBackgroundColor},
          ]}>
          <Animated.View {...animatedViewProps}>
            <Animated.Text {...animatedTextProps}>{label}</Animated.Text>
          </Animated.View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderRadius: 5,
              borderColor,
              alignItems: 'center',
            }}>
            {!editable ? (
              <Text
                style={[
                  inputProps.style,
                  {
                    paddingVertical: 14,
                    paddingLeft: 16,
                    height: 'auto',
                    color: Colors.TEXT_COLOR,
                  },
                ]}>
                {searchText ?? ''}
              </Text>
            ) : (
              <TextInput
                {...inputProps}
                // style={{borderWidth: 2, borderColor: 'red', width: '85%'}}
                value={searchText}
                onChangeText={data => setSearchText(data)}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onLayout={(event: LayoutChangeEvent) => {
                setRightContainerWidth(event.nativeEvent.layout.width);
              }}>
              {isFocused ? (
                <TouchableOpacity
                  onPress={() => {
                    setIsFocused(false);
                    setSearchText('');
                    SelectOptionFunc('');
                  }}
                  style={{zIndex: 100000}}>
                  <Ionicons name="close" size={25} style={styles.closeIcon} />
                </TouchableOpacity>
              ) : (
                <Ionicons
                  name="search-outline"
                  size={20}
                  style={styles.searchIcon}
                />
              )}
            </View>
          </View>
        </View>
        {isFocused ? (
          <View
            style={{
              position: 'absolute',
              top: 50,
              width: '100%',
              borderWidth: 2,
              borderTopWidth: 0,
              borderColor: Colors.GRAY_LIGHT,
              borderBottomEndRadius: 12,
              backgroundColor: Colors.WHITE,
              zIndex: 100000,
            }}>
            {options?.length > 0 &&
              options.map((option: any) => (
                <TouchableOpacity
                  key={option.id}
                  style={{
                    paddingVertical: 8,
                    paddingLeft: 8,
                    backgroundColor: Colors.WHITE,
                    borderTopWidth: 0,
                    borderWidth: 1,
                    borderColor: Colors.GRAY_LIGHT,
                    zIndex: 100000,
                  }}
                  onPress={() => {
                    setSelectedOption(option.id);
                    setSearchText(option.name);
                    setOptions([]);
                    Keyboard.dismiss();
                    // setIsFocused(false);
                    SelectOptionFunc(option.id);
                  }}>
                  <Text
                    style={{
                      fontSize: Typography.FONT_SIZE_16,
                      color: Colors.TEXT_COLOR,
                    }}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ) : (
          []
        )}
      </View>
    );
  },
);

const LabelStyle = ({
  isFocused,
  initialTopValue,
  activeLabelColor,
  passiveLabelColor,
  backgroundLabelColor,
}: LabelStylePropTypes) => ({
  fontStyle: 'normal',
  fontWeight: 'normal',
  color: isFocused ? activeLabelColor : passiveLabelColor,
  backgroundColor: backgroundLabelColor || Colors.WHITE,
  paddingRight: 5,
  paddingLeft: 5,
  top: initialTopValue,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.WHITE,
  },
  errorText: {
    color: Colors.ALERT,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_12,
    marginTop: 6,
  },
  infoIconContainer: {
    position: 'relative',
    padding: 10,
  },
  infoTextContainer: {
    position: 'absolute',
    right: 6,
    top: 36,
    padding: 10,
    borderRadius: 8,
    width: 300,
    backgroundColor: Colors.TEXT_COLOR,
    zIndex: 2,
  },
  infoText: {
    fontSize: Typography.FONT_SIZE_12,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.WHITE,
    textAlign: 'justify',
  },
  searchIcon: {
    color: '#949596',
    paddingRight: 20,
  },
  closeIcon: {
    justifyContent: 'flex-end',
    color: Colors.TEXT_COLOR,
    paddingRight: 20,
  },
});

const InputStyle = ({
  padding,
  height,
  fontSize,
  isFocused,
  activeValueColor,
  passiveValueColor,
}: InputStyleProps) => ({
  padding,
  height,
  fontSize,
  color: isFocused ? activeValueColor : passiveValueColor,
});

export default memo(SearchInput);
