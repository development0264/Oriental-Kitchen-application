/**
* This is the navbar component
* example of usage:
*   var left = (<Left><Button transparent><Icon name='menu' /></Button></Left>);
*   var right = (<Right><Button transparent><Icon name='menu' /></Button></Right>);
*   <Navbar left={left} right={right} title="My Navbar" />
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Header, Body, Title, Left, Right, } from 'native-base';

// Our custom files and classes import
import Colors from '../Colors';

export default class Navbar extends Component {
  render() {
    return (
      <Header
        style={{ backgroundColor: Colors.navbarBackgroundColor, height: 70, zIndex: -1 }}
        backgroundColor={Colors.navbarBackgroundColor}
        androidStatusBarColor={Colors.statusBarColor}
        noShadow={true}
      >
        {/* <View> */}
        {this.props.left ? this.props.left : <Left style={{ flex: 1 }} />}
        <Body style={styles.body}>
          <Title style={styles.title}>{this.props.title}</Title>
        </Body>
        {this.props.right ? this.props.right : <Right style={{ flex: 1 }} />}
        {/* </View> */}

      </Header>
    );
  }
}

const styles = {
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    //fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 35,
    padding: 5,
    color: 'white'
  }
};
