/**
* This is the SideMenu component used in the navbar
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { ScrollView, LayoutAnimation, UIManager, Linking, Image, TouchableOpacity } from 'react-native';
import { View, List, ListItem, Body, Left, Right, Icon, Item, Input, Button, Grid, Col } from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHistory, faStar, faBell, faUsers, faShare, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
// Our custom files and classes import
import Text from './Text';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      searchError: false,
      subMenu: false,
      subMenuItems: [],
      clickedItem: ''
    };

    //UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  gonext = () => {
    this.props.navigation.navigate("History")
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
        <View>
          <View style={styles.MainContainer} >
            <Item style={{ paddingBottom: 10 }} onPress={() => { this.gonext() }}>
              <Image
                source={require('../images/profile-circle-picture-8.png')}
                style={{ width: 120, height: 120 }}
              />
            </Item>
          </View>
        </View>
        <View style={{ paddingRight: 40, paddingBottom: 200 }}>
          <List>
            {this.renderMenuItems()}
          </List>
        </View>
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
                <Text style={{ color: 'white', paddingLeft: 10 }}>LogOut</Text>
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
          <View style={{ backgroundColor: '#ff9500', borderRadius: 50, padding: 5 }}>
            {/* <FontAwesomeIcon icon={item.icon} style={{ color: 'black' }} /> */}
          </View>
          <Body>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate(item.page) }}>
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
    paddingBottom: 30
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




const menusSecondaryItems = [
  {
    id: 190,
    title: 'Login',
    icon: 'ios-person',
    key: 'login'
  },
  {
    id: 519,
    title: 'Signup',
    icon: 'ios-person-add',
    key: 'signup'
  },
  {
    id: 19,
    title: 'Wish List',
    icon: 'heart',
    key: 'wishlist'
  },
  {
    id: 20,
    key: 'map',
    title: 'Store Finder',
    icon: 'ios-pin',
    key: 'map'
  },
  {
    id: 21,
    key: 'contact',
    title: 'Contact Us',
    icon: 'md-phone-portrait',
    key: 'contact'
  },
  {
    id: 23,
    key: 'newsletter',
    title: 'Newsletter',
    icon: 'md-paper',
    key: 'newsletter'
  }
];
