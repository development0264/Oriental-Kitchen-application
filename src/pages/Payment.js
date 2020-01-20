import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Button,
  Left,
  Right,
  Grid,
  Col,
  Row,
  Picker,
  Switch,
  Footer,
  Body,
  Container,
} from 'native-base';
import Navbar from '../components/Navbar';
import CheckBox from 'react-native-check-box';
import {
  faBars,
  faWindowClose,
  faArrowRight,
  faCamera,
  faPrint,
  faPager,
  faPlus,
  faMinus,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Dialog} from 'react-native-simple-dialogs';
import {Card} from 'react-native-elements';
import RNImagePicker from 'react-native-image-picker';
import Colors from '../Colors';
import ViewMoreText from 'react-native-view-more-text';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableHighlight} from 'react-native-gesture-handler';
import SideMenuDrawer from '../components/SideMenuDrawer';
import SocketIOClient from 'socket.io-client';

export default class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSwitchOn: false,
      add_dish_dialog: false,
      payment_dialog: false,
      card_dish_dialog: false,
      cash: 0,
      dataSource: '',
      card_dataSource: [],
      dishname: '',
      dishdescription: '',
      // token: "",
      dataSource_inside: {},
      select_dish_dialog: false,
      img_uri: '',
      avatar: '',
      isPopular: false,
      quantity: 1,
      dishqty: 1,
      qty: 1,
      max: null,
      groupmax: 0,
      cover: null,
      name: null,
      description: null,
      price: null,
      groupname: null,
      isexisting: false,
      dishData: {},
      did: null,
      ingredientexixts: [],
      ingredient_group_id: '',
      userDetail: '',
      paymentData: [],
      totalPriceCustom: 0,
      dishPrice: '',
      takeTotal: 0,
      custom_dish_dialog: false,
      Order_Dish: [],
      custom_dish_list: [],
      get_last_order: 0,
      custom_dish_total: 0,
      Is_custom_Id: null,
      vender_id: 1,
    };

    this.socket = SocketIOClient('http://dev-fs.8d.ie:6001');
    this.dishQty = [];
    this._retrieveData();

    AsyncStorage.setItem('INGREDIENT', '');
    //AsyncStorage.setItem('Order_Dish', "")
    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (res != null) {
        this.setState({ingredientexixts: JSON.parse(res)});
      }
      this.main_callvenderingredient();
    });
    this.call_storage_order();
    this.get_last_order();
    this.delivery_types();
  }

  call_storage_order() {
    AsyncStorage.getItem('Order_Dish', (err, res) => {
      if (res != null) {
        var price = 0;
        let totalList = [];
        this.setState({Order_Dish: JSON.parse(res)});
        totalList = JSON.parse(res);
        totalList.map(item => {
          var total = item.qty * parseFloat(item.rate);
          price = price + total;
        });
        this.setState({takeTotal: price});
      } else {
        this.setState({Order_Dish: []});
        this.setState({takeTotal: 0});
      }
    });
  }

  get_last_order = async () => {
    fetch('http://dev-fs.8d.ie/api/order/get-last-order', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson['status'] == 'success') {
          this.setState({
            get_last_order: parseInt(responseJson['data'].reference) + 1,
          });
        } else {
          this.setState({get_last_order: 1});
        }
      });
  };

  delivery_types = async () => {
    var headers = new Headers();
    headers.append('Accept', 'application/json');

    fetch('http://dev-fs.8d.ie/api/delivery-type', {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson['status'] == 'success') {
          var types = [];
          for (var i = 0; i < responseJson['data'].length; i++) {
            var obj = new Object();
            obj.id = responseJson['data'][i].id;
            obj.label = responseJson['data'][i].name;
            types.push(obj);
          }
          this.setState({delivery_types: types});
        }
      });
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        this.setState({userDetail: JSON.parse(value)});
      }
    } catch (error) {
      alert(error);
    }
  };

  //Get Vender List Menu Open
  show_card = () => {
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViNTE5MmFmNjYyZjkxMTQzYTE1ZDQ2OTZkNTg2ZGY0MmYyMDkxMmFiMGZjYWY1ZDJmNDg4YmQwOWZiOGFjNDkwZWVkODViODMzYTM1MjEyIn0.eyJhdWQiOiIxIiwianRpIjoiZWI1MTkyYWY2NjJmOTExNDNhMTVkNDY5NmQ1ODZkZjQyZjIwOTEyYWIwZmNhZjVkMmY0ODhiZDA5ZmI4YWM0OTBlZWQ4NWI4MzNhMzUyMTIiLCJpYXQiOjE1NzY2Njk4MDMsIm5iZiI6MTU3NjY2OTgwMywiZXhwIjoxNjA4MjkyMjAzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.WamiILeUa8pz0xFLiFQJVJ33QLrsjIU48QU4Nx1H5UBKCq2p28GnYlfkAG2ySCTaqhqxoNTvQ6kqSCoPRl4qFWSQyOxb_51hquwD_59nCgVkASRqxym4Pthcd9CAbme1m-InVgALwNTRl7VwHGch3XE3fdfA8AN_nuRlF0GJ_uQWDDapNHPSCd_EtxpCDmlcW8k4zCzcHY27_gwuLRr_LlI-bztJZQdKlK-kWDzvDmxBYKE_DbxAeVt7BCwX1DZpcqPjNxgLoo0QXir8fOFkOoZdS4y-k3wY0IPJybO-_Pmj-DkJ8Oq4eu9XXpraW50AHXvYz_sWcUm_WikYWUOkjjPp682DiaaR8TUWF75M6C403m-TgqCMTQXJWkukLeWunpH43V6h4iQf4uGtWLbJUPus2HDDMPhEWziFjHJB2_X0iBFlKmdCqeFtjisMENYsNRs3Q4KFmd7FjctiOs0_DbyonmlQ-yYV_DDlYHhz83gxEEC-1fCyFISA99VAEv2Hwx4vOeJ2sdh0NcCXpCmaGZFPdXoU5_Ae5mGgvNF1UHcuwluq1bbQx0-mgZ1JsFmQbFYs4QuQ4MeIzhqC_yj0bOY3Lv3vt3vNs2cq2vWHFSNy1FwvTXPkaka4FxHSIPA3D2fluR4BgegK9uT4A86YQmIXFWdGUzjtuWF6OiZBy1Q';
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    fetch('http://dev-fs.8d.ie/api/dishes/show-dishes', {
      method: 'POST',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'success') {
          this.setState({card_dish_dialog: true});
          for (var i = 0; i < responseJson.data.length; i++) {
            responseJson.data[i].qty = 1;
          }
          this.setState({card_dataSource: responseJson.data});
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  //Payment Page Dailog Open
  take_payment = () => {
    this.setState({payment_dialog: true});
    this.orderFunction();
  };

  orderFunction = () => {
    AsyncStorage.getItem('Order_Dish', (err, res) => {
      if (res != null) {
        var price = 0;
        let totalList = [];
        this.setState({paymentData: JSON.parse(res)});
        totalList = JSON.parse(res);
        totalList.map(item => {
          var total = item.qty * parseFloat(item.rate);
          price = price + total;
        });
        this.setState({takeTotal: price});
      }
    });
  };

  onDigitPresssum = digit => {
    let a = parseFloat(this.state.cash);
    let b = digit;
    let c = (a + b).toString();
    this.setState({cash: c});
  };

  onDecimalPointPresssum = digit => {
    let a = parseFloat(this.state.cash);
    let b = digit;
    let c = (a + b).toString();
    this.setState({cash: c});
  };

  _totalChange() {
    let total = this.state.cash;
    this.setState({
      cash: total,
    });
  }

  onZeroPress = () => {
    this.setState({cash: this.state.cash + '0'});
  };

  onDoubleZeroPress = () => {
    this.setState({cash: this.state.cash + '00'});
  };

  onPercentCash = () => {
    var newNum = this.state.cash / 100;
    this.setState({
      cash: newNum,
    });
  };

  onClearPress = () => {
    this.setState({cash: 0});
  };

  main_callvenderingredient() {
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU2MTE1NTZiYTJmZjUxZDlmNTg4ZWY0N2MxY2EzNDZiN2Q2NWQ5YjEyZGIxYzJkZWZkZTRlMjg3NzU2YTQ4NjE0YmY4YWU0OWQ0ZDZkM2VjIn0.eyJhdWQiOiIxIiwianRpIjoiNTYxMTU1NmJhMmZmNTFkOWY1ODhlZjQ3YzFjYTM0NmI3ZDY1ZDliMTJkYjFjMmRlZmRlNGUyODc3NTZhNDg2MTRiZjhhZTQ5ZDRkNmQzZWMiLCJpYXQiOjE1NzIwMTExMTcsIm5iZiI6MTU3MjAxMTExNywiZXhwIjoxNjAzNjMzNTE3LCJzdWIiOiIzMSIsInNjb3BlcyI6W119.tbhBgFC_mbmVdP924vH0RcIhmOa7Vd8tPnLIGeFMjFz9TptGIFXDf9jp44yEYSAR5JZq31kz3yth92lQnMgdSg-ah1vqyo_OWETzMTxlQaRbpSnuWX9tFGT53wbbR4QHCrTMGi72cumIvMV0E4z-XqxKJnMjiWN91HhPznGiVlT5gu1Y9AUDpxn1vXuNRNYhHO_3jxqJIqxucCln-ZMeZ38-jUgcj_bi7b5gS62mX08KuLqpNMJTzC3PLjW7krbuHS0Ac8TLVDrYH0sDgK4waXmDaNNY8Sp1wx1MHUN1Jzmwog1ACUvyrasT4J2aoxbr0L_Mvyqu-nSpMexZw4CkrM8h8h1sAjPp4JCxKRtzVyBKTaFzXg6ZNWYEzo19MgWHa0Noj23t2TZeVULO3udmt5wyMY4W9rKpFW1JoaUb5inmFTCDTdUSdFXNpMBGYi-Jx3lP5H1pkPI4IFfzOvgFEy0FrekPClC622JNRlLoVllJSTNFN-660kcwQltG6vETH8Xb4isF03GeLhwew7z4P0cGyw_wIsvhyCOx3uEB2vJnpf5QTCVD1knqZYkwxnfbPs7zcos1oWJOmFADkbNeBx1Ti3hBzW16eXN3kKGmoY9W5FVTZSq0M9W_rQI_n7tvl9BqaTukiSpRwMJw1FuDFpr9T5P3ANFR6m8LzhOkPhs';
    headers.append('Authorization', auth);
    fetch('http://dev-fs.8d.ie/api/venders/1/ingredient-groups', {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          //this.props.navigation.navigate('AfterLogin',{Json_value:responseJson.data});

          let ingredientGroups = [];

          for (var i = 0; i < responseJson.ingredientGroups.length; i++) {
            responseJson.ingredientGroups[i].isgroup = true;
            ingredientGroups.push(responseJson.ingredientGroups[i]);
            for (
              var j = 0;
              j < responseJson.ingredientGroups[i].ingredients.length;
              j++
            ) {
              responseJson.ingredientGroups[i].ingredients[j].idingredient =
                responseJson.ingredientGroups[i].ingredients[j].id;
              responseJson.ingredientGroups[i].ingredients[j].dishPrice =
                responseJson.ingredientGroups[i].ingredients[j].price;
              responseJson.ingredientGroups[i].ingredients[j].groupmax =
                responseJson.ingredientGroups[i].max;
              responseJson.ingredientGroups[i].ingredients[
                j
              ].isexisting = false;
              responseJson.ingredientGroups[i].ingredients[
                j
              ].ingredient_group_id = responseJson.ingredientGroups[i].id;
              responseJson.ingredientGroups[i].ingredients[j].iscreate = false;
              responseJson.ingredientGroups[i].ingredients[j].isgroup = false;
              responseJson.ingredientGroups[i].ingredients[j].groupname =
                responseJson.ingredientGroups[i].name;
              ingredientGroups.push(
                responseJson.ingredientGroups[i].ingredients[j],
              );
            }
          }
          this.setState({
            dataSource: ingredientGroups,
            dataSource_inside: responseJson.ingredientGroups.ingredients,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  //Open  add ingredient Dailog
  ingredients_data = item => {
    this.setState({did: item.idingredient});
    this.setState({dishPrice: item.dishPrice});
    this.setState({groupname: item.groupname});
    this.setState({max: item.max});
    this.setState({name: item.name});
    this.setState({quantity: 1});
    this.setState({groupmax: item.groupmax});
    this.setState({ingredient_group_id: item.ingredient_group_id});
    this.setState({description: item.description});
    this.setState({cover: item.cover});
    this.state.ingredientexixts.map(items => {
      if (item.id == items.id) {
        this.setState({quantity: parseInt(items.qty)});
        this.setState({dishPrice: items.dishPrice});
      }
    });
    this.setState({select_dish_dialog: true});
    // console.log(this.state.ingredientexixts.length);
    // console.log(this.state.ingredientexixts);
  };

  //add Quantity ingredient Dailog
  addQuantity() {
    if (this.state.quantity + 1 <= this.state.max) {
      this.setState({quantity: this.state.quantity + 1});
    } else {
      ToastAndroid.show(
        'You have reached the maximum limit of qty!',
        ToastAndroid.SHORT,
      );
    }
  }

  //funtion for Take Payment Page Data
  showDishPaymentBox = () => {
    var items = [];
    var {height, width} = Dimensions.get('window');

    if (this.state.paymentData) {
      this.state.paymentData.map((item, i) => {
        var obj = null;
        if (item.Is_custom == true) {
          obj = JSON.parse(item['ingredients'])[0];
          obj.name = 'Custom Dish (' + obj.name + ')';
        } else {
          obj = item;
        }
        items.push(
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.2, justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: width * 0.018,
                  color: '#76726d',
                  textAlign: 'center',
                }}>
                {i + 1}
              </Text>
            </View>
            <View style={{flex: 0.35, justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: width * 0.018,
                  color: '#76726d',
                  textAlign: 'center',
                }}>
                {obj.name}
              </Text>
            </View>
            <View style={{flex: 0.25, justifyContent: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.018,
                    marginHorizontal: 5,
                    color: '#76726d',
                    textAlign: 'center',
                  }}>
                  {item.qty}
                </Text>
              </View>
            </View>
            <View style={{flex: 0.2, justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: width * 0.018,
                  color: '#76726d',
                  textAlign: 'center',
                }}>
                ${item.rate * item.qty}
              </Text>
            </View>
          </View>,
        );
      });
      // if (this.state.totalPriceCustom != 0) {
      //   items.push(this.showCustomDish(this.state.paymentData.length));
      // }
    }
    return items;
  };

  showCustomDish = i => {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.2, justifyContent: 'center'}}>
          <Text style={{fontSize: width * 0.018, color: '#76726d'}}>
            {i + 1}
          </Text>
        </View>
        <View style={{flex: 0.35, justifyContent: 'center'}}>
          <Text style={{fontSize: width * 0.018, color: '#76726d'}}>
            Custom Dish
          </Text>
        </View>
        <View style={{flex: 0.25, justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  qty: this.state.qty > 1 ? this.state.qty - 1 : 1,
                });
              }}>
              <FontAwesomeIcon icon={faMinus} size={20} color={'#ff9500'} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: width * 0.018,
                marginHorizontal: 5,
                color: '#76726d',
              }}>
              {this.state.qty}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  qty:
                    this.state.qty < 1
                      ? (this.state.qty = 1)
                      : this.state.qty + 1,
                });
              }}>
              <FontAwesomeIcon icon={faPlus} size={20} color={'#ff9500'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 0.2, justifyContent: 'center'}}>
          <Text style={{fontSize: width * 0.018, color: '#76726d'}}>
            ${(this.state.qty * this.state.totalPriceCustom).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  //Add Vender Dish on Storage
  card_add_dish(item) {
    var Dish = [];
    var success = false;
    var isqtyupdate = false;
    var orderdishlist = [];
    var obj = {
      ingredients: [],
    };
    AsyncStorage.getItem('Order_Dish', (err, res) => {
      if (!res) {
        obj['rate'] = item.rate;
        obj['vender_id'] = item.vender_id;
        obj['id'] = item.id;
        obj['qty'] = this.state.dishqty;
        obj['Is_custom'] = false;
        obj.ingredients = item.ingredients;
        Dish.push(obj);
        AsyncStorage.setItem('Order_Dish', JSON.stringify(Dish));
      } else {
        orderdishlist = JSON.parse(res);
        orderdishlist.map(items => {
          if (items.id == item.id) {
            if (items.qty == item.qty) {
              success = true;
            } else {
              items.qty = item.qty;
              // items.name = this.state.d_name;
              isqtyupdate = true;
            }
          }
        });
      }
      if (success) {
        ToastAndroid.show('This dish already exist !', ToastAndroid.SHORT);
      } else {
        if (isqtyupdate) {
          ToastAndroid.show('Dish update quantity !', ToastAndroid.SHORT);
          AsyncStorage.setItem('Order_Dish', JSON.stringify(orderdishlist));
        } else {
          item.Is_custom = false;
          orderdishlist.push(item);
          AsyncStorage.setItem('Order_Dish', JSON.stringify(orderdishlist));
          ToastAndroid.show('Dish added successfully !', ToastAndroid.SHORT);
        }
      }

      this.call_storage_order();
    });
  }

  //Add Dish ingredient Storage
  add_Dish_ingredient() {
    var success = false;
    var isqtyupdate = false;
    var isgroupmax = false;
    var ingredientsList = [];
    var ingredients = {};
    ingredients['id'] = this.state.did;
    ingredients['qty'] = this.state.quantity;
    ingredients['price'] = this.state.dishPrice;
    ingredients['name'] = this.state.name;
    ingredients['group_id'] = this.state.ingredient_group_id;
    // console.log(ingredients);
    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (!res) {
        var ing = [];
        ing.push(ingredients);
        AsyncStorage.setItem('INGREDIENT', JSON.stringify(ing));
      } else {
        var group_count = 0;
        ingredientsList = JSON.parse(res);
        ingredientsList.map(item => {
          if (item.id == this.state.did) {
            if (item.qty == this.state.quantity) {
              success = true;
            } else {
              item.qty = this.state.quantity;
              isqtyupdate = true;
            }
          }
          if (item.group_id == this.state.ingredient_group_id) {
            group_count++;
          }
        });

        if (this.state.groupmax == group_count) {
          isgroupmax = true;
        }
      }
      if (success) {
        ToastAndroid.show(
          'This ingredient already exist !',
          ToastAndroid.SHORT,
        );
        this.getindiexistingqtyAdd(ingredients);
        this.setState({select_dish_dialog: false});
      } else {
        if (isqtyupdate) {
          ToastAndroid.show('Ingredient update quantity !', ToastAndroid.SHORT);
          if (this.state.quantity == 0) {
            let items = [];
            ingredientsList.map(item => {
              if (JSON.stringify(item.id) !== JSON.stringify(this.state.did))
                items.push(item);
            });
            ingredientsList = items;
            AsyncStorage.setItem('INGREDIENT', JSON.stringify(ingredientsList));
            this.getindiexistingqtyAdd(ingredients);
          } else {
            AsyncStorage.setItem('INGREDIENT', JSON.stringify(ingredientsList));
            this.getindiexistingqtyAdd(ingredients);
            this.setState({select_dish_dialog: false});
          }
        } else {
          if (isgroupmax) {
            ToastAndroid.show(
              'You have reached the maximum limit of group qty!',
              ToastAndroid.SHORT,
            );
          } else {
            ingredientsList.push(ingredients);
            ToastAndroid.show(
              'Ingredient added to your dish !',
              ToastAndroid.SHORT,
            );
            AsyncStorage.setItem('INGREDIENT', JSON.stringify(ingredientsList));
            this.setState({select_dish_dialog: false});
            this.getindiexistingqtyAdd(ingredients);
          }
        }
      }
    });
  }

  getindiexistingqtyAdd(items) {
    var itemsarray = [];
    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (res != null) {
        this.setState({ingredientexixts: JSON.parse(res)});
        this.state.ingredientexixts.map(item => {
          if (item.id == items.id) {
            itemsarray.push(
              <View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 15,
                    width: 15,
                    backgroundColor: Colors.navbarBackgroundColor,
                    borderRadius: 200 / 2,
                  }}>
                  <Text style={{color: 'white'}}>{item.qty}</Text>
                </View>
              </View>,
            );
          }
        });
      }
      return itemsarray;
    });
  }

  getindiexistingqty(item) {
    var itemsarray = [];
    if (this.state.ingredientexixts.length > 0) {
      //   console.log(this.state.ingredientexixts.length);
      //   console.log(this.state.ingredientexixts);
      this.state.ingredientexixts.map(items => {
        if (item.idingredient == items.id) {
          {
            itemsarray.push(
              <View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    width: 30,
                    backgroundColor: Colors.navbarBackgroundColor,
                    borderRadius: 200 / 2,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginRight: 3,
                    }}>
                    {items.qty}
                  </Text>
                </View>
              </View>,
            );
          }
        }
      });
    }
    return itemsarray;
  }

  renderViewMore = onPress => {
    return (
      <Text onPress={onPress} style={{color: '#ff9500', fontWeight: 'bold'}}>
        View more
      </Text>
    );
  };
  renderViewLess = onPress => {
    return (
      <Text onPress={onPress} style={{color: '#ff9500', fontWeight: 'bold'}}>
        View less
      </Text>
    );
  };

  getItemQty(item) {
    item['qty'] = 1;
    return item['qty'];
  }

  addDishQuantity(item, cart_quantity) {
    item.qty = cart_quantity < 1 ? (cart_quantity = 1) : cart_quantity;

    let items = [];
    this.state.card_dataSource.map(item => {
      items.push(item);
    });
    this.setState({card_dataSource: items});
  }

  addDish(item, cart_quantity) {
    item.qty = cart_quantity < 1 ? (cart_quantity = 1) : cart_quantity;
    let items = [];
    this.state.paymentData.map(item => {
      items.push(item);
    });
    this.setState({paymentData: items, takeTotal: item.rate * item.qty});
  }

  subDishQuantity(item, cart_quantity) {
    item.qty = cart_quantity > 1 ? cart_quantity : (cart_quantity = 1);
    let items = [];
    this.state.card_dataSource.map(item => {
      items.push(item);
    });
    this.setState({card_dataSource: items});
  }

  subDish(item, cart_quantity) {
    item.qty = cart_quantity > 1 ? cart_quantity : (cart_quantity = 1);
    let items = [];
    this.state.paymentData.map(item => {
      items.push(item);
    });
    this.setState({paymentData: items, takeTotal: item.rate * item.qty});
  }

  add_new_custom_dish() {
    var Dish = [];
    var orderdishlist = [];
    var obj = {
      ingredients: [],
    };
    AsyncStorage.getItem('INGREDIENT', (err, resINGREDIENT) => {
      if (resINGREDIENT == null) {
        ToastAndroid.show(
          'Add INGREDIENT to create custom dish !',
          ToastAndroid.SHORT,
        );
      } else {
        AsyncStorage.getItem('Order_Dish', (err, res) => {
          console.log('Order_Dish', res);
          var price = 0;
          let INGREDIENTList = [];
          INGREDIENTList = JSON.parse(resINGREDIENT);
          INGREDIENTList.map(item => {
            var total = parseFloat(item.price);
            price = price + total;
          });
          if (res == null) {
            obj['rate'] = price;
            obj['vender_id'] = 1;
            obj['id'] = null;
            obj['qty'] = 1;
            obj['Is_custom'] = true;
            obj['Is_custom_Id'] = 1;
            obj.ingredients = resINGREDIENT;
            Dish.push(obj);
            AsyncStorage.setItem('Order_Dish', JSON.stringify(Dish));
          } else {
            orderdishlist = JSON.parse(res);
            if (this.state.Is_custom_Id != null) {
              var objfind = orderdishlist.filter(
                o => o.Is_custom_Id == this.state.Is_custom_Id,
              );
              if (objfind.length > 0) {
                objfind[0].rate = price;
                objfind[0].ingredients = resINGREDIENT;
                AsyncStorage.setItem(
                  'Order_Dish',
                  JSON.stringify(orderdishlist),
                );
              }
            } else {
              obj['rate'] = price;
              obj['vender_id'] = 1;
              obj['id'] = null;
              obj['qty'] = 1;
              obj['Is_custom'] = true;
              obj['Is_custom_Id'] = orderdishlist.length + 1;
              obj.ingredients = resINGREDIENT;
              orderdishlist.push(obj);
              AsyncStorage.setItem('Order_Dish', JSON.stringify(orderdishlist));
            }
          }
          AsyncStorage.setItem('INGREDIENT', '');
          this.setState({ingredientexixts: []});

          ToastAndroid.show(
            'custom dish add successfully !',
            ToastAndroid.SHORT,
          );
          this.call_storage_order();
        });
      }
    });
  }

  filldata = () => {
    var {height, width} = Dimensions.get('window');
    var items = [];
    this.state.custom_dish_list.map((item, i) => {
      var obj = JSON.parse(item['ingredients']);
      items.push(
        <TouchableOpacity
          underlayColor="lightgray"
          onPress={() => this.get_selected_dish(item)}>
          <View
            style={
              item.Is_select == true
                ? styles.custom_select
                : styles.custom_no_select
            }>
            <View style={{flex: 0.1, alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: width * 0.02,
                  marginRight: 20,
                  color: '#808080',
                  alignSelf: 'center',
                }}>
                {i + 1}.
              </Text>
            </View>
            <View style={{flex: 0.4, alignSelf: 'center'}}>
              <Text style={{fontSize: 20, color: '#808080'}}>
                Custom({obj[0].name})
              </Text>
            </View>
            <View
              style={{flex: 0.4, alignItems: 'center', flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: width * 0.02,
                  color: '#808080',
                  paddingLeft: 30,
                }}>
                ${item.rate} x {}
              </Text>
              <Text style={{fontSize: width * 0.02, color: '#808080'}}>
                {item.qty}
              </Text>
            </View>
            <View style={{flex: 0.4, alignItems: 'center'}}>
              <Text style={{fontSize: width * 0.02, color: '#808080'}}>
                ${item.rate * item.qty}
              </Text>
            </View>
          </View>
        </TouchableOpacity>,
      );
    });
    return items;
  };

  get_selected_dish(item) {
    var objfind = this.state.custom_dish_list.filter(o => o.Is_select == true);
    if (objfind.length > 0) {
      objfind[0].Is_select = false;
    }
    item.Is_select = true;
    this.setState({Is_custom_Id: item.Is_custom_Id});
    this.setState({custom_dish_list: this.state.custom_dish_list});
  }

  custom_dish_total = () => {
    let total = 0;
    this.state.custom_dish_list.map((item, i) => {
      if (item.rate > 0) {
        total = total + item.rate * item.qty;
      }
    });
    return total;
  };

  get_custom_dish_List() {
    AsyncStorage.getItem('Order_Dish', (err, resINGREDIENT) => {
      if (resINGREDIENT != null) {
        var obj = JSON.parse(resINGREDIENT);
        obj = obj.filter(o => o.Is_custom == true);
        if (obj.length > 0) {
          obj[0].Is_select = true;
          this.setState({Is_custom_Id: obj[0].Is_custom_Id});
          this.setState({custom_dish_list: obj});
        } else {
          this.setState({custom_dish_list: []});
        }
        if (this.state.custom_dish_list.length > 0) {
          this.setState({custom_dish_dialog: true});
        } else {
          ToastAndroid.show('No Custom Dishes Added !', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('No Custom Dishes Added !', ToastAndroid.SHORT);
      }
    });
  }

  change_quntity_up() {
    var objfind = this.state.custom_dish_list.filter(o => o.Is_select == true);
    if (objfind.length > 0) {
      objfind[0].qty = objfind[0].qty + 1;
    }
    this.setState({custom_dish_list: this.state.custom_dish_list});
  }

  change_quntity_down() {
    var objfind = this.state.custom_dish_list.filter(o => o.Is_select == true);
    if (objfind.length > 0) {
      objfind[0].qty = objfind[0].qty - 1;
    }
    if (objfind[0].qty < 1) {
      objfind[0].qty = 1;
    }
    objfind[0].price * objfind[0].qty;
    this.setState({custom_dish_list: this.state.custom_dish_list});
  }

  delete_custom_quntity() {
    let items = [];
    this.state.custom_dish_list.map(item => {
      if (
        item.Is_select == undefined ||
        item.Is_select == null ||
        item.Is_select == false
      ) {
        items.push(item);
      }
    });
    this.state.custom_dish_list = items;
    this.setState({custom_dish_list: this.state.custom_dish_list});
    AsyncStorage.setItem(
      'Order_Dish',
      JSON.stringify(this.state.custom_dish_list),
    );
    AsyncStorage.getItem('Order_Dish', (err, res) => {
      if (res != null) {
        var price = 0;
        let totalList = [];
        this.setState({Order_Dish: JSON.parse(res)});
        totalList = JSON.parse(res);
        totalList.map(item => {
          var total = item.qty * parseFloat(item.rate);
          price = price + total;
        });
        this.setState({takeTotal: price});
        var obj = JSON.parse(res);
        obj = obj.filter(o => o.Is_custom == true);
        if (obj.length > 0) {
          obj[0].Is_select = true;
          this.setState({custom_dish_list: obj});
        } else {
          this.setState({custom_dish_list: []});
        }
      }
    });
    ToastAndroid.show('Dish Deleted Successfully!', ToastAndroid.SHORT);
  }

  update_quntity() {
    var qty = 0;
    var objfind = this.state.custom_dish_list.filter(o => o.Is_select == true);
    if (objfind.length > 0) {
      qty = objfind[0].qty;
    }
    AsyncStorage.getItem('Order_Dish', (err, res) => {
      var orderdishlist = JSON.parse(res);
      if (res != null) {
        if (this.state.Is_custom_Id != null) {
          var objfind = orderdishlist.filter(
            o => o.Is_custom_Id == this.state.Is_custom_Id,
          );
          if (objfind.length > 0) {
            objfind[0].qty = qty;
            AsyncStorage.setItem('Order_Dish', JSON.stringify(orderdishlist));
          }
        }

        var price = 0;
        let totalList = [];
        this.setState({Order_Dish: orderdishlist});
        totalList = orderdishlist;
        totalList.map(item => {
          var total = item.qty * parseFloat(item.rate);
          price = price + total;
        });
        this.setState({takeTotal: price});
      } else {
        this.setState({takeTotal: 0});
      }
    });
    this.setState({custom_dish_dialog: false});
    ToastAndroid.show('Dish Updated Successfully!', ToastAndroid.SHORT);
  }

  edit_custom_dish() {
    var objfind = this.state.custom_dish_list.filter(o => o.Is_select == true);
    if (objfind.length > 0) {
      AsyncStorage.setItem('INGREDIENT', objfind[0].ingredients);
      AsyncStorage.getItem('INGREDIENT', (err, res) => {
        if (res != null) {
          this.setState({ingredientexixts: JSON.parse(res)});
          this.setState({custom_dish_dialog: false});
        }
      });
    }
  }

  placeorder() {
    //alert(JSON.stringify(this.props.navigation.navigate()))

    //return

    var order_dish = [];
    var custom_order_dish_ing = [];
    var custom_order_dish = [];
    var data;

    var Menu_order = this.state.paymentData.filter(o => o.Is_custom == false);
    for (var i = 0; i < Menu_order.length; i++) {
      var obj = new Object();
      obj.dish_id = Menu_order[i].id;
      obj.qty = Menu_order[i].qty;
      obj.discount = 0;
      obj.dish_name = Menu_order[i].name;
      obj.dish_price = this.getingredients(Menu_order[i]).price;
      obj.dish_description = Menu_order[i].description;
      order_dish.push(obj);
    }
    var custom_order = this.state.paymentData.filter(o => o.Is_custom == true);
    if (custom_order.length > 0) {
      for (var i = 0; i < custom_order.length; i++) {
        var ingredients = JSON.parse(custom_order[i].ingredients)[0];
        var obj = new Object();
        obj.name = 'Custom Dish (' + ingredients.name + ')';
        obj.qty = custom_order[i].qty;
        custom_order_dish.push(obj);
        var ingredients_list = JSON.parse(custom_order[i].ingredients);

        var total = 0;
        ingredients_list.map((item, i) => {
          total = total + parseFloat(item.price).toFixed(2) * item.qty;
        });
        for (var j = 0; j < ingredients_list.length; j++) {
          var obj = new Object();
          obj.dish_name = 'Custom Dish (' + ingredients.name + ')';
          obj.dish_index = i + 1;
          obj.ingredient_id = ingredients_list[j].id;
          obj.qty = ingredients_list[j].qty;
          // obj.ingredient_group_id = ingredients_list[j].group_id;
          // obj.price = total;
          custom_order_dish_ing.push(obj);
        }
      }
    }

    //alert(JSON.stringify(custom_order_dish_ing))
    //return
    data = {
      delivery_type_id: 4,
      station_id: null,
      reference: this.state.get_last_order,
      courier_id: '1',
      courier: '123',
      customer_id: null,
      employee_id: this.state.userDetail.user_id,
      address_id: null,
      order_status_id: 2,
      till_id: null,
      note: 'this order by ' + this.state.userDetail.name,
      number: '0',
      payment: '0',
      discounts: '0',
      total_products: Menu_order.length,
      total_shipping: '0',
      tax: '0',
      total: parseFloat(this.state.takeTotal).toFixed(2),
      total_paid: '0',
      invoice: '0',
      label_url: '0',
      //"tracking_number": "2",
      // "card_number": this.state.cardNumber,
      // "expmonth": this.state.expireMonth,
      // "expyear": this.state.expireYear,
      // "cvn": this.state.cvv,
      // "card_holder_name": this.state.cardholder,
      order_date: this.convertdateformat(new Date()),
      order_dish: order_dish,
      custom_order_dish: custom_order_dish_ing,
      vender_id: this.state.vender_id,
    };

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('http://dev-fs.8d.ie/api/kitchen/addOrder', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseJsonOrder => {
        alert(JSON.stringify(responseJsonOrder));
        if (responseJsonOrder['status'] == 'success') {
          var obj = this.state.delivery_types.find(o => o.id === 4);
          var type = null;
          if (obj) {
            type = obj.label;
          }

          //this.socket.on('connect', function () { });
          this.socket.emit('employeeJoined', this.state.userDetail.user_id);
          this.socket.on('employeeJoined', userId => {});
          var obj = {
            order_id: responseJsonOrder['data'].order_id,
            vender_id: 1,
            reference: this.state.get_last_order,
            delivery_name: type,
            name: 'pending',
          };
          this.socket.emit('order_placed', obj);
          this.socket.on('disconnect', function() {});

          ToastAndroid.show(responseJsonOrder['message'], ToastAndroid.SHORT);
          AsyncStorage.setItem('INGREDIENT', '');
          AsyncStorage.setItem('Order_Dish', '');
          this.get_last_order();
          this.call_storage_order();
          this.setState({payment_dialog: false});

          this.props.navigation.navigate('Order_success', {
            status: 'Success',
            order_no: this.state.get_last_order,
          });
        } else {
          ToastAndroid.show(responseJsonOrder['message'], ToastAndroid.SHORT);
          this.props.navigation.navigate('Order_success', {status: 'Fail'});
        }
      });
  }

  convertdateformat(date) {
    var date = new Date(date);
    var firstdayMonth = date.getMonth() + 1;
    var firstdayDay = date.getDate();
    var firstdayYear = date.getFullYear();
    var firstdayMinutes = date.getMinutes();
    var firstdayHours = date.getHours();
    var firstdaySeconds = date.getSeconds();

    return (
      ('0000' + firstdayYear.toString()).slice(-4) +
      '-' +
      ('00' + firstdayMonth.toString()).slice(-2) +
      '-' +
      ('00' + firstdayDay.toString()).slice(-2) +
      ' ' +
      ('00' + firstdayHours.toString()).slice(-2) +
      ':' +
      ('00' + firstdayMinutes.toString()).slice(-2) +
      ':' +
      ('00' + firstdaySeconds.toString()).slice(-2)
    );
  }

  getingredients(item) {
    let items = {};
    let ingredient = null;
    let price = 0;
    let totalprice = 0;
    if (item.rate > 0) {
      price = item.rate * item.qty;
      items['price'] = parseFloat(price).toFixed(2);
      return items;
    } else {
      item.ingredients.map((item, i) => {
        price = price + parseFloat(item.price).toFixed(2) * item.qty;
      });
      price = price * item.qty;
      items['price'] = parseFloat(price).toFixed(2);
      return items;
    }
  }

  render() {
    const {isSwitchOn} = this.state;
    const user_details = this.state.userDetail;
    var {height, width} = Dimensions.get('window');
    var left = (
      <Left style={{flex: 1, flexDirection: 'row'}}>
        <Button
          style={{flex: 1}}
          onPress={() => this._sideMenuDrawer.open()}
          transparent>
          <FontAwesomeIcon icon={faBars} size={25} style={{color: 'white'}} />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{flex: 1}}>
        <TouchableOpacity onPress={() => this.get_custom_dish_List()}>
          <Image
            source={require('../images/bar_icon.png')}
            style={{height: 42, width: 42}}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingHorizontal: 8}}
          onPress={() => this.show_card()}>
          <Image
            source={require('../images/menu_list-5122.png')}
            style={{height: 42, width: 42}}></Image>
        </TouchableOpacity>
        <Button transparent>
          <View style={{width: 45, height: 45, top: 5}}>
            <Image
              style={{width: 42, height: 42}} // must be passed from the parent, the number may vary depending upon your screen size
              source={require('../images/dish-create.png')}></Image>
          </View>

          {this.state.Order_Dish.length > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: 3,
                right: 8,
                justifyContent: 'center',
                alignItems: 'center',
                height: 20,
                width: 20,
                backgroundColor: 'red',
                borderRadius: 200 / 2,
              }}>
              <Text style={{color: 'white'}}>
                {this.state.Order_Dish.length}
              </Text>
            </View>
          ) : null}
        </Button>
      </Right>
    );

    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        navigation={this.props}>
        <Container style={{backgroundColor: '#ebeff0'}}>
          <KeyboardAvoidingView behavior="padding" enabled>
            {/* open ingredient model */}
            {/* <Dialog
              visible={this.state.select_dish_dialog}
              dialogStyle={{
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#efeff4',
                width: '50%',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#efeff4',
              }}
              onTouchOutside={() => this.setState({select_dish_dialog: false})}>
              <View style={{height: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: 'lightgrey',
                        paddingBottom: 15,
                        marginBottom: 0,
                        fontSize: 23,
                      }}>
                      Select {this.state.groupname}
                    </Text>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({select_dish_dialog: false})
                      }>
                      <FontAwesomeIcon
                        icon={faWindowClose}
                        color={'#ff9500'}
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{marginLeft: 20, marginTop: 20}}>
                      <Image
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 100,
                          height: 100,
                          backgroundColor: 'white',
                        }}
                        source={{
                          uri: 'http://dev-fs.8d.ie/' + this.state.cover,
                        }}></Image>
                    </View>
                    <View style={{marginLeft: 40, marginTop: 10}}>
                      <Text
                        style={{fontSize: width * 0.018, fontWeight: 'bold'}}>
                        {this.state.name}
                      </Text>
                      <Text style={{fontSize: 16, width: 350, marginTop: 10}}>
                        {this.state.description}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: '#ccccde',
                    flex: 1,
                  }}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Button
                      block
                      icon
                      transparent
                      style={{marginTop: 10}}
                      onPress={() =>
                        this.setState({
                          quantity:
                            this.state.quantity > 0
                              ? this.state.quantity - 1
                              : 0,
                        })
                      }>
                      <FontAwesomeIcon
                        icon={faMinus}
                        color={'orange'}
                        size={20}
                      />
                    </Button>

                    <Text
                      style={{
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: width * 0.018,
                        marginLeft: 30,
                        marginTop: 20,
                      }}>
                      {this.state.quantity}
                    </Text>

                    <Button
                      block
                      icon
                      transparent
                      style={{marginLeft: 30, marginTop: 10}}
                      onPress={() => this.addQuantity()}>
                      <FontAwesomeIcon
                        icon={faPlus}
                        color={'orange'}
                        size={20}
                      />
                    </Button>

                    <TouchableOpacity
                      style={{
                        paddingLeft: 30,
                        paddingRight: 30,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: '#ff9500',
                      }}
                      onPress={() => this.add_Dish_ingredient()}>
                      <Text style={{fontSize: width * 0.018, color: 'white'}}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Dialog> */}
            <Dialog
              visible={this.state.select_dish_dialog}
              dialogStyle={{
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#efeff4',
                width: '40%',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#efeff4',
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0.95}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: 'lightgrey',
                      fontSize: width * 0.02,
                    }}>
                    Select {this.state.groupname}
                  </Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.setState({select_dish_dialog: false})}>
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      color={'#ff9500'}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginVertical: 15}}>
                <View
                  style={{
                    flex: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: 'white',
                    }}
                    source={{
                      uri: 'http://dev-fs.8d.ie/' + this.state.cover,
                    }}></Image>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      fontSize: width * 0.016,
                      fontWeight: '900',
                      textAlign: 'left',
                    }}>
                    {this.state.name}
                  </Text>
                  <Text style={{fontSize: width * 0.012, textAlign: 'left'}}>
                    {this.state.description}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderTopColor: 'lightgrey',
                  borderTopWidth: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      this.setState({
                        quantity:
                          this.state.quantity > 0 ? this.state.quantity - 1 : 0,
                      })
                    }>
                    <FontAwesomeIcon
                      icon={faMinus}
                      color={'orange'}
                      size={width * 0.018}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: width * 0.018,
                      marginHorizontal: 20,
                    }}>
                    {this.state.quantity}
                  </Text>

                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => this.addQuantity()}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      color={'orange'}
                      size={width * 0.018}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.no}
                    onPress={() => this.add_Dish_ingredient()}>
                    <Text style={{fontSize: width * 0.015, color: 'white'}}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Dialog>
            {/* Custome Dish List Dialog */}
            <Dialog
              visible={this.state.custom_dish_dialog}
              dialogStyle={{
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#efeff4',
                width: '80%',
                margin: 0,
                padding: 0,
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#efeff4',
              }}
              onTouchOutside={() =>
                this.setState({edit_history_dialog: false})
              }>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0.99, margin: 0, padding: 0}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: 'lightgrey',
                      paddingBottom: 5,
                      fontSize: width * 0.02,
                    }}>
                    Order - {this.state.get_last_order}
                  </Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={{marginBottom: 40, marginStart: 50}}
                    onPress={() => this.setState({custom_dish_dialog: false})}>
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      color={'#ff9500'}
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 0.78,
                    borderRightWidth: 1,
                    borderRightColor: 'lightgrey',
                    padding: 10,
                  }}>
                  {this.filldata()}
                </View>
                <View
                  style={{
                    flex: 0.22,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity
                      style={[styles.add_btn, {paddingHorizontal: 25}]}
                      onPress={() => this.change_quntity_down()}>
                      <Text style={{fontSize: width * 0.025, color: 'white'}}>
                        -
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.add_btn, {paddingHorizontal: 20}]}
                      onPress={() => this.change_quntity_up()}>
                      <Text style={{fontSize: width * 0.025, color: 'white'}}>
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.add_btn,
                      {
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: 160,
                      },
                    ]}
                    onPress={() => this.delete_custom_quntity()}>
                    <Text
                      style={{
                        fontSize: width * 0.025,
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      DEL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.add_btn,
                      {justifyContent: 'center', alignSelf: 'center'},
                    ]}
                    onPress={() => this.edit_custom_dish()}>
                    <Text style={{fontSize: width * 0.025, color: 'white'}}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity style={styles.print_btn}>
                      <FontAwesomeIcon icon={faPrint} size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.print_btn}>
                      <FontAwesomeIcon icon={faReceipt} size={25} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginTop: 20,
                  borderTopColor: 'lightgrey',
                  borderTopWidth: 1,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: width * 0.03,
                    alignSelf: 'flex-start',
                    flex: 0.4,
                    textAlign: 'left',
                    marginTop: 10,
                    paddingVertical: 10,
                    color: '#5a5a5a',
                  }}>
                  {/* Total: ${totalPrice} */}
                </Text>
                <View
                  style={{
                    left: -200,
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View style={{width: width * 0.15}}>
                    <Text style={{fontSize: width * 0.03, color: '#5a5a5a'}}>
                      Total:
                    </Text>
                  </View>
                  <Text style={{fontSize: width * 0.03, color: '#5a5a5a'}}>
                    {this.custom_dish_total()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.add_btn}
                  onPress={() => this.update_quntity()}>
                  <Text style={{fontSize: width * 0.025, color: 'white'}}>
                    UPDATE
                  </Text>
                </TouchableOpacity>
              </View>
            </Dialog>
            {/* open dish menu model */}
            <Dialog
              visible={this.state.card_dish_dialog}
              dialogStyle={{
                borderRadius: 20,
                borderWidth: 3,
                borderColor: '#efeff4',
                width: '50%',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#efeff4',
                marginBottom: 25,
              }}
              onTouchOutside={() => this.setState({card_dish_dialog: false})}>
              <View style={{flexDirection: 'row-reverse'}}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    marginBottom: 8,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setState({card_dish_dialog: false})}>
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      color={'#ff9500'}
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                <FlatList
                  pagingEnabled={this.state.card_dish_dialog}
                  data={this.state.card_dataSource}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <View
                      style={{flexDirection: 'column', paddingVertical: 10}}>
                      <Card containerStyle={styles.cardview}>
                        {item.cover == '' ||
                        item.cover == null ||
                        item.cover == undefined ? (
                          <Image
                            style={{
                              width: '100%',
                              height: width * 0.2,
                              borderTopLeftRadius: 15,
                              borderTopRightRadius: 15,
                            }}
                            source={require('../images/b1.jpg')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: '100%',
                              height: width * 0.2,
                              borderTopLeftRadius: 15,
                              borderTopRightRadius: 15,
                            }}
                            source={{
                              uri: 'http://dev-fs.8d.ie/' + item.cover,
                            }}></Image>
                        )}
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                          }}>
                          <View style={{flex: 0.8, flexDirection: 'column'}}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: width * 0.018,
                                paddingTop: 8,
                              }}>
                              {item.name}
                            </Text>
                            <ViewMoreText
                              numberOfLines={3}
                              renderViewMore={this.renderViewMore}
                              renderViewLess={this.renderViewLess}
                              textStyle={{
                                fontSize: 15,
                                color: 'grey',
                                paddingBottom: 10,
                              }}>
                              <Text style={{marginTop: 10}}>
                                {item.description}
                              </Text>
                            </ViewMoreText>
                          </View>

                          <View
                            style={{
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#ff9500',
                                fontWeight: 'bold',
                                fontSize: width * 0.018,
                                marginLeft: 8,
                                marginTop: 8,
                              }}>
                              $ {item.rate}
                            </Text>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                              }}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.subDishQuantity(
                                    item,
                                    parseInt(item.qty) - 1,
                                  )
                                }>
                                <FontAwesomeIcon
                                  icon={faMinus}
                                  color={'orange'}
                                  size={20}
                                />
                              </TouchableOpacity>

                              <Text
                                style={{
                                  textAlign: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  fontSize: width * 0.018,
                                  paddingHorizontal: 10,
                                }}>
                                {item.qty}
                              </Text>

                              <TouchableOpacity
                                onPress={() =>
                                  this.addDishQuantity(
                                    item,
                                    parseInt(item.qty) + 1,
                                  )
                                }>
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  color={'orange'}
                                  size={20}
                                />
                              </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                              style={{
                                backgroundColor: '#ff9500',
                                height: 35,
                                width: 60,
                                borderRadius: 10,
                                marginTop: 10,
                                justifyContent: 'center',
                              }}
                              onPress={() => this.card_add_dish(item)}>
                              <Text
                                style={{
                                  fontSize: width * 0.018,
                                  fontWeight: 'bold',
                                  color: 'white',
                                  textAlign: 'center',
                                }}>
                                Add
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Card>
                    </View>
                  )}
                  keyExtractor={({id}, index) => id}
                />
              </ScrollView>
            </Dialog>
            {/* open dish payment model */}
            <Dialog
              visible={this.state.payment_dialog}
              dialogStyle={{
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#efeff4',
                width: '90%',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#efeff4',
              }}>
              <ScrollView>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: 'lightgrey',
                        paddingTop: 10,
                        paddingBottom: 10,
                        fontSize: 23,
                      }}>
                      Take Payment
                    </Text>
                  </View>
                  <View style={{justifyContent: 'center', marginLeft: 40}}>
                    <TouchableOpacity
                      onPress={() => this.setState({payment_dialog: false})}>
                      <FontAwesomeIcon
                        icon={faWindowClose}
                        color={'#ff9500'}
                        size={35}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 0.5,
                      borderRightWidth: 1,
                      borderRightColor: 'lightgrey',
                    }}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'lightgrey',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 15,
                          justifyContent: 'center',
                        }}>
                        <View style={{width: width * 0.1}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Cash:
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: 40,
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                            alignSelf: 'flex-end',
                          }}
                          placeholder=""
                          defaultValue={this.state.cash.toString()}
                          onChange={() => this._totalChange()}
                          keyboardType={'numeric'}
                          onChangeText={cash => this.setState({cash: cash})}
                        />
                      </View>
                    </View>

                    <View style={{height: 180}}>
                      <ScrollView>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.2, justifyContent: 'center'}}>
                            <Text
                              style={{
                                fontSize: width * 0.018,
                                color: '#76726d',
                                textAlign: 'center',
                              }}>
                              Srno.
                            </Text>
                          </View>
                          <View style={{flex: 0.4, justifyContent: 'center'}}>
                            <Text
                              style={{
                                fontSize: width * 0.018,
                                color: '#76726d',
                                textAlign: 'center',
                              }}>
                              Name
                            </Text>
                          </View>
                          <View style={{flex: 0.2, justifyContent: 'center'}}>
                            <Text
                              style={{
                                fontSize: width * 0.018,
                                color: '#76726d',
                                textAlign: 'center',
                              }}>
                              Qty
                            </Text>
                          </View>
                          <View style={{flex: 0.2, justifyContent: 'center'}}>
                            <Text
                              style={{
                                fontSize: width * 0.018,
                                color: '#76726d',
                                textAlign: 'center',
                              }}>
                              Price
                            </Text>
                          </View>
                        </View>
                        {this.showDishPaymentBox()}
                      </ScrollView>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                    }}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'lightgrey',
                        paddingBottom: 20,
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                      <View style={styles.touchable1}>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onDigitPresssum(7);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              color: 'grey',
                            }}>
                            7
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onDigitPresssum(8);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            8
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onDigitPresssum(9);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            9
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'orange',
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            marginHorizontal: 10,
                          }}
                          onPress={() => {
                            this.onPercentCash('%');
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            %
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'orange',
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            marginHorizontal: 10,
                          }}
                          onPress={() => {}}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            -
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.touchable2}>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onDigitPresssum(4);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            4
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onDigitPresssum(5);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            5
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onDigitPresssum(6);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            6
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.print_btn}>
                          <FontAwesomeIcon icon={faPrint} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.print_btn}>
                          <FontAwesomeIcon icon={faReceipt} size={25} />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 15,
                          flexDirection: 'row',
                        }}>
                        <View style={{}}>
                          <View
                            style={{flexDirection: 'row', marginVertical: 10}}>
                            <TouchableOpacity
                              style={styles.touchablenumber1}
                              onPress={() => {
                                this.onDigitPresssum(1);
                              }}>
                              <Text
                                style={{
                                  fontSize: width * 0.018,
                                  // fontWeight: 'bold',
                                  color: 'grey',
                                }}>
                                1
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.touchablenumber1}
                              onPress={() => {
                                this.onDigitPresssum(2);
                              }}>
                              <Text
                                style={{
                                  fontSize: width * 0.018,
                                  // fontWeight: 'bold',
                                  color: 'grey',
                                }}>
                                2
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.touchablenumber1}
                              onPress={() => {
                                this.onDigitPresssum(3);
                              }}>
                              <Text
                                style={{
                                  fontSize: width * 0.018,
                                  // fontWeight: 'bold',
                                  color: 'grey',
                                }}>
                                3
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginBottom: 10,
                            }}>
                            <TouchableOpacity
                              style={styles.touchablenumber1}
                              onPress={() => {
                                this.onZeroPress(0);
                              }}>
                              <Text
                                style={{
                                  fontSize: width * 0.018,
                                  // fontWeight: 'bold',
                                  color: 'grey',
                                }}>
                                0
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.touchablenumber1}
                              onPress={() => {
                                this.onDoubleZeroPress();
                              }}>
                              <Text
                                style={{
                                  fontSize: width * 0.018,
                                  // fontWeight: 'bold',
                                  color: 'grey',
                                }}>
                                00
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.touchablenumber1}
                              onPress={() => {
                                this.onDigitPresssum('.');
                              }}>
                              <Text
                                style={{
                                  fontSize: width * 0.018,
                                  // fontWeight: 'bold',
                                  color: 'grey',
                                }}>
                                .
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View
                          style={{
                            margin: 10,
                          }}>
                          <TouchableOpacity
                            style={{
                              height: 90,
                              width: 100,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 10,
                              backgroundColor: 'white',
                            }}
                            onPress={() => {
                              this.onClearPress('');
                            }}>
                            <Text
                              style={{
                                fontSize: width * 0.025,
                                fontWeight: '300',
                                color: 'grey',
                              }}>
                              CE
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <View style={styles.touchable1}>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDigitPresssum(50);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            50
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDigitPresssum(20);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            20
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDigitPresssum(10);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            10
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDigitPresssum(2);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            2
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.touchable1}>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDigitPresssum(1);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            1
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDecimalPointPresssum(0.5);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            0.5
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDecimalPointPresssum(0.2);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            0.2
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.touchablenumber2}
                          onPress={() => {
                            this.onDecimalPointPresssum(0.1);
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.018,
                              // fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            0.1
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    borderTopColor: 'lightgrey',
                    borderTopWidth: 1,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      alignSelf: 'flex-start',
                      marginLeft: 10,
                      flex: 20,
                      textAlign: 'left',
                      marginTop: 10,
                      paddingVertical: 10,
                      color: 'grey',
                      textAlign: 'center',
                    }}>
                    Total : {this.state.takeTotal}
                  </Text>

                  <Text
                    style={{
                      fontSize: width * 0.03,
                      alignSelf: 'center',
                      flex: 30,
                      marginLeft: 20,
                      marginTop: 10,
                      paddingVertical: 10,
                      color: 'grey',
                      textAlign: 'center',
                    }}>
                    Return :{' '}
                    {this.state.cash == 0
                      ? 0
                      : (
                          parseFloat(this.state.cash) - this.state.takeTotal
                        ).toFixed(2)}
                  </Text>

                  <View
                    style={{
                      flex: 30,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <Text
                      style={{
                        fontSize: width * 0.03,
                        alignSelf: 'center',
                        color: 'grey',
                      }}>
                      Receipt :
                    </Text>

                    <Switch
                      trackColor={{true: 'white', false: 'white'}}
                      value={isSwitchOn}
                      color="white"
                      thumbColor={
                        this.state.isSwitchOn == true ? 'orange' : 'grey'
                      }
                      onValueChange={() => {
                        this.setState({isSwitchOn: !isSwitchOn});
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 20,
                      justifyContent: 'center',
                    }}>
                    {this.state.cash > 0 ? (
                      <TouchableOpacity
                        style={styles.add_btn}
                        onPress={() => this.placeorder()}>
                        <Text
                          style={{
                            fontSize: 25,
                            color: 'white',
                            textAlign: 'center',
                          }}>
                          Pay
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </ScrollView>
            </Dialog>
          </KeyboardAvoidingView>
          <Navbar left={left} right={right} title="Payment" />
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              top: 35,
              left: 0,
              right: 0,
            }}>
            <Image
              style={{
                width: width * 0.06,
                height: width * 0.06,
                borderRadius: (width * 0.06) / 2,
              }}
              source={{
                uri: 'http://dev-fs.8d.ie/storage/' + user_details.wok,
              }}
            />
          </View>
          <View style={{flex: 0.9, flexDirection: 'row', padding: 5}}>
            <FlatList
              data={this.state.dataSource}
              keyExtractor={({id}, index) => id}
              numColumns={8}
              renderItem={({item}) => (
                <View style={{justifyContent: 'space-evenly'}}>
                  {item.isgroup == true ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#ff9500',
                        height: width * 0.116,
                        width: width * 0.116,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        marginLeft: width * 0.0075,
                        marginTop: width * 0.0075,
                      }}>
                      <Image
                        style={{
                          height: width * 0.1,
                          width: width * 0.1,
                          backgroundColor: '#ff9500',
                        }}
                        source={{uri: 'http://dev-fs.8d.ie/' + item.cover}}
                      />
                      <Text
                        style={{
                          position: 'absolute',
                          fontSize: width * 0.025,
                          color: 'white',
                          top: width * 0.02,
                          width: width * 0.08,
                          textAlign: 'center',
                          lineHeight: width * 0.025,
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                        }}>
                        {item.name}
                      </Text>

                      <Text
                        style={{
                          position: 'absolute',
                          fontSize: width * 0.012,
                          color: 'white',
                          bottom: width * 0.02,
                        }}>
                        MAX{' '}
                        <Text
                          style={{
                            position: 'absolute',
                            fontSize: width * 0.01,
                            color: 'white',
                            bottom: width * 0.02,
                          }}>
                          {item.max}
                        </Text>{' '}
                        SEL.
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.ingredients_data(item)}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginLeft: width * 0.0075,
                          marginTop: width * 0.0075,
                        }}>
                        <Image
                          style={{
                            height: width * 0.116,
                            width: width * 0.116,
                            backgroundColor: 'white',
                          }}
                          source={{uri: 'http://dev-fs.8d.ie/' + item.cover}}
                        />
                        <Text
                          style={{
                            position: 'absolute',
                            fontSize: width * 0.012,
                            top: 5,
                            marginLeft: 8,
                          }}>
                          {item.sequence}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {this.getindiexistingqty(item)}
                </View>
              )}
            />
          </View>
          <Footer
            style={{
              backgroundColor: Colors.navbarBackgroundColor,
              position: 'absolute',
              bottom: 0,
            }}
            backgroundColor={Colors.navbarBackgroundColor}>
            <Left>
              <View style={{left: 10}}>
                <Text
                  style={{
                    color: 'white',
                    width: '100%',
                    fontSize: width * 0.035,
                  }}>
                  Total : {this.state.takeTotal}
                </Text>
              </View>
            </Left>
            <Body>
              <Button transparent onPress={() => this.take_payment()}>
                <Text
                  style={{
                    color: 'white',
                    width: '100%',
                    fontSize: width * 0.035,
                    textAlign: 'center',
                  }}>
                  Pay Now
                </Text>
              </Button>
            </Body>
            <Right>
              <Button transparent onPress={() => this.add_new_custom_dish()}>
                <View style={styles.viewfooterimg}>
                  <Image
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      right: 20,
                    }} // must be passed from the parent, the number may vary depending upon your screen size
                    source={require('../images/dish-create.png')}></Image>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 35,
                    width: 35,
                    right: 5,
                    backgroundColor: 'red',
                    borderRadius: 200 / 2,
                  }}>
                  <FontAwesomeIcon icon={faPlus} color={'white'} size={25} />
                </View>
              </Button>
            </Right>
          </Footer>
        </Container>
      </SideMenuDrawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  no: {
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#ff9500',
  },
  add_btn: {
    marginTop: 10,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#ff9500',
  },
  touchable1: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  touchable2: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  touchablenumber1: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  touchablenumber2: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 13,
  },
  cardview: {
    flexDirection: 'column',
    padding: 0,
    paddingBottom: 12,
    borderRadius: 15,
  },
  print_btn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
  },
  camera_icon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 200 / 2,
    height: 80,
    width: 80,
    backgroundColor: 'white',
    opacity: 0.7,
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  create_btn: {
    marginTop: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 45,
    paddingRight: 45,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#ff9500',
  },
  button: {
    width: '100%',
    height: 40,
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  buttonText: {
    color: 'grey',
    textAlign: 'center',
  },
  TextInputStyle: {
    textAlign: 'center',
    height: 40,
    width: '100%',
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#ff9500',
  },
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 200 / 2,
    height: 50,
    width: 50,
    backgroundColor: '#ff9500',
    borderColor: '#ff9500',
    left: 120,
    bottom: 20,
  },
  custom_select: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  custom_no_select: {
    flexDirection: 'row',
    borderRadius: 20,
  },
});
