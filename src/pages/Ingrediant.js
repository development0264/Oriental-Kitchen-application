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
} from 'react-native';
import {Button, Left, Right, Icon} from 'native-base';
import Navbar from '../components/Navbar';
import {
  faBars,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Card} from 'react-native-elements';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
      dataSource: [],
      dataSource_inside: {},
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

  componentDidMount() {
    if (this.state.count == 1) {
      var headers = new Headers();
      const user_details = this.state.userDetail;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.userToken;
      headers.append('Authorization', auth);
      headers.append('Accept', 'application/json');
      console.log('Header = ' + JSON.stringify(headers));
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
                responseJson.ingredientGroups[i].ingredients[
                  j
                ].isexisting = false;
                responseJson.ingredientGroups[i].ingredients[
                  j
                ].iscreate = false;
                responseJson.ingredientGroups[i].ingredients[j].isgroup = false;
                responseJson.ingredientGroups[i].ingredients[
                  j
                ].priceupdateparent = this.priceupdate;
                ingredientGroups.push(
                  responseJson.ingredientGroups[i].ingredients[j],
                );
              }
            }

            this.setState({
              dataSource: ingredientGroups,
              //dataSource_inside: responseJson.ingredientGroups.ingredients,
            });
            //alert(JSON.stringify(this.state.dataSource));
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  renderGroupMembers = group => {
    if (group.ingredients) {
      return (
        <View style={{flexDirection: 'row'}}>
          {group.ingredients.map((prop, key) => {
            return (
              <Image
                style={{height: 90, width: 90}}
                source={{uri: 'http://dev-fs.8d.ie/storage/' + prop.cover}}
              />
            );
          })}
        </View>
      );
    }
    return null;
  };
  render() {
    var {height, width} = Dimensions.get('window');
    const user_details = this.state.userDetail;
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
        {/* <FontAwesomeIcon icon={faBars} color={'white'} />
        <FontAwesomeIcon icon={faBars} color={'white'} />
        <FontAwesomeIcon icon={faBars} color={'white'} /> */}
      </Right>
    );
    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{zIndex: 1}}
        navigation={this.props}>
        <View style={styles.container}>
          <Navbar left={left} right={right} title="Ingredient" />
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
          <View style={{flex: 0.92, flexDirection: 'row', padding: 5}}>
            <FlatList
              data={this.state.dataSource}
              keyExtractor={({id}, index) => id}
              numColumns={8}
              renderItem={({item}) => (
                <View>
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
                    <TouchableOpacity onPress={() => {}}>
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
                </View>
              )}
            />
          </View>
          <View style={{flex: 0.08, backgroundColor: '#ff9500'}}></View>
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
});
