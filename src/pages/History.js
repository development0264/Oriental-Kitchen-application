import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Navbar from '../components/Navbar';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Dialog} from 'react-native-simple-dialogs';
import DatePicker from 'react-native-datepicker';
import {Button, Left, Right} from 'native-base';
import {
  faBars,
  faWindowClose,
  faPrint,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';
var {height, width} = Dimensions.get('window');
export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      FromDate: '',
      ToDate: '',
      edit_history_dialog: false,
      dataSource: [],
      Search_history: '',
      is_search: false,
      Numid: 0,
      dataSourcePicker: [],
      Quantity: 0,
      totalPrice: 0,
      orderStatus: '',
      refund: '',
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
      const user_details = this.state.userDetail;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.userToken;
      headers.append('Authorization', auth);
      headers.append('Accept', 'application/json');
      console.log(headers);
      fetch('http://dev-fs.8d.ie/api/kitchen/getOrderHistoryList', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status == 'success') {
            console.log('Main = ' + JSON.stringify(responseJson));
            // const dataSource = [];
            console.log(responseJson);
            this.setState({dataSource: responseJson.orders});
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
  edit_history_dialog = () => {
    this.setState({edit_history_dialog: true});
  };
  clear = () => {
    this.setState({FromDate: '', ToDate: '', is_search: false});
  };
  // getParsedDate = (date) => {
  //   console.log(date);
  //   date = String(date).split('-');
  //   var days = String(date[0]).split('-');
  //   return [days[0], days[1], days[2]].join('-');
  // };

  getOrder = id => {
    console.log(this.state.Numid);
    var data = new FormData();
    data.append('order_id', id);
    console.log(data);

    fetch('http://dev-fs.8d.ie/api/order/get-orderdata-id', {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'success') {
          console.log(responseJson);
          this.setState({edit_history_dialog: true, Numid: 0});
          this.setState({dataSourcePicker: responseJson.data});
          // this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  filldata = () => {
    var {height, width} = Dimensions.get('window');
    var items = [];
    this.state.dataSourcePicker.map((item, i) => {
      items.push(
        <TouchableHighlight
          underlayColor="lightgray"
          style={{borderRadius: 20}}
          onPress={() => {}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <View style={{flex: 0.1, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: width * 0.02,
                  textAlign: 'center',
                  color: '#808080',
                }}>
                {i + 1}.
              </Text>
            </View>
            <View style={{flex: 0.4, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: width * 0.02,
                  color: '#808080',
                  textAlign: 'center',
                }}>
                Custom({item.dish_name})
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: width * 0.02,
                  color: '#808080',
                }}>
                ${item.dish_price} x {}
              </Text>
              <Text
                style={{
                  fontSize: width * 0.02,
                  color: '#808080',
                }}>
                {item.qty}
              </Text>
            </View>
            <View style={{flex: 0.2, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: width * 0.02,
                  color: '#808080',
                  textAlign: 'center',
                }}>
                ${item.dish_price * item.qty}
              </Text>
            </View>
          </View>
        </TouchableHighlight>,
      );
    });
    return items;
  };

  // minusQty = () =>{
  //   let Quantity = this.state.Quantity
  //   if(Quantity!=0){
  //     this.setState({
  //       Quantity: qty - 1
  //     });
  //   }
  // }

  // plusQty = () =>{
  //   let Quantity = this.state.Quantity + 1
  //   this.setState({
  //     Quantity: Quantity
  //   });
  // }

  searchHistory = () => {
    // var fromDate = this.getParsedDate(this.state.FromDate);
    // console.log(fromDate);
    // var toDate = this.getParsedDate(this.state.ToDate);
    // console.log(toDate);
    const user_details = this.state.userDetail;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.userToken;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);

    var data = new FormData();
    data.append('start_date', this.state.FromDate);
    data.append('end_date', this.state.ToDate);
    fetch('http://dev-fs.8d.ie/api/kitchen/searchOrderHistory', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Search =' + JSON.stringify(responseJson));
        if (responseJson.status == 'success') {
          if (responseJson.orders.length == 0) {
            alert('No data found');
          } else {
            this.setState({
              Search_history: responseJson.orders,
              is_search: true,
            });
          }
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  render() {
    var {height, width} = Dimensions.get('window');
    // let totalQuantity = this.state.totalQuantity;
    let totalPrice = this.state.totalPrice;
    this.state.dataSourcePicker.forEach(item => {
      // totalQuantity += item.quantity;
      totalPrice += item.qty * item.dish_price;
    });
    let orderStatus = this.state.orderStatus;
    this.state.dataSourcePicker.map(item => {
      // totalQuantity += item.quantity;
      orderStatus = item.orders_status_name;
    });
    var left = (
      <Left style={{flex: 1}}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
        </Button>
      </Left>
    );
    var right = <Right style={{flex: 1}}></Right>;
    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{zIndex: 1}}
        navigation={this.props}>
        <View style={styles.container}>
          <Navbar left={left} right={right} title="History" />

          <ScrollView>
            <KeyboardAvoidingView behavior="padding" enabled>
              {/* History Update Dialog */}
              <Dialog
                visible={this.state.edit_history_dialog}
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
                  this.setState({edit_history_dialog: false})
                }>
                <ScrollView>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.99}}>
                      <Text
                        style={{
                          textAlign: 'center',
                          borderBottomWidth: 1,
                          borderBottomColor: 'lightgrey',
                          paddingBottom: 5,
                          fontSize: width * 0.02,
                        }}>
                        Order
                      </Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({edit_history_dialog: false})
                        }>
                        <FontAwesomeIcon
                          icon={faWindowClose}
                          color={'#ff9500'}
                          size={width * 0.03}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        flex: 0.74,
                        borderRightWidth: 1,
                        borderRightColor: 'lightgrey',
                        padding: width * 0.01,
                      }}>
                      {this.filldata()}
                    </View>
                    <View
                      style={{
                        flex: 0.26,
                        padding: width * 0.01,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity style={styles.btn}>
                          <Text
                            style={{fontSize: width * 0.025, color: 'white'}}>
                            -
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}>
                          <Text
                            style={{fontSize: width * 0.025, color: 'white'}}>
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'column'}}>
                        <View
                          style={{
                            padding: width * 0.02,
                            elevation: 8,
                            backgroundColor: '#FAFAFA',
                            borderRadius: 25,
                            marginVertical: width * 0.01,
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.02,
                              textAlign: 'center',
                            }}>
                            STATUS{'\n'}
                            <Text
                              style={{
                                fontSize: width * 0.02,
                                color: 'orange',
                                textAlign: 'center',
                              }}>
                              {orderStatus}
                            </Text>
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.btn}>
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
                          style={[styles.btn, {marginVertical: width * 0.01}]}>
                          <Text
                            style={{
                              fontSize: width * 0.025,
                              color: 'white',
                              textAlign: 'center',
                            }}>
                            REFUND
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity style={styles.print_btn}>
                          <FontAwesomeIcon
                            icon={faPrint}
                            size={width * 0.025}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.print_btn}>
                          <FontAwesomeIcon
                            icon={faReceipt}
                            size={width * 0.025}
                          />
                        </TouchableOpacity>
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
                        flex: 0.3,
                        textAlign: 'left',
                        paddingVertical: width * 0.01,
                        color: 'grey',
                        textAlign: 'center',
                      }}>
                      Total: ${totalPrice}
                    </Text>
                    <View
                      style={{
                        flex: 0.4,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <Text
                        style={{
                          fontSize: width * 0.03,
                          alignSelf: 'center',
                          color: 'grey',
                          textAlign: 'center',
                        }}>
                        Refund:
                      </Text>

                      <TextInput
                        style={{
                          borderColor: 'white',
                          height: '80%',
                          width: '50%',
                          alignSelf: 'center',
                          borderWidth: 1,
                          textAlign: 'center',
                          backgroundColor: 'white',
                          borderRadius: 50,
                          flexWrap: 'wrap',
                        }}
                        placeholder="Type here"
                        keyboardType="numeric"
                        onChangeText={refund => this.setState({refund})}
                        value={this.state.refund}
                      />
                    </View>
                    <View
                      style={{
                        flex: 0.3,
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity style={styles.update_btn}>
                        <Text style={{fontSize: width * 0.025, color: 'white'}}>
                          UPDATE
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Dialog>
            </KeyboardAvoidingView>
            <View
              style={{
                flex: 0.12,
                backgroundColor: '#efeff4',
                flexDirection: 'row',
                padding: width * 0.01,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 0.98,
                  marginLeft: 40,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 0.5,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: width * 0.03}}>Start:</Text>
                  <DatePicker
                    style={{width: '80%'}}
                    date={this.state.FromDate}
                    mode="date"
                    placeholder="From Date"
                    format="YYYY-MM-DD"
                    minDate="2019-01-01"
                    maxDate={this.state.date}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        width: 0,
                        height: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                        borderRadius: 50,
                      },
                    }}
                    onDateChange={date => {
                      this.setState({FromDate: date});
                    }}
                  />
                </View>
                {this.state.FromDate != '' ? (
                  <View
                    style={{
                      paddingLeft: 20,
                      flexDirection: 'row',
                      flex: 0.5,
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: width * 0.03}}>End:</Text>
                    <DatePicker
                      style={{width: '80%'}}
                      date={this.state.ToDate}
                      mode="date"
                      placeholder="To Date"
                      format="YYYY-MM-DD"
                      minDate={this.state.FromDate}
                      maxDate={this.state.date}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          width: 0,
                          height: 0,
                        },
                        dateInput: {
                          marginLeft: 36,
                          borderRadius: 50,
                        },
                      }}
                      onDateChange={date => {
                        this.setState({ToDate: date});
                      }}
                    />
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                {this.state.is_search == false ? (
                  <TouchableOpacity
                    underlayColor="lightgray"
                    onPress={() => {
                      this.searchHistory();
                    }}>
                    <Text
                      style={{
                        fontSize: width * 0.03,
                        backgroundColor: '#ff9500',
                        paddingHorizontal: width * 0.01,
                        color: 'white',
                        borderRadius: 10,
                      }}>
                      SEARCH
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    underlayColor="lightgray"
                    onPress={() => {
                      this.clear();
                    }}>
                    <Text
                      style={{
                        fontSize: width * 0.03,
                        backgroundColor: '#ff9500',
                        paddingHorizontal: width * 0.01,
                        color: 'white',
                        borderRadius: 10,
                      }}>
                      CLEAR
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={{flex: 0.8}}>
              <View
                style={{
                  padding: width * 0.016,
                  flex: 0.2,
                  flexDirection: 'row',
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1,
                }}>
                <View
                  style={{
                    flex: 0.4,
                    alignItems: 'center',
                    marginTop: width * 0.01,
                  }}>
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
                    Date
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    alignItems: 'center',
                    marginTop: width * 0.01,
                  }}>
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
                    No.
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    alignItems: 'center',
                    marginTop: width * 0.01,
                  }}>
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
                    Total
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    alignItems: 'center',
                    marginTop: width * 0.01,
                  }}>
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
                    Type
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    alignItems: 'center',
                    marginTop: width * 0.01,
                  }}>
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
                    Cashier
                  </Text>
                </View>
              </View>
              {this.state.is_search == false ? (
                <FlatList
                  pagingEnabled={true}
                  data={this.state.dataSource}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableHighlight
                      underlayColor="lightgray"
                      style={{borderRadius: 20}}
                      onPress={() => this.getOrder(item.order_id)}>
                      <View style={styles.dynamic_list_view}>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            {item.order_date.split(' ')[0]}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            {item.reference}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            ${item.total}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            {item.type}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            {item.employee_name}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  )}
                  keyExtractor={({id}, index) => id}
                />
              ) : (
                <FlatList
                  pagingEnabled={true}
                  data={this.state.Search_history}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableHighlight
                      underlayColor="lightgray"
                      style={{borderRadius: 20, marginHorizontal: 20}}
                      onPress={() => this.getOrder(item.order_id)}>
                      <View style={styles.dynamic_list_view}>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text
                            style={{fontSize: width * 0.025, marginRight: 20}}>
                            {item.order_date.split(' ')[0]}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            {item.order_id}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            ${item.total}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.025}}>
                            {item.type}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, alignItems: 'center'}}>
                          <Text
                            style={{fontSize: width * 0.025, marginLeft: 20}}>
                            {item.employee_name}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  )}
                  keyExtractor={({id}, index) => id}
                />
              )}
            </View>
          </ScrollView>
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
  dynamic_list_view: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    padding: width * 0.016,
  },
  print_btn: {
    padding: width * 0.016,
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
  update_btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#ff9500',
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ff9500',
  },
});
