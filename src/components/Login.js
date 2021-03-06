import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoffee, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      email: '',
      showPassword: true,
      device_id: DeviceInfo.getDeviceId(),
      device_type: Platform.OS,
      errorText: '',
      hasError: false,
      userToken: '',
      userId: '',
      roleName: '',
      name: '',
      wok: '',
      vender_id: null,
    };

    NetInfo.addEventListener(state => {
      if (state.isConnected.toString() == 'false') {
        Alert.alert(
          'No network connection',
          'No internet connection. connect to the internet and try again.',
          [
            {
              text: 'ok',
              onPress: () => {},
            },
          ],
          {cancelable: false},
        );
      } else {
        this._retrieveData();
        this.storeData = this.storeData.bind(this);
      }
    });
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      console.log('userId::' + value);
      let valueRecieve = JSON.parse(value);

      if (value !== null) {
        this.setState({userId: JSON.parse(value)});
        if (valueRecieve.roleName == 'vender') {
          this.props.navigation.navigate('Employee');
        } else if (valueRecieve.roleName == 'cashier') {
          this.props.navigation.navigate('Payment');
        } else if (valueRecieve.roleName == 'kitchenstaff') {
          this.props.navigation.navigate('Home_kitchen');
        }
      } else {
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
      alert(error);
    }
  };

  storeData = async () => {
    let obj = {
      user_id: this.state.userId,
      userToken: this.state.userToken,
      roleName: this.state.roleName,
      name: this.state.name,
      wok: this.state.wok,
      vender_id: this.state.vender_id,
    };
    console.log(obj);
    try {
      await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
      if (this.state.roleName == 'vender') {
        this.props.navigation.navigate('Employee');
      } else if (this.state.roleName == 'cashier') {
        this.props.navigation.navigate('Payment');
      } else if (this.state.roleName == 'kitchenstaff') {
        this.props.navigation.navigate('Home_kitchen');
      }
    } catch (e) {
      alert(e);
    }
  };

  login = () => {
    if (this.state.email == '') {
      alert('Email cannot be black');
    } else if (this.state.password == '') {
      alert('Password cannot be black');
    } else if (this.state.email == '' && this.state.password == '') {
      alert('Username and Password cannot be blank');
    } else {
      //this.props.navigation.navigate('Employee');
      var data = new FormData();
      data.append('email', this.state.email);
      data.append('password', this.state.password);
      console.log(data);
      var headers = new Headers();
      headers.append('Accept', 'application/json');

      fetch('http://dev-fs.8d.ie/api/kitchen/login', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('safhjv', responseJson);
          if (responseJson.status == 'success') {
            if (responseJson.role == 'vender') {
              this.setState({
                userId: responseJson.vender.id,
                roleName: responseJson.role,
                userToken: responseJson.access_token,
                name: responseJson.vender.name,
                wok: responseJson.vender.logo,
                vender_id: responseJson.vender.vender_id,
              });
            } else {
              this.setState({
                userId: responseJson.employee.id,
                roleName: responseJson.employee.role_name,
                userToken: responseJson.access_token,
                name: responseJson.employee.name,
                vender_id: responseJson.employee.vender_id,
              });
            }
            this.storeData();
          } else if (responseJson.status == 'fail') {
            alert('Unauthorized user');
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          this.setState({hasError: true, errorText: error});
        });
    }
  };

  render() {
    var {height, width} = Dimensions.get('window');
    // const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={{
            paddingTop: 20,
            flex: 0.4,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={require('../images/logo.png')} />
        </View>
        <View
          style={{flex: 0.5, marginTop: width * 0.01, alignItems: 'center'}}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <TextInput
              style={{
                borderBottomColor: 'white',
                paddingLeft: 15,
                borderBottomWidth: 1,
                textAlignVertical: 'top',
                width: '70%',
                color: 'white',
                flexWrap: 'wrap',
              }}
              placeholder="Username -or- Email"
              placeholderTextColor="white"
              numberOfLines={1}
              onChangeText={email => this.setState({email})}
            />
          </View>
          <View
            style={{position: 'relative', width: '100%', alignItems: 'center'}}>
            <TextInput
              style={{
                borderBottomColor: 'white',
                paddingLeft: 15,
                marginTop: 20,
                borderBottomWidth: 1,
                textAlignVertical: 'top',
                width: '70%',
                color: 'white',
                flexWrap: 'wrap',
              }}
              placeholder="Password"
              placeholderTextColor="white"
              numberOfLines={1}
              onChangeText={password => this.setState({password})}
              secureTextEntry={this.state.showPassword}
            />
            <View style={{position: 'absolute', right: width * 0.18, top: 40}}>
              {this.state.showPassword == true ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({showPassword: false});
                  }}>
                  <FontAwesomeIcon icon={faEyeSlash} color={'white'} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({showPassword: true});
                  }}>
                  <FontAwesomeIcon icon={faEye} color={'white'} />
                </TouchableOpacity>
              )}
            </View>
            {this.state.hasError ? (
              <Text
                style={{
                  color: '#c0392b',
                  textAlign: 'center',
                  marginTop: width * 0.01,
                }}>
                {this.state.errorText}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={{backgroundColor: 'white', borderRadius: 9, marginTop: 20}}
            onPress={() => this.login()}>
            <Text
              style={{
                color: '#808080',
                fontSize: width * 0.025,
                textAlign: 'center',
                padding: 10,
                paddingRight: 80,
                paddingLeft: 80,
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9500',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
