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
    ScrollView
} from 'react-native';
import { Button, Left, Right, Row, Col } from 'native-base';
import Navbar from '../components/Navbar';
import {
    faBars,
    faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Dialog } from 'react-native-simple-dialogs';
import SideMenuDrawer from '../components/SideMenuDrawer';
import CheckBox from 'react-native-check-box'

export default class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vender_id: 1,
            id: null,
            name: null,
            description: null,
            status: true,
            dataSource: [],
            dataSourcenew: [],
            searchText: null,
            add_dialog: false,
            edit_dialog: false
        };
        this.get_menu_data();

    }

    goto_add_dish(id) {
        this.props.navigation.navigate('CreateDish', { menu_id: id });
    }

    add_menu = () => {
        this.setState({ add_dialog: true, name: null, description: null, status: true, id: null });
    };

    selectmenu = (id) => {
        let objectGroup = this.state.dataSource.find(o => o.id === id);
        if (objectGroup) {
            this.setState({
                id: objectGroup.id,
                name: objectGroup.name,
                description: objectGroup.description,
                status: objectGroup.status == 1 ? true : false,
            });
            this.setState({ edit_dialog: true });
        }
    };


    updatePress = (id) => {
        var data = new FormData();
        data.append('id', id);
        data.append('name', this.state.name);
        data.append('description', this.state.description);
        data.append('status', this.state.status == true ? 1 : 0);

        var headers = new Headers();
        let auth =
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViNTE5MmFmNjYyZjkxMTQzYTE1ZDQ2OTZkNTg2ZGY0MmYyMDkxMmFiMGZjYWY1ZDJmNDg4YmQwOWZiOGFjNDkwZWVkODViODMzYTM1MjEyIn0.eyJhdWQiOiIxIiwianRpIjoiZWI1MTkyYWY2NjJmOTExNDNhMTVkNDY5NmQ1ODZkZjQyZjIwOTEyYWIwZmNhZjVkMmY0ODhiZDA5ZmI4YWM0OTBlZWQ4NWI4MzNhMzUyMTIiLCJpYXQiOjE1NzY2Njk4MDMsIm5iZiI6MTU3NjY2OTgwMywiZXhwIjoxNjA4MjkyMjAzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.WamiILeUa8pz0xFLiFQJVJ33QLrsjIU48QU4Nx1H5UBKCq2p28GnYlfkAG2ySCTaqhqxoNTvQ6kqSCoPRl4qFWSQyOxb_51hquwD_59nCgVkASRqxym4Pthcd9CAbme1m-InVgALwNTRl7VwHGch3XE3fdfA8AN_nuRlF0GJ_uQWDDapNHPSCd_EtxpCDmlcW8k4zCzcHY27_gwuLRr_LlI-bztJZQdKlK-kWDzvDmxBYKE_DbxAeVt7BCwX1DZpcqPjNxgLoo0QXir8fOFkOoZdS4y-k3wY0IPJybO-_Pmj-DkJ8Oq4eu9XXpraW50AHXvYz_sWcUm_WikYWUOkjjPp682DiaaR8TUWF75M6C403m-TgqCMTQXJWkukLeWunpH43V6h4iQf4uGtWLbJUPus2HDDMPhEWziFjHJB2_X0iBFlKmdCqeFtjisMENYsNRs3Q4KFmd7FjctiOs0_DbyonmlQ-yYV_DDlYHhz83gxEEC-1fCyFISA99VAEv2Hwx4vOeJ2sdh0NcCXpCmaGZFPdXoU5_Ae5mGgvNF1UHcuwluq1bbQx0-mgZ1JsFmQbFYs4QuQ4MeIzhqC_yj0bOY3Lv3vt3vNs2cq2vWHFSNy1FwvTXPkaka4FxHSIPA3D2fluR4BgegK9uT4A86YQmIXFWdGUzjtuWF6OiZBy1Q';
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');

        fetch('http://dev-fs.8d.ie/api/menu/edit-menu', {
            method: 'POST',
            headers: headers,
            body: data,
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == 'success') {
                    console.log(responseJson);
                    this.setState({ edit_dialog: false, name: null, description: null, status: true, id: null });
                    this.get_menu_data();
                } else {
                    alert('Something wrong happened.');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    clear = () => {
        this.setState({ searchText: null });
        this.setState({ dataSource: this.state.dataSourcenew });
    };

    deletePress = (id) => {
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
                        //this.deleteYesPress(id);
                    },
                },
            ],
            { cancelable: false },
        );
    };

    deleteYesPress = id => {
        var headers = new Headers();
        let auth =
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViNTE5MmFmNjYyZjkxMTQzYTE1ZDQ2OTZkNTg2ZGY0MmYyMDkxMmFiMGZjYWY1ZDJmNDg4YmQwOWZiOGFjNDkwZWVkODViODMzYTM1MjEyIn0.eyJhdWQiOiIxIiwianRpIjoiZWI1MTkyYWY2NjJmOTExNDNhMTVkNDY5NmQ1ODZkZjQyZjIwOTEyYWIwZmNhZjVkMmY0ODhiZDA5ZmI4YWM0OTBlZWQ4NWI4MzNhMzUyMTIiLCJpYXQiOjE1NzY2Njk4MDMsIm5iZiI6MTU3NjY2OTgwMywiZXhwIjoxNjA4MjkyMjAzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.WamiILeUa8pz0xFLiFQJVJ33QLrsjIU48QU4Nx1H5UBKCq2p28GnYlfkAG2ySCTaqhqxoNTvQ6kqSCoPRl4qFWSQyOxb_51hquwD_59nCgVkASRqxym4Pthcd9CAbme1m-InVgALwNTRl7VwHGch3XE3fdfA8AN_nuRlF0GJ_uQWDDapNHPSCd_EtxpCDmlcW8k4zCzcHY27_gwuLRr_LlI-bztJZQdKlK-kWDzvDmxBYKE_DbxAeVt7BCwX1DZpcqPjNxgLoo0QXir8fOFkOoZdS4y-k3wY0IPJybO-_Pmj-DkJ8Oq4eu9XXpraW50AHXvYz_sWcUm_WikYWUOkjjPp682DiaaR8TUWF75M6C403m-TgqCMTQXJWkukLeWunpH43V6h4iQf4uGtWLbJUPus2HDDMPhEWziFjHJB2_X0iBFlKmdCqeFtjisMENYsNRs3Q4KFmd7FjctiOs0_DbyonmlQ-yYV_DDlYHhz83gxEEC-1fCyFISA99VAEv2Hwx4vOeJ2sdh0NcCXpCmaGZFPdXoU5_Ae5mGgvNF1UHcuwluq1bbQx0-mgZ1JsFmQbFYs4QuQ4MeIzhqC_yj0bOY3Lv3vt3vNs2cq2vWHFSNy1FwvTXPkaka4FxHSIPA3D2fluR4BgegK9uT4A86YQmIXFWdGUzjtuWF6OiZBy1Q';
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');

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
                    this.setState({ edit_dialog: false });
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
            this.state.name == ''
        ) {
            alert('Please inserted remaining fields');
        } else {

            var data = new FormData();
            data.append('vender_id', this.state.vender_id);
            data.append('name', this.state.name);
            data.append('description', this.state.description);
            data.append('status', this.state.status == true ? 1 : 0);

            console.log(data);
            var headers = new Headers();
            let auth =
                'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViNTE5MmFmNjYyZjkxMTQzYTE1ZDQ2OTZkNTg2ZGY0MmYyMDkxMmFiMGZjYWY1ZDJmNDg4YmQwOWZiOGFjNDkwZWVkODViODMzYTM1MjEyIn0.eyJhdWQiOiIxIiwianRpIjoiZWI1MTkyYWY2NjJmOTExNDNhMTVkNDY5NmQ1ODZkZjQyZjIwOTEyYWIwZmNhZjVkMmY0ODhiZDA5ZmI4YWM0OTBlZWQ4NWI4MzNhMzUyMTIiLCJpYXQiOjE1NzY2Njk4MDMsIm5iZiI6MTU3NjY2OTgwMywiZXhwIjoxNjA4MjkyMjAzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.WamiILeUa8pz0xFLiFQJVJ33QLrsjIU48QU4Nx1H5UBKCq2p28GnYlfkAG2ySCTaqhqxoNTvQ6kqSCoPRl4qFWSQyOxb_51hquwD_59nCgVkASRqxym4Pthcd9CAbme1m-InVgALwNTRl7VwHGch3XE3fdfA8AN_nuRlF0GJ_uQWDDapNHPSCd_EtxpCDmlcW8k4zCzcHY27_gwuLRr_LlI-bztJZQdKlK-kWDzvDmxBYKE_DbxAeVt7BCwX1DZpcqPjNxgLoo0QXir8fOFkOoZdS4y-k3wY0IPJybO-_Pmj-DkJ8Oq4eu9XXpraW50AHXvYz_sWcUm_WikYWUOkjjPp682DiaaR8TUWF75M6C403m-TgqCMTQXJWkukLeWunpH43V6h4iQf4uGtWLbJUPus2HDDMPhEWziFjHJB2_X0iBFlKmdCqeFtjisMENYsNRs3Q4KFmd7FjctiOs0_DbyonmlQ-yYV_DDlYHhz83gxEEC-1fCyFISA99VAEv2Hwx4vOeJ2sdh0NcCXpCmaGZFPdXoU5_Ae5mGgvNF1UHcuwluq1bbQx0-mgZ1JsFmQbFYs4QuQ4MeIzhqC_yj0bOY3Lv3vt3vNs2cq2vWHFSNy1FwvTXPkaka4FxHSIPA3D2fluR4BgegK9uT4A86YQmIXFWdGUzjtuWF6OiZBy1Q';
            headers.append('Authorization', auth);
            headers.append('Accept', 'application/json');

            fetch('http://dev-fs.8d.ie/api/menu/add-menu', {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.status == 'success') {
                        this.setState({ add_dialog: false, name: null, description: null, status: true, id: null });
                        this.get_menu_data();
                    } else {
                        alert('Something wrong happened');
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        }
    };

    get_menu_data() {

        try {
            AsyncStorage.getItem('visited_onces', (err, res) => {
                if (res === null || res === 'null' || res === "") {
                    this.props.navigation.replace('login');
                } else {
                    var data = new FormData()
                    data.append('vender_id', 1);

                    fetch('http://dev-fs.8d.ie/api/menu/menu', {
                        method: 'POST',
                        body: data
                        //headers: headers,
                    })
                        .then(response => response.json())
                        .then(responseJson => {
                            if (responseJson) {
                                //alert(JSON.stringify(responseJson["data"]))

                                if (responseJson["status"] == "success") {
                                    this.setState({ dataSource: responseJson["data"] });
                                    this.setState({ dataSourcenew: responseJson["data"] });
                                }
                                //alert(JSON.stringify(this.state.dataSource))
                                //this.props.navigation.navigate('AfterLogin',{Json_value:responseJson.data});
                            } else {
                                alert('Something wrong happened');
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        } catch (error) {
        }
    }

    searchFilterFunction = (text) => {
        if (text != "") {
            const newData = this.state.dataSource.filter(item => {
                const itemData = `${item.description.toUpperCase()}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({ dataSource: newData });
        } else {
            this.setState({ dataSource: this.state.dataSourcenew });
        }
    };

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
                <TouchableOpacity onPress={() => this.add_menu()}>
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
                <Navbar left={left} right={right} title="Menu" />
                    <ScrollView>

                        {/* Add Menu Dialog  */}
                        <KeyboardAvoidingView behavior="padding" enabled>
                            {/* Add  */}
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
                                                Add Menu
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
                                                        style={{ fontSize: width * 0.016, color: '#76726d' }}>
                                                        Name:
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
                                                    placeholder="Type name here.."
                                                    onChangeText={name =>
                                                        this.setState({ name })
                                                    }
                                                    defaultValue={this.state.name}
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
                                                        style={{ fontSize: width * 0.016, color: '#76726d' }}>
                                                        Description:
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
                                                    placeholder="Type description here.."
                                                    onChangeText={description =>
                                                        this.setState({ description })
                                                    }
                                                    defaultValue={this.state.description}
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
                                                        style={{ fontSize: width * 0.016, color: '#76726d' }}>
                                                        Is Status:
                                                    </Text>
                                                </View>
                                                <CheckBox
                                                    style={{ flex: 1, padding: 10 }}
                                                    onClick={() => {
                                                        this.setState({
                                                            status: !this.state.status
                                                        })
                                                    }}
                                                    isChecked={this.state.status}
                                                />
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

                            {/* Edit  */}
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
                                onTouchOutside={() => this.setState({ edit_dialog: false })}>
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
                                                Edit
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ edit_dialog: false })}>
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
                                                        style={{ fontSize: width * 0.016, color: '#76726d' }}>
                                                        Name :
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
                                                    placeholder="Type name here.."
                                                    onChangeText={name =>
                                                        this.setState({ name })
                                                    }
                                                    defaultValue={this.state.name}
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
                                                        style={{ fontSize: width * 0.016, color: '#76726d' }}>
                                                        Description:
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
                                                    placeholder="Type description here.."
                                                    onChangeText={description =>
                                                        this.setState({ description })
                                                    }
                                                    defaultValue={this.state.description}
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
                                                        style={{ fontSize: width * 0.016, color: '#76726d' }}>
                                                        Is Status:
                                                    </Text>
                                                </View>
                                                <CheckBox
                                                    style={{ flex: 1, padding: 10 }}
                                                    onClick={() => {
                                                        this.setState({
                                                            status: !this.state.status
                                                        })
                                                    }}
                                                    isChecked={this.state.status}
                                                />
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
                                                onPress={() => this.deletePress(this.state.id)}>
                                                <Text style={{ fontSize: width * 0.0165, color: 'white' }}>
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                                style={styles.add_btn}
                                                onPress={() => this.updatePress(this.state.id)}>
                                                <Text style={{ fontSize: width * 0.0165, color: 'white' }}>
                                                    Update
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            </Dialog>
                        </KeyboardAvoidingView>

                        {/* data Search  */}

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
                                        width: '50%',
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
                                        this.setState({ searchText: Searchtext })
                                    }
                                    onSubmitEditing={() => this.searchFilterFunction(this.state.searchText)}
                                    defaultValue={this.state.searchText}
                                />
                            </View>
                            <View
                                style={{
                                    margin: 10,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}>
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
                                <TouchableOpacity
                                    onPress={() => this.searchFilterFunction(this.state.searchText)}>
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

                        {/* data Display  */}
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
                                        Is Active
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
                                data={this.state.dataSource}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={styles.dynamic_list_view}>
                                        <View style={{ flex: 0.5, alignItems: 'center' }}>
                                            <Text style={{ fontSize: width * 0.0165 }}>
                                                {item.name}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 0.5, alignItems: 'center' }}>
                                            <Text style={{ fontSize: width * 0.0165 }}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 0.5, alignItems: 'center' }}>
                                            {item.status == 1 ? (
                                                <Text style={{ fontSize: width * 0.0165 }}>Yes</Text>
                                            ) : (
                                                    <Text style={{ fontSize: width * 0.0165 }}>No</Text>
                                                )}
                                        </View>
                                        <View style={{ flex: 0.5, alignItems: 'center' }}>
                                            {/* <Button onPress={() => this._sideMenuDrawer.open()} transparent>
                                                <FontAwesomeIcon icon={faBars} color={'white'} size={25} />
                                            </Button> */}
                                            <Row>
                                                <Col style={{ width: 80 }}>
                                                    <Button onPress={() => this.selectmenu(item.id)} style={{
                                                        fontSize: width * 0.016,
                                                        backgroundColor: '#ff9500',
                                                        color: 'white',
                                                        borderRadius: 80,
                                                        padding: 15,
                                                        paddingBottom: 2,
                                                        paddingTop: 2,
                                                    }}>
                                                        <Text style={{ color: 'white', fontSize: 18 }}> Edit </Text>
                                                    </Button>
                                                </Col>
                                                <Col style={{ marginLeft: 10, width: 110 }}>
                                                    <Button onPress={() => this.goto_add_dish(item.id)} style={{
                                                        fontSize: width * 0.016,
                                                        backgroundColor: '#ff9500',
                                                        color: 'white',
                                                        borderRadius: 80,
                                                        padding: 15,
                                                        paddingBottom: 2,
                                                        paddingTop: 2,
                                                    }}>
                                                        <Text style={{ color: 'white', fontSize: 18 }}> Add Dish </Text>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={({ id }, index) => id}
                            />
                        </View>


                    </ScrollView>
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
