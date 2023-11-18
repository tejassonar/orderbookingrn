import {
  Text,
  View,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import * as shape from 'd3-shape';
import React, {useEffect, useState} from 'react';
import Svg, {Path, SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/core';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

import {Colors, Typography} from '../../styles';
// import {multipleTreesIcon, singleTreeIcon} from '../../assets';
import {cash_icon} from '../../assets/cash_icon';
import {bank_icon} from '../../assets/bank_icon';
import {Pressable} from 'react-native';

const IS_ANDROID = Platform.OS === 'android';

let {width} = Dimensions.get('window');
const windowWidth = width;
const buttonWidth = 64;
const buttonGutter = 10;
const extraHeight = IS_ANDROID ? 0 : 20;
const tabbarHeight = 60 + extraHeight;

const tabWidth = buttonWidth + buttonGutter * 2;
width = (width - tabWidth) / 2;
const curveHeight = tabbarHeight - (22 + extraHeight);

const getPath = (): string => {
  const left = shape
    .line()
    .x(d => d[0])
    .y(d => d[1])([
    [0, 0],
    [width - 5, 0],
  ]);

  const tab = shape
    .line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(shape.curveBasis)([
    [width - 5, 0],
    [width, 0],
    [width + 5, 5],
    [width + 7, curveHeight / 2],
    [width + tabWidth / 2 - 16, curveHeight],
    [width + tabWidth / 2 + 16, curveHeight],
    [width + tabWidth - 7, curveHeight / 2],
    [width + tabWidth - 5, 5],
    [width + tabWidth, 0],
    [width + 5 + tabWidth, 0],
  ]);

  const right = shape
    .line()
    .x(d => d[0])
    .y(d => d[1])([
    [width + 5 + tabWidth, 0],
    [width * 2 + tabWidth, 0],
    [width * 2 + tabWidth, tabbarHeight],
    [0, tabbarHeight],
    [0, 0],
  ]);
  return `${left} ${tab} ${right}`;
};

const d = getPath();

const AddOptions = ({navigation}: any) => {
  const addOptions = [
    {
      svgXML: cash_icon,
      title: 'Add Order',
      onPress: () => navigation.navigate('RegisterSingleTree'),
    },
    {
      svgXML: bank_icon,
      title: 'Add Collection',
      onPress: () => navigation.navigate('LocateTree'),
    },
  ];

  return (
    <View style={styles.addOptionsParent}>
      <View style={styles.addOptionsContainer}>
        {addOptions.length > 0
          ? addOptions.map((option: any, index: number) => (
              <TouchableOpacity
                style={[
                  styles.addButtonOption,
                  addOptions.length - 1 !== index ? {marginBottom: 8} : {},
                ]}
                onPress={option.onPress}
                key={`addOption${index}`}>
                <View style={styles.icon}>
                  <SvgXml xml={option.svgXML} height={48} width={48} />
                </View>
                <Text style={styles.text}>{option.title}</Text>
              </TouchableOpacity>
            ))
          : []}
      </View>
    </View>
  );
};

interface IBottomBarProps {
  onMenuPress: any;
  onTreeInventoryPress: any;
  numberOfInventory: number;
  state: any;
  descriptors: any;
  navigation: any;
}

const BottomBar = ({
  state,
  descriptors,
  navigation,
  onMenuPress,
  onTreeInventoryPress,
  numberOfInventory,
}: IBottomBarProps) => {
  const [showAddOptions, setShowAddOptions] = useState(false);
  //   const navigation = useNavigation();
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    return () => setShowAddOptions(false);
  }, []);

  // Next, interpolate beginning and end values (in this case 0 and 1)
  // if Clockwise icon will rotate clockwise, else anti-clockwise
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '225deg'],
  });

  const animatedScaleStyle = {
    transform: [{rotate: spin}],
  };

  const onAddPress = () => {
    {
      setShowAddOptions(!showAddOptions);
      Animated.spring(
        spinValue, // The animated value to drive
        {
          toValue: showAddOptions ? 0 : 1,
          useNativeDriver: true,
        },
      ).start();
    }
  };

  //   return (
  //     <>
  //       <View style={styles.bottomBarContainer}>
  //         <Svg
  //           width={width * 2 + tabWidth}
  //           height={tabbarHeight}
  //           style={styles.bottomBar}
  //           strokeWidth="1"
  //           stroke={Colors.GRAY_LIGHT}>
  //           <Path {...{d}} fill={Colors.WHITE} />
  //         </Svg>
  //         {/* add button */}
  //         <TouchableOpacity style={styles.addButton} onPress={() => onAddPress()}>
  //           <Animated.View style={animatedScaleStyle}>
  //             <FA5Icon name="plus" color={Colors.WHITE} size={32} />
  //           </Animated.View>
  //         </TouchableOpacity>

  //         {/* menu button */}
  //         <TouchableOpacity
  //           style={[styles.left, styles.tabButton]}
  //           onPress={onMenuPress}>
  //           <>
  //             <View style={[styles.menuDash, styles.firstDash]} />
  //             <View style={[styles.menuDash, styles.secondDash]} />
  //           </>
  //         </TouchableOpacity>

  //         {/* Tree Inventory button */}
  //         <TouchableOpacity
  //           style={[styles.right, styles.tabButton]}
  //           onPress={() => {
  //             navigation.navigate('MoreScreen', {});
  //           }}>
  //           <Text style={styles.tabText}>More</Text>
  //           {/* <View style={styles.inventoryCount}>
  //                 <Text style={styles.inventoryCountText}>{numberOfInventory}</Text>
  //               </View> */}
  //         </TouchableOpacity>
  //         <SafeAreaView style={styles.safeArea} />
  //       </View>
  //       {showAddOptions ? <AddOptions navigation={navigation} /> : []}
  //     </>
  //   );
  return (
    <>
      <View style={styles.bottomBarContainer}>
        <View style={{zIndex: -1}}>
          <Svg
            width={width * 2 + tabWidth}
            height={tabbarHeight}
            zIndex={-1}
            style={styles.bottomBar}
            strokeWidth="1"
            stroke={Colors.GRAY_LIGHT}>
            <Path {...{d}} fill={Colors.WHITE} />
          </Svg>
        </View>
        {/* <TouchableOpacity
            style={[styles.left, styles.tabButton]}
            onPress={onMenuPress}>
            <>
              <View style={[styles.menuDash, styles.firstDash]} />
              <View style={[styles.menuDash, styles.secondDash]} />
            </>
          </TouchableOpacity> */}
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View
              key={index}
              style={[
                styles.tabButton,
                {
                  //   marginRight: index == 1 ? 30 : 0,
                  left:
                    index == 1
                      ? (windowWidth - 68) / 4
                      : index == 2
                      ? ((windowWidth - 68) * 2) / 4 + 68
                      : index == 3
                      ? ((windowWidth - 68) * 3) / 4 + 68
                      : 0,
                },
              ]}>
              <Pressable
                onPress={onPress}
                // style={{
                //   backgroundColor: isFocused ? '#030D16' : '#182028',
                //   borderRadius: 20,
                // }}
                style={{}}>
                <View style={{}}>
                  {/* <NavigationIcon route={label} isFocused={isFocused} /> */}
                  <Text
                    style={{
                      color: isFocused ? Colors.PRIMARY : Colors.TEXT_COLOR,
                    }}>
                    {label}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}

        <SafeAreaView style={styles.safeArea} />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => onAddPress()}>
        <Animated.View style={animatedScaleStyle}>
          <FA5Icon name="plus" color={Colors.WHITE} size={32} />
        </Animated.View>
      </TouchableOpacity>
      {showAddOptions ? <AddOptions navigation={navigation} /> : []}
    </>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.WHITE,
  },
  bottomBar: {backgroundColor: 'transparent'},
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: windowWidth,
    flex: 1,
    // paddingHorizontal: 20,
    height: tabbarHeight,
    // backgroundColor: Colors.PRIMARY,
  },
  menuDash: {
    height: 3,
    borderRadius: 10,
    backgroundColor: Colors.TEXT_COLOR,
  },
  tabButton: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // borderWidth: 2,
    width: (windowWidth - 68) / 4,
    borderColor: 'red',
    marginBottom: IS_ANDROID ? 0 : 6,
    height: tabbarHeight,
    zIndex: 999,
  },
  firstDash: {
    width: 16,
  },
  secondDash: {
    width: 24,
    marginTop: 6,
  },
  // 44 = height of menu container + 2 * padding
  left: {
    left: 16,
    bottom: (tabbarHeight - 44) / 2,
    padding: 16,
  },
  // 38 = height of text + 2 * padding
  right: {
    right: 16,
    bottom: (tabbarHeight - 38) / 2,
    padding: 10,
    borderRadius: 8,
    position: 'relative',
  },
  tabText: {
    fontSize: Typography.FONT_SIZE_14,
    fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
    color: Colors.TEXT_COLOR,
  },
  addButton: {
    position: 'absolute',
    bottom: tabbarHeight - buttonWidth / 2,
    width: buttonWidth,
    height: buttonWidth,
    borderRadius: 60,
    backgroundColor: Colors.PRIMARY,
    left: width + buttonGutter,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOptionsParent: {
    position: 'absolute',
    bottom: tabbarHeight + 42,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addOptionsContainer: {
    borderRadius: 14,
    padding: 8,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'flex-start',
    elevation: 4,
  },
  addButtonOption: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inventoryCount: {
    position: 'absolute',
    top: 0,
    right: -6,
    minWidth: 18,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
  },
  inventoryCountText: {
    color: Colors.WHITE,
    fontSize: Typography.FONT_SIZE_10,
    fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
  },
  icon: {height: 48, width: 48, marginRight: 16},
  text: {
    fontFamily: Typography.FONT_FAMILY_SEMI_BOLD,
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.TEXT_COLOR,
  },
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    // backgroundColor: '#182028',
    borderRadius: 25,
    marginHorizontal: width * 0.1,
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 1,
    borderColor: '#333B42',
  },
});
