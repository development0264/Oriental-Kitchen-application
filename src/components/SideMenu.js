/**
* This is the SideMenu component used in the navbar
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { ScrollView, LayoutAnimation, UIManager, Linking, Image, TouchableOpacity } from 'react-native';
import { View, List, ListItem, Body, Left, Right, Icon, Item, Input, Button, Grid, Col } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHistory, faStar, faBell, faUsers, faShare, faSignOutAlt, faMoneyBill, faConciergeBell } from '@fortawesome/free-solid-svg-icons'
// Our custom files and classes import
import Text from './Text';
import { NavigationEvents } from 'react-navigation';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.propsnavi = this.props.navigation;
    this.state = {
      search: "",
      searchError: false,
      subMenu: false,
      subMenuItems: [],
      clickedItem: '',
      roleName: '',
      userDetail: ''
    };
    //UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }


  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        this.setState({ userDetail: JSON.parse(value), count: 1, roleName: value.roleName });
        this.componentDidMount();
      }
    } catch (error) {
      alert(error);
    }
  };

  page_reloaded = () => {
    this.componentDidMount();
  }

  gonext = () => {
    this.props.navigation.navigate("History")
  }
  componentDidMount() {
    console.log(this.state.userDetail.roleName);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderMenu()}
      </ScrollView>
    );
  }

  renderMenu() {
    const { navigation } = this.props;
    return (
      <View style={{ backgroundColor: '#2f2d2d', height: '100%', width: '100%', opacity: 0.9, zIndex: 1 }}>
        <NavigationEvents onDidFocus={() => { this.page_reloaded() }} />
        <View>
          <View style={styles.MainContainer} >
            <Image
              source={require('../images/profile-circle-picture-8.png')}
              style={{ width: 120, height: 120 }}
            />
            <Text style={{ color: 'white', fontSize: 20, marginTop: 20 }}>{this.state.userDetail.name}</Text>
          </View>
          <Item style={{ marginLeft: 60, marginRight: 60, marginBottom: 30 }}></Item>
        </View>
        <View style={{ paddingRight: 40, paddingBottom: 15 }}>
          <List>
            {this.state.userDetail.roleName == "cashier" ? this.renderCashierMenuItems() : this.state.userDetail.roleName == "admin" ? this.renderAdminMenuItems() : this.state.userDetail.roleName == "kitchenstaff" ? this.renderKitchenMenuItems() : this.state.userDetail.roleName == "vender" ? this.renderVenderMenuItems() : null}
          </List>
        </View>
        <Item style={{ marginLeft: 60, marginRight: 60, marginBottom: 5 }}></Item>
        <View style={{ paddingRight: 40 }}>
          <List>
            <ListItem
              noBorder
              button={true}
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <View style={{ backgroundColor: '#ff9500', borderRadius: 50, padding: 5 }}>
                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: 'black' }} />
              </View>
              <Body>


                <TouchableOpacity onPress={() => { this.propsnavi.navigation.navigate('Logout') }}>
                  <Text style={{ color: 'white', paddingLeft: 10 }}>LogOut</Text>
                </TouchableOpacity>
              </Body>
            </ListItem>
          </List>
        </View>
      </View>
    );
  }

  renderMenuItems() {
    let items = [];
    menuItems.map((item, i) => {
      items.push(
        <ListItem
          last={menuItems.length === i + 1}
          noBorder
          key={item.id}
          button={true}
        >
          <View style={{ backgroundColor: '#ff9500', borderRadius: 50, padding: 5 }} >
            <FontAwesomeIcon icon={item.icon} style={{ color: 'black' }} />
          </View>
          <Body>
            <TouchableOpacity onPress={() => { this.propsnavi.navigation.navigate(item.page) }}>
              <Text style={{ color: 'white', paddingLeft: 10 }} >{item.title}</Text>
            </TouchableOpacity>
          </Body>
        </ListItem>
      );
    });
    return items;
  }

  renderCashierMenuItems() {
    let items = [];
    CashiermenuItems.map((item, i) => {
      items.push(
        <ListItem
          last={CashiermenuItems.length === i + 1}
          noBorder
          key={item.id}
          button={true}
        >
          <View style={{ backgroundColor: '#ff9500', borderRadius: 50, padding: 5 }}>
            <FontAwesomeIcon icon={item.icon} style={{ color: 'black' }} />
          </View>
          <Body>
            <TouchableOpacity onPress={() => { this.propsnavi.navigation.navigate(item.page) }}>
              <Text style={{ color: 'white', paddingLeft: 10 }} >{item.title}</Text>
            </TouchableOpacity>
          </Body>
        </ListItem>
      );
    });
    return items;
  }

  renderAdminMenuItems() {
    let items = [];
    AdminmenuItems.map((item, i) => {
      items.push(
        <ListItem
          last={AdminmenuItems.length === i + 1}
          noBorder
          key={item.id}
          button={true}
        >
          <View style={{ backgroundColor: '#ff9500', borderRadius: 50, padding: 5 }}>
            <FontAwesomeIcon icon={item.icon} style={{ color: 'black' }} />
          </View>
          <Body>
            <TouchableOpacity onPress={() => { this.propsnavi.navigation.navigate(item.page) }}>
              <Text style={{ color: 'white', paddingLeft: 10 }} >{item.title}</Text>
            </TouchableOpacity>
          </Body>
        </ListItem>
      );
    });
    return items;
  }

  renderKitchenMenuItems() {
    let items = [];
    KitchenmenuItems.map((item, i) => {
      items.push(
        <ListItem
          last={KitchenmenuItems.length === i + 1}
          noBorder
          key={item.id}
          button={true}
        >
          <View style={{ backgroundColor: '#ff9500', borderRadius: 50, padding: 5 }}>
            <FontAwesomeIcon icon={item.icon} style={{ color: 'black' }} />
          </View>
          <Body>
            <TouchableOpacity onPress={() => { this.propsnavi.navigation.navigate(item.page) }}>
              <Text style={{ color: 'white', paddingLeft: 10 }} >{item.title}</Text>
            </TouchableOpacity>
          </Body>
        </ListItem>
      );
    });
    return items;
  }

  renderVenderMenuItems() {
    let items = [];
    vendermenuItems.map((item, i) => {
      items.push(
        <ListItem
          last={vendermenuItems.length === i + 1}
          noBorder
          key={item.id}
          button={true}
        >
          <View style={{ backgroundColor: '#ff9500', borderRadius: 50, padding: 5 }}>
            <FontAwesomeIcon icon={item.icon} style={{ color: 'black' }} />
          </View>
          <Body>
            <TouchableOpacity onPress={() => { this.propsnavi.navigation.navigate(item.page) }}>
              <Text style={{ color: 'white', paddingLeft: 10 }} >{item.title}</Text>
            </TouchableOpacity>
          </Body>
        </ListItem>
      );
    });
    return items;
  }

}

const styles = {
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#2f2d2d',
    opacity: 0.9, zIndex: 1,
    height: '100%',
    width: '100%'
  },
  line: {
    width: '100%',
    height: 1,
    // backgroundColor: 'rgba(189, 195, 199, 0.6)',
    marginTop: 10,
    marginBottom: 10
  }
};

var menuItems = [
  {
    id: 1,
    title: 'favourite',
    icon: faStar,
    page: 'History'
  },
  {
    id: 2,
    title: 'history',
    icon: faHistory
  },
  {
    id: 3,
    title: 'share',
    icon: faShare
  },
  {
    id: 4,
    title: 'notification',
    icon: faBell
  },
  {
    id: 4,
    title: 'friends',
    icon: faUsers
  }
];

var CashiermenuItems = [
  {
    id: 1,
    title: 'Order',
    icon: faStar,
  },
  {
    id: 2,
    title: 'Sales',
    icon: faHistory
  },
  {
    id: 3,
    title: 'History',
    icon: faShare,
    page: 'History'
  },
];

var AdminmenuItems = [
  {
    id: 1,
    title: 'Employee',
    icon: faStar,
  },
  {
    id: 2,
    title: 'Report',
    icon: faHistory
  },
  {
    id: 3,
    title: 'Ingrident',
    icon: faStar,
  },
  {
    id: 4,
    title: 'Sales',
    icon: faHistory
  },
  {
    id: 5,
    title: 'History',
    icon: faShare,
    page: 'History'
  },
];

var KitchenmenuItems = [
  {
    id: 1,
    title: 'Kitchen',
    icon: faStar,
  },
  {
    id: 2,
    title: 'Dishes',
    icon: faHistory
  },
  {
    id: 3,
    title: 'Sales',
    icon: faHistory
  },
  {
    id: 4,
    title: 'History',
    icon: faShare,
    page: 'History'
  },
];

var vendermenuItems = [
  {
    id: 1,
    title: 'Employee',
    icon: faStar,
    page: 'Employee'
  },
  {
    id: 2,
    title: 'Ingrediant',
    icon: faHistory,
    page: 'Ingrediant'
  },
  {
    id: 3,
    title: 'Report',
    icon: faHistory,
    page: 'History'
  },
  {
    id: 4,
    title: 'IngridentGroup',
    icon: faStar,
    page: 'IngrediantsGroups'
  },
  {
    id: 5,
    title: 'Sales',
    icon: faHistory
  },
  {
    id: 6,
    title: 'History',
    icon: faHistory,
    page: 'History'
  },
  {
    id: 8,
    title: 'Menu',
    icon: faConciergeBell,
    page: 'Menu'
  },
  {
    id: 8,
    title: 'Payment',
    icon: faMoneyBill,
    page: 'Payment'
  },
];