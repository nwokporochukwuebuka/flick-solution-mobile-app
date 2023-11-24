import {StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ParkingSpaces from '../authenticatedStack/ParkingSpaces';
import Profile from '../authenticatedStack/Profile';
import Bookings from '../authenticatedStack/Bookings';
import Transactions from '../authenticatedStack/Transactions';
import CustomDrawer from '../../components/CustomDrawer';

const Drawer = createDrawerNavigator();

const AuthenticatedStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="ParkingSpaces"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="ParkingSpaces"
        options={{title: 'Available Parking Spaces'}}
        component={ParkingSpaces}
      />
      <Drawer.Screen name="Bookings" component={Bookings} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Transaction" component={Transactions} />
    </Drawer.Navigator>
  );
};

export default AuthenticatedStack;

const styles = StyleSheet.create({});
