import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TextInput
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
  faReceipt
} from '@fortawesome/free-solid-svg-icons';

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      FromDate: '',
      ToDate: '',
      edit_history_dialog: false,
      dataSource: '',
      Search_history: '',
      is_search: false,
      Numid:0,
      dataSourcePicker:[],
      Quantity:0,
      totalPrice:0,
      orderStatus:'',
      refund:''
    };
  }

  componentDidMount() {
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViNTE5MmFmNjYyZjkxMTQzYTE1ZDQ2OTZkNTg2ZGY0MmYyMDkxMmFiMGZjYWY1ZDJmNDg4YmQwOWZiOGFjNDkwZWVkODViODMzYTM1MjEyIn0.eyJhdWQiOiIxIiwianRpIjoiZWI1MTkyYWY2NjJmOTExNDNhMTVkNDY5NmQ1ODZkZjQyZjIwOTEyYWIwZmNhZjVkMmY0ODhiZDA5ZmI4YWM0OTBlZWQ4NWI4MzNhMzUyMTIiLCJpYXQiOjE1NzY2Njk4MDMsIm5iZiI6MTU3NjY2OTgwMywiZXhwIjoxNjA4MjkyMjAzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.WamiILeUa8pz0xFLiFQJVJ33QLrsjIU48QU4Nx1H5UBKCq2p28GnYlfkAG2ySCTaqhqxoNTvQ6kqSCoPRl4qFWSQyOxb_51hquwD_59nCgVkASRqxym4Pthcd9CAbme1m-InVgALwNTRl7VwHGch3XE3fdfA8AN_nuRlF0GJ_uQWDDapNHPSCd_EtxpCDmlcW8k4zCzcHY27_gwuLRr_LlI-bztJZQdKlK-kWDzvDmxBYKE_DbxAeVt7BCwX1DZpcqPjNxgLoo0QXir8fOFkOoZdS4y-k3wY0IPJybO-_Pmj-DkJ8Oq4eu9XXpraW50AHXvYz_sWcUm_WikYWUOkjjPp682DiaaR8TUWF75M6C403m-TgqCMTQXJWkukLeWunpH43V6h4iQf4uGtWLbJUPus2HDDMPhEWziFjHJB2_X0iBFlKmdCqeFtjisMENYsNRs3Q4KFmd7FjctiOs0_DbyonmlQ-yYV_DDlYHhz83gxEEC-1fCyFISA99VAEv2Hwx4vOeJ2sdh0NcCXpCmaGZFPdXoU5_Ae5mGgvNF1UHcuwluq1bbQx0-mgZ1JsFmQbFYs4QuQ4MeIzhqC_yj0bOY3Lv3vt3vNs2cq2vWHFSNy1FwvTXPkaka4FxHSIPA3D2fluR4BgegK9uT4A86YQmIXFWdGUzjtuWF6OiZBy1Q';
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
          console.log(responseJson);
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
  edit_history_dialog = () => {
    this.setState({edit_history_dialog: true});
  };
  clear = () => {
    this.setState({FromDate: '', ToDate: '',is_search: false});
  };
  getParsedDate = (date) => {
    date = String(date).split('-');
    var days = String(date[0]).split('-');
    return [days[0], days[1], days[2]].join('-');
  };

  getOrder = (id) => {
    console.log(this.state.Numid);
    var data = new FormData();
    data.append('order_id', id);
    console.log(data);
   
    fetch('http://dev-fs.8d.ie/api/order/get-orderdata-id	', {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          console.log(responseJson);
          this.setState({edit_history_dialog: true,Numid:0});
          this.setState({dataSourcePicker: responseJson});
          // this.componentDidMount();
        } else {
          alert('Something wrong happened');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  filldata = () => {
    var {height, width} = Dimensions.get('window');
    var items = [];
    this.state.dataSourcePicker.map((item, i) => {
        items.push(
              <TouchableHighlight
                underlayColor="lightgray"
                style={{borderRadius: 20, marginHorizontal: 20}}
                onPress={()=>{}}>
                <View style={{flexDirection:'row',paddingVertical:10}}>
                  <View style={{flex: 0.1, alignItems: 'center'}}>
                    <Text style={{fontSize: width * 0.02, marginRight: 20,color:'#808080'}}>
                      {i + 1}.
                    </Text>
                  </View>
                  <View style={{flex: 0.4, alignItems: 'center',marginRight:50}}>
                    <Text style={{fontSize: width * 0.02,color:'#808080'}}>
                      Custom({item.dish_name})
                    </Text>
                  </View>
                  <View style={{flex: 0.4, alignItems: 'center',flexDirection:'row'}}>
                    <Text style={{fontSize: width * 0.02,color:'#808080',paddingLeft:30}}>
                      ${item.dish_price} x { }
                    </Text>
                    <Text style={{fontSize: width * 0.02,color:'#808080'}}>
                       {item.qty}
                    </Text>
                  </View>
                  <View style={{flex: 0.4, alignItems: 'center'}}>
                    <Text style={{fontSize: width * 0.02,color:'#808080'}}>${item.dish_price*item.qty}</Text>
                  </View>
                </View>
              </TouchableHighlight>
        )
    })
    return items;
}

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
    var fromDate = this.getParsedDate(this.state.FromDate);
    console.log(fromDate);
    var toDate = this.getParsedDate(this.state.ToDate);
    console.log(toDate);
    var headers = new Headers();
    let auth =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViNTE5MmFmNjYyZjkxMTQzYTE1ZDQ2OTZkNTg2ZGY0MmYyMDkxMmFiMGZjYWY1ZDJmNDg4YmQwOWZiOGFjNDkwZWVkODViODMzYTM1MjEyIn0.eyJhdWQiOiIxIiwianRpIjoiZWI1MTkyYWY2NjJmOTExNDNhMTVkNDY5NmQ1ODZkZjQyZjIwOTEyYWIwZmNhZjVkMmY0ODhiZDA5ZmI4YWM0OTBlZWQ4NWI4MzNhMzUyMTIiLCJpYXQiOjE1NzY2Njk4MDMsIm5iZiI6MTU3NjY2OTgwMywiZXhwIjoxNjA4MjkyMjAzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.WamiILeUa8pz0xFLiFQJVJ33QLrsjIU48QU4Nx1H5UBKCq2p28GnYlfkAG2ySCTaqhqxoNTvQ6kqSCoPRl4qFWSQyOxb_51hquwD_59nCgVkASRqxym4Pthcd9CAbme1m-InVgALwNTRl7VwHGch3XE3fdfA8AN_nuRlF0GJ_uQWDDapNHPSCd_EtxpCDmlcW8k4zCzcHY27_gwuLRr_LlI-bztJZQdKlK-kWDzvDmxBYKE_DbxAeVt7BCwX1DZpcqPjNxgLoo0QXir8fOFkOoZdS4y-k3wY0IPJybO-_Pmj-DkJ8Oq4eu9XXpraW50AHXvYz_sWcUm_WikYWUOkjjPp682DiaaR8TUWF75M6C403m-TgqCMTQXJWkukLeWunpH43V6h4iQf4uGtWLbJUPus2HDDMPhEWziFjHJB2_X0iBFlKmdCqeFtjisMENYsNRs3Q4KFmd7FjctiOs0_DbyonmlQ-yYV_DDlYHhz83gxEEC-1fCyFISA99VAEv2Hwx4vOeJ2sdh0NcCXpCmaGZFPdXoU5_Ae5mGgvNF1UHcuwluq1bbQx0-mgZ1JsFmQbFYs4QuQ4MeIzhqC_yj0bOY3Lv3vt3vNs2cq2vWHFSNy1FwvTXPkaka4FxHSIPA3D2fluR4BgegK9uT4A86YQmIXFWdGUzjtuWF6OiZBy1Q';
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');

    var data = new FormData();
    data.append('start_date', fromDate);
    data.append('end_date', toDate);
    fetch('http://dev-fs.8d.ie/api/kitchen/searchOrderHistory', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
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
    this.state.dataSourcePicker.forEach((item) => {
      // totalQuantity += item.quantity;
      totalPrice += item.qty * item.dish_price;
    })
    let orderStatus = this.state.orderStatus;
    this.state.dataSourcePicker.map((item) => {
      // totalQuantity += item.quantity;
      orderStatus = item.orders_status_name;
    })
    var left = (
      <Left style={{flex: 1}}>
        <Button onPress={() => this.props.navigation.openDrawer()} transparent>
          <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
        </Button>
      </Left>
    );
    var right = <Right style={{flex: 1}}></Right>;
    return (
      <View style={styles.container}>
        <Navbar left={left} right={right} title="History" />
        {/* History Update Dialog */}
        <Dialog
          visible={this.state.edit_history_dialog}
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
          onTouchOutside={() => this.setState({edit_history_dialog: false})}>
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
                Order
              </Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity
                style={{marginBottom: 40, marginStart: 50}}
                onPress={() => this.setState({edit_history_dialog: false})}>
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
                  onPress={() => this.onSubtract(item, index)}>
                  <Text style={{fontSize: width * 0.025, color: 'white'}}>
                    -
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.add_btn, {paddingHorizontal: 20}]}
                  onAdd={() => this.onAdd(item, index)}>
                  <Text style={{fontSize: width * 0.025, color: 'white'}}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginVertical: 15,
                  padding: 20,
                  elevation: 8,
                  backgroundColor: '#FAFAFA',
                  borderRadius: 25,
                  marginRight: 10,
                }}>
                <Text style={{fontSize: width * 0.02}}>STATUS</Text>
                <Text style={{fontSize: width * 0.02,color:'orange'}}>{orderStatus}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.add_btn,
                  {justifyContent: 'center', alignSelf: 'center', width: 160},
                ]}>
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
                ]}>
                <Text style={{fontSize: width * 0.025, color: 'white'}}>
                  REFUND
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
                flex: 0.40,
                textAlign: 'left',
                marginTop: 10,
                paddingVertical: 10,
                color: '#5a5a5a',
              }}>
              Total: ${totalPrice}
            </Text>
            <View style={{flex: 0.56,flexDirection: 'row', alignItems: 'center',marginTop: 10,}}>
              <View style={{width: 150}}>
                <Text style={{fontSize: width * 0.03, color: '#5a5a5a',}}>
                  Refund:
                </Text>
              </View>
              <TextInput
                style={{
                  borderColor: 'white',
                  height: 50,
                  width: '50%',
                  marginLeft:10,
                  borderWidth: 1,
                  textAlign:'center',
                  backgroundColor: 'white',
                  borderRadius: 50,
                  flexWrap: 'wrap',
                }}
                placeholder="Type here"
                keyboardType='numeric'
                onChangeText={refund => this.setState({refund})}
                value={this.state.refund}
              />
            </View>
            <TouchableOpacity style={styles.add_btn}>
              <Text style={{fontSize: width * 0.025, color: 'white'}}>
                UPDATE
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog>

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
              alignItems: 'center',
            }}>
            <View
              style={{flexDirection: 'row', flex: 0.5, alignItems: 'center'}}>
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
          <View style={{margin: 10, justifyContent: 'center'}}>
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
                    paddingLeft: 10,
                    paddingRight: 10,
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
                    paddingLeft: 10,
                    paddingRight: 10,
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
                Date
              </Text>
            </View>
            <View
              style={{
                flex: 0.4,
                alignItems: 'center',
                marginTop: 10,
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
                No.
              </Text>
            </View>
            <View
              style={{
                flex: 0.4,
                alignItems: 'center',
                marginTop: 10,
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
                Total
              </Text>
            </View>
            <View
              style={{
                flex: 0.4,
                alignItems: 'center',
                marginTop: 10,
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
                Type
              </Text>
            </View>
            <View
              style={{
                flex: 0.4,
                alignItems: 'center',
                marginTop: 10,
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
                  style={{borderRadius: 20, marginHorizontal: 20}}
                  onPress={() => this.getOrder(item.order_id)}>
                  <View style={styles.dynamic_list_view}>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02, marginRight: 20}}>
                        {item.order_date}
                      </Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02}}>
                        {item.order_id}
                      </Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02}}>
                        ${item.total_paid}
                      </Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02}}>{item.type}</Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02, marginLeft: 20}}>
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
                      <Text style={{fontSize: width * 0.02, marginRight: 20}}>
                        {item.order_date}
                      </Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02}}>
                        {item.order_id}
                      </Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02}}>
                        ${item.total_paid}
                      </Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02}}>{item.type}</Text>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                      <Text style={{fontSize: width * 0.02, marginLeft: 20}}>
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
  dynamic_list_view: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  print_btn: {
    marginTop: 10,
    marginRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#ffffff',
  },
  add_btn: {
    marginTop: 10,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#ff9500',
  },
});
