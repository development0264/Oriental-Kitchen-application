import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Button, Left, Right, Icon } from 'native-base';
import { Dialog } from 'react-native-simple-dialogs';
import Navbar from '../components/Navbar';
import {
  faBars,
  faWindowClose,
  faArrowDown,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import moment from 'moment';
import { Card } from 'react-native-elements';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
      dataSource: [],
      dataImage: [],
      cancel_dialog: false,
      pause_dialog: false,
      count: 0,
      userDetail: '',
    };
    this._retrieveData();
    this.socket = SocketIOClient('http://dev-fs.8d.ie:6001');
    this.socket.emit('kitchenJoined', 1);
    this.socket.on('kitchenJoined', (userId) => {

      // if (userId != null) {
      //   var obj = {
      //     id: responseJsonOrder["data"].order_id,
      //     vender_id: 1,
      //     reference: data.reference,
      //     status: type
      //   }

      //   this.socket.emit('order_placed', obj);

      //   setTimeout(() => {
      //     Actions.ordersuccess({ status: "Success", id: responseJsonOrder["data"].payment_id });
      //   }, 1000);
      // }
    });
    this.socket.on('order_receive', (message) => {
      console.log(message);
    });
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        this.setState({ userDetail: JSON.parse(value), count: 1 });
        this.componentDidMount();
      }
    } catch (error) {
      alert(error);
    }
  };

  componentDidMount() {
    if (this.state.count == 1) {
      var data = new FormData();
      data.append('order_id', 1);
      console.log(data);
      const user_details = this.state.userDetail;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.userToken;
      headers.append('Authorization', auth);
      headers.append('Accept', 'application/json');
      console.log(headers);
      fetch('http://dev-fs.8d.ie/api/kitchen/getOrderList', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.status == 'success') {
            this.setState({
              dataSource: responseJson.data,
              dataImage: responseJson.data[0].ingredient,
            });
            console.log(this.state.dataImage);
          } else {
            alert('Something wrong happened');
          }
        })

        .catch(error => {
          console.error(error);
        });
    }
  }

  getOrderId = () => {
    var { height, width } = Dimensions.get('window');
    var items = [];
    this.state.dataSource.map((item, i) => {
      items.push(
        <View>
          <Text
            style={{
              fontSize: width * 0.05,
              textAlign: 'center',
              marginVertical: 20,
              fontFamily: 'Roboto',
              color: '#5F5F5F',
              fontWeight: 'bold',
            }}>
            {item.order_id + ' SIT'}
          </Text>
        </View>,
      );
    });
    return items;
  };

  fillOrder = () => {
    var { height, width } = Dimensions.get('window');
    var items = [];
    this.state.dataSource.map((item, i) => {
      items.push(
        <View>
          <View style={{ flexDirection: 'row', backgroundColor: 'black' }}>
            <View style={{ padding: 15, flex: 0.11 }}>
              <Text
                style={{
                  fontSize: width * 0.03,
                  color: 'white',
                  borderRightWidth: 1,
                  borderRightColor: 'white',
                }}>
                {item.order_id}
              </Text>
            </View>
            <View
              style={{
                flex: 0.89,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{ alignItems: 'flex-end', flex: 0.5 }}>
                <Text style={{ fontSize: width * 0.02, color: 'white' }}>
                  {item.updated_at.split(' ')[1].substring(0, 5)}
                </Text>
              </View>
              <View
                style={{ alignItems: 'flex-end', flex: 0.5, marginRight: 60 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: width * 0.03,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {this.state.dataSource.length} DISHES
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                padding: 8,
                flex: 0.11,
                flexDirection: 'column',
                backgroundColor: 'lightgrey',
                flexWrap: 'wrap',
              }}>
              <ScrollView>
              </ScrollView>
            </View>
            <View style={{ flex: 0.89 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <TouchableOpacity style={{ marginLeft: 30, marginTop: 10 }}>
                    <Image source={require('../images/arrow.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 30, marginTop: 10 }}>
                    <Image source={require('../images/arrow-down.png')} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginRight: 30,
                  }}>
                  <TouchableOpacity
                    style={{ marginLeft: 30 }}
                    onPress={() => {
                      this.setState({ pause_dialog: true });
                    }}>
                    <Text
                      style={{
                        fontSize: width * 0.035,
                        backgroundColor: '#ff9500',
                        paddingLeft: 10,
                        paddingRight: 10,
                        color: 'white',
                        borderRadius: 10,
                        marginTop: 10,
                      }}>
                      PAUSE
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 30 }}
                    onPress={() => {
                      this.setState({ cancel_dialog: true });
                    }}>
                    <Text
                      style={{
                        fontSize: width * 0.035,
                        backgroundColor: '#ff5800',
                        paddingLeft: 10,
                        paddingRight: 10,
                        color: 'white',
                        borderRadius: 10,
                        marginTop: 10,
                      }}>
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                <View>{this.fillCard()}</View>
              </ScrollView>
            </View>
          </View>
        </View>,
      );
    });
    return items;
  };

  fillCard = () => {
    var { height, width } = Dimensions.get('window');
    var items = [];
    this.state.dataSource.map((item, i) => {
      {
        items.push(
          <Card>
            <View
              style={{
                flexDirection: 'row',
                padding: 1,
                alignItems: 'center',
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}>
              <View style={{ flex: 0.9 }}>
                <Text style={{ fontSize: 25 }}>
                  {i + 1}
                  {'. '}
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 35,
                      textTransform: 'uppercase',
                    }}>
                    {item.order_dish_name}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flex: 0.1,
                  borderLeftColor: 'grey',
                  borderLeftWidth: 1,
                }}>
                <Text
                  style={{
                    fontSize: 40,
                    marginLeft: 15,
                    fontWeight: 'bold',
                  }}>
                  X{' '}
                  <Text style={{ fontWeight: 'bold', fontSize: 40 }}>
                    {item.qty}
                  </Text>
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',

                flexWrap: 'wrap',
              }}>
              {this.loadImage(item)}
            </View>
          </Card>,
        );
      }
    });
    return items;
  };

  loadImage = item => {
    // var {height, width} = Dimensions.get('window');
    var items = [];
    var ingredient = [];
    for (var i = 0; i < item.ingredient_group.length; i++) {
      ingredient.push(item.ingredient_group[i]);
      let object = item.ingredient.filter(
        o =>
          o.ingredient_group_id == item.ingredient_group[i].ingredient_group_id,
      );

      for (var j = 0; j < object.length; j++) {
        ingredient.push(object[j]);
      }
      console.log(object.length);
    }

    console.log(ingredient);
    for (var i = 0; i < ingredient.length; i++) {
      items.push(
        <View>
          <View>
            <Image
              source={{
                uri: 'http://dev-fs.8d.ie/storage/' + ingredient[i].cover,
              }}
              style={{
                height: 90,
                width: 90,
                margin: 8,
              }}
              resizeMode="contain"
            />
            <Text>{ingredient[i].name}</Text>
          </View>
        </View>,
      );
    }
    return items;
  };

  render() {
    var { height, width } = Dimensions.get('window');
    var left = (
      <Left style={{ flex: 1 }}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontFamily: 'Roboto', fontWeight: '100' }}>
          Station 1
        </Text>
      </Right>
    );
    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{ zIndex: 1 }}
        navigation={this.props}>
        <View style={styles.container}>
          <Navbar left={left} right={right} title="Kitchen" />
          <View style={{ flex: 0.88 }}>
            <View>{this.fillOrder()}</View>
          </View>
          <Dialog
            visible={this.state.pause_dialog}
            dialogStyle={{
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#efeff4',
              width: '35%',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#efeff4',
            }}
            onTouchOutside={() => this.setState({ pause_dialog: false })}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.95 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgrey',
                    paddingBottom: 15,
                    marginTop: 0,
                    fontSize: 23,
                    fontWeight: 'bold',
                  }}>
                  Pause order
                </Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ pause_dialog: false })}>
                  <FontAwesomeIcon
                    icon={faWindowClose}
                    color={'#ff9500'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                fontSize: width * 0.02,
                textAlign: 'center',
                marginTop: 10,
              }}>
              Order will pause for 5 minutes?
            </Text>
            {this.getOrderId()}
            <View
              style={{
                borderTopColor: 'lightgrey',
                borderTopWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={{ flex: 0.9, marginTop: 10 }}>
                <TouchableOpacity style={styles.yes} onPress={() => { }}>
                  <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={styles.no}
                  onPress={() => this.setState({ pause_dialog: false })}>
                  <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.cancel_dialog}
            dialogStyle={{
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#efeff4',
              width: '35%',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#efeff4',
            }}
            onTouchOutside={() => this.setState({ cancel_dialog: false })}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.95 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgrey',
                    paddingBottom: 15,
                    marginTop: 0,
                    fontSize: 23,
                    fontWeight: 'bold',
                  }}>
                  Cancel order
                </Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ cancel_dialog: false })}>
                  <FontAwesomeIcon
                    icon={faWindowClose}
                    color={'#ff9500'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                fontSize: width * 0.02,
                textAlign: 'center',
                marginTop: 10,
              }}>
              Are you sure to cancel the order?
            </Text>
            {this.getOrderId()}
            <View
              style={{
                borderTopColor: 'lightgrey',
                borderTopWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={{ flex: 0.9, marginTop: 10 }}>
                <TouchableOpacity style={styles.yes} onPress={() => { }}>
                  <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={styles.no}
                  onPress={() => this.setState({ cancel_dialog: false })}>
                  <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <View style={{ flex: 0.12, flexDirection: 'row' }}>
            <View
              style={{
                backgroundColor: '#ff9500',
                flex: 0.8,
                justifyContent: 'center',
                padding: 20,
              }}>
              <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
                CURRENT ORDER
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'green',
                flex: 0.2,
                justifyContent: 'center',
                padding: 20,
              }}>
              <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
                COMPLETE
              </Text>
            </View>
          </View>
        </View>
      </SideMenuDrawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  yes: {
    marginTop: 5,
    marginRight: 10,
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: '#ff5800',
  },
  no: {
    marginTop: 5,
    marginRight: 10,
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#ff9500',
  },
});
