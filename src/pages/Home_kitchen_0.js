import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import { Button, Left, Right, Icon } from 'native-base';
import { Dialog } from 'react-native-simple-dialogs';
import Navbar from '../components/Navbar';
import {
    faBars,
    faWindowClose,
    faArrowDown,
    faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import moment from 'moment';
import { Card } from 'react-native-elements';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            token: '',
            dataSource: [],
            dataImage: [],
            dataIni: [],
            getId: [],
            isActive: false,
            secondsElapsed: 1800000 / 1000,
            cancel_dialog: false,
            pause_dialog: false,
            count: 0,
            userDetail: '',
        };
        this._retrieveData();

        this.socket = SocketIOClient('http://dev-fs.8d.ie:6001');
        this.socket.emit('kitchenJoined', 1);
        this.socket.on('kitchenJoined', userId => {
            this.locad_socket();
        });
    }

    locad_socket() {
        this.socket.on('order_receive', message => {
            alert(JSON.stringify(message));
        });
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

    getMinutes() {
        return ('0' + Math.floor((this.state.secondsElapsed % 3600) / 60)).slice(
            -2,
        );
    }

    getSeconds() {
        return ('0' + (this.state.secondsElapsed % 60)).slice(-2);
    }

    startTime = () => {
        this.setState({ isActive: true });

        this.countdown = setInterval(() => {
            this.setState(({ secondsElapsed }) => ({
                secondsElapsed: secondsElapsed - 1,
            }));
        }, 1000);
    };

    pauseStatus = () => {
        var headers = new Headers();
        let auth =
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNTIwYjFiNGRkY2FmNTRjZGQ3NjViYzBhYzg5ODZjNzQ3OWJiNWIzNzc4M2NkODBkZGFjODQ5Mjc3Mzg4NjY5YmU5ZTgwNTBlMjJhMWIwIn0.eyJhdWQiOiIxIiwianRpIjoiNDA1MjBiMWI0ZGRjYWY1NGNkZDc2NWJjMGFjODk4NmM3NDc5YmI1YjM3NzgzY2Q4MGRkYWM4NDkyNzczODg2NjliZTllODA1MGUyMmExYjAiLCJpYXQiOjE1Nzc3ODE2ODgsIm5iZiI6MTU3Nzc4MTY4OCwiZXhwIjoxNjA5NDA0MDg4LCJzdWIiOiIxOCIsInNjb3BlcyI6W119.SlEA_7NoXPaANQ0TtusrLcl85p9Hnn0xxF2N6zSwGDeaNYxdM-I9VjeXLCU3AKWMC5_8Gxvb_SHDnABjVz1UgKgyUzT-pmrv9r1h70yh6qdsMGVu8dX7Dfzdr04KIu32lxkXhhgWRDHKpn4RZ9B_WlRCuHp72Us1q-z7rD0Vu_Bo5j_COAw-8HJsLjDxb2hls-On26FWSNHGgTa6siJtWruAmxBJVBWu9jSWNJFYisyzB5i6DgNCHRCk29Wl7sy-X2PUItRvTN7EKYKTBz6AvTq6-2yADmIfURiH3dBUHHG-KqqSvwav2HxCYcP7L5IH1HPm7-2Q09E8UWkkTSWgq3dX2g7zs9RBAduxiK1q7_GlgRXfDD9H_fGunkVqa0K83iZUH8TxLuqdcUY4vhW-pS5s0gVgAd7M9QLq8Oayab_QqkvqteuUjYd3zXX_Ar8S7L9yVg4-4u9ABN_wrT6lEwwA2SJoZtVAjScsrk8jVxHtMWo4kTKgYzNZTI9ZVLb2GmbGL36TYqoAH2t8JyEMgsXlvfrfpfcGj2_ERWjAMNwtS4hWiMgz7qKLwg7zji2-7LZLhuNY3tJtwp6DB7_frCCYNTejSdATu13rG__ko1fOdofqhdZ16SVEVO0p5ddw7ZX-n-BKesJsjSq-Qt1MK2_HEXm_gRjuyvswkvIvQrY';
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');

        var data = new FormData();
        data.append('order_id', 15);
        data.append('order_status', 6);

        console.log(data);
        fetch('http://dev-fs.8d.ie/api/kitchen/updateOrderStatus', {
            method: 'POST',
            headers: headers,
            body: data,
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.status == 'success') {
                    this.setState({ pause_dialog: false });
                    this.componentDidMount();
                } else {
                    alert('Something wrong happened');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    completeStatus = () => {
        var headers = new Headers();
        let auth =
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNTIwYjFiNGRkY2FmNTRjZGQ3NjViYzBhYzg5ODZjNzQ3OWJiNWIzNzc4M2NkODBkZGFjODQ5Mjc3Mzg4NjY5YmU5ZTgwNTBlMjJhMWIwIn0.eyJhdWQiOiIxIiwianRpIjoiNDA1MjBiMWI0ZGRjYWY1NGNkZDc2NWJjMGFjODk4NmM3NDc5YmI1YjM3NzgzY2Q4MGRkYWM4NDkyNzczODg2NjliZTllODA1MGUyMmExYjAiLCJpYXQiOjE1Nzc3ODE2ODgsIm5iZiI6MTU3Nzc4MTY4OCwiZXhwIjoxNjA5NDA0MDg4LCJzdWIiOiIxOCIsInNjb3BlcyI6W119.SlEA_7NoXPaANQ0TtusrLcl85p9Hnn0xxF2N6zSwGDeaNYxdM-I9VjeXLCU3AKWMC5_8Gxvb_SHDnABjVz1UgKgyUzT-pmrv9r1h70yh6qdsMGVu8dX7Dfzdr04KIu32lxkXhhgWRDHKpn4RZ9B_WlRCuHp72Us1q-z7rD0Vu_Bo5j_COAw-8HJsLjDxb2hls-On26FWSNHGgTa6siJtWruAmxBJVBWu9jSWNJFYisyzB5i6DgNCHRCk29Wl7sy-X2PUItRvTN7EKYKTBz6AvTq6-2yADmIfURiH3dBUHHG-KqqSvwav2HxCYcP7L5IH1HPm7-2Q09E8UWkkTSWgq3dX2g7zs9RBAduxiK1q7_GlgRXfDD9H_fGunkVqa0K83iZUH8TxLuqdcUY4vhW-pS5s0gVgAd7M9QLq8Oayab_QqkvqteuUjYd3zXX_Ar8S7L9yVg4-4u9ABN_wrT6lEwwA2SJoZtVAjScsrk8jVxHtMWo4kTKgYzNZTI9ZVLb2GmbGL36TYqoAH2t8JyEMgsXlvfrfpfcGj2_ERWjAMNwtS4hWiMgz7qKLwg7zji2-7LZLhuNY3tJtwp6DB7_frCCYNTejSdATu13rG__ko1fOdofqhdZ16SVEVO0p5ddw7ZX-n-BKesJsjSq-Qt1MK2_HEXm_gRjuyvswkvIvQrY';
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');

        var data = new FormData();
        data.append('order_id', 15);
        data.append('order_status', 8);

        console.log(data);
        fetch('http://dev-fs.8d.ie/api/kitchen/updateOrderStatus', {
            method: 'POST',
            headers: headers,
            body: data,
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.status == 'success') {
                    this.setState({ pause_dialog: false });
                    this.componentDidMount();
                } else {
                    alert('Something wrong happened');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    cancelStatus = () => {
        var headers = new Headers();
        let auth =
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNTIwYjFiNGRkY2FmNTRjZGQ3NjViYzBhYzg5ODZjNzQ3OWJiNWIzNzc4M2NkODBkZGFjODQ5Mjc3Mzg4NjY5YmU5ZTgwNTBlMjJhMWIwIn0.eyJhdWQiOiIxIiwianRpIjoiNDA1MjBiMWI0ZGRjYWY1NGNkZDc2NWJjMGFjODk4NmM3NDc5YmI1YjM3NzgzY2Q4MGRkYWM4NDkyNzczODg2NjliZTllODA1MGUyMmExYjAiLCJpYXQiOjE1Nzc3ODE2ODgsIm5iZiI6MTU3Nzc4MTY4OCwiZXhwIjoxNjA5NDA0MDg4LCJzdWIiOiIxOCIsInNjb3BlcyI6W119.SlEA_7NoXPaANQ0TtusrLcl85p9Hnn0xxF2N6zSwGDeaNYxdM-I9VjeXLCU3AKWMC5_8Gxvb_SHDnABjVz1UgKgyUzT-pmrv9r1h70yh6qdsMGVu8dX7Dfzdr04KIu32lxkXhhgWRDHKpn4RZ9B_WlRCuHp72Us1q-z7rD0Vu_Bo5j_COAw-8HJsLjDxb2hls-On26FWSNHGgTa6siJtWruAmxBJVBWu9jSWNJFYisyzB5i6DgNCHRCk29Wl7sy-X2PUItRvTN7EKYKTBz6AvTq6-2yADmIfURiH3dBUHHG-KqqSvwav2HxCYcP7L5IH1HPm7-2Q09E8UWkkTSWgq3dX2g7zs9RBAduxiK1q7_GlgRXfDD9H_fGunkVqa0K83iZUH8TxLuqdcUY4vhW-pS5s0gVgAd7M9QLq8Oayab_QqkvqteuUjYd3zXX_Ar8S7L9yVg4-4u9ABN_wrT6lEwwA2SJoZtVAjScsrk8jVxHtMWo4kTKgYzNZTI9ZVLb2GmbGL36TYqoAH2t8JyEMgsXlvfrfpfcGj2_ERWjAMNwtS4hWiMgz7qKLwg7zji2-7LZLhuNY3tJtwp6DB7_frCCYNTejSdATu13rG__ko1fOdofqhdZ16SVEVO0p5ddw7ZX-n-BKesJsjSq-Qt1MK2_HEXm_gRjuyvswkvIvQrY';
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');

        var data = new FormData();
        data.append('order_id', 15);
        data.append('order_status', 7);

        console.log(data);
        fetch('http://dev-fs.8d.ie/api/kitchen/updateOrderStatus', {
            method: 'POST',
            headers: headers,
            body: data,
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.status == 'success') {
                    this.setState({ cancel_dialog: false });
                    this.componentDidMount();
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
            var data = new FormData();
            data.append('order_id', 15);
            const user_details = this.state.userDetail;
            var headers = new Headers();
            let auth = 'Bearer ' + user_details.userToken;
            console.log(auth);
            headers.append('Authorization', auth);
            headers.append('Accept', 'application/json');
            console.log(headers);
            fetch('http://dev-fs.8d.ie/api/order/get-vender-order', {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    if (responseJson.status == 'success') {
                        this.setState({
                            dataIni: responseJson.data,
                        });
                        // console.log(this.state.dataImage);
                    } else {
                        alert('Something wrong happened');
                    }
                })

                .catch(error => {
                    console.error(error);
                });
        }

        if (this.state.count == 1) {
            var data = new FormData();
            data.append('order_id', 15);
            console.log(data);
            const user_details = this.state.userDetail;
            var headers = new Headers();
            let auth = 'Bearer ' + user_details.userToken;
            headers.append('Authorization', auth);
            headers.append('Accept', 'application/json');
            console.log(headers);
            fetch('http://dev-fs.8d.ie/api/kitchen/getOrderList', {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    if (responseJson.status == 'success') {
                        this.setState({
                            dataSource: responseJson.data,
                            dataImage: responseJson.data[0].ingredient,
                            getId: responseJson.data[0].order_id,
                        });
                        console.log('helllo');
                        console.log(this.state.getId);
                    } else {
                        alert('Something wrong happened');
                    }
                })

                .catch(error => {
                    console.error(error);
                });
        }
    }

    getOrderId = () => {
        var { height, width } = Dimensions.get('window');
        var items = [];
        this.state.dataSource.map((item, i) => {
            items.push(
                <View>
                    <Text
                        style={{
                            fontSize: width * 0.05,
                            textAlign: 'center',
                            marginVertical: 20,
                            fontFamily: 'Roboto',
                            color: '#5F5F5F',
                            fontWeight: 'bold',
                        }}>
                        {item.order_id + ' SIT'}
                    </Text>
                </View>,
            );
        });
        return items;
    };

    order = () => {
        var { height, width } = Dimensions.get('window');
        var items = [];
        this.state.dataIni.map((item, i) => {
            items.push(
                <TouchableOpacity onPress={() => this.get_selectedorder(item)}>
                    <View
                        style={
                            item.is_selected == null ||
                                item.is_selected == undefined ||
                                item.is_selected == false
                                ? styles.defultpress
                                : styles.selected_order
                        }>
                        <Text
                            style={
                                item.is_selected == null ||
                                    item.is_selected == undefined ||
                                    item.is_selected == false
                                    ? styles.defulttext
                                    : styles.selected_order_text
                            }>
                            {item.reference}
                            {'\n'}
                        </Text>
                        <Text style={{ fontSize: width * 0.016, fontWeight: 'normal' }}>
                            {item.delivery_name}
                        </Text>
                    </View>
                </TouchableOpacity>,
            );
        });
        return items;
    };

    fillOrder = () => {
        var { height, width } = Dimensions.get('window');
        var items = [];
        this.state.dataSource.map((item, i) => {
            items.push(
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <View
                            style={{
                                flex: 0.2,
                            }}>
                            <ScrollView>{this.order()}</ScrollView>
                        </View>
                        <View style={{ flex: 0.89 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#383330',
                                        paddingVertical: 10,
                                    }}>
                                    <View style={{ alignItems: 'flex-end', flex: 0.5 }}>
                                        <Text style={{ fontSize: width * 0.016, color: 'white' }}>
                                            {item.updated_at.split(' ')[1].substring(0, 5)}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            alignItems: 'flex-end',
                                            flex: 0.5,
                                            marginRight: 60,
                                        }}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: width * 0.03,
                                                fontWeight: 'bold',
                                                color: 'white',
                                            }}>
                                            {this.state.dataSource.length} DISHES
                    </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View
                                    style={{
                                        flex: 0.3,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                    }}>
                                    <TouchableOpacity style={{ marginLeft: 30, marginTop: 10 }}>
                                        <Image source={require('../images/arrow.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginLeft: 30, marginTop: 10 }}>
                                        <Image source={require('../images/arrow-down.png')} />
                                    </TouchableOpacity>
                                </View>
                                {this.state.isActive ? (
                                    <View
                                        style={{
                                            flex: 0.15,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{ fontSize: width * 0.016 }}>
                                            {this.getMinutes()}:{this.getSeconds()}
                                        </Text>
                                    </View>
                                ) : null}
                                <View
                                    style={{
                                        flex: 0.55,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginRight: 30,
                                    }}>
                                    <TouchableOpacity
                                        style={{ marginLeft: 30 }}
                                        onPress={() => {
                                            this.setState({ pause_dialog: true });
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: width * 0.035,
                                                backgroundColor: '#ff9500',
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                color: 'white',
                                                borderRadius: 10,
                                                marginTop: 10,
                                            }}>
                                            PAUSE
                    </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginLeft: 30 }}
                                        onPress={() => {
                                            this.setState({ cancel_dialog: true });
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: width * 0.035,
                                                backgroundColor: '#ff5800',
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                color: 'white',
                                                borderRadius: 10,
                                                marginTop: 10,
                                            }}>
                                            CANCEL
                    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ScrollView>
                                <View>{this.fillCard()}</View>
                            </ScrollView>
                        </View>
                    </View>
                </View>,
            );
        });
        return items;
    };

    fillCard = () => {
        var { height, width } = Dimensions.get('window');
        var items = [];
        this.state.dataSource.map((item, i) => {
            {
                items.push(
                    <Card>
                        <View
                            style={{
                                flexDirection: 'row',
                                padding: 1,
                                alignItems: 'center',
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                                paddingBottom: 10,
                            }}>
                            <View style={{ flex: 0.9 }}>
                                <Text style={{ fontSize: 25 }}>
                                    {i + 1}
                                    {'. '}
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: 35,
                                            textTransform: 'uppercase',
                                        }}>
                                        {item.order_dish_name}
                                    </Text>
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 0.1,
                                    borderLeftColor: 'grey',
                                    borderLeftWidth: 1,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 40,
                                        marginLeft: 15,
                                        fontWeight: 'bold',
                                    }}>
                                    X{' '}
                                    <Text style={{ fontWeight: 'bold', fontSize: 40 }}>
                                        {item.qty}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',

                                flexWrap: 'wrap',
                            }}>
                            {this.loadImage(item)}
                        </View>
                    </Card>,
                );
            }
        });
        return items;
    };

    loadImage = item => {
        // var {height, width} = Dimensions.get('window');
        var items = [];
        var ingredient = [];
        for (var i = 0; i < item.ingredient_group.length; i++) {
            ingredient.push(item.ingredient_group[i]);
            let object = item.ingredient.filter(
                o =>
                    o.ingredient_group_id == item.ingredient_group[i].ingredient_group_id,
            );

            for (var j = 0; j < object.length; j++) {
                ingredient.push(object[j]);
            }
            console.log(object.length);
        }

        console.log(ingredient);
        for (var i = 0; i < ingredient.length; i++) {
            items.push(
                <View>
                    <View>
                        <Image
                            source={{
                                uri: 'http://dev-fs.8d.ie/' + ingredient[i].cover,
                            }}
                            style={{
                                height: 90,
                                width: 90,
                                margin: 8,
                            }}
                            resizeMode="contain"
                        />
                        <Text>{ingredient[i].name}</Text>
                    </View>
                </View>,
            );
        }
        return items;
    };

    get_selectedorder(item) {
        var objfind = this.state.dataIni.filter(o => o.is_selected == true);
        if (objfind.length > 0) {
            objfind[0].is_selected = false;
        }
        item.is_selected = true;
        //setTimeout(function () {
        this.setState({ dataIni: this.state.dataIni });
        //})
    }

    render() {
        var { height, width } = Dimensions.get('window');
        var left = (
            <Left style={{ flex: 1 }}>
                <Button onPress={() => this._sideMenuDrawer.open()} transparent>
                    <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
                </Button>
            </Left>
        );
        var right = (
            <Right style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontFamily: 'Roboto', fontWeight: '100' }}>
                    Station 1
        </Text>
            </Right>
        );
        return (
            <SideMenuDrawer
                ref={ref => (this._sideMenuDrawer = ref)}
                style={{ zIndex: 1 }}
                navigation={this.props}>
                <View style={styles.container}>
                    <Navbar left={left} right={right} title="Kitchen" />
                    <View style={{ flex: 0.88 }}>
                        <View>{this.fillOrder()}</View>
                    </View>
                    <Dialog
                        visible={this.state.pause_dialog}
                        dialogStyle={{
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: '#efeff4',
                            width: '35%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#efeff4',
                        }}
                        onTouchOutside={() => this.setState({ pause_dialog: false })}>
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
                                        fontWeight: 'bold',
                                    }}>
                                    Pause order
                </Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ pause_dialog: false })}>
                                    <FontAwesomeIcon
                                        icon={faWindowClose}
                                        color={'#ff9500'}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text
                            style={{
                                fontSize: width * 0.016,
                                textAlign: 'center',
                                marginTop: 10,
                            }}>
                            Order will pause for 5 minutes?
            </Text>
                        {this.getOrderId()}
                        <View
                            style={{
                                borderTopColor: 'lightgrey',
                                borderTopWidth: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}>
                            <View style={{ flex: 0.9, marginTop: 10 }}>
                                <TouchableOpacity
                                    style={styles.yes}
                                    onPress={() => {
                                        this.pauseStatus();
                                    }}>
                                    <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                                        Yes
                  </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity
                                    style={styles.no}
                                    onPress={() => this.setState({ pause_dialog: false })}>
                                    <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                                        No
                  </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Dialog>
                    <Dialog
                        visible={this.state.cancel_dialog}
                        dialogStyle={{
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: '#efeff4',
                            width: '35%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#efeff4',
                        }}
                        onTouchOutside={() => this.setState({ cancel_dialog: false })}>
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
                                        fontWeight: 'bold',
                                    }}>
                                    Cancel order
                </Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ cancel_dialog: false })}>
                                    <FontAwesomeIcon
                                        icon={faWindowClose}
                                        color={'#ff9500'}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text
                            style={{
                                fontSize: width * 0.016,
                                textAlign: 'center',
                                marginTop: 10,
                            }}>
                            Are you sure to cancel the order?
            </Text>
                        {this.getOrderId()}
                        <View
                            style={{
                                borderTopColor: 'lightgrey',
                                borderTopWidth: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}>
                            <View style={{ flex: 0.9, marginTop: 10 }}>
                                <TouchableOpacity
                                    style={styles.yes}
                                    onPress={() => {
                                        this.cancelStatus();
                                    }}>
                                    <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                                        Yes
                  </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity
                                    style={styles.no}
                                    onPress={() => this.setState({ cancel_dialog: false })}>
                                    <Text style={{ fontSize: width * 0.015, color: 'white' }}>
                                        No
                  </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Dialog>
                    <View style={{ flex: 0.12, flexDirection: 'row' }}>
                        <View
                            style={{
                                backgroundColor: '#ff9500',
                                flex: 0.8,
                                justifyContent: 'center',
                                padding: 20,
                            }}>
                            <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
                                CURRENT ORDER {this.state.getId}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'green',
                                flex: 0.2,
                                justifyContent: 'center',
                                padding: 20,
                            }}
                            onPress={() => {
                                this.completeStatus();
                            }}>
                            <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
                                COMPLETE
              </Text>
                        </TouchableOpacity>
                    </View>
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
    yes: {
        marginTop: 5,
        marginRight: 10,
        paddingVertical: 2,
        paddingHorizontal: 20,
        borderRadius: 25,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        backgroundColor: '#ff5800',
    },
    no: {
        marginTop: 5,
        marginRight: 10,
        paddingVertical: 2,
        paddingHorizontal: 20,
        borderRadius: 25,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        backgroundColor: '#ff9500',
    },
    defultpress: {
        color: '#383330',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#383330',
        backgroundColor: '#efeff4',
    },
    selected_order: {
        color: '#383330',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#383330',
        backgroundColor: '#383330',
    },
    defulttext: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#625e5e',
        textAlign: 'center',
    },
    selected_order_text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
});