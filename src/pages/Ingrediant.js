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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
      dataSource: [],
      dataSource_inside: {},
    };
  }
  componentDidMount() {
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
        console.log(responseJson);
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
              responseJson.ingredientGroups[i].ingredients[j].iscreate = false;
              responseJson.ingredientGroups[i].ingredients[j].isgroup = true;
              responseJson.ingredientGroups[i].ingredients[
                j
              ].priceupdateparent = this.priceupdate;
              ingredientGroups.push(
                responseJson.ingredientGroups[i].ingredients[j],
              );
            }
          }
          console.log(responseJson.ingredientGroups);
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
    console.log(width);
    var left = (
      <Left style={{flex: 1}}>
        <Button onPress={() => this.props.navigation.openDrawer()} transparent>
          <FontAwesomeIcon icon={faBars} color={'white'} />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{flex: 1}}>
        <FontAwesomeIcon icon={faBars} color={'white'} />
        <FontAwesomeIcon icon={faBars} color={'white'} />
        <FontAwesomeIcon icon={faBars} color={'white'} />
      </Right>
    );
    return (
      <View style={styles.container}>
        <Navbar left={left} right={right} title="Kitchen" />
        <View style={{flex: 0.9, flexDirection: 'row'}}>
          <FlatList
            data={this.state.dataSource}
            keyExtractor={({id}, index) => id}
            numColumns={8}
            renderItem={({item}) => (
              <View style={{padding: 5, flexDirection: 'row'}}>
                <Image
                  style={{height: 150, width: 150}}
                  source={{uri: 'http://dev-fs.8d.ie/storage/' + item.cover}}
                />
              </View>
            )}
          />
        </View>
        <View style={{flex: 0.1, backgroundColor: '#ff9500'}}></View>
      </View>
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
});
