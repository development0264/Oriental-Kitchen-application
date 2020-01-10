// React native and others libraries imports
import React, { Component } from 'react';
import { Root } from 'native-base';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home_kitchen from './pages/Home_kitchen';
import Login from './components/Login';
import Logout from './pages/Logout';
import Ingrediant from './pages/Ingrediant';
import Employee from './pages/Employee';
import History from './pages/History';
import Payment from './pages/Payment';
import IngrediantsGroups from './pages/IngrediantsGroups';
import CreateDish from './pages/CreateDish';
import Menu from './pages/Menu';
import Splashscreen from './components/Splashscreen';

var x = new Date();
var offset = -x.getTimezoneOffset();
global.CurrentOffset = (offset >= 0 ? "+" : "-") + ('00' + parseInt(Math.abs(offset) / 60).toString()).slice(-2) + ":" + ('00' + (Math.abs(offset) % 60).toString()).slice(-2);

const AppNavigator = createStackNavigator({
    Splashscreen: {
        screen: Splashscreen,
        navigationOptions: {
            header: null,
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
        }
    },
    Logout: {
        screen: Logout,
        navigationOptions: {
            header: null,
        }
    },
    Home_kitchen: {
        screen: Home_kitchen,
        navigationOptions: {
            header: null,
        }
    },
    Employee: {
        screen: Employee,
        navigationOptions: {
            header: null,
        }
    },
    Ingrediant: {
        screen: Ingrediant,
        navigationOptions: {
            header: null,
        }
    },
    History: {
        screen: History,
        navigationOptions: {
            header: null,
        }
    },
    Payment: {
        screen: Payment,
        navigationOptions: {
            header: null,
        }
    },
    IngrediantsGroups: {
        screen: IngrediantsGroups,
        navigationOptions: {
            header: null,
        }
    },
    CreateDish: {
        screen: CreateDish,
        navigationOptions: {
            header: null,
        }
    },
    Menu: {
        screen: Menu,
        navigationOptions: {
            header: null,
        }
    },

}, {
    initialRouteName: 'Splashscreen'
});

const ReApp = createAppContainer(AppNavigator);
export default ReApp;
