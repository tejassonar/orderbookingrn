import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../HomeScreen/HomeScreen';
import BottomBar from '../MainScreen/BottomBar';
import MoreScreen from '../MoreScreen/MoreScreen';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      tabBar={props => <BottomBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Inventory"
        component={MoreScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Parties"
        component={MoreScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
