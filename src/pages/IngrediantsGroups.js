import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Left, Right, Picker, Col, Row, Grid} from 'native-base';
import Navbar from '../components/Navbar';
import CheckBox from '@react-native-community/checkbox';
import {
  faBars,
  faWindowClose,
  faArrowDown,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Card} from 'react-native-elements';
import {Dialog} from 'react-native-simple-dialogs';
import RNImagePicker from 'react-native-image-picker';
import {ScrollView} from 'react-native-gesture-handler';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';
var {height, width} = Dimensions.get('window');
export default class IngrediantsGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tax_id: '',
      name: '',
      price: '',
      max: '',
      description: '',
      sequence: '',
      weight: '',
      status: '1',
      img_uri: '',
      avatar: '',
      cover: '',
      change_response: 1,
      add_name: '',
      add_max: '',
      add_min: '',
      add_description: '',
      add_sequence: 0,
      add_weight: '',
      add_status: '1',
      editname: '',
      editmax: 0,
      editmin: 0,
      editdescription: '',
      editstatus: '',
      editis_main: false,
      editsequence: 0,
      editcover: '',
      ingrediant_id: '',
      Ingredientid: '',
      Ingredienttaxid: '',
      Ingredientname: '',
      Ingredientprice: '',
      Ingredientmax: '',
      Ingredientdesc: '',
      Ingredientseq: '',
      Ingredientweight: '',
      Ingredientstatus: '',
      Ingredientimage: '',
      ingredient_group_id: '',
      checked: false,
      add_dialog: false,
      edit_dialog: false,
      add_ingredient_dialog: false,
      edit_ingredient_dialog: false,
      dataSource: [],
      dialog: false,
      dataSourceIngredient: [],
      count: 0,
      userDetail: '',
    };
    this._retrieveData();
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

  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }

  add_employee = () => {
    this.setState({add_dialog: true, img_uri: ''});
  };

  add_ingredient = id => {
    this.setState({
      add_ingredient_dialog: true,
      ingredient_group_id: id,
      cover: '',
    });
  };

  edit_ingredient = () => {
    this.setState({edit_ingredient_dialog: true});
  };

  addCheckBox = () => {
    if (!this.state.checked) {
      Alert.alert(
        'Do you want to change the main?',
        'Once changed cannot be redo',
        [
          {
            text: 'No',
            onPress: () =>
              this.setState({change_response: 0, checked: !this.state.checked}),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () =>
              this.setState({
                change_response: 1,
                checked: this.state.checked,
              }),
          },
        ],
        {cancelable: false},
      );
    }
    this.setState({checked: !this.state.checked});
  };

  updateCheckBox = () => {
    if (!this.state.editis_main) {
      Alert.alert(
        'Do you want to change the main?',
        'Once changed cannot be redo',
        [
          {
            text: 'No',
            onPress: () =>
              this.setState({
                change_response: 0,
                editis_main: !this.state.editis_main,
              }),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () =>
              this.setState({
                change_response: 1,
                editis_main: this.state.editis_main,
              }),
          },
        ],
        {cancelable: false},
      );
    }
    this.setState({editis_main: !this.state.editis_main});
  };

  updatePress = id => {
    {
      this.state.editis_main == true
        ? (this.state.editis_main = 1)
        : (this.state.editis_main = 0);
    }
    {
      this.state.editis_main == 1
        ? this.setState({editis_main: true})
        : this.setState({editis_main: false});
    }
    var data = new FormData();
    data.append('id', id);
    data.append('name', this.state.editname);
    data.append('max', this.state.editmax);
    data.append('min', this.state.editmin);
    data.append('description', this.state.editdescription);
    data.append('status', this.state.editstatus);
    data.append('is_main', this.state.editis_main);
    data.append('sequence', this.state.editsequence);
    data.append('change_response', this.state.change_response);
    if (this.state.avatar != '') {
      data.append('cover', {
        name: this.state.avatar.fileName,
        type: this.state.avatar.type,
        uri:
          Platform.OS === 'android'
            ? this.state.avatar.uri
            : this.state.avatar.uri.replace('file://', ''),
      });
    }
    console.log(data);
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    fetch('http://dev-fs.8d.ie/api/kitchen/updateIngredientGroup', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('More' + JSON.stringify(responseJson));
        if (responseJson.status == 'success') {
          this.setState({edit_dialog: false, img_uri: ''});
          this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  deleteIngredientGroup = () => {
    Alert.alert(
      'Are you sure want to delete?',
      'Once deleted, You can not able to recover',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.deleteYesIngredientGroup(this.state.ingrediant_id);
          },
        },
      ],
      {cancelable: false},
    );
  };

  deleteYesIngredientGroup = id => {
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    var data = new FormData();
    data.append('id', id);

    fetch('http://dev-fs.8d.ie/api/kitchen/deleteIngredientGroup', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({edit_dialog: false});
          this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  deleteIngredient = () => {
    Alert.alert(
      'Are sure you want to delete?',
      'Once deleted, You want able to recover',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.deleteYesIngredient(this.state.Ingredientid);
          },
        },
      ],
      {cancelable: false},
    );
  };

  deleteYesIngredient = id => {
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    var data = new FormData();
    data.append('id', id);

    fetch('http://dev-fs.8d.ie/api/kitchen/deleteIngredient', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({edit_ingredient_dialog: false});
          this.componentDidMount();
          this.getIngredientGroup();
          alert('Delete record successfully');
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
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
          avatar: response,
          img_uri: response.uri,
          cover: response.uri,
        });
      }
    });
  };

  addDetail = () => {
    if (
      this.state.add_name == '' ||
      this.state.add_max == '' ||
      this.state.add_min == '' ||
      this.state.add_description == '' ||
      this.state.add_sequence == ''
    ) {
      alert('Please inserted remaining fields');
    } else {
      if (this.state.checked == true) {
        this.state.checked = 1;
      } else {
        this.state.checked = 0;
      }
      var data = new FormData();
      data.append('name', this.state.add_name);
      data.append('max', this.state.add_max);
      data.append('min', this.state.add_min);
      data.append('description', this.state.add_description);
      data.append('status', this.state.add_status);
      data.append('is_main', this.state.checked);
      data.append('sequence', this.state.add_sequence);
      data.append('change_response', this.state.change_response);
      data.append('cover', {
        name: this.state.avatar.fileName,
        type: this.state.avatar.type,
        uri:
          Platform.OS === 'android'
            ? this.state.avatar.uri
            : this.state.avatar.uri.replace('file://', ''),
      });
      // alert(JSON.stringify(data));
      // return;
      const user_details = this.state.userDetail;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.userToken;
      headers.append('Authorization', auth);
      headers.append('Accept', 'application/json');

      fetch('http://dev-fs.8d.ie/api/kitchen/addIngredientGroup', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.status == 'success') {
            this.setState({add_dialog: false, img_uri: ''});
            this.componentDidMount();
          } else {
            alert('Something wrong happened');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  getIngredientGroup = () => {
    var data = new FormData();
    data.append('ingredient_group_id', this.state.ingredient_group_id);

    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    console.log(data);
    fetch('http://dev-fs.8d.ie/api/kitchen/getIngredientByGroupId', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({
            dataSourceIngredient: responseJson.ingredient,
            dialog: true,
          });
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  addIngrediant = () => {
    var data = new FormData();
    data.append('ingredient_group_id', this.state.ingredient_group_id);
    data.append('tax_id', this.state.tax_id);
    data.append('name', this.state.name);
    data.append('price', this.state.price);
    data.append('max', this.state.max);
    data.append('description', this.state.description);
    data.append('sequence', this.state.sequence);
    data.append('weight', this.state.weight);
    data.append('status', this.state.status);
    data.append('cover', {
      name: this.state.avatar.fileName,
      type: this.state.avatar.type,
      uri:
        Platform.OS === 'android'
          ? this.state.avatar.uri
          : this.state.avatar.uri.replace('file://', ''),
    });
    console.log(data);

    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    fetch('http://dev-fs.8d.ie/api/kitchen/addIngredient', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({add_ingredient_dialog: false, cover: ''});
        this.componentDidMount();
      });
  };

  updateIngredient = id => {
    var data = new FormData();
    data.append('id', id);
    data.append('ingredient_group_id', this.state.ingredient_group_id);
    data.append('tax_id', this.state.Ingredienttaxid);
    data.append('name', this.state.Ingredientname);
    data.append('weight', this.state.Ingredientweight);
    data.append('price', this.state.Ingredientprice);
    data.append('max', this.state.Ingredientmax);
    data.append('description', this.state.Ingredientdesc);
    data.append('status', this.state.Ingredientstatus);
    data.append('sequence', this.state.Ingredientseq);
    if (this.state.avatar != '') {
      data.append('cover', {
        name: this.state.avatar.fileName,
        type: this.state.avatar.type,
        uri:
          Platform.OS === 'android'
            ? this.state.avatar.uri
            : this.state.avatar.uri.replace('file://', ''),
      });
    }
    console.log(data);

    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    fetch('http://dev-fs.8d.ie/api/kitchen/updateIngredient', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          console.log(responseJson);
          this.setState({edit_ingredient_dialog: false, cover: ''});
          this.componentDidMount();
          this.getIngredientGroup();
          // alert('Update record successfully');
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  getIngredient = id => {
    var data = new FormData();
    data.append('id', id);

    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    fetch('http://dev-fs.8d.ie/api/kitchen/getIngredient', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'success') {
          console.log(responseJson);
          this.setState({edit_ingredient_dialog: true});
          this.setState({
            Ingredientid: responseJson.ingredient.id,
            Ingredienttaxid: responseJson.ingredient.tax_id,
            Ingredientname: responseJson.ingredient.name,
            Ingredientprice: responseJson.ingredient.price,
            Ingredientmax: responseJson.ingredient.max,
            Ingredientdesc: responseJson.ingredient.description,
            Ingredientseq: responseJson.ingredient.sequence,
            Ingredientweight: responseJson.ingredient.weight,
            Ingredientstatus: responseJson.ingredient.status,
            Ingredientimage: responseJson.ingredient.cover,
          });
          console.log(responseJson.ingredient.status);
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  getIngrediants = id => {
    var data = new FormData();
    data.append('id', id);
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    fetch('http://dev-fs.8d.ie/api/kitchen/getIngredientGroup', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'success') {
          console.log(responseJson);
          this.setState({edit_dialog: true});
          if (responseJson.ingredient_group.is_main == 1) {
            this.setState({editis_main: true});
          } else {
            this.setState({editis_main: false});
          }
          this.setState({
            ingrediant_id: responseJson.ingredient_group.id,
            editname: responseJson.ingredient_group.name,
            editmax: responseJson.ingredient_group.max,
            editmin: responseJson.ingredient_group.min,
            editdescription: responseJson.ingredient_group.description,
            editsequence: responseJson.ingredient_group.sequence,
            editstatus: responseJson.ingredient_group.status,
            editcover: responseJson.ingredient_group.cover,
          });
          // this.componentDidMount();

          //alert(this.state.editmax)
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  componentDidMount() {
    if (this.state.count == 1) {
      const user_details = this.state.userDetail;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.userToken;
      headers.append('Authorization', auth);
      headers.append('Accept', 'application/json');
      console.log(headers);
      fetch('http://dev-fs.8d.ie/api/kitchen/getIngredientGroupList', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson) {
            if (responseJson.status == 'success') {
              this.setState({dataSource: responseJson.ingredient_group});
            }
          } else {
            alert('Something wrong happened');
          }
        })

        .catch(error => {
          console.error(error);
        });
    }
  }

  render() {
    const {checked, editis_main} = this.state;
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
        <TouchableOpacity onPress={() => this.add_employee()}>
          <Image
            style={{width: 45, height: 45}}
            source={require('../images/add_employee.png')}
          />
        </TouchableOpacity>
      </Right>
    );

    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{zIndex: 1}}
        navigation={this.props}>
        <View>
          <ScrollView>
            <Navbar left={left} right={right} title="IngrediantsGroups" />
            <KeyboardAvoidingView behavior="padding" enabled>
              {/* Add dialog */}
              <Dialog
                visible={this.state.add_dialog}
                dialogStyle={{
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#efeff4',
                  width: '80%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#efeff4',
                }}
                onTouchOutside={() =>
                  this.setState({add_dialog: false, img_uri: ''})
                }>
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
                        Add IngrediantsGroups
                      </Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({add_dialog: false, img_uri: ''})
                        }>
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
                        padding: 10,
                        paddingTop: 25,
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Name:
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          onChangeText={text => this.setState({add_name: text})}
                          value={this.state.add_name}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Max:
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          number={true}
                          keyboardType="numeric"
                          onChangeText={number =>
                            this.setState({add_max: number})
                          }
                          value={this.state.add_max}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Min:
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          number={true}
                          keyboardType="numeric"
                          onChangeText={number =>
                            this.setState({add_min: number})
                          }
                          value={this.state.add_min}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View
                          style={{
                            width: width * 0.15,
                            alignSelf: 'flex-start',
                          }}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Description:
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: 80,
                            width: '59%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 10,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          multiline={true}
                          underlineColorAndroid="transparent"
                          onChangeText={text =>
                            this.setState({add_description: text})
                          }
                          value={this.state.add_description}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Status :
                          </Text>
                        </View>
                        <Picker
                          note
                          mode="dropdown"
                          style={{width: '60%'}}
                          selectedValue={this.state.add_status}
                          onValueChange={add_status =>
                            this.setState({add_status: add_status})
                          }>
                          <Picker.Item label="Enable" value="1" />
                          <Picker.Item label="Disable" value="0" />
                        </Picker>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: width * 0.01,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Is Main? :
                          </Text>
                        </View>
                        <CheckBox
                          status={checked ? 'checked' : 'unchecked'}
                          tintColors={{true: 'orange'}}
                          value={checked}
                          onValueChange={() => this.addCheckBox()}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Sequence:
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            marginRight: 10,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          number={true}
                          keyboardType="numeric"
                          onChangeText={number =>
                            this.setState({add_sequence: number})
                          }
                          value={this.state.add_sequence}
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
                        {this.state.img_uri == '' ? (
                          <Image
                            style={{
                              width: width * 0.2,
                              height: width * 0.2,
                              borderRadius: (width * 0.2) / 2,
                            }}
                            source={require('../images/profile-circle-picture-8.jpg')}></Image>
                        ) : (
                          <Image
                            style={{
                              width: width * 0.2,
                              height: width * 0.2,
                              borderRadius: (width * 0.2) / 2,
                            }}
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
                      marginTop: 15,
                      borderTopColor: 'lightgrey',
                      borderTopWidth: 1,
                    }}>
                    <TouchableOpacity
                      style={styles.add_btn}
                      onPress={() => {
                        this.addDetail();
                      }}>
                      <Text style={{fontSize: width * 0.03, color: 'white'}}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Dialog>
              {/* Update dialog */}
              <Dialog
                visible={this.state.edit_dialog}
                dialogStyle={{
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#efeff4',
                  width: '80%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#efeff4',
                }}
                onTouchOutside={() =>
                  this.setState({edit_dialog: false, img_uri: ''})
                }>
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
                        Edit IngrediantsGroups{' '}
                      </Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({edit_dialog: false, img_uri: ''})
                        }>
                        <FontAwesomeIcon
                          icon={faWindowClose}
                          color={'#ff9500'}
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 15}}>
                    <View
                      style={{
                        flex: 0.6,
                        borderRightWidth: 1,
                        borderRightColor: 'lightgrey',
                        padding: 10,
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Name :
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          onChangeText={editname => this.setState({editname})}
                          defaultValue={this.state.editname}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Max :
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          number={true}
                          keyboardType="numeric"
                          // onChangeText={editmax =>
                          //     this.setState({ editmax })
                          // }
                          // defaultValue={this.state.editmax}
                          //value={parseInt(this.state.editmax)}

                          onChangeText={text => this.setState({editmax: text})}
                          value={this.state.editmax.toString()}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Min :
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          number={true}
                          keyboardType="numeric"
                          // onChangeText={editmin =>
                          //     this.setState({ editmin })
                          // }
                          // defaultValue={this.state.editmin}
                          onChangeText={text => this.setState({editmin: text})}
                          value={this.state.editmin.toString()}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View
                          style={{
                            width: width * 0.15,
                            alignSelf: 'flex-start',
                          }}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Description :
                          </Text>
                        </View>

                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          multiline={true}
                          underlineColorAndroid="transparent"
                          onChangeText={editdescription =>
                            this.setState({editdescription})
                          }
                          defaultValue={this.state.editdescription}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginRight: 50,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Status :
                          </Text>
                        </View>
                        <Picker
                          note
                          mode="dropdown"
                          style={{width: '60%'}}
                          selectedValue={this.state.editstatus.toString()}
                          onValueChange={editstatus =>
                            this.setState({editstatus: editstatus})
                          }>
                          <Picker.Item label="Enable" value="1" />
                          <Picker.Item label="Disable" value="0" />
                        </Picker>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Is_Main:
                          </Text>
                        </View>
                        <CheckBox
                          status={editis_main ? 'checked' : 'unchecked'}
                          tintColors={{true: 'orange'}}
                          value={editis_main}
                          onValueChange={() => this.updateCheckBox()}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={{width: width * 0.15}}>
                          <Text
                            style={{fontSize: width * 0.02, color: '#76726d'}}>
                            Sequence :
                          </Text>
                        </View>
                        <TextInput
                          style={{
                            borderColor: 'white',
                            height: '80%',
                            width: '60%',
                            paddingLeft: 15,
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexWrap: 'wrap',
                          }}
                          placeholder="Type here.."
                          number={true}
                          keyboardType="numeric"
                          // onChangeText={editsequence => this.setState({ editsequence })}
                          // defaultValue={this.state.editsequence}
                          onChangeText={text =>
                            this.setState({editsequence: text})
                          }
                          value={this.state.editsequence.toString()}
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
                        {this.state.img_uri == '' ? (
                          <Image
                            style={{
                              width: width * 0.2,
                              height: width * 0.2,
                              borderRadius: (width * 0.2) / 2,
                            }}
                            source={{
                              uri:
                                'http://dev-fs.8d.ie/' + this.state.editcover,
                            }}></Image>
                        ) : (
                          <Image
                            style={{
                              width: width * 0.2,
                              height: width * 0.2,
                              borderRadius: (width * 0.2) / 2,
                            }}
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
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View style={{flex: 0.9, marginTop: width * 0.01}}>
                      <TouchableOpacity
                        style={styles.delete_btn}
                        onPress={() => this.deleteIngredientGroup()}>
                        <Text style={{fontSize: width * 0.025, color: 'white'}}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{marginTop: width * 0.01}}>
                      <TouchableOpacity
                        style={styles.add_btn}
                        onPress={() =>
                          this.updatePress(this.state.ingrediant_id)
                        }>
                        <Text style={{fontSize: width * 0.025, color: 'white'}}>
                          Update
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Dialog>
              {/* Add ingredient dialog */}
              <Dialog
                visible={this.state.add_ingredient_dialog}
                dialogStyle={{
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#efeff4',
                  width: '80%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#efeff4',
                }}
                onTouchOutside={() =>
                  this.setState({
                    add_ingredient_dialog: false,
                    dialog: false,
                    cover: '',
                  })
                }>
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
                        Ingrediants
                      </Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            add_ingredient_dialog: false,
                            dialog: false,
                            cover: '',
                          })
                        }>
                        <FontAwesomeIcon
                          icon={faWindowClose}
                          color={'#ff9500'}
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: width * 0.01}}>
                    <View style={{flex: 0.5}}>
                      {this.state.dialog == false ? (
                        <TouchableOpacity
                          style={styles.add}
                          onPress={() =>
                            this.setState({
                              add_ingredient_dialog: true,
                              cover: '',
                            })
                          }>
                          <Text
                            style={{color: 'white', fontSize: width * 0.02}}>
                            Insert
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.inactive_add}
                          onPress={() =>
                            this.setState({dialog: false, cover: ''})
                          }>
                          <Text
                            style={{color: 'white', fontSize: width * 0.02}}>
                            Insert
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={{flex: 0.5}}>
                      {this.state.dialog == true ? (
                        <TouchableOpacity
                          style={styles.add}
                          onPress={() =>
                            this.setState({
                              add_ingredient_dialog: false,
                              cover: '',
                            })
                          }>
                          <Text
                            style={{color: 'white', fontSize: width * 0.02}}>
                            View
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.inactive_add}
                          onPress={() => {
                            this.getIngredientGroup();
                          }}>
                          <Text
                            style={{color: 'white', fontSize: width * 0.02}}>
                            View
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {this.state.dialog == true ? (
                    <ScrollView>
                      <Grid>
                        {/* <Row style={{height: 30, marginVertical: 20}}>
                          <Col style={styles.add}>
                            <Text style={styles.grid_text}>Name</Text>
                          </Col>
                          <Col style={styles.add}>
                            <Text style={styles.grid_text}>Price</Text>
                          </Col>
                          <Col style={styles.add}>
                            <Text style={styles.grid_text}>Max</Text>
                          </Col>
                          <Col style={styles.add}>
                            <Text style={styles.grid_text}>Weight</Text>
                          </Col>
                          <Col style={styles.add}>
                            <Text style={styles.grid_text}>Status</Text>
                          </Col>
                        </Row> */}
                        <Row>
                          <View
                            style={{
                              flexDirection: 'row',
                              borderBottomColor: 'lightgrey',
                              borderBottomWidth: 1,
                              alignItems: 'center',
                              justifyContent: 'space-around',
                              paddingVertical: 15,
                            }}>
                            <Col style={{alignItems: 'center', width: '20%'}}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    backgroundColor: '#ff9500',
                                    color: 'white',
                                    borderRadius: 80,
                                    padding: width * 0.016,
                                    paddingBottom: 2,
                                    paddingTop: 2,
                                  }}>
                                  Name
                                </Text>
                              </View>
                            </Col>
                            <Col style={{alignItems: 'center', width: '20%'}}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    backgroundColor: '#ff9500',
                                    color: 'white',
                                    borderRadius: 80,
                                    padding: width * 0.016,
                                    paddingBottom: 2,
                                    paddingTop: 2,
                                  }}>
                                  Price
                                </Text>
                              </View>
                            </Col>
                            <Col style={{alignItems: 'center', width: '20%'}}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    backgroundColor: '#ff9500',
                                    color: 'white',
                                    borderRadius: 80,
                                    padding: width * 0.016,
                                    paddingBottom: 2,
                                    paddingTop: 2,
                                  }}>
                                  Max
                                </Text>
                              </View>
                            </Col>
                            <Col style={{alignItems: 'center', width: '20%'}}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    backgroundColor: '#ff9500',
                                    color: 'white',
                                    borderRadius: 80,
                                    padding: width * 0.016,
                                    paddingBottom: 2,
                                    paddingTop: 2,
                                  }}>
                                  Weight
                                </Text>
                              </View>
                            </Col>
                            <Col style={{alignItems: 'center', width: '20%'}}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    backgroundColor: '#ff9500',
                                    color: 'white',
                                    borderRadius: 80,
                                    padding: width * 0.016,
                                    paddingBottom: 2,
                                    paddingTop: 2,
                                  }}>
                                  Status
                                </Text>
                              </View>
                            </Col>
                          </View>
                        </Row>
                        {this.fillIngredient()}
                      </Grid>
                    </ScrollView>
                  ) : (
                    <View>
                      <ScrollView>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              flex: 0.6,
                              borderRightWidth: 1,
                              borderRightColor: 'lightgrey',
                              padding: 10,
                              paddingTop: 25,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  taxId:
                                </Text>
                              </View>
                              <TextInput
                                style={{
                                  borderColor: 'white',
                                  height: '80%',
                                  width: '60%',
                                  paddingLeft: 15,
                                  borderWidth: 1,
                                  textAlignVertical: 'top',
                                  backgroundColor: 'white',
                                  borderRadius: 50,
                                  flexWrap: 'wrap',
                                }}
                                placeholder="Type here.."
                                onChangeText={tax_id =>
                                  this.setState({tax_id: tax_id})
                                }
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  Name:
                                </Text>
                              </View>
                              <TextInput
                                style={{
                                  borderColor: 'white',
                                  height: '80%',
                                  width: '60%',
                                  paddingLeft: 15,
                                  borderWidth: 1,
                                  textAlignVertical: 'top',
                                  backgroundColor: 'white',
                                  borderRadius: 50,
                                  flexWrap: 'wrap',
                                }}
                                placeholder="Type here.."
                                onChangeText={name =>
                                  this.setState({name: name})
                                }
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  Price:
                                </Text>
                              </View>
                              <TextInput
                                style={{
                                  borderColor: 'white',
                                  height: '80%',
                                  width: '60%',
                                  paddingLeft: 15,
                                  borderWidth: 1,
                                  textAlignVertical: 'top',
                                  backgroundColor: 'white',
                                  borderRadius: 50,
                                  flexWrap: 'wrap',
                                }}
                                placeholder="Type here.."
                                onChangeText={price =>
                                  this.setState({price: price})
                                }
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  Max:
                                </Text>
                              </View>
                              <TextInput
                                style={{
                                  borderColor: 'white',
                                  height: '80%',
                                  width: '60%',
                                  paddingLeft: 15,
                                  borderWidth: 1,
                                  textAlignVertical: 'top',
                                  backgroundColor: 'white',
                                  borderRadius: 50,
                                  flexWrap: 'wrap',
                                }}
                                placeholder="Type here.."
                                onChangeText={max => this.setState({max: max})}
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  Description:
                                </Text>
                              </View>
                              <TextInput
                                style={{
                                  borderColor: 'white',
                                  height: 80,
                                  width: '60%',
                                  paddingLeft: 15,
                                  borderWidth: 1,
                                  textAlignVertical: 'top',
                                  backgroundColor: 'white',
                                  borderRadius: 10,
                                  flexWrap: 'wrap',
                                }}
                                placeholder="Type here.."
                                multiline={true}
                                underlineColorAndroid="transparent"
                                onChangeText={description =>
                                  this.setState({description: description})
                                }
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  Sequence:
                                </Text>
                              </View>
                              <TextInput
                                style={{
                                  borderColor: 'white',
                                  height: '80%',
                                  width: '60%',
                                  paddingLeft: 15,
                                  borderWidth: 1,
                                  textAlignVertical: 'top',
                                  backgroundColor: 'white',
                                  borderRadius: 50,
                                  flexWrap: 'wrap',
                                }}
                                placeholder="Type here.."
                                onChangeText={sequence =>
                                  this.setState({sequence: sequence})
                                }
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  Weight:
                                </Text>
                              </View>
                              <TextInput
                                style={{
                                  borderColor: 'white',
                                  height: '80%',
                                  width: '60%',
                                  paddingLeft: 15,
                                  borderWidth: 1,
                                  textAlignVertical: 'top',
                                  backgroundColor: 'white',
                                  borderRadius: 50,
                                  flexWrap: 'wrap',
                                }}
                                placeholder="Type here.."
                                onChangeText={weight =>
                                  this.setState({weight: weight})
                                }
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                              }}>
                              <View style={{width: width * 0.15}}>
                                <Text
                                  style={{
                                    fontSize: width * 0.02,
                                    color: '#76726d',
                                  }}>
                                  Status:
                                </Text>
                              </View>
                              <Picker
                                note
                                mode="dropdown"
                                style={{width: '40%'}}
                                selectedValue={this.state.status}
                                onValueChange={status =>
                                  this.setState({status: status})
                                }>
                                <Picker.Item label="Enable" value="1" />
                                <Picker.Item label="Disable" value="0" />
                              </Picker>
                            </View>
                          </View>
                          <View
                            style={{
                              flex: 0.4,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View style={{position: 'relative'}}>
                              {this.state.cover == '' ? (
                                <Image
                                  style={{
                                    width: width * 0.2,
                                    height: width * 0.2,
                                    borderRadius: (width * 0.2) / 2,
                                  }}
                                  source={require('../images/profile-circle-picture-8.jpg')}></Image>
                              ) : (
                                <Image
                                  style={{
                                    width: width * 0.2,
                                    height: width * 0.2,
                                    borderRadius: (width * 0.2) / 2,
                                  }}
                                  source={{uri: this.state.cover}}></Image>
                              )}
                              <View style={styles.camera_icon}>
                                <TouchableOpacity
                                  onPress={() => this.opencamera()}>
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
                      </ScrollView>
                      <View
                        style={{
                          marginTop: 20,
                          borderTopColor: 'lightgrey',
                          borderTopWidth: 1,
                        }}>
                        <TouchableOpacity
                          style={styles.add_btn}
                          onPress={() => {
                            this.addIngrediant();
                          }}>
                          <Text
                            style={{fontSize: width * 0.028, color: 'white'}}>
                            Add
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </Dialog>
              {/* Update ingredient dialog*/}
              <Dialog
                visible={this.state.edit_ingredient_dialog}
                dialogStyle={{
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#efeff4',
                  width: '80%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#efeff4',
                }}
                onTouchOutside={() =>
                  this.setState({edit_ingredient_dialog: false, cover: ''})
                }>
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
                          fontSize: width * 0.02,
                        }}>
                        Ingrediants
                      </Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            edit_ingredient_dialog: false,
                            cover: '',
                          })
                        }>
                        <FontAwesomeIcon
                          icon={faWindowClose}
                          color={'#ff9500'}
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flex: 0.6,
                          borderRightWidth: 1,
                          borderRightColor: 'lightgrey',
                          padding: 10,
                          paddingTop: 25,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{width: width * 0.15}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              taxId:
                            </Text>
                          </View>
                          <TextInput
                            style={{
                              borderColor: 'white',
                              height: '80%',
                              width: '60%',
                              paddingLeft: 15,
                              marginLeft: 15,
                              borderWidth: 1,
                              textAlignVertical: 'top',
                              backgroundColor: 'white',
                              borderRadius: 50,
                              flexWrap: 'wrap',
                            }}
                            placeholder="Type here.."
                            onChangeText={Ingredienttaxid =>
                              this.setState({Ingredienttaxid: Ingredienttaxid})
                            }
                            defaultValue={this.state.Ingredienttaxid.toString()}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                          }}>
                          <View style={{width: width * 0.15}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              Name:
                            </Text>
                          </View>
                          <TextInput
                            style={{
                              borderColor: 'white',
                              height: '80%',
                              width: '60%',
                              paddingLeft: 15,
                              marginLeft: 15,
                              borderWidth: 1,
                              textAlignVertical: 'top',
                              backgroundColor: 'white',
                              borderRadius: 50,
                              flexWrap: 'wrap',
                            }}
                            placeholder="Type here.."
                            onChangeText={Ingredientname =>
                              this.setState({Ingredientname: Ingredientname})
                            }
                            defaultValue={this.state.Ingredientname}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                          }}>
                          <View style={{width: width * 0.15}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              Price:
                            </Text>
                          </View>
                          <TextInput
                            style={{
                              borderColor: 'white',
                              height: '80%',
                              width: '60%',
                              paddingLeft: 15,
                              marginLeft: 15,
                              borderWidth: 1,
                              textAlignVertical: 'top',
                              backgroundColor: 'white',
                              borderRadius: 50,
                              flexWrap: 'wrap',
                            }}
                            placeholder="Type here.."
                            onChangeText={Ingredientprice =>
                              this.setState({Ingredientprice: Ingredientprice})
                            }
                            defaultValue={this.state.Ingredientprice}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                          }}>
                          <View style={{width: width * 0.15}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              Max:
                            </Text>
                          </View>
                          <TextInput
                            style={{
                              borderColor: 'white',
                              height: '80%',
                              width: '60%',
                              paddingLeft: 15,
                              marginLeft: 15,
                              borderWidth: 1,
                              textAlignVertical: 'top',
                              backgroundColor: 'white',
                              borderRadius: 50,
                              flexWrap: 'wrap',
                            }}
                            placeholder="Type here.."
                            onChangeText={Ingredientmax =>
                              this.setState({Ingredientmax: Ingredientmax})
                            }
                            defaultValue={this.state.Ingredientmax.toString()}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                          }}>
                          <View style={{width: width * 0.15}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              Description:
                            </Text>
                          </View>
                          <TextInput
                            style={{
                              borderColor: 'white',
                              height: 80,
                              width: '60%',
                              paddingLeft: 15,
                              marginLeft: 15,
                              borderWidth: 1,
                              textAlignVertical: 'top',
                              backgroundColor: 'white',
                              borderRadius: 10,
                              flexWrap: 'wrap',
                            }}
                            placeholder="Type here.."
                            multiline={true}
                            underlineColorAndroid="transparent"
                            onChangeText={Ingredientdesc =>
                              this.setState({Ingredientdesc: Ingredientdesc})
                            }
                            defaultValue={this.state.Ingredientdesc}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                          }}>
                          <View style={{width: width * 0.15}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              Sequence:
                            </Text>
                          </View>
                          <TextInput
                            style={{
                              borderColor: 'white',
                              height: '80%',
                              width: '60%',
                              paddingLeft: 15,
                              marginLeft: 15,
                              borderWidth: 1,
                              textAlignVertical: 'top',
                              backgroundColor: 'white',
                              borderRadius: 50,
                              flexWrap: 'wrap',
                            }}
                            placeholder="Type here.."
                            onChangeText={Ingredientseq =>
                              this.setState({Ingredientseq: Ingredientseq})
                            }
                            defaultValue={this.state.Ingredientseq.toString()}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                          }}>
                          <View style={{width: width * 0.15}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              Weight:
                            </Text>
                          </View>
                          <TextInput
                            style={{
                              borderColor: 'white',
                              height: '80%',
                              width: '60%',
                              paddingLeft: 15,
                              marginLeft: 15,
                              borderWidth: 1,
                              textAlignVertical: 'top',
                              backgroundColor: 'white',
                              borderRadius: 50,
                              flexWrap: 'wrap',
                            }}
                            placeholder="Type here.."
                            onChangeText={Ingredientweight =>
                              this.setState({
                                Ingredientweight: Ingredientweight,
                              })
                            }
                            defaultValue={this.state.Ingredientweight}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                          }}>
                          <View style={{width: 160}}>
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: '#76726d',
                              }}>
                              Status:
                            </Text>
                          </View>
                          <Picker
                            note
                            mode="dropdown"
                            style={{width: '40%'}}
                            selectedValue={this.state.Ingredientstatus.toString()}
                            onValueChange={Ingredientstatus =>
                              this.setState({
                                Ingredientstatus: Ingredientstatus,
                              })
                            }>
                            <Picker.Item label="Enable" value="1" />
                            <Picker.Item label="Disable" value="0" />
                          </Picker>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 0.4,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View style={{position: 'relative'}}>
                          {this.state.cover == '' ? (
                            <Image
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: 200 / 2,
                              }}
                              source={{
                                uri:
                                  'http://dev-fs.8d.ie/' +
                                  this.state.Ingredientimage,
                              }}></Image>
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
                  </View>
                  <View
                    style={{
                      marginTop: 20,
                      borderTopColor: 'lightgrey',
                      borderTopWidth: 1,
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 0.9}}>
                      <TouchableOpacity
                        style={styles.delete_btn}
                        onPress={() => this.deleteIngredient()}>
                        <Text style={{fontSize: width * 0.025, color: 'white'}}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styles.add_btn}
                        onPress={() =>
                          this.updateIngredient(this.state.Ingredientid)
                        }>
                        <Text style={{fontSize: width * 0.025, color: 'white'}}>
                          Update
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Dialog>
            </KeyboardAvoidingView>
            <View style={{flex: 1}}>
              {this.state.dataSource.length > 0 ? (
                <Grid>
                  <Row>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomColor: 'lightgrey',
                        borderBottomWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: width * 0.016,
                      }}>
                      <Col style={{alignItems: 'center', width: '15%'}}>
                        <View>
                          <Text
                            style={{
                              fontSize: width * 0.025,
                              backgroundColor: '#ff9500',
                              color: 'white',
                              borderRadius: 80,
                              padding: width * 0.016,
                              paddingBottom: 2,
                              paddingTop: 2,
                            }}>
                            Sr.No.
                          </Text>
                        </View>
                      </Col>
                      <Col style={{alignItems: 'center', width: '17%'}}>
                        <View>
                          <Text
                            style={{
                              fontSize: width * 0.025,
                              backgroundColor: '#ff9500',
                              color: 'white',
                              borderRadius: 80,
                              padding: width * 0.016,
                              paddingBottom: 2,
                              paddingTop: 2,
                            }}>
                            Name
                          </Text>
                        </View>
                      </Col>
                      <Col style={{alignItems: 'center', width: '17%'}}>
                        <View>
                          <Text
                            style={{
                              fontSize: width * 0.025,
                              backgroundColor: '#ff9500',
                              color: 'white',
                              borderRadius: 80,
                              padding: width * 0.016,
                              paddingBottom: 2,
                              paddingTop: 2,
                            }}>
                            Max
                          </Text>
                        </View>
                      </Col>
                      <Col style={{alignItems: 'center', width: '17%'}}>
                        <View>
                          <Text
                            style={{
                              fontSize: width * 0.025,
                              backgroundColor: '#ff9500',
                              color: 'white',
                              borderRadius: 80,
                              padding: width * 0.016,
                              paddingBottom: 2,
                              paddingTop: 2,
                            }}>
                            Status
                          </Text>
                        </View>
                      </Col>
                      <Col style={{alignItems: 'center', width: '17%'}}>
                        <View>
                          <Text
                            style={{
                              fontSize: width * 0.025,
                              backgroundColor: '#ff9500',
                              color: 'white',
                              borderRadius: 80,
                              padding: width * 0.016,
                              paddingBottom: 2,
                              paddingTop: 2,
                            }}>
                            Main
                          </Text>
                        </View>
                      </Col>
                      <Col style={{alignItems: 'center', width: '17%'}}>
                        <View>
                          <Text
                            style={{
                              fontSize: width * 0.025,
                              backgroundColor: '#ff9500',
                              color: 'white',
                              borderRadius: 80,
                              padding: width * 0.016,
                              paddingBottom: 2,
                              paddingTop: 2,
                            }}>
                            Action
                          </Text>
                        </View>
                      </Col>
                    </View>
                  </Row>
                  {this.filldata()}
                </Grid>
              ) : (
                <Grid></Grid>
              )}
            </View>
          </ScrollView>
        </View>
      </SideMenuDrawer>
    );
  }

  fillIngredient() {
    var items = [];
    var {height, width} = Dimensions.get('window');
    console.log('Data = ' + JSON.stringify(this.state.dataSourceIngredient));
    this.state.dataSourceIngredient.map((item, i) => {
      items.push(
        <TouchableOpacity onPress={() => this.getIngredient(item.id)}>
          <Grid>
            <Row>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: 'lightgrey',
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <Col style={{alignItems: 'center', width: '20%'}}>
                  <Text style={{fontSize: width * 0.02, textAlign: 'center'}}>
                    {item.name}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '20%'}}>
                  <Text style={{fontSize: width * 0.02, textAlign: 'center'}}>
                    ${item.price}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '20%'}}>
                  <Text style={{fontSize: width * 0.02, textAlign: 'center'}}>
                    {item.max}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '20%'}}>
                  <Text style={{fontSize: width * 0.02, textAlign: 'center'}}>
                    {item.weight}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '20%'}}>
                  <Text style={{fontSize: width * 0.02, textAlign: 'center'}}>
                    {item.status == 1 ? (
                      <Text>Enable</Text>
                    ) : (
                      <Text>Disable</Text>
                    )}
                  </Text>
                </Col>
              </View>
            </Row>
          </Grid>
        </TouchableOpacity>,
      );
    });
    return items;
  }

  filldata() {
    var items = [];
    var {height, width} = Dimensions.get('window');
    this.state.dataSource.map((item, i) => {
      items.push(
        <Grid>
          <TouchableOpacity
            onPress={() => {
              this.getIngrediants(item.id);
            }}>
            <Row>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: width * 0.016,
                }}>
                <Col style={{alignItems: 'center', width: '15%'}}>
                  <Text style={{fontSize: width * 0.025, textAlign: 'center'}}>
                    {i + 1}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '17%'}}>
                  <Text style={{fontSize: width * 0.025, textAlign: 'center'}}>
                    {item.name}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '17%'}}>
                  <Text style={{fontSize: width * 0.025, textAlign: 'center'}}>
                    {item.max}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '17%'}}>
                  <Text style={{fontSize: width * 0.025, textAlign: 'center'}}>
                    {item.status == 1 ? (
                      <Text>Enable</Text>
                    ) : (
                      <Text>Disable</Text>
                    )}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '17%'}}>
                  <Text style={{fontSize: width * 0.025, textAlign: 'center'}}>
                    {item.is_main == 1 ? <Text>Yes</Text> : <Text>No</Text>}
                  </Text>
                </Col>
                <Col style={{alignItems: 'center', width: '17%'}}>
                  <TouchableOpacity
                    style={styles.add}
                    onPress={() => this.add_ingredient(item.id)}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.025,
                        textAlign: 'center',
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </Col>
              </View>
            </Row>
          </TouchableOpacity>
        </Grid>,
      );
    });
    return items;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  add_btn: {
    marginTop: width * 0.01,
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#ff9500',
  },
  add: {
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#ff9500',
  },
  inactive_add: {
    marginRight: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#818580',
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
  dynamic_list_view: {
    flexDirection: 'row',
    padding: width * 0.016,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  grid_text: {
    fontSize: 30,
    fontWeight: 'normal',
    color: 'white',
    textAlign: 'center',
  },
  delete_btn: {
    marginTop: width * 0.01,
    marginRight: 15,
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: '#ff5800',
  },
});
