import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Button, Left, Right, Grid, Col, Row, Picker } from 'native-base';
import Navbar from '../components/Navbar';
import {
  faBars,
  faWindowClose,
  faArrowDown,
  faCamera,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Card } from 'react-native-elements';
import { Dialog } from 'react-native-simple-dialogs';
import RNImagePicker from 'react-native-image-picker';
import SideMenu from '../components/SideMenu';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';

export default class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      repassword: '',
      token: '',
      role: '',
      add_dialog: false,
      edit_dialog: false,
      img_uri: '',
      selected: null,
      avatar: '',
      dataSource: '',
      currency: '',
      role_details: [],
      status: 1,
      Editusername: '',
      Editname: '',
      Editfirstname: '',
      Editlastname: '',
      Editemail: '',
      Editphone: '',
      Editpassword: '',
      Editrole: '',
      EditImage: '',
      Search_result: '',
      Searchtext: '',
      Employeeid: '',
      hidePassword: true,
      count: 0,
      userDetail: ""
      // dataSourcePicker : []
    };
    this.dataSourcePicker = [];
    this._retrieveData();
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

  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }
  add_employee = () => {
    this.setState({ add_dialog: true });
  };
  selectEmployee = (id) => {
    var data = new FormData();
    data.append('id', id);
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    fetch('http://dev-fs.8d.ie/api/kitchen/getEmployee', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({ edit_dialog: true });
          this.setState({
            Employeeid: responseJson.Employee.id,
            Editusername: responseJson.Employee.user_name,
            Editfirstname: responseJson.Employee.name.split(' ')[0],
            Editlastname: responseJson.Employee.name.split(' ')[1],
            Editemail: responseJson.Employee.email,
            Editphone: responseJson.Employee.phone_number,
            Editpassword: responseJson.Employee.password,
            Editrole: responseJson.Employee.role_id,
            EditImage: responseJson.Employee.photo,
          });
          // this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  validate = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      this.setState({ email: text });
      return false;
    } else {
      this.setState({ email: text });
      console.log('Email is Correct');
    }
  };
  updatePress = (id) => {
    var data = new FormData();
    data.append('id', id);
    data.append('first_name', this.state.Editfirstname);
    data.append('last_name', this.state.Editlastname);
    data.append('user_name', this.state.Editusername);
    data.append('phone_number', this.state.Editphone);
    data.append('email', this.state.Editemail);
    data.append('password', this.state.Editpassword);
    data.append('password_confirmation', this.state.Editpassword);
    data.append('status', this.state.status);
    if (this.state.avatar != "") {
      data.append('photo', {
        name: this.state.avatar.fileName,
        type: this.state.avatar.type,
        uri:
          Platform.OS === 'android'
            ? this.state.avatar.uri
            : this.state.avatar.uri.replace('file://', ''),
      });
    }
    data.append('role_id', this.state.Editrole);
    console.log(data);
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    fetch('http://dev-fs.8d.ie/api/kitchen/updateEmployee', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          console.log(responseJson);
          this.setState({ edit_dialog: false, img_uri: "" });
          this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  searchResult = () => {
    var headers = new Headers();
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    var data = new FormData();
    data.append('name', this.state.Searchtext);

    fetch('http://dev-fs.8d.ie/api/kitchen/searchEmployee', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({ Search_result: responseJson.Employee });
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  clear = () => {
    this.setState({ Search_result: '', Searchtext: '' });
  };
  deletePress = () => {
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
            this.deleteYesPress(this.state.Employeeid);
          },
        },
      ],
      { cancelable: false },
    );
  };
  deleteYesPress = id => {
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    var data = new FormData();
    data.append('id', id);

    fetch('http://dev-fs.8d.ie/api/kitchen/deleteEmployee', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({ edit_dialog: false, img_uri: "" });
          this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  showDetail = () => {
    if (
      this.state.username == '' ||
      this.state.firstName == '' ||
      this.state.lastName == '' ||
      this.state.email == '' ||
      this.state.phone.length < 10 ||
      this.state.password == '' ||
      this.state.role == ''
    ) {
      alert('Please inserted remaining fields');
    } else {
      if (this.state.repassword != this.state.password) {
        alert('Password mismatch');
      } else {
        var data = new FormData();
        data.append('first_name', this.state.firstName);
        data.append('last_name', this.state.lastName);
        data.append('user_name', this.state.username);
        data.append('phone_number', this.state.phone);
        data.append('email', this.state.email);
        data.append('password', this.state.password);
        data.append('password_confirmation', this.state.repassword);
        data.append('status', this.state.status);
        data.append('photo', {
          name: this.state.avatar.fileName,
          type: this.state.avatar.type,
          uri:
            Platform.OS === 'android'
              ? this.state.avatar.uri
              : this.state.avatar.uri.replace('file://', ''),
        });
        data.append('role_id', this.state.role);
        console.log(data);
        const user_details = this.state.userDetail;
        var headers = new Headers();
        let auth = 'Bearer ' + user_details.userToken;
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');
        console.log(headers);

        fetch('http://dev-fs.8d.ie/api/kitchen/addEmployee', {
          method: 'POST',
          headers: headers,
          body: data,
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log(responseJson);
            if (responseJson.status == 'success') {
              // console.log('username', this.state.username);
              // console.log('firstname', this.state.firstName);
              // console.log('lastname', this.state.lastName);
              // console.log('email', this.state.email);
              // console.log('phone', this.state.phone);
              // console.log('password', this.state.password);
              // console.log('Confirm password', this.state.repassword);
              // console.log('Role', this.state.role);
              // console.log('avatar', {
              //   name: this.state.avatar.fileName,
              //   type: this.state.avatar.type,
              //   uri:
              //     Platform.OS === 'android'
              //       ? this.state.avatar.uri
              //       : this.state.avatar.uri.replace('file://', ''),
              // });
              console.log(responseJson);
              this.setState({ add_dialog: false });
              this.componentDidMount();
            } else {
              alert('Something wrong happened');
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  roleList = () => {
    return this.dataSourcePicker.map(item => {
      return <Picker.Item label={item.name} value={item.id} />;
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
        });
      }
    });
  };
  componentDidMount() {
    if (this.state.count == 1) {
      this.dataSourcePicker = [];
      const user_details = this.state.userDetail;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.userToken;
      headers.append('Authorization', auth);
      headers.append('Accept', 'application/json');
      console.log(headers);
      fetch('http://dev-fs.8d.ie/api/kitchen/getEmployees', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson) {
            const dataSource = [];
            console.log(responseJson);
            this.setState({ dataSource: responseJson.employees });
            //this.props.navigation.navigate('AfterLogin',{Json_value:responseJson.data});
          } else {
            alert('Something wrong happened');
          }
        })
        .catch(error => {
          console.error(error);
        });

      fetch('http://dev-fs.8d.ie/api/kitchen/getRoles', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson) {
            console.log(responseJson);
            // this.setState({dataSource: responseJson.Roles});
            var MyArr;
            let i = 0;
            for (i = 0; i < responseJson.Roles.length; i++) {
              //this.dataSourcePicker['name'+i] = responseJson.Roles[i].name
              MyArr = {
                id: responseJson.Roles[i].id,
                name: responseJson.Roles[i].display_name,
              };
              this.dataSourcePicker.push(MyArr);
            }
            // let hello = JSON.stringify(this.dataSourcePicker);
            this.setState({ role_details: JSON.stringify(this.dataSourcePicker) });
            console.log(this.dataSourcePicker);
            console.log(JSON.stringify(this.dataSourcePicker));
            //this.props.navigation.navigate('AfterLogin',{Json_value:responseJson.data});
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
    var { height, width } = Dimensions.get('window');
    console.log(width);
    var left = (
      <Left style={{ flex: 1 }}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => this.add_employee()}>
          <Image
            style={{ width: 45, height: 45 }}
            source={require('../images/add_employee.png')}
          />
        </TouchableOpacity>
      </Right>
    );
    return (
      <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref} style={{ zIndex: 1 }} navigation={this.props}>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding" enabled>
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
              onTouchOutside={() => this.setState({ add_dialog: false })}>
              <ScrollView>
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
                      }}>
                      Add Employee
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => this.setState({ add_dialog: false })}>
                      <FontAwesomeIcon
                        icon={faWindowClose}
                        color={'#ff9500'}
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      flex: 0.6,
                      borderRightWidth: 1,
                      borderRightColor: 'lightgrey',
                      padding: 10,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          User Name:
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
                        onChangeText={username => this.setState({ username })}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          First Name:
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
                        onChangeText={firstName => this.setState({ firstName })}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Last Name:
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
                        onChangeText={lastName => this.setState({ lastName })}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Email:
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
                        onChangeText={text => this.validate(text)}
                        value={this.state.email}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Phone:
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
                        onChangeText={phone => this.setState({ phone })}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Password:
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
                        secureTextEntry={this.state.hidePassword}
                        onChangeText={password => this.setState({ password })}
                      />

                      <View
                        style={{
                          position: 'absolute',
                          zIndex: 1,
                          right: '13%',
                          top: '18%',
                        }}>
                        {this.state.hidePassword == true ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ hidePassword: false });
                            }}>
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              color={'#76726d'}
                              size={25}
                            />
                          </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ hidePassword: true });
                              }}>
                              <FontAwesomeIcon
                                icon={faEye}
                                color={'#76726d'}
                                size={25}
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Re-type:
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
                          alignSelf: 'flex-end',
                          marginRight: 15,
                        }}
                        placeholder="Type message here.."
                        onChangeText={repassword => this.setState({ repassword })}
                        secureTextEntry={true}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 160 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Role:
                        </Text>
                      </View>
                      <Picker
                        note
                        mode="dropdown"
                        style={{ width: '40%' }}
                        selectedValue={this.state.role}
                        onValueChange={value => this.setState({ role: value })}>
                        {this.roleList()}
                      </Picker>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{ position: 'relative' }}>
                      {this.state.img_uri == '' ? (
                        <Image
                          style={{
                            width: 200,
                            height: 200,
                            borderRadius: 200 / 2,
                          }}
                          source={require('../images/profile-circle-picture-8.png')}></Image>
                      ) : (
                          <Image
                            style={{
                              width: 200,
                              height: 200,
                              borderRadius: 200 / 2,
                            }}
                            source={{ uri: this.state.img_uri }}></Image>
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
                    onPress={() => {
                      this.showDetail();
                    }}>
                    <Text style={{ fontSize: width * 0.03, color: 'white' }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Dialog>
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
              onTouchOutside={() => this.setState({ edit_dialog: false, img_uri: "" })}>
              <ScrollView>
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
                      }}>
                      Edit Employee
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => this.setState({ edit_dialog: false, img_uri: "" })}>
                      <FontAwesomeIcon
                        icon={faWindowClose}
                        color={'#ff9500'}
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      flex: 0.6,
                      borderRightWidth: 1,
                      borderRightColor: 'lightgrey',
                      padding: 10,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          User Name:
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
                        onChangeText={Editusername =>
                          this.setState({ Editusername })
                        }
                        defaultValue={this.state.Editusername}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          First Name:
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
                        onChangeText={Editfirstname =>
                          this.setState({ Editfirstname })
                        }
                        defaultValue={this.state.Editfirstname}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Last Name:
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
                        onChangeText={Editlastname =>
                          this.setState({ Editlastname })
                        }
                        defaultValue={this.state.Editlastname}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Email:
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
                        onChangeText={Editemail => this.setState({ Editemail })}
                        defaultValue={this.state.Editemail}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Phone:
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
                        onChangeText={Editphone => this.setState({ Editphone })}
                        defaultValue={this.state.Editphone}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Password:
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
                        onChangeText={Editpassword =>
                          this.setState({ Editpassword })
                        }
                        defaultValue={this.state.Editpassword}
                        secureTextEntry={this.state.hidePassword}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          zIndex: 1,
                          right: '13%',
                          top: '18%',
                        }}>
                        {this.state.hidePassword ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ hidePassword: false });
                            }}>
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              color={'#76726d'}
                              size={25}
                            />
                          </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ hidePassword: true });
                              }}>
                              <FontAwesomeIcon
                                icon={faEye}
                                color={'#76726d'}
                                size={25}
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 150 }}>
                        <Text
                          style={{ fontSize: width * 0.02, color: '#76726d' }}>
                          Re-type:
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
                          alignSelf: 'flex-end',
                        }}
                        placeholder="Type message here.."
                        onChangeText={Editpassword =>
                          this.setState({ Editpassword })
                        }
                        defaultValue={this.state.Editpassword}
                        secureTextEntry={true}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <View style={{ width: 160 }}>
                        <Text style={{ fontSize: width * 0.02, color: 'grey' }}>
                          Role:
                        </Text>
                      </View>
                      <Picker
                        note
                        mode="dropdown"
                        style={{ width: '40%' }}
                        selectedValue={this.state.Editrole}
                        onValueChange={Editrole =>
                          this.setState({ Editrole: Editrole })
                        }>
                        {this.roleList()}
                      </Picker>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{ position: 'relative' }}>
                      {this.state.img_uri == '' ? (
                        <Image
                          style={{
                            width: 200,
                            height: 200,
                            borderRadius: 200 / 2,
                          }}
                          source={{
                            uri:
                              'http://dev-fs.8d.ie/employee-photos/' +
                              this.state.EditImage,
                          }}></Image>
                      ) : (
                          <Image
                            style={{
                              width: 200,
                              height: 200,
                              borderRadius: 200 / 2,
                            }}
                            source={{ uri: this.state.img_uri }}></Image>
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
                  }}>
                  <View style={{ flex: 0.9 }}>
                    <TouchableOpacity
                      style={styles.delete_btn}
                      onPress={() => this.deletePress()}>
                      <Text style={{ fontSize: width * 0.025, color: 'white' }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.add_btn}
                      onPress={() => this.updatePress(this.state.Employeeid)}>
                      <Text style={{ fontSize: width * 0.025, color: 'white' }}>
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </Dialog>
          </KeyboardAvoidingView>
          <Navbar left={left} right={right} title="Employee" />
          <View
            style={{
              flex: 0.12,
              backgroundColor: '#efeff4',
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 0.98,
                margin: 10,
                marginLeft: 40,
              }}>
              <Text style={{ fontSize: width * 0.03 }}>Name:</Text>
              <TextInput
                style={{
                  borderColor: 'gray',
                  height: '70%',
                  width: '60%',
                  paddingLeft: 15,
                  marginLeft: 15,
                  borderWidth: 1,
                  textAlignVertical: 'top',
                  backgroundColor: 'white',
                  borderRadius: 50,
                  flexWrap: 'wrap',
                  alignSelf: 'center',
                }}
                placeholder=" "
                numberOfLines={1}
                onChangeText={(Searchtext) =>
                  this.setState({ Searchtext: Searchtext })
                }
                defaultValue={this.state.Searchtext}
              />
            </View>
            <View
              style={{
                margin: 10,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              {this.state.Search_result != '' ? (
                <TouchableOpacity
                  style={{ marginHorizontal: 30 }}
                  onPress={() => {
                    this.clear(' ');
                  }}>
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      backgroundColor: '#ff9500',
                      paddingLeft: 10,
                      paddingRight: 10,
                      color: 'white',
                      borderRadius: 10,
                    }}>
                    CLEAR
                  </Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  this.searchResult();
                }}>
                <Text
                  style={{
                    fontSize: width * 0.03,
                    paddingHorizontal: 10,
                    backgroundColor: '#ff9500',
                    color: 'white',
                    borderRadius: 10,
                  }}>
                  SEARCH
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 0.8 }}>
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
                    fontSize: width * 0.02,
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
                    fontSize: width * 0.02,
                    backgroundColor: '#ff9500',
                    color: 'white',
                    borderRadius: 80,
                    padding: 15,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}>
                  Role
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
                    fontSize: width * 0.02,
                    backgroundColor: '#ff9500',
                    color: 'white',
                    borderRadius: 80,
                    padding: 15,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}>
                  Enable
                </Text>
              </View>
            </View>
            {this.state.Search_result == '' ? (
              <FlatList
                pagingEnabled={true}
                data={this.state.dataSource}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.selectEmployee(item.id);
                    }}>
                    <View style={styles.dynamic_list_view}>
                      <View style={{ flex: 0.5, alignItems: 'center' }}>
                        <Text style={{ fontSize: width * 0.025 }}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={{ flex: 0.5, alignItems: 'center' }}>
                        <Text style={{ fontSize: width * 0.025 }}>
                          {item.display_name}
                        </Text>
                      </View>
                      <View style={{ flex: 0.5, alignItems: 'center' }}>
                        {item.status == 1 ? (
                          <Text style={{ fontSize: width * 0.025 }}>Yes</Text>
                        ) : (
                            <Text style={{ fontSize: width * 0.025 }}>No</Text>
                          )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={({ id }, index) => id}
              />
            ) : (
                <FlatList
                  pagingEnabled={true}
                  data={this.state.Search_result}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.selectEmployee(item.id);
                      }}>
                      <View style={styles.dynamic_list_view}>
                        <View style={{ flex: 0.5, alignItems: 'center' }}>
                          <Text style={{ fontSize: width * 0.025 }}>
                            {item.name}
                          </Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center' }}>
                          <Text style={{ fontSize: width * 0.025 }}>
                            {item.display_name}
                          </Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center' }}>
                          {item.status == 1 ? (
                            <Text style={{ fontSize: width * 0.025 }}>Yes</Text>
                          ) : (
                              <Text style={{ fontSize: width * 0.025 }}>No</Text>
                            )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={({ id }, index) => id}
                />
              )}
          </View>
          <View style={{ flex: 0.08, backgroundColor: '#ff9500' }}></View>
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
  add_btn: {
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
  delete_btn: {
    marginTop: 10,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 45,
    paddingRight: 45,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: '#ff5800',
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
    padding: 15,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
});
