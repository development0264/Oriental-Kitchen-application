import React, {Component} from 'react';
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
  ToastAndroid,
} from 'react-native';
import {Button, Left, Right, Icon, Grid, Col} from 'native-base';
import {Dialog} from 'react-native-simple-dialogs';
import Navbar from '../components/Navbar';
import {
  faBars,
  faWindowClose,
  faArrowDown,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import moment from 'moment';
import {Card} from 'react-native-elements';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client';

var order = [];
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
      dataSource: [],
      dataImage: [],
      dataIni: [],
      current_order: [],
      isActive: false,
      secondsElapsed: 1800000 / 1000,
      cancel_dialog: false,
      pause_dialog: false,
      userDetail: '',
      order_pause_id: null,
      delivery_id: null,
      order_date: null,
      address_1: null,
      address_2: null,
      zip: null,
      city: null,
    };
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        this.setState({userDetail: JSON.parse(value)});
        this.get_vender_order();

        this.socket = SocketIOClient('http://dev-fs.8d.ie:6001');
        this.socket.emit('kitchenJoined', 1);
        this.socket.on('kitchenJoined', userId => {
          this.locad_socket();
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  locad_socket() {
    this.socket.on('order_receive', message => {
      var obj = order.filter(o => o.reference == message.reference);
      if (obj.length == 0) {
        order.unshift(message);
        ToastAndroid.show('New Order is Placed !', ToastAndroid.SHORT);
      }
      this.setState({dataIni: order});
    });
  }

  getMinutes() {
    return ('0' + Math.floor((this.state.secondsElapsed % 3600) / 60)).slice(
      -2,
    );
  }

  getSeconds() {
    return ('0' + (this.state.secondsElapsed % 60)).slice(-2);
  }

  startTime = () => {
    this.setState({isActive: true});

    this.countdown = setInterval(() => {
      this.setState(({secondsElapsed}) => ({
        secondsElapsed: secondsElapsed - 1,
      }));
    }, 1000);
  };

  pauseStatus = () => {
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNTIwYjFiNGRkY2FmNTRjZGQ3NjViYzBhYzg5ODZjNzQ3OWJiNWIzNzc4M2NkODBkZGFjODQ5Mjc3Mzg4NjY5YmU5ZTgwNTBlMjJhMWIwIn0.eyJhdWQiOiIxIiwianRpIjoiNDA1MjBiMWI0ZGRjYWY1NGNkZDc2NWJjMGFjODk4NmM3NDc5YmI1YjM3NzgzY2Q4MGRkYWM4NDkyNzczODg2NjliZTllODA1MGUyMmExYjAiLCJpYXQiOjE1Nzc3ODE2ODgsIm5iZiI6MTU3Nzc4MTY4OCwiZXhwIjoxNjA5NDA0MDg4LCJzdWIiOiIxOCIsInNjb3BlcyI6W119.SlEA_7NoXPaANQ0TtusrLcl85p9Hnn0xxF2N6zSwGDeaNYxdM-I9VjeXLCU3AKWMC5_8Gxvb_SHDnABjVz1UgKgyUzT-pmrv9r1h70yh6qdsMGVu8dX7Dfzdr04KIu32lxkXhhgWRDHKpn4RZ9B_WlRCuHp72Us1q-z7rD0Vu_Bo5j_COAw-8HJsLjDxb2hls-On26FWSNHGgTa6siJtWruAmxBJVBWu9jSWNJFYisyzB5i6DgNCHRCk29Wl7sy-X2PUItRvTN7EKYKTBz6AvTq6-2yADmIfURiH3dBUHHG-KqqSvwav2HxCYcP7L5IH1HPm7-2Q09E8UWkkTSWgq3dX2g7zs9RBAduxiK1q7_GlgRXfDD9H_fGunkVqa0K83iZUH8TxLuqdcUY4vhW-pS5s0gVgAd7M9QLq8Oayab_QqkvqteuUjYd3zXX_Ar8S7L9yVg4-4u9ABN_wrT6lEwwA2SJoZtVAjScsrk8jVxHtMWo4kTKgYzNZTI9ZVLb2GmbGL36TYqoAH2t8JyEMgsXlvfrfpfcGj2_ERWjAMNwtS4hWiMgz7qKLwg7zji2-7LZLhuNY3tJtwp6DB7_frCCYNTejSdATu13rG__ko1fOdofqhdZ16SVEVO0p5ddw7ZX-n-BKesJsjSq-Qt1MK2_HEXm_gRjuyvswkvIvQrY';
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    var data = new FormData();
    data.append('order_id', this.state.order_pause_id);
    data.append('order_status', 6);

    //alert(this.state.order_pause_id)
    //return;
    fetch('http://dev-fs.8d.ie/api/kitchen/updateOrderStatus', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        //alert(JSON.stringify(responseJson))
        if (responseJson.status == 'success') {
          this.setState({pause_dialog: false});
          this.get_vender_order();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  completeStatus = () => {
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNTIwYjFiNGRkY2FmNTRjZGQ3NjViYzBhYzg5ODZjNzQ3OWJiNWIzNzc4M2NkODBkZGFjODQ5Mjc3Mzg4NjY5YmU5ZTgwNTBlMjJhMWIwIn0.eyJhdWQiOiIxIiwianRpIjoiNDA1MjBiMWI0ZGRjYWY1NGNkZDc2NWJjMGFjODk4NmM3NDc5YmI1YjM3NzgzY2Q4MGRkYWM4NDkyNzczODg2NjliZTllODA1MGUyMmExYjAiLCJpYXQiOjE1Nzc3ODE2ODgsIm5iZiI6MTU3Nzc4MTY4OCwiZXhwIjoxNjA5NDA0MDg4LCJzdWIiOiIxOCIsInNjb3BlcyI6W119.SlEA_7NoXPaANQ0TtusrLcl85p9Hnn0xxF2N6zSwGDeaNYxdM-I9VjeXLCU3AKWMC5_8Gxvb_SHDnABjVz1UgKgyUzT-pmrv9r1h70yh6qdsMGVu8dX7Dfzdr04KIu32lxkXhhgWRDHKpn4RZ9B_WlRCuHp72Us1q-z7rD0Vu_Bo5j_COAw-8HJsLjDxb2hls-On26FWSNHGgTa6siJtWruAmxBJVBWu9jSWNJFYisyzB5i6DgNCHRCk29Wl7sy-X2PUItRvTN7EKYKTBz6AvTq6-2yADmIfURiH3dBUHHG-KqqSvwav2HxCYcP7L5IH1HPm7-2Q09E8UWkkTSWgq3dX2g7zs9RBAduxiK1q7_GlgRXfDD9H_fGunkVqa0K83iZUH8TxLuqdcUY4vhW-pS5s0gVgAd7M9QLq8Oayab_QqkvqteuUjYd3zXX_Ar8S7L9yVg4-4u9ABN_wrT6lEwwA2SJoZtVAjScsrk8jVxHtMWo4kTKgYzNZTI9ZVLb2GmbGL36TYqoAH2t8JyEMgsXlvfrfpfcGj2_ERWjAMNwtS4hWiMgz7qKLwg7zji2-7LZLhuNY3tJtwp6DB7_frCCYNTejSdATu13rG__ko1fOdofqhdZ16SVEVO0p5ddw7ZX-n-BKesJsjSq-Qt1MK2_HEXm_gRjuyvswkvIvQrY';
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    var data = new FormData();
    var obj = this.state.dataIni.filter(o => o.name == 'current');
    if (obj.length) {
      data.append('order_id', obj[0].order_id);
    }
    data.append('order_status', 8);

    console.log(data);
    fetch('http://dev-fs.8d.ie/api/kitchen/updateOrderStatus', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({pause_dialog: false});
          this.get_vender_order();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  cancelStatus = () => {
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNTIwYjFiNGRkY2FmNTRjZGQ3NjViYzBhYzg5ODZjNzQ3OWJiNWIzNzc4M2NkODBkZGFjODQ5Mjc3Mzg4NjY5YmU5ZTgwNTBlMjJhMWIwIn0.eyJhdWQiOiIxIiwianRpIjoiNDA1MjBiMWI0ZGRjYWY1NGNkZDc2NWJjMGFjODk4NmM3NDc5YmI1YjM3NzgzY2Q4MGRkYWM4NDkyNzczODg2NjliZTllODA1MGUyMmExYjAiLCJpYXQiOjE1Nzc3ODE2ODgsIm5iZiI6MTU3Nzc4MTY4OCwiZXhwIjoxNjA5NDA0MDg4LCJzdWIiOiIxOCIsInNjb3BlcyI6W119.SlEA_7NoXPaANQ0TtusrLcl85p9Hnn0xxF2N6zSwGDeaNYxdM-I9VjeXLCU3AKWMC5_8Gxvb_SHDnABjVz1UgKgyUzT-pmrv9r1h70yh6qdsMGVu8dX7Dfzdr04KIu32lxkXhhgWRDHKpn4RZ9B_WlRCuHp72Us1q-z7rD0Vu_Bo5j_COAw-8HJsLjDxb2hls-On26FWSNHGgTa6siJtWruAmxBJVBWu9jSWNJFYisyzB5i6DgNCHRCk29Wl7sy-X2PUItRvTN7EKYKTBz6AvTq6-2yADmIfURiH3dBUHHG-KqqSvwav2HxCYcP7L5IH1HPm7-2Q09E8UWkkTSWgq3dX2g7zs9RBAduxiK1q7_GlgRXfDD9H_fGunkVqa0K83iZUH8TxLuqdcUY4vhW-pS5s0gVgAd7M9QLq8Oayab_QqkvqteuUjYd3zXX_Ar8S7L9yVg4-4u9ABN_wrT6lEwwA2SJoZtVAjScsrk8jVxHtMWo4kTKgYzNZTI9ZVLb2GmbGL36TYqoAH2t8JyEMgsXlvfrfpfcGj2_ERWjAMNwtS4hWiMgz7qKLwg7zji2-7LZLhuNY3tJtwp6DB7_frCCYNTejSdATu13rG__ko1fOdofqhdZ16SVEVO0p5ddw7ZX-n-BKesJsjSq-Qt1MK2_HEXm_gRjuyvswkvIvQrY';
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    var data = new FormData();
    data.append('order_id', 15);
    data.append('order_status', 7);

    console.log(data);
    fetch('http://dev-fs.8d.ie/api/kitchen/updateOrderStatus', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({cancel_dialog: false});
          //this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  currentStatus = id => {
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNTIwYjFiNGRkY2FmNTRjZGQ3NjViYzBhYzg5ODZjNzQ3OWJiNWIzNzc4M2NkODBkZGFjODQ5Mjc3Mzg4NjY5YmU5ZTgwNTBlMjJhMWIwIn0.eyJhdWQiOiIxIiwianRpIjoiNDA1MjBiMWI0ZGRjYWY1NGNkZDc2NWJjMGFjODk4NmM3NDc5YmI1YjM3NzgzY2Q4MGRkYWM4NDkyNzczODg2NjliZTllODA1MGUyMmExYjAiLCJpYXQiOjE1Nzc3ODE2ODgsIm5iZiI6MTU3Nzc4MTY4OCwiZXhwIjoxNjA5NDA0MDg4LCJzdWIiOiIxOCIsInNjb3BlcyI6W119.SlEA_7NoXPaANQ0TtusrLcl85p9Hnn0xxF2N6zSwGDeaNYxdM-I9VjeXLCU3AKWMC5_8Gxvb_SHDnABjVz1UgKgyUzT-pmrv9r1h70yh6qdsMGVu8dX7Dfzdr04KIu32lxkXhhgWRDHKpn4RZ9B_WlRCuHp72Us1q-z7rD0Vu_Bo5j_COAw-8HJsLjDxb2hls-On26FWSNHGgTa6siJtWruAmxBJVBWu9jSWNJFYisyzB5i6DgNCHRCk29Wl7sy-X2PUItRvTN7EKYKTBz6AvTq6-2yADmIfURiH3dBUHHG-KqqSvwav2HxCYcP7L5IH1HPm7-2Q09E8UWkkTSWgq3dX2g7zs9RBAduxiK1q7_GlgRXfDD9H_fGunkVqa0K83iZUH8TxLuqdcUY4vhW-pS5s0gVgAd7M9QLq8Oayab_QqkvqteuUjYd3zXX_Ar8S7L9yVg4-4u9ABN_wrT6lEwwA2SJoZtVAjScsrk8jVxHtMWo4kTKgYzNZTI9ZVLb2GmbGL36TYqoAH2t8JyEMgsXlvfrfpfcGj2_ERWjAMNwtS4hWiMgz7qKLwg7zji2-7LZLhuNY3tJtwp6DB7_frCCYNTejSdATu13rG__ko1fOdofqhdZ16SVEVO0p5ddw7ZX-n-BKesJsjSq-Qt1MK2_HEXm_gRjuyvswkvIvQrY';
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    var data = new FormData();
    data.append('order_id', id);
    data.append('order_status', 9);

    fetch('http://dev-fs.8d.ie/api/kitchen/updateOrderStatus', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'success') {
          this.get_vender_order();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  get_vender_order() {
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    // headers.append('Accept', 'application/json');
    console.log('headers', headers);
    fetch('http://dev-fs.8d.ie/api/order/get-vender-order', {
      method: 'POST',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'success') {
          //alert(JSON.stringify(responseJson))
          this.setState({
            dataIni: responseJson.data,
          });
          order = this.state.dataIni;
          // var obj = this.state.dataIni.filter(o => o.name == 'pause');
          // if (obj.length) {
          //   for (var i = 0; i < obj.length; i++) {
          //     obj[i].is_pause = true;
          //   }
          // }

          var obj = this.state.dataIni.filter(o => o.name == 'current');
          if (obj.length) {
            obj[0].is_selected = true;
            this.select_order(obj[0].order_id, true);
            this.setState({
              current_order: obj[0].reference,
              delivery_id: obj[0].delivery_id,
            });
          } else {
            this.makecurrentorder(this.state.dataIni);
          }
          // else {
          //   var obj = this.state.dataIni.filter(o => o.name == 'pause');
          //   if (obj.length) {
          //     for (var i = 0; i < obj.length; i++) {
          //       obj[i].is_pause = true;
          //     }
          //     // this.select_order(obj[0].order_id)
          //     // this.setState({
          //     //   current_order: obj[0].reference,
          //     // });
          //   } else {
          //     //this.makecurrentorder(this.state.dataIni)
          //   }
          // }
        } else {
          alert('Something wrong happened');
        }
      })

      .catch(error => {
        console.error(error);
      });
  }

  select_order(id, Is_cuurent) {
    var data = new FormData();
    //call current order on page load
    data.append('order_id', id);
    data.append('UserOffset', global.CurrentOffset);

    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    fetch('http://dev-fs.8d.ie/api/kitchen/getOrderList', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'success') {
          this.setState({
            dataSource: responseJson.data,
          });
          if (Is_cuurent == true) {
            if (this.state.dataSource[0].address != undefined) {
              this.setState({
                order_date: this.state.dataSource[0].order_date,
                address_1: this.state.dataSource[0].address[0].address_1,
                address_2: this.state.dataSource[0].address[0].address_2,
                zip: this.state.dataSource[0].address[0].zip,
                city: this.state.dataSource[0].address[0].city,
              });
            } else {
              this.setState({
                order_date: this.state.dataSource[0].order_date,
              });
            }
          }
        } else {
          this.setState({
            dataSource: [],
          });
          alert('Something wrong happened');
        }
      })

      .catch(error => {
        console.error(error);
      });
  }

  makecurrentorder(item) {
    this.currentStatus(item[item.length - 1].order_id);
  }

  getOrderId = () => {
    var {height, width} = Dimensions.get('window');
    var items = [];
    var Status = '';
    if (this.state.dataSource.length > 0) {
      var StatusOrder = this.state.dataIni.filter(
        o => o.order_id == this.state.dataSource[0].order_id,
      );
      if (StatusOrder.length) {
        Status = StatusOrder[0].delivery_name;
      }
    }
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
            {item.reference + ' ' + Status}
          </Text>
        </View>,
      );
    });
    return items;
  };

  order = () => {
    var {height, width} = Dimensions.get('window');
    var items = [];
    this.state.dataIni.map((item, i) => {
      items.push(
        <TouchableOpacity onPress={() => this.get_selectedorder(item)}>
          <View
            style={
              item.is_selected == null ||
              item.is_selected == undefined ||
              item.is_selected == false
                ? styles.defultpress
                : styles.selected_order
            }>
            <Text
              style={
                item.is_selected == null ||
                item.is_selected == undefined ||
                item.is_selected == false
                  ? styles.defulttext
                  : styles.selected_order_text
              }>
              {item.reference}
              {'\n'}
              {item.delivery_name}
            </Text>
            {/* <Text>
              {
                (item.is_pause == null || item.is_pause == undefined || item.is_pause == false) ?
                  null
                  :
                  this.calltimer()
              }
            </Text> */}
          </View>
        </TouchableOpacity>,
      );
    });
    return items;
  };

  calltimer() {
    return '00:00';
  }

  fillOrder = () => {
    var {height, width} = Dimensions.get('window');
    var items = [];
    if (this.state.dataSource.length > 0) {
      this.state.dataSource.map((item, i) => {
        items.push(
          <ScrollView>
            <View>
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
                  <View style={{flex: 0.9}}>
                    <Text style={{fontSize: 25}}>
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
                      <Text style={{fontWeight: 'bold', fontSize: 40}}>
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
              </Card>
            </View>
          </ScrollView>,
        );
      });
    } else {
      items.push(
        <View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  alignContent: 'center',
                  fontSize: 25,
                }}>
                No Any Current Order Selectd !
              </Text>
            </View>
          </View>
        </View>,
      );
    }
    return items;
  };

  loadImage = item => {
    // var {height, width} = Dimensions.get('window');
    // alert(JSON.stringify(item));
    var items = [];
    var ingredient = [];
    if (item.ingredient_group != undefined) {
      for (var i = 0; i < item.ingredient_group.length; i++) {
        item.ingredient_group[i].is_group = true;
        ingredient.push(item.ingredient_group[i]);

        let object = item.ingredient.filter(
          o =>
            o.ingredient_group_id ==
            item.ingredient_group[i].ingredient_group_id,
        );

        for (var j = 0; j < object.length; j++) {
          ingredient.push(object[j]);
        }
      }
    }
    // alert(ingredient.length);
    for (var i = 0; i < ingredient.length; i++) {
      items.push(
        <View>
          <View>
            {ingredient[i].is_group == true ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: '#ff9500',
                  height: 90,
                  width: 90,
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginLeft: 8,
                  marginTop: 8,
                }}>
                <Image
                  style={{
                    height: 80,
                    width: 80,
                    margin: 8,
                    backgroundColor: '#ff9500',
                  }}
                  resizeMode="contain"
                  source={{uri: 'http://dev-fs.8d.ie/' + ingredient[i].cover}}
                />
                <Text
                  style={{
                    position: 'absolute',
                    fontSize: 30,
                    color: 'white',
                    top: 18,
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  }}>
                  {ingredient[i].name}
                </Text>
              </View>
            ) : (
              <Image
                source={{
                  uri: 'http://dev-fs.8d.ie/' + ingredient[i].cover,
                }}
                style={{
                  height: 90,
                  width: 90,
                  margin: 8,
                }}
                resizeMode="contain"
              />
            )}
            {/* <Text>{ingredient[i].name}</Text> */}
          </View>
        </View>,
      );
    }
    return items;
  };

  get_selectedorder(item) {
    var objfind = this.state.dataIni.filter(o => o.is_selected == true);
    if (objfind.length > 0) {
      objfind[0].is_selected = false;
    }
    item.is_selected = true;
    // this.setState({
    //   current_order: item.reference,
    // });
    this.select_order(item.order_id, false);
    //setTimeout(function () {
    this.setState({dataIni: this.state.dataIni});
    //})
  }

  order_details(Order_item) {
    var {height, width} = Dimensions.get('window');
    var items = [];
    items.push(
      <View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#383330',
                  paddingVertical: 10,
                }}>
                <View style={{alignItems: 'flex-end', flex: 0.5}}>
                  <Text style={{fontSize: width * 0.016, color: 'white'}}>
                    {Order_item.order_created_at.split(' ')[1].substring(0, 5)}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                    flex: 0.5,
                    marginRight: 60,
                  }}>
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
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.3,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                {/* <TouchableOpacity style={{marginLeft: 30, marginTop: 10}}>
                    <Image source={require('../images/arrow.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft: 30, marginTop: 10}}>
                    <Image source={require('../images/arrow-down.png')} />
                  </TouchableOpacity> */}
              </View>
              {this.state.isActive ? (
                <View
                  style={{
                    flex: 0.15,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: width * 0.016}}>
                    {this.getMinutes()}:{this.getSeconds()}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 0.15,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}></View>
              )}
              <View
                style={{
                  flex: 0.55,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginRight: 30,
                }}>
                {/* <TouchableOpacity
      style={{ marginLeft: 30 }}
      onPress={() => {
        this.setState({ pause_dialog: true, order_pause_id: item.order_id });
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
    </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    this.setState({cancel_dialog: true});
                  }}>
                  <Text
                    style={{
                      fontSize: width * 0.035,
                      backgroundColor: '#ff5800',
                      paddingHorizontal: 10,
                      color: 'white',
                      borderRadius: 10,
                      marginTop: 10,
                    }}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.fillOrder()}
          </View>
        </View>
      </View>,
    );
    return items;
  }

  render() {
    var {height, width} = Dimensions.get('window');
    var left = (
      <Left style={{flex: 1}}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{flex: 1}}>
        <Text style={{color: 'white', fontFamily: 'Roboto', fontWeight: '100'}}>
          Station 1
        </Text>
      </Right>
    );
    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{zIndex: 1}}
        navigation={this.props}>
        <View style={styles.container}>
          <Navbar left={left} right={right} title="Kitchen" />
          <View style={{flex: 1}}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 0.2,
                  }}>
                  <ScrollView>{this.order()}</ScrollView>
                </View>
                {this.state.dataSource.length > 0 ? (
                  <ScrollView>
                    <View style={{flex: 1}}>
                      {this.order_details(this.state.dataSource[0])}
                    </View>
                  </ScrollView>
                ) : (
                  <View style={{flex: 1}}>
                    <View
                      style={{
                        alignSelf: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                          alignContent: 'center',
                          fontSize: 25,
                        }}>
                        No Any Current Order Selectd !
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
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
            onTouchOutside={() => this.setState({pause_dialog: false})}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.95}}>
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
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setState({pause_dialog: false})}>
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
                fontSize: width * 0.016,
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
              <View style={{flex: 0.9, marginTop: 10}}>
                <TouchableOpacity
                  style={styles.yes}
                  onPress={() => {
                    this.pauseStatus();
                  }}>
                  <Text style={{fontSize: width * 0.015, color: 'white'}}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 10}}>
                <TouchableOpacity
                  style={styles.no}
                  onPress={() => this.setState({pause_dialog: false})}>
                  <Text style={{fontSize: width * 0.015, color: 'white'}}>
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
            onTouchOutside={() => this.setState({cancel_dialog: false})}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.95}}>
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
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setState({cancel_dialog: false})}>
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
                fontSize: width * 0.016,
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
              <View style={{flex: 0.9, marginTop: 10}}>
                <TouchableOpacity
                  style={styles.yes}
                  onPress={() => {
                    this.cancelStatus();
                  }}>
                  <Text style={{fontSize: width * 0.015, color: 'white'}}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 10}}>
                <TouchableOpacity
                  style={styles.no}
                  onPress={() => this.setState({cancel_dialog: false})}>
                  <Text style={{fontSize: width * 0.015, color: 'white'}}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <View style={{flex: 0.12, flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#ff9500',
                flex: 0.8,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: width * 0.03,
                  color: 'white',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '50%',
                }}>
                CURRENT ORDER {this.state.current_order}
              </Text>
              {this.state.delivery_id == 2 ? (
                <Text
                  style={{
                    fontSize: width * 0.018,
                    color: 'white',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    width: '50%',
                    textAlign: 'left',
                    // backgroundColor: 'red',
                  }}>
                  Collection Time : {this.state.order_date}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: width * 0.018,
                    color: 'white',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    width: '50%',
                    textAlign: 'left',
                  }}>
                  Delivery Address :{' '}
                  {this.state.address_1 != null && this.state.address_2 != null
                    ? this.state.address_1 +
                      this.state.address_2 +
                      this.state.city +
                      this.state.zip
                    : 'N/A'}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
                flex: 0.2,
                justifyContent: 'center',
                padding: 20,
              }}
              onPress={() => {
                this.completeStatus();
              }}>
              <Text
                style={{
                  fontSize: width * 0.035,
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                COMPLETE
              </Text>
            </TouchableOpacity>
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
  defultpress: {
    color: '#383330',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#383330',
    backgroundColor: '#efeff4',
  },
  selected_order: {
    color: '#383330',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#383330',
    backgroundColor: '#383330',
  },
  selected_pause_order: {
    color: 'red',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    backgroundColor: 'red',
  },
  defulttext: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#625e5e',
    textAlign: 'center',
  },
  selected_order_text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  selected_order_pause_text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
});
