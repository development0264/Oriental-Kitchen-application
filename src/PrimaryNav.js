import Home_kitchen from './pages/Home_kitchen';
import demo from './demo';
import Login from './components/Login';
import Ingrediant from './pages/Ingrediant';
import Employee from './pages/Employee';
import History from './pages/History';
import Payment from './pages/Payment';
import IngrediantsGroups from './pages/IngrediantsGroups';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Image, Dimensions, ScrollView, View, Text } from 'react-native';

var { height, width } = Dimensions.get('window');

// const design = (props) =>(
//   <SafeAreaView style={{flex:1}}>
//     <View style={{alignItems:'center',marginTop:20,marginBottom:20}}>
//       <Image
//         source={require('./images/profile-circle-picture-8.png')}
//         style={{width:80,height:80}}
//       />
//     </View>
//     <ScrollView>
//       <DrawerItems {...props}/>
//     </ScrollView>
//   </SafeAreaView>
// )
const Primary_Nav = createDrawerNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
    Home_kitchen: {
      screen: Home_kitchen,
      navigationOptions: {
        drawerLabel: 'Home',
      },
    },
    Ingrediant: {
      screen: Ingrediant,
      navigationOptions: {
        drawerLabel: 'Ingrediant',
      },
    },
    Employee: {
      screen: Employee,
      navigationOptions: {
        drawerLabel: 'Employee',
      },
    },
    History: {
      screen: History,
      navigationOptions: {
        drawerLabel: 'History',
      },
    },
    IngrediantsGroups: {
      screen: IngrediantsGroups,
      navigationOptions: {
        drawerLabel: 'IngrediantsGroups',
      },
    },
    Payment: {
      screen: Payment,
      navigationOptions: {
        drawerLabel: 'Payment',
      },
    },
  },
  {
    initialRouteName: 'Payment',
    drawerPosition: 'left',
    drawerType: 'slide',
    // drawerOpenRouter:'DrawerOpen',
    // drawerCloseRouter:'DrawerClose',
    drawerBackgroundColor: '#ff9500b3',
    drawerType: 'front',
    drawerWidth: width * 0.35,
    contentOptions: {
      inactiveTintColor: 'white',
      activeTintColor: 'white',
      labelStyle: {
        fontSize: 15,
      },
    },
  },
);

const PrimaryNav = createAppContainer(Primary_Nav);
export default PrimaryNav;
