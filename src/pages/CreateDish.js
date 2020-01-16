import React, {Component} from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  ToastAndroid,
  Slider,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Left, Right, Toast, Row, Col} from 'native-base';
import Navbar from '../components/Navbar';
import {
  faBars,
  faBackward,
  faArrowUp,
  faArrowDown,
  faPlus,
  faMinus,
  faWindowClose,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Card} from 'react-native-elements';
import {Dialog} from 'react-native-simple-dialogs';
import RNImagePicker from 'react-native-image-picker';
import Colors from '../Colors';
import SideMenuDrawer from '../components/SideMenuDrawer';
import CheckBox from 'react-native-check-box';

const createFormData = (photo, body) => {
  const data = new FormData();

  data.append('cover', {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};
export default class CreateDish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      dishname: null,
      dishdescription: null,
      token: '',
      dataSource: [],
      ListdataSource: [],
      add_dialog: false,
      show_dialog: false,
      avatar: null,
      isPopular: false,
      quantity: 1,
      max: null,
      cover: null,
      name: null,
      description: null,
      groupname: null,
      isexisting: false,
      dishData: {},
      did: null,
      ingredientexixts: [],
      venderid: 1,
      dishrate: 0,
      ingredient_group_id: null,
      groupmax: 0,
      isadd: false,
      isdishedit: false,
      menu_id: this.props.navigation.state.params.menu_id,
      dish_id: null,
      customer_id: null,
      ingredientcover: null,
      user_details: '',
    };
    this._retrieveData();

    AsyncStorage.setItem('INGREDIENT', '');
    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (res != null) {
        this.setState({ingredientexixts: JSON.parse(res)});
      }
      this.getvenderingredient();
      this.vendermenu();
    });
  }

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

  //vender ingredient
  getvenderingredient() {
    // this.setState({ qty: '' });
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU2MTE1NTZiYTJmZjUxZDlmNTg4ZWY0N2MxY2EzNDZiN2Q2NWQ5YjEyZGIxYzJkZWZkZTRlMjg3NzU2YTQ4NjE0YmY4YWU0OWQ0ZDZkM2VjIn0.eyJhdWQiOiIxIiwianRpIjoiNTYxMTU1NmJhMmZmNTFkOWY1ODhlZjQ3YzFjYTM0NmI3ZDY1ZDliMTJkYjFjMmRlZmRlNGUyODc3NTZhNDg2MTRiZjhhZTQ5ZDRkNmQzZWMiLCJpYXQiOjE1NzIwMTExMTcsIm5iZiI6MTU3MjAxMTExNywiZXhwIjoxNjAzNjMzNTE3LCJzdWIiOiIzMSIsInNjb3BlcyI6W119.tbhBgFC_mbmVdP924vH0RcIhmOa7Vd8tPnLIGeFMjFz9TptGIFXDf9jp44yEYSAR5JZq31kz3yth92lQnMgdSg-ah1vqyo_OWETzMTxlQaRbpSnuWX9tFGT53wbbR4QHCrTMGi72cumIvMV0E4z-XqxKJnMjiWN91HhPznGiVlT5gu1Y9AUDpxn1vXuNRNYhHO_3jxqJIqxucCln-ZMeZ38-jUgcj_bi7b5gS62mX08KuLqpNMJTzC3PLjW7krbuHS0Ac8TLVDrYH0sDgK4waXmDaNNY8Sp1wx1MHUN1Jzmwog1ACUvyrasT4J2aoxbr0L_Mvyqu-nSpMexZw4CkrM8h8h1sAjPp4JCxKRtzVyBKTaFzXg6ZNWYEzo19MgWHa0Noj23t2TZeVULO3udmt5wyMY4W9rKpFW1JoaUb5inmFTCDTdUSdFXNpMBGYi-Jx3lP5H1pkPI4IFfzOvgFEy0FrekPClC622JNRlLoVllJSTNFN-660kcwQltG6vETH8Xb4isF03GeLhwew7z4P0cGyw_wIsvhyCOx3uEB2vJnpf5QTCVD1knqZYkwxnfbPs7zcos1oWJOmFADkbNeBx1Ti3hBzW16eXN3kKGmoY9W5FVTZSq0M9W_rQI_n7tvl9BqaTukiSpRwMJw1FuDFpr9T5P3ANFR6m8LzhOkPhs';
    headers.append('Authorization', auth);
    fetch(
      'http://dev-fs.8d.ie/api/venders/' + this.state.id + '/ingredient-groups',
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          //this.props.navigation.navigate('AfterLogin',{Json_value:responseJson.data});

          let ingredientGroups = [];

          for (var i = 0; i < responseJson.ingredientGroups.length; i++) {
            responseJson.ingredientGroups[i].isgroup = true;
            responseJson.ingredientGroups[i].group = 'Yes';
            ingredientGroups.push(responseJson.ingredientGroups[i]);
            for (
              var j = 0;
              j < responseJson.ingredientGroups[i].ingredients.length;
              j++
            ) {
              responseJson.ingredientGroups[i].ingredients[j].idingredient =
                responseJson.ingredientGroups[i].ingredients[j].id;
              responseJson.ingredientGroups[i].ingredients[
                j
              ].isexisting = false;
              responseJson.ingredientGroups[i].ingredients[j].iscreate = false;
              responseJson.ingredientGroups[i].ingredients[j].isgroup = false;
              responseJson.ingredientGroups[i].ingredients[j].groupname =
                responseJson.ingredientGroups[i].name;
              responseJson.ingredientGroups[i].ingredients[j].groupmax =
                responseJson.ingredientGroups[i].max;
              responseJson.ingredientGroups[i].ingredients[
                j
              ].ingredient_group_id = responseJson.ingredientGroups[i].id;
              responseJson.ingredientGroups[i].ingredients[j].group = 'No';
              ingredientGroups.push(
                responseJson.ingredientGroups[i].ingredients[j],
              );
            }
          }
          this.setState({dataSource: ingredientGroups});
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  //vender menu
  vendermenu = async () => {
    try {
      var data = new FormData();
      data.append('id', this.state.id);

      var headers = new Headers();
      headers.append('Accept', 'application/json');

      fetch('http://dev-fs.8d.ie/api/menu/get-menu', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('Hello' + JSON.stringify(responseJson));
          if (responseJson['status'] == 'success') {
            var data = responseJson['data'];
            let object = data.filter(
              o => o.menu_id == this.props.navigation.state.params.menu_id,
            );
            console.log('List ' + this.props.navigation.state.params.menu_id);
            console.log('List' + JSON.stringify(object));
            this.setState({ListdataSource: object});
          } else {
            this.setState({ListdataSource: []});
          }
        });
    } catch (e) {}
  };

  add_dish = () => {
    this.setState({add_dialog: true});
  };

  handleAddDish = () => {
    if (this.state.dishname == '') {
      alert('Please Enter Dish Name.');
    } else if (this.state.dishdescription == '') {
      alert('Please Enter Dish Description.');
    } else if (this.state.dishrate == 0) {
      alert('Please Enter Dish Rate.');
    } else {
      ToastAndroid.show('Continue Please..', ToastAndroid.SHORT);
      this.setState({add_dialog: false});
    }
  };

  //Open for quantiry
  ingredients_data = item => {
    //this.setState({ qty: '' });
    if (item.isgroup == false) {
      this.setState({did: item.idingredient});
      this.setState({groupname: item.groupname});
      this.setState({max: item.max});
      this.setState({name: item.name});
      this.setState({description: item.description});
      this.setState({ingredient_group_id: item.ingredient_group_id});
      this.setState({groupmax: item.groupmax});
      this.setState({quantity: 1});
      this.setState({ingredientcover: item.cover});
      //alert((item.id))
      this.state.ingredientexixts.map(items => {
        if (item.id == items.id) {
          //alert(parseInt(items.qty))
          this.setState({quantity: parseInt(items.qty)});
        }
      });
      this.setState({show_dialog: true});
    }
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
        alert(response.uri);
        this.setState({
          cover: response.uri,
          avatar: response,
        });
      }
    });
  };

  //check with group quantity
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

  //Save Dish
  save_dish() {
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
      dish_id: this.state.dish_id,
      name: this.state.dishname,
      customer_id: null,
      employee_id: null,
      description: this.state.dishdescription,
      is_popular: this.state.isPopular == true ? 1 : 0,
      //"rate": this.state.dishrate,
      ingredients: ingredientsList,
    };

    if (this.state.dishname != '' && this.state.dishname != null) {
      //return
      fetch('http://dev-fs.8d.ie/api/dishes', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(responseJsonDish => {
          //dish added successfully
          if (responseJsonDish['dish'] != undefined) {
            //dish add to menu

            var data = new FormData();
            data.append('dish_id', responseJsonDish['dish'][0].id);
            data.append('menu_id', this.state.menu_id);

            fetch('http://dev-fs.8d.ie/api/menu/add-dish-menu', {
              method: 'POST',
              body: data,
            })
              .then(response => response.json())
              .then(responseJson => {
                //add rate for dish
                var headers = new Headers();
                headers.append('Content-Type', 'application/json');

                var rdata = {
                  dish_id: responseJsonDish['dish'][0].id,
                  vender_id: this.state.venderid,
                  rate: this.state.dishrate,
                };

                fetch('http://dev-fs.8d.ie/api/dishes/add_dish_rate', {
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify(rdata),
                })
                  .then(response => response.json())
                  .then(responseJson => {
                    //alert(this.state.avatar)
                    //alert(responseJsonDish["dish"][0].id)
                    if (this.state.avatar) {
                      var headers = new Headers();
                      headers.append('Accept', 'application/json');

                      fetch(
                        'http://dev-fs.8d.ie/api/dishes/edit-dishes-image',
                        {
                          method: 'POST',
                          headers: headers,
                          body: createFormData(this.state.avatar, {
                            id: responseJsonDish['dish'][0].id,
                          }),
                        },
                      )
                        .then(response => response.json())
                        .then(responseJson => {
                          alert(JSON.stringify(responseJson));

                          this.setState({
                            resp: responseJson,
                            networkError: false,
                          });
                          ToastAndroid.show(
                            'Dish creatded successfully !',
                            ToastAndroid.SHORT,
                          );

                          AsyncStorage.setItem('INGREDIENT', '');
                          this.vendermenu();
                          this.setState({ingredientexixts: [], isadd: false});
                        });
                    } else {
                      this.setState({resp: responseJson, networkError: false});
                      ToastAndroid.show(
                        'Dish creatded successfully !',
                        ToastAndroid.SHORT,
                      );

                      AsyncStorage.setItem('INGREDIENT', '');
                      this.vendermenu();
                      this.setState({ingredientexixts: [], isadd: false});
                    }
                  });
              });
          } else {
            ToastAndroid.show('Please Check your Code !', ToastAndroid.SHORT);
          }
        });
    } else {
      this.setState({add_dialog: true});
      ToastAndroid.show('Enter Dish Name !', ToastAndroid.SHORT);
    }
  }

  //Add ingredient for Dish
  add_Dish_ingredient() {
    var success = false;
    var isqtyupdate = false;
    var isgroupmax = false;
    var ingredientsList = [];
    var ingredients = {};
    ingredients['id'] = this.state.did;
    ingredients['qty'] = this.state.quantity;
    ingredients['group_id'] = this.state.ingredient_group_id;
    AsyncStorage.getItem('INGREDIENT', (err, res) => {
      if (!res) {
        var ing = [];
        ing.push(ingredients);
        AsyncStorage.setItem('INGREDIENT', JSON.stringify(ing));
      } else {
        //alert(this.state.did)
        console.log(JSON.parse(res));
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
        this.setState({add_dialog: false});
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
            this.setState({add_dialog: false});
            this.getindiexistingqtyAdd(ingredients);
          }
        }
      }
    });
  }

  //Update Quantity on Add
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

  //Edit Dish From id
  editdish(id) {
    console.log(id);
    var obj = this.state.ListdataSource.find(o => o.id == id);
    //console.log(obj.name);
    console.log(obj);
    this.setState({isadd: true});
    //this.setState({ ingredientexixts: obj.ingredient })
    this.setState({cover: 'http://dev-fs.8d.ie/' + obj.cover});
    this.setState({isdishedit: true});
    this.setState({dishname: obj.name});
    this.setState({dishdescription: obj.description});
    this.setState({isPopular: obj.is_popular == 0 ? false : true});
    this.setState({dishrate: obj.rate});
    this.setState({dish_id: obj.id});
    this.setState({add_dialog: true});
    var ingredientsList = [];
    for (var i = 0; i < obj.ingredient.length; i++) {
      var ingredients = {};
      ingredients['id'] = obj.ingredient[i].ingredient_id;
      ingredients['qty'] = obj.ingredient[i].qty;
      ingredients['group_id'] = obj.ingredient[i].ingredient_group_id;
      ingredientsList.push(ingredients);
      AsyncStorage.setItem('INGREDIENT', JSON.stringify(ingredientsList));
      this.getindiexistingqtyAdd(ingredients);
    }
  }

  //create Dish
  create_new_dish() {
    this.setState({
      isadd: !this.state.isadd,
      dishname: null,
      dishdescription: null,
      isPopular: false,
      dishrate: 0,
      //isadd: false,
      isdishedit: false,
      ingredientexixts: [],
    });
    AsyncStorage.setItem('INGREDIENT', '');
  }

  render() {
    var {height, width} = Dimensions.get('window');
    const user_details = this.state.userDetail;
    var left = (
      <Left style={{flex: 1}}>
        {this.state.isadd == false ? (
          <Button
            onPress={() => this.props.navigation.navigate('Menu')}
            transparent>
            <FontAwesomeIcon icon={faBackward} color={'white'} />
          </Button>
        ) : (
          <Button onPress={() => this.create_new_dish()} transparent>
            <FontAwesomeIcon icon={faBackward} color={'white'} />
          </Button>
        )}
      </Left>
    );
    var right = (
      <Right style={{flex: 1}}>
        {this.state.isadd == false ? (
          <TouchableOpacity
            onPress={() => {
              this.create_new_dish();
            }}
            title="Create Dish">
            <Text
              style={{
                fontSize: width * 0.0165,
                paddingHorizontal: 10,
                backgroundColor: '#ff9500',
                color: 'white',
                borderRadius: 10,
              }}>
              Create
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.add_dish()} title="Create Dish">
            <Image
              style={{width: 45, height: 45}}
              source={require('../images/add_employee.png')}
            />
          </TouchableOpacity>
        )}
      </Right>
    );
    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{zIndex: 1}}
        navigation={this.props}>
        <Navbar
          left={left}
          right={right}
          title={
            this.state.dishname == null ? 'Create Dish' : this.state.dishname
          }
        />
        {this.state.isadd == false ? (
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomColor: 'lightgrey',
                paddingBottom: 8,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  flex: 0.4,
                  alignItems: 'center',
                  marginTop: 10,
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.016,
                    backgroundColor: '#ff9500',
                    color: 'white',
                    borderRadius: 80,
                    padding: 15,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}>
                  Name
                </Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  alignItems: 'center',
                  marginTop: 10,
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.016,
                    backgroundColor: '#ff9500',
                    color: 'white',
                    borderRadius: 80,
                    padding: 15,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}>
                  Description
                </Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  alignItems: 'center',
                  marginTop: 10,
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.016,
                    backgroundColor: '#ff9500',
                    color: 'white',
                    borderRadius: 80,
                    padding: 15,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}>
                  Is popular
                </Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  alignItems: 'center',
                  marginTop: 10,
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.016,
                    backgroundColor: '#ff9500',
                    color: 'white',
                    borderRadius: 80,
                    padding: 15,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}>
                  Actions
                </Text>
              </View>
            </View>
            <FlatList
              pagingEnabled={true}
              data={this.state.ListdataSource}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={styles.dynamic_list_view}>
                  <View style={{flex: 0.5, alignItems: 'center'}}>
                    <Text style={{fontSize: width * 0.0165}}>{item.name}</Text>
                  </View>
                  <View style={{flex: 0.5, alignItems: 'center'}}>
                    <Text style={{fontSize: width * 0.0165}}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={{flex: 0.5, alignItems: 'center'}}>
                    {item.is_popular == 1 ? (
                      <Text style={{fontSize: width * 0.0165}}>Yes</Text>
                    ) : (
                      <Text style={{fontSize: width * 0.0165}}>No</Text>
                    )}
                  </View>
                  <View style={{flex: 0.5, alignItems: 'center'}}>
                    <Row>
                      <Col style={{width: 80}}>
                        <Button
                          onPress={() => this.editdish(item.id)}
                          style={{
                            fontSize: width * 0.016,
                            backgroundColor: '#ff9500',
                            color: 'white',
                            borderRadius: 80,
                            padding: 15,
                            paddingBottom: 2,
                            paddingTop: 2,
                          }}>
                          <Text style={{color: 'white', fontSize: 18}}>
                            {' '}
                            Edit{' '}
                          </Text>
                        </Button>
                      </Col>
                    </Row>
                  </View>
                </View>
              )}
              keyExtractor={({id}, index) => id}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                top: -15,
                left: 0,
                right: 0,
              }}>
              <Image
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 65 / 2,
                }}
                source={{
                  uri: 'http://dev-fs.8d.ie/storage/' + user_details.wok,
                }}
              />
            </View>
            <KeyboardAvoidingView behavior="padding" enabled>
              <Dialog
                visible={this.state.add_dialog}
                dialogStyle={{
                  borderRadius: 10,
                  borderWidth: 10,
                  borderColor: '#efeff4',
                  width: '80%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#efeff4',
                }}
                onTouchOutside={() => this.setState({add_dialog: false})}>
                <ScrollView>
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
                        onPress={() => this.setState({add_dialog: false})}>
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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 150}}>
                          <Text
                            style={{fontSize: width * 0.016, color: '#76726d'}}>
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
                          onChangeText={dishname => this.setState({dishname})}
                          // onChangeText={this.setName}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: 150}}>
                          <Text
                            style={{fontSize: width * 0.016, color: '#76726d'}}>
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
                          onChangeText={dishdescription =>
                            this.setState({dishdescription})
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
                          <Text
                            style={{fontSize: width * 0.016, color: '#76726d'}}>
                            Dish Rate:
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
                          value={this.state.dishrate.toString()}
                          onChangeText={dishrate => this.setState({dishrate})}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: 150}}>
                          <Text
                            style={{fontSize: width * 0.016, color: '#76726d'}}>
                            Is Popular:
                          </Text>
                        </View>
                        <CheckBox
                          style={{flex: 1, padding: 10}}
                          onClick={() => {
                            this.setState({
                              isPopular: !this.state.isPopular,
                            });
                          }}
                          isChecked={this.state.isPopular}
                          checkedCheckBoxColor={'orange'}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 0.4,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={{position: 'relative'}}>
                        {this.state.cover == null ? (
                          <Image
                            style={{
                              width: 200,
                              height: 200,
                              borderRadius: 200 / 2,
                            }}
                            source={require('../images/profile-circle-picture-8.jpg')}></Image>
                        ) : (
                          <Image
                            style={{
                              width: 200,
                              height: 200,
                              borderRadius: 200 / 2,
                            }}
                            source={{uri: this.state.cover}}></Image>
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
                      style={styles.add_btn}
                      onPress={() => this.handleAddDish()}>
                      <Text style={{fontSize: width * 0.03, color: 'white'}}>
                        {this.state.isdishedit == true ? 'Update' : 'Create'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Dialog>

              {/* Quantity Dialog */}

              <Dialog
                visible={this.state.show_dialog}
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
                onTouchOutside={() => this.setState({show_dialog: false})}>
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
                        onPress={() => this.setState({show_dialog: false})}>
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
                            backgroundColor: 'white',
                          }}
                          source={{
                            uri:
                              'http://dev-fs.8d.ie/' +
                              this.state.ingredientcover,
                          }}></Image>
                      </View>
                      <View style={{marginLeft: 40, marginTop: 10}}>
                        <Text
                          style={{fontSize: width * 0.016, fontWeight: 'bold'}}>
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
                          fontSize: width * 0.016,
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
                          marginBottom: 80,
                          marginLeft: 320,
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          backgroundColor: '#ff9500',
                        }}
                        onPress={() => this.add_Dish_ingredient()}>
                        <Text style={{fontSize: width * 0.016, color: 'white'}}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Dialog>
            </KeyboardAvoidingView>
            <View style={{flex: 0.9, flexDirection: 'row', padding: 5}}>
              <FlatList
                data={this.state.dataSource}
                keyExtractor={({id}, index) => id}
                numColumns={width < height ? 5 : 8}
                renderItem={({item}) => (
                  <View>
                    {item.isgroup == true ? (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          backgroundColor: '#ff9500',
                          height: 150,
                          width: 150,
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          marginLeft: 8,
                          marginTop: 8,
                        }}>
                        <Image
                          style={{
                            height: 130,
                            width: 130,
                            backgroundColor: '#ff9500',
                          }}
                          source={{uri: 'http://dev-fs.8d.ie/' + item.cover}}
                        />
                        <Text
                          style={{
                            position: 'absolute',
                            fontSize: 35,
                            color: 'white',
                            top: 25,
                            width: 100,
                            textAlign: 'center',
                            lineHeight: 35,
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                          }}>
                          {item.name}
                        </Text>

                        <Text
                          style={{
                            position: 'absolute',
                            fontSize: 18,
                            color: 'white',
                            bottom: 25,
                          }}>
                          MAX{' '}
                          <Text
                            style={{
                              position: 'absolute',
                              fontSize: 15,
                              color: 'white',
                              bottom: 40,
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
                            marginLeft: 8,
                            marginTop: 8,
                          }}>
                          <Image
                            style={{
                              height: 150,
                              width: 150,
                              backgroundColor: 'white',
                            }}
                            source={{uri: 'http://dev-fs.8d.ie/' + item.cover}}
                          />
                          <Text
                            style={{
                              position: 'absolute',
                              fontSize: 15,
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
            <View style={{flex: 0.1, backgroundColor: '#ff9500'}}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignSelf: 'center'}}
                onPress={() => this.save_dish()}>
                <Text style={{fontSize: width * 0.03, color: 'white'}}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SideMenuDrawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
  add_btn: {
    marginTop: 10,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 45,
    paddingRight: 45,
    borderRadius: 25,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#ff9500',
  },
  dynamic_list_view: {
    flexDirection: 'row',
    padding: 15,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
});
