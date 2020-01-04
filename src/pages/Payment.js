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
  CheckBox,
  ScrollView,
  Alert,
} from 'react-native';
import {Button, Left, Right, Grid, Col, Row, Picker, Switch} from 'native-base';
import Navbar from '../components/Navbar';
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

var price = 0;
export default class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSwitchOn: false,
      add_dish_dialog: false,
      payment_dialog: false,
      // edit_dialog: false,
      card_dish_dialog: false,
      cash: 0,
      dataSource: '',
      card_dataSource: '',
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
      // d_name: '',
      max: null,
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
      // textInputData: '',
      // getValue: '',count: 0,
      userDetail: '',
      paymentData: [],
      totalPriceCustom: 0,
      dishPrice: '',
      takeTotal: '',
    };
    this.dishQty = [];
    this._retrieveData();

    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (res != null) {
        var price = 0;
        let totalList = [];
        this.setState({ingredientexixts: JSON.parse(res)});
        totalList = JSON.parse(res);
        console.log(totalList);
        totalList.map(item => {
          var total = item.qty * parseFloat(item.price);
          console.log('total = ' + total);
          price = price + total;
        });
        console.log('Price= ' + price);
        this.setState({totalPriceCustom: price});
      }
      this.main_callvenderingredient();
    });

    AsyncStorage.getItem('Order_Dish', (err, res) => {
      if (res) {
        this.setState({paymentData: JSON.parse(res)});
      }
      console.log(JSON.parse(res));
    });
  }

  orderFunction = () => {
    AsyncStorage.getItem('Order_Dish', (err, res) => {
      if (res) {
        this.setState({paymentData: JSON.parse(res)});
      }
      console.log(JSON.parse(res));
    });
  };

  customFunction = () => {
    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (res != null) {
        var price = 0;
        let totalList = [];
        this.setState({ingredientexixts: JSON.parse(res)});
        totalList = JSON.parse(res);
        console.log(totalList);
        totalList.map(item => {
          var total = item.qty * parseFloat(item.price);
          console.log('total = ' + total);
          price = price + total;
        });
        console.log('Price= ' + price);
        this.setState({totalPriceCustom: price});
      }
      // this.main_callvenderingredient();
    });
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        this.setState({userDetail: JSON.parse(value), count: 1});
        this.componentDidMount();
      }
    } catch (error) {
      alert(error);
    }
  };

  componentDidMount() {}

  // saveValueFunction = () => {
  //     //function to save the value in AsyncStorage
  //     if (this.state.textInputData) {
  //         //To check the input not empty
  //         AsyncStorage.setItem('data', this.state.textInputData);
  //         //Setting a data to a AsyncStorage with respect to a key
  //         //Setting a data to a AsyncStorage with respect to a key
  //         //Setting a data to a AsyncStorage with respect to a key
  //         this.setState({ textInputData: '' })
  //         //Resetting the TextInput
  //         alert('Data Saved');
  //         //alert to confirm
  //     } else {
  //         alert('Please fill data');
  //         //alert for the empty InputText
  //     }
  // };
  // getValueFunction = () => {
  //     //function to get the value from AsyncStorage
  //     AsyncStorage.getItem('data').then(value =>
  //         //AsyncStorage returns a promise so adding a callback to get the value
  //         this.setState({ getValue: value })
  //         //Setting the value in Text
  //         //Setting the value in Text
  //         //Setting the value in Text
  //     );
  // };

  // onValueChange(value) {
  //     this.setState({
  //         selected: value
  //     });
  // }

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
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({card_dish_dialog: true});
          for (var i = 0; i < responseJson.data.length; i++) {
            responseJson.data[i].qty = 1;
          }
          console.log('responseJson.data');
          console.log(responseJson.data);
          this.setState({card_dataSource: responseJson.data});
          // console.log(this.dishQty);
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  take_payment = () => {
    this.setState({payment_dialog: true});
    this.orderFunction();
    this.customFunction();
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
              responseJson.ingredientGroups[i].ingredients[
                j
              ].isexisting = false;
              responseJson.ingredientGroups[i].ingredients[j].iscreate = false;
              responseJson.ingredientGroups[i].ingredients[j].isgroup = false;
              responseJson.ingredientGroups[i].ingredients[j].groupname =
                responseJson.ingredientGroups[i].name;
              ingredientGroups.push(
                responseJson.ingredientGroups[i].ingredients[j],
              );
            }
          }
          console.log(ingredientGroups);
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

  add_dish = () => {
    this.setState({add_dish_dialog: true});
  };

  ingredients_data = item => {
    this.setState({did: item.idingredient});
    this.setState({dishPrice: item.dishPrice});
    this.setState({groupname: item.groupname});
    this.setState({max: item.max});
    this.setState({name: item.name});
    this.setState({description: item.description});
    // console.log(item.idingredient);
    // console.log(item.groupname);
    // console.log(item.max);
    // console.log(item.name);
    // console.log(item.description);
    // console.log(item.price);
    this.state.ingredientexixts.map(items => {
      if (item.id == items.id) {
        this.setState({quantity: items.qty});
        this.setState({dishPrice: items.dishPrice});
      }
    });
    console.log(this.state.ingredientexixts);
    this.setState({select_dish_dialog: true});
    // console.log(this.state.ingredientexixts.length);
    // console.log(this.state.ingredientexixts);
  };

  opencamera = () => {
    const options = {
      noData: true,
    };
    RNImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log(response);
        this.setState({
          img_uri: response.uri,
          avatar: response,
        });
      }
    });
  };

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

  create_dish() {
    var ingredientsList = [];

    for (var i = 0; i < this.state.ingredientexixts.length; i++) {
      var obj = new Object();
      obj.id = this.state.ingredientexixts[i].id;
      obj.qty = this.state.ingredientexixts[i].qty;
      ingredientsList.push(obj);
    }

    // let auth = 'Bearer ' + this.state.access_token;
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU2MTE1NTZiYTJmZjUxZDlmNTg4ZWY0N2MxY2EzNDZiN2Q2NWQ5YjEyZGIxYzJkZWZkZTRlMjg3NzU2YTQ4NjE0YmY4YWU0OWQ0ZDZkM2VjIn0.eyJhdWQiOiIxIiwianRpIjoiNTYxMTU1NmJhMmZmNTFkOWY1ODhlZjQ3YzFjYTM0NmI3ZDY1ZDliMTJkYjFjMmRlZmRlNGUyODc3NTZhNDg2MTRiZjhhZTQ5ZDRkNmQzZWMiLCJpYXQiOjE1NzIwMTExMTcsIm5iZiI6MTU3MjAxMTExNywiZXhwIjoxNjAzNjMzNTE3LCJzdWIiOiIzMSIsInNjb3BlcyI6W119.tbhBgFC_mbmVdP924vH0RcIhmOa7Vd8tPnLIGeFMjFz9TptGIFXDf9jp44yEYSAR5JZq31kz3yth92lQnMgdSg-ah1vqyo_OWETzMTxlQaRbpSnuWX9tFGT53wbbR4QHCrTMGi72cumIvMV0E4z-XqxKJnMjiWN91HhPznGiVlT5gu1Y9AUDpxn1vXuNRNYhHO_3jxqJIqxucCln-ZMeZ38-jUgcj_bi7b5gS62mX08KuLqpNMJTzC3PLjW7krbuHS0Ac8TLVDrYH0sDgK4waXmDaNNY8Sp1wx1MHUN1Jzmwog1ACUvyrasT4J2aoxbr0L_Mvyqu-nSpMexZw4CkrM8h8h1sAjPp4JCxKRtzVyBKTaFzXg6ZNWYEzo19MgWHa0Noj23t2TZeVULO3udmt5wyMY4W9rKpFW1JoaUb5inmFTCDTdUSdFXNpMBGYi-Jx3lP5H1pkPI4IFfzOvgFEy0FrekPClC622JNRlLoVllJSTNFN-660kcwQltG6vETH8Xb4isF03GeLhwew7z4P0cGyw_wIsvhyCOx3uEB2vJnpf5QTCVD1knqZYkwxnfbPs7zcos1oWJOmFADkbNeBx1Ti3hBzW16eXN3kKGmoY9W5FVTZSq0M9W_rQI_n7tvl9BqaTukiSpRwMJw1FuDFpr9T5P3ANFR6m8LzhOkPhs';
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', auth);

    var data = {
      vender_id: 1,
      name: this.state.dishname,
      employee_id: null,
      description: this.state.dishdescription,
      is_popular: this.state.isPopular,
      ingredients: ingredientsList,
    };

    if (this.state.dishname != ' ' && this.state.dishname != null) {
      //return
      fetch('http://dev-fs.8d.ie/api/dishes', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson['dish'] != undefined) {
            // alert(JSON.stringify(responseJson["dish"]));
            ToastAndroid.show('Dish creatded succefully !', ToastAndroid.SHORT);

            AsyncStorage.setItem('INGREDIENT', '');
            this.setState({ingredientexixts: []});
          } else {
            ToastAndroid.show(
              'Dish does not creatded succefully !',
              ToastAndroid.SHORT,
            );
          }
        });
    } else {
      this.setState({add_dish_dialog: true});
      ToastAndroid.show('Enter Dish Name !', ToastAndroid.SHORT);
    }
  }

  showDishPaymentBox = () => {
    var items = [];

    if (this.state.paymentData) {
      this.state.paymentData.map((item, i) => {
        var total = item.qty * parseInt(item.rate);
        console.log('total = ' + total);
        price = price + total;
        console.log('price = ' + price);
        items.push(
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.2, justifyContent: 'center'}}>
              <Text style={{fontSize: 20}}>{i + 1}</Text>
            </View>
            <View style={{flex: 0.35, justifyContent: 'center'}}>
              <Text style={{fontSize: 20}}>{item.name}</Text>
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
                    this.subDish(item, parseInt(item.qty) - 1);
                  }}>
                  <FontAwesomeIcon icon={faMinus} size={20} color={'#ff9500'} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, marginHorizontal: 5}}>
                  {item.qty}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.addDish(item, parseInt(item.qty) + 1);
                  }}>
                  <FontAwesomeIcon icon={faPlus} size={20} color={'#ff9500'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flex: 0.2, justifyContent: 'center'}}>
              <Text style={{fontSize: 20}}>${item.rate * item.qty}</Text>
            </View>
          </View>,
        );
      });
      items.push(this.showCustomDish(this.state.paymentData.length));
      // this.setState({takeTotal: price});
      // Alert.alert(this.state.takeTotal);
    }
    return items;
  };

  showCustomDish = i => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.2, justifyContent: 'center'}}>
          <Text style={{fontSize: 20}}>{i + 1}</Text>
        </View>
        <View style={{flex: 0.35, justifyContent: 'center'}}>
          <Text style={{fontSize: 20}}>Custom Dish</Text>
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
            <Text style={{fontSize: 20, marginHorizontal: 5}}>
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
          <Text style={{fontSize: 20}}>
            ${(this.state.qty * this.state.totalPriceCustom).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  card_add_dish(item) {
    var success = false;
    var isqtyupdate = false;
    var orderdishlist = [];
    console.log('Dish: ' + item.name);
    AsyncStorage.getItem('Order_Dish', (err, res) => {
      console.log(res);
      if (!res) {
        var Dish = [];
        item.qty = this.state.dishqty;
        // item.name = this.state.d_name;
        Dish.push(item);
        console.log('Dish' + Dish);
        AsyncStorage.setItem('Order_Dish', JSON.stringify(Dish));
      } else {
        orderdishlist = JSON.parse(res);
        // console.log(orderdishlist);
        orderdishlist.map(items => {
          if (items.id == item.id) {
            if (items.qty == item.qty) {
              success = true;
              console.log(items);
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
          orderdishlist.push(item);
          AsyncStorage.setItem('Order_Dish', JSON.stringify(orderdishlist));
          ToastAndroid.show('Dish added successfully !', ToastAndroid.SHORT);
        }
      }
    });
  }

  add_Dish_ingredient() {
    var success = false;
    var isqtyupdate = false;
    var isgroupmax = false;
    var ingredientsList = [];
    var ingredients = {};
    ingredients['id'] = this.state.did;
    ingredients['qty'] = this.state.quantity;
    ingredients['price'] = this.state.dishPrice;
    // console.log(ingredients);
    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (!res) {
        var ing = [];
        ing.push(ingredients);
        // console.log('123');
        console.log(ing);
        // console.log('456');
        AsyncStorage.setItem('INGREDIENT', JSON.stringify(ing));
      } else {
        //alert(this.state.did)
        var group_count = 0;
        console.log(res);
        ingredientsList = JSON.parse(res);
        console.log(ingredientsList);
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
                    bottom: 30,
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
    // alert(JSON.stringify(cart_quantity));
    item.qty = cart_quantity < 1 ? (cart_quantity = 1) : cart_quantity;
    // // var obj = this.state.card_dataSource.filter(o => o.id == item.id);
    // // obj[0].qty = obj[0].qty + 1;
    // // alert(JSON.stringify(obj[0]));

    let items = [];
    this.state.card_dataSource.map(item => {
      items.push(item);
    });
    this.setState({card_dataSource: items});
    // // alert(obj['qty']);
  }

  addDish(item, cart_quantity) {
    // alert(JSON.stringify(cart_quantity));
    item.qty = cart_quantity < 1 ? (cart_quantity = 1) : cart_quantity;
    // // var obj = this.state.card_dataSource.filter(o => o.id == item.id);
    // // obj[0].qty = obj[0].qty + 1;
    // // alert(JSON.stringify(obj[0]));

    let items = [];
    this.state.paymentData.map(item => {
      items.push(item);
    });
    this.setState({paymentData: items});
    // // alert(obj['qty']);
  }

  subDishQuantity(item, cart_quantity) {
    item.qty = cart_quantity > 1 ? cart_quantity : (cart_quantity = 1);
    let items = [];
    this.state.card_dataSource.map(item => {
      items.push(item);
    });
    this.setState({card_dataSource: items});
    // // alert(obj['qty']);
  }

  subDish(item, cart_quantity) {
    // alert(JSON.stringify(cart_quantity));
    item.qty = cart_quantity > 1 ? cart_quantity : (cart_quantity = 1);
    // // var obj = this.state.card_dataSource.filter(o => o.id == item.id);
    // // obj[0].qty = obj[0].qty + 1;
    // // alert(JSON.stringify(obj[0]));

    let items = [];
    this.state.paymentData.map(item => {
      items.push(item);
    });
    this.setState({paymentData: items});
    // // alert(obj['qty']);
  }

  render() {
    const {isSwitchOn} = this.state;
    var {height, width} = Dimensions.get('window');
    console.log(width);
    var left = (
      <Left style={{flex: 1}}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{flex: 1}}>
        <TouchableOpacity
          style={{marginVertical: 8}}
          onPress={() => this.add_dish()}
          transparent
          title="Add Dish">
          <FontAwesomeIcon icon={faPlus} color={'white'} size={25} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{paddingHorizontal: 8}}
          onPress={() => this.show_card()}>
          <Image
            source={require('../images/menu_list-5122.png')}
            style={{height: 42, width: 42}}></Image>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.take_payment()}>
          <FontAwesomeIcon
            icon={faArrowRight}
            color={'white'}
            size={25}
            style={{marginVertical: 8}}
          />
        </TouchableOpacity>
      </Right>
    );

    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{zIndex: 1}}
        navigation={this.props}>
        <View style={styles.container}>
          <Dialog
            visible={this.state.select_dish_dialog}
            dialogStyle={{
              borderRadius: 10,
              borderWidth: 10,
              borderColor: '#efeff4',
              width: '50%',
              height: '50%',
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
                    onPress={() => this.setState({select_dish_dialog: false})}>
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      color={'#ff9500'}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flex: 1, width: 250, maxHeight: 200}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginLeft: 20, marginTop: 20}}>
                    <Image
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 100,
                        height: 110,
                        backgroundColor: 'black',
                      }}
                      source={{
                        uri: 'http://dev-fs.8d.ie/storage/' + this.state.cover,
                      }}></Image>
                  </View>
                  <View style={{marginLeft: 40, marginTop: 10}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
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
                  width: 530,
                  maxHeight: 150,
                  marginBottom: -100,
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
                          this.state.quantity > 1 ? this.state.quantity - 1 : 1,
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
                      fontSize: 20,
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
                    <FontAwesomeIcon icon={faPlus} color={'orange'} size={20} />
                  </Button>

                  <TouchableOpacity
                    style={{
                      paddingLeft: 30,
                      paddingRight: 30,
                      marginBottom: 80,
                      marginLeft: 320,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      backgroundColor: '#ff9500',
                    }}
                    onPress={() => this.add_Dish_ingredient()}>
                    <Text style={{fontSize: 20, color: 'white'}}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Dialog>

          <Dialog
            visible={this.state.add_dish_dialog}
            dialogStyle={{
              borderRadius: 10,
              borderWidth: 10,
              borderColor: '#efeff4',
              width: '80%',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#efeff4',
            }}
            onTouchOutside={() => this.setState({add_dish_dialog: false})}>
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
                  }}>
                  Create Dish
                </Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setState({add_dish_dialog: false})}>
                  <FontAwesomeIcon
                    icon={faWindowClose}
                    color={'#ff9500'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.6,
                  borderRightWidth: 1,
                  borderRightColor: 'lightgrey',
                  padding: 50,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: 150}}>
                    <Text style={{fontSize: width * 0.02, color: '#76726d'}}>
                      Dish Name:
                    </Text>
                  </View>
                  <TextInput
                    style={{
                      borderColor: 'white',
                      height: 40,
                      width: '60%',
                      paddingLeft: 15,
                      marginLeft: 15,
                      borderWidth: 1,
                      textAlignVertical: 'top',
                      backgroundColor: 'white',
                      borderRadius: 50,
                      flexWrap: 'wrap',
                    }}
                    placeholder="Type message here.."
                    value={this.state.dishname}
                    onChangeText={text => this.setState({dishname: text})}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <View style={{width: 150}}>
                    <Text style={{fontSize: width * 0.02, color: '#76726d'}}>
                      Dish Description:
                    </Text>
                  </View>
                  <TextInput
                    style={{
                      borderColor: 'white',
                      height: 40,
                      width: '60%',
                      paddingLeft: 15,
                      marginLeft: 15,
                      borderWidth: 1,
                      textAlignVertical: 'top',
                      backgroundColor: 'white',
                      borderRadius: 50,
                      flexWrap: 'wrap',
                    }}
                    placeholder="Type message here.."
                    value={this.state.dishdescription}
                    onChangeText={text =>
                      this.setState({dishdescription: text})
                    }
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <View style={{width: 150}}>
                    <Text style={{fontSize: width * 0.02, color: '#76726d'}}>
                      Popular:
                    </Text>
                  </View>
                  {/* <CheckBox
                                    style={{ flex: 1, marginLeft: 15, }}
                                    tintColors={{ true: 'orange' }}
                                    value={this.state.isPopular}
                                    onValueChange={() => this.setState({ isPopular: !this.state.isPopular })}
                                    leftText={"PopularCheck"}
                                /> */}
                </View>
              </View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{position: 'relative'}}>
                  {this.state.img_uri == '' ? (
                    <Image
                      style={{width: 200, height: 200, borderRadius: 200 / 2}}
                      source={require('../images/profile-circle-picture-8.png')}></Image>
                  ) : (
                    <Image
                      style={{width: 200, height: 200, borderRadius: 200 / 2}}
                      source={{uri: this.state.img_uri}}></Image>
                  )}
                  <View style={styles.camera_icon}>
                    <TouchableOpacity onPress={() => this.opencamera()}>
                      <FontAwesomeIcon
                        icon={faCamera}
                        color={'black'}
                        size={45}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                borderTopColor: 'lightgrey',
                borderTopWidth: 1,
              }}>
              <TouchableOpacity
                style={styles.create_btn}
                onPress={() => this.setState({add_dish_dialog: false})}>
                <Text style={{fontSize: width * 0.03, color: 'white'}}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </Dialog>

          <Dialog
            visible={this.state.card_dish_dialog}
            dialogStyle={{
              borderRadius: 20,
              borderWidth: 3,
              borderColor: '#efeff4',
              width: '45%',
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
                  <View style={{flexDirection: 'column', paddingVertical: 10}}>
                    <Card containerStyle={styles.cardview}>
                      <Image
                        style={{
                          width: '100%',
                          height: 230,
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                        }}
                        source={{
                          uri: 'http://dev-fs.8d.ie/img/dish/' + item.cover,
                        }}></Image>
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
                              fontSize: 20,
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
                              fontSize: 20,
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
                                fontSize: 20,
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
                            }}
                            onPress={() => this.card_add_dish(item)}>
                            <Text
                              style={{
                                fontSize: 20,
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

          <Dialog
            visible={this.state.payment_dialog}
            dialogStyle={{
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#efeff4',
              width: '80%',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#efeff4',
            }}
            onTouchOutside={() => this.setState({add_dish_dialog: false})}>
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

            <View style={{flexDirection: 'row', height: 400}}>
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
                    paddingBottom: 37,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: 10,
                      marginTop: 20,
                    }}>
                    <Text style={{fontSize: 30, color: '#76726d'}}>Cash:</Text>
                    <TextInput
                      style={{
                        borderColor: 'white',
                        height: 40,
                        width: '60%',
                        paddingLeft: 15,
                        marginLeft: 60,
                        borderWidth: 1,
                        textAlignVertical: 'top',
                        backgroundColor: 'white',
                        borderRadius: 50,
                      }}
                      placeholder=""
                      defaultValue={this.state.cash.toString()}
                      onChange={() => this._totalChange()}
                      keyboardType={'numeric'}
                      onChangeText={cash => this.setState({cash: cash})}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: 10,
                      marginTop: 10,
                    }}>
                    <Text style={{fontSize: 30, color: '#76726d'}}>Card:</Text>
                    <TextInput
                      style={{
                        borderColor: 'white',
                        height: 40,
                        width: '60%',
                        paddingLeft: 15,
                        marginLeft: 60,
                        borderWidth: 1,
                        textAlignVertical: 'top',
                        backgroundColor: 'white',
                        borderRadius: 50,
                      }}
                      placeholder=""
                      onChangeText={card => this.setState({card: card})}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: 10,
                      marginTop: 10,
                    }}>
                    <Text style={{fontSize: 30, color: '#76726d'}}>
                      Voucher:
                    </Text>
                    <TextInput
                      style={{
                        borderColor: 'white',
                        height: 40,
                        width: '60%',
                        paddingLeft: 15,
                        marginLeft: 15,
                        borderWidth: 1,
                        textAlignVertical: 'top',
                        backgroundColor: 'white',
                        borderRadius: 50,
                      }}
                      placeholder=""
                      onChangeText={voucher =>
                        this.setState({voucher: voucher})
                      }
                    />
                  </View>
                </View>

                <View style={{height: 180}}>
                  <ScrollView>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.2, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>Srno.</Text>
                      </View>
                      <View style={{flex: 0.4, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>Name</Text>
                      </View>
                      <View style={{flex: 0.2, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>Qty</Text>
                      </View>
                      <View style={{flex: 0.2, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>Price</Text>
                      </View>
                    </View>
                    {this.showDishPaymentBox()}
                  </ScrollView>
                </View>
              </View>

              <View
                style={{
                  flex: 0.5,
                  height: '100%',
                }}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgrey',
                    paddingBottom: 20,
                    flexDirection: 'column',
                  }}>
                  <View style={styles.touchable1}>
                    <TouchableOpacity
                      style={styles.touchablenumber1}
                      onPress={() => {
                        this.onDigitPresssum(7);
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                      flexDirection: 'row',
                      height: 100,
                      width: '70%',
                      alignSelf: 'center',
                      marginRight: 30,
                    }}>
                    <View style={{flex: 0.6}}>
                      <View style={{flexDirection: 'row', margin: 10}}>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onDigitPresssum(1);
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
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
                              fontSize: 20,
                              fontWeight: 'bold',
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
                              fontSize: 20,
                              fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            3
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: 10,
                        }}>
                        <TouchableOpacity
                          style={styles.touchablenumber1}
                          onPress={() => {
                            this.onZeroPress(0);
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
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
                              fontSize: 20,
                              fontWeight: 'bold',
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
                              fontSize: 20,
                              fontWeight: 'bold',
                              color: 'grey',
                            }}>
                            .
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{flex: 0.4, margin: 10}}>
                      <TouchableOpacity
                        style={{
                          height: 90,
                          width: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 10,
                          backgroundColor: 'white',
                          marginStart: 8,
                        }}
                        onPress={() => {
                          this.onClearPress('');
                        }}>
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                            color: 'grey',
                          }}>
                          CE
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View>
                  <View style={styles.touchable1}>
                    <TouchableOpacity
                      style={styles.touchablenumber2}
                      onPress={() => {
                        this.onDigitPresssum(50);
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                          fontSize: 20,
                          fontWeight: 'bold',
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
                marginTop: 20,
                borderTopColor: 'lightgrey',
                borderTopWidth: 1,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: width * 0.03,
                  alignSelf: 'flex-start',
                  marginLeft: 10,
                  flex: 30,
                  textAlign: 'left',
                  marginTop: 10,
                  paddingVertical: 10,
                  color: 'grey',
                }}>
                Total :{' '}
                {parseFloat(this.state.cash) +
                  this.state.qty * this.state.totalPriceCustom +
                  this.state.takeTotal}
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
                }}>
                Return :{' '}
              </Text>

              <Switch
                trackColor={{true: 'white', false: 'white'}}
                value={isSwitchOn}
                style={styles.btnswitch}
                color="white"
                thumbColor="orange"
                onValueChange={() => {
                  this.setState({isSwitchOn: !isSwitchOn});
                }}
              />

              <TouchableOpacity style={styles.add_btn}>
                <Text
                  style={{fontSize: 30, color: 'white', textAlign: 'center'}}>
                  Pay
                </Text>
              </TouchableOpacity>
            </View>
          </Dialog>

          <Navbar left={left} right={right} title="Payment" />

          <View style={{flex: 0.9, flexDirection: 'row'}}>
            <FlatList
              data={this.state.dataSource}
              keyExtractor={({id}, index) => id}
              numColumns={8}
              renderItem={({item}) => (
                <View style={{padding: 5, flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => this.ingredients_data(item)}>
                    <Image
                      style={{height: 150, width: 150}}
                      source={{
                        uri: 'http://dev-fs.8d.ie/storage/' + item.cover,
                      }}
                    />
                    {/* <Text>{item.id}-{item.name}</Text> */}
                  </TouchableOpacity>
                  {this.getindiexistingqty(item)}
                </View>
              )}
            />
          </View>

          <View
            style={{
              flex: 0.1,
              backgroundColor: '#ff9500',
              borderTopWidth: 5,
              borderTopColor: 'white',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center', alignSelf: 'center'}}
              onPress={() => this.create_dish()}>
              <Text style={{fontSize: width * 0.03, color: 'white'}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SideMenuDrawer>
    );
  }

  // updatedishqty(id) {
  //     var qty = {};

  //     return
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  btnswitch: {
    flex: 10,
    marginTop: 20,
    marginRight: 50,
    marginVertical: 10,
  },
  add_btn: {
    flex: 10,
    marginTop: 20,
    marginRight: 40,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#ff9500',
  },
  touchable1: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    marginStart: 50,
  },
  touchable2: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginStart: 50,
  },
  touchable3: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    marginStart: 50,
  },
  touchable4: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginStart: 50,
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
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  cardview: {
    flexDirection: 'column',
    padding: 0,
    paddingBottom: 12,
    borderRadius: 15,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
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
  text: {
    fontSize: 20,
    marginTop: 10,
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
});
