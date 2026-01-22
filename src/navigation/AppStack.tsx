import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
// import HomeScreen from '../screens/customer/HomeScreen';
// import MenuScreen from '../screens/customer/MenuScreen';
// import OrderScreen from '../screens/customer/OrderScreen';
// import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen';
// import ContactScreen from '../screens/customer/ContactScreen';

const Tab = createBottomTabNavigator();

const AppStack = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Menu" component={MenuScreen} />
    <Tab.Screen name="Order" component={OrderScreen} />
    <Tab.Screen name="Tracking" component={OrderTrackingScreen} />
    <Tab.Screen name="Contact" component={ContactScreen} />
  </Tab.Navigator>
);

export default AppStack;
