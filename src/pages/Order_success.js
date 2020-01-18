
import React, { Component } from 'react';
import { Image, Text } from 'react-native';
import { Container, Content, View, Button, Left, Right, Icon, Card, CardItem, cardBody, Grid, Col, Row, Footer } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faTimes, faHome } from '@fortawesome/free-solid-svg-icons'
import { Actions } from 'react-native-router-flux';

import Navbar from '../components/Navbar';

export default class Order_success extends Component {

    constructor(props) {
        super(props);
        //alert(navigation.getParam('Json_value'))
        this.state = {
            hotdishes: [],
            loading: false,
            transaction_id: null,
            order_id: null,
            Status: null,
            paymentid: this.props.id,
            order_no: null
        };

        //this.getTransaction();

    }

    // getTransaction() {
    //     var data = new FormData()
    //     data.append('id', this.state.paymentid);


    //     // var headers = new Headers();
    //     // headers.append('Accept', 'application/json');


    //     fetch("http://dev-fs.8d.ie/api/payments/get-payment", {
    //         method: "POST",
    //         // headers: headers,
    //         body: data
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {

    //             if (responseJson["status"] == "success") {
    //                 this.setState({ transaction_id: responseJson["data"][0].transaction_id })
    //                 this.setState({ order_no: responseJson["data"][0].response_order_id })
    //             }
    //             //Actions.hotdeals();                
    //         })
    // }

    render() {

        const { navigation } = this.props;
        const Status = navigation.getParam('status');
        const order_no = navigation.getParam('order_no');

        var left = (
            <Left style={{ flex: 1, marginRight: -10 }}>
                <Button style={{ flex: 1, marginBottom: 10 }} onPress={() => this.props.navigation.navigate('Payment')} transparent>
                    <FontAwesomeIcon icon={faHome} size={25} style={{ color: 'white' }} />
                </Button>
            </Left>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>
                <Navbar left={left} title={Status} />
                <View style={{ backgroundColor: '#ebeff0', flex: 1, justifyContent: 'center', alignItems: 'center', top: 0 }}>
                    {/* <FontAwesomeIcon icon={faCheck} size={200} style={{ color: 'green' }} /> */}
                    {Status == "Success" ?
                        <FontAwesomeIcon icon={faCheck} size={200} style={{ color: 'green' }} />

                        :
                        <FontAwesomeIcon icon={faTimes} size={200} style={{ color: 'red' }} />

                    }
                    {Status == "Success" ?
                        <View>
                            <Text style={{ color: 'green', fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>Your order is successfully placed </Text>
                            <Text style={{ color: '#233240', fontSize: 15, justifyContent: 'center', alignItems: 'center' }}>Order No : {order_no} </Text>
                        </View>
                        :
                        <Text style={{ color: 'red', fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>Your order is fails </Text>
                    }

                </View>
            </Container>
            // </SideMenuDrawer>
        )
    }

}