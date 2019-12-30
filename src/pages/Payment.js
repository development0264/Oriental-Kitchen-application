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
    ToastAndroid,
} from 'react-native';
import { Button, Left, Right, Grid, Col, Row, Picker, Switch } from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import Navbar from '../components/Navbar';
import {
    faBars,
    faWindowClose,
    faArrowDown,
    faCamera,
    faPrint,
    faReceipt,
    faPager,
    faPlus,
    faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Dialog } from 'react-native-simple-dialogs';
import { Card } from 'react-native-elements';
import RNImagePicker from 'react-native-image-picker';
import Colors from '../Colors';
import SideMenuDrawer from '../components/SideMenuDrawer';
import AsyncStorage from '@react-native-community/async-storage';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSwitchOn: false,
            add_dialog: false,
            add_emp: false,
            edit_dialog: false,
            pro_dialog: false,
            cash: 0,
            dataSource: [],
            dishname: null,
            dishdescription: null,
            token: '',
            // dataSource: [],
            dataSource_inside: [],
            // add_dialog: false,
            show_dialog: false,
            img_uri: '',
            avatar: '',
            isPopular: false,
            quantity: 1,
            max: null,
            cover: null,
            name: null,
            description: null,
            groupname: null,
            isexisting: false,
            dishData: {},
            did: null,
            ingredientexixts: [],
            dataSourceProduct: [], count: 0,
            userDetail: ""
        };
        this._retrieveData();
        this._totalChange = this._totalChange.bind(this);
        //AsyncStorage.setItem("INGREDIENT", "")
        AsyncStorage.getItem('INGREDIENT', (err, res) => {
            if (res != null) {
                this.setState({ ingredientexixts: JSON.parse(res) });
            }
            this.callvenderingredient();
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

    onValueChange(value) {
        this.setState({
            selected: value,
        });
    }

    product = () => {
        const user_details = this.state.userDetail;
        var headers = new Headers();
        let auth = 'Bearer ' + user_details.userToken;
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');
        console.log(headers);

        fetch('http://dev-fs.8d.ie/api/dishes/show-dishes', {
            method: 'POST',
            headers: headers,
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == 'success') {
                    console.log(responseJson);
                    this.setState({ pro_dialog: true });
                    this.setState({ dataSourceProduct: responseJson.data });
                } else {
                    alert('Something wrong happened');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    add_employee = () => {
        this.setState({ add_emp: true });
    };

    onDigitPresssum = digit => {
        console.log(this.state.cash);
        let a = parseFloat(this.state.cash);
        let b = digit;
        let c = (a + b).toString();
        this.setState({ cash: c });
    };

    onDecimalPointPresssum = digit => {
        let a = parseFloat(this.state.cash);
        let b = digit;
        let c = (a + b).toString();
        this.setState({ cash: c });
    };

    _totalChange() {
        let total = this.state.cash;
        this.setState({
            cash: total,
        });
    }

    onZeroPress = () => {
        this.setState({ cash: this.state.cash + '0' });
    };

    onDoubleZeroPress = () => {
        this.setState({ cash: this.state.cash + '00' });
    };

    onPercentCash = () => {
        var newNum = this.state.cash / 100;
        this.setState({
            cash: newNum,
        });
    };
    onClearPress = () => {
        this.setState({ cash: 0 });
    };

    callvenderingredient() {
        const user_details = this.state.userDetail;
        var headers = new Headers();
        let auth = 'Bearer ' + user_details.userToken;
        headers.append('Authorization', auth);
        headers.append('Accept', 'application/json');
        console.log(headers);
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
                            responseJson.ingredientGroups[i].ingredients[j].idingredient =
                                responseJson.ingredientGroups[i].ingredients[j].id;
                            responseJson.ingredientGroups[i].ingredients[
                                j
                            ].isexisting = false;
                            responseJson.ingredientGroups[i].ingredients[j].iscreate = false;
                            responseJson.ingredientGroups[i].ingredients[j].isgroup = false;
                            responseJson.ingredientGroups[i].ingredients[j].groupname =
                                responseJson.ingredientGroups[i].name;
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

    add_dish = () => {
        this.setState({ add_dialog: true });
    };

    ingredients_data = item => {
        this.setState({ did: item.idingredient });
        this.setState({ groupname: item.groupname });
        this.setState({ max: item.max });
        this.setState({ name: item.name });
        this.setState({ description: item.description });
        this.state.ingredientexixts.map(items => {
            if (item.id == items.id) {
                this.setState({ quantity: items.qty });
            }
        });
        this.setState({ show_dialog: true });
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
                    img_uri: response.uri,
                    avatar: response,
                });
            }
        });
    };

    addQuantity() {
        if (this.state.quantity + 1 <= this.state.max) {
            this.setState({ quantity: this.state.quantity + 1 });
        } else {
            ToastAndroid.show(
                'You have reached the maximum limit of qty!',
                ToastAndroid.SHORT,
            );
        }
    }

    create_dish() {
        var ingredientsList = [];

        for (var i = 0; i < this.state.ingredientexixts.length; i++) {
            var obj = new Object();
            obj.id = this.state.ingredientexixts[i].id;
            obj.qty = this.state.ingredientexixts[i].qty;
            ingredientsList.push(obj);
        }

        // let auth = 'Bearer ' + this.state.access_token;
        const user_details = this.state.userDetail;
        var headers = new Headers();
        let auth = 'Bearer ' + user_details.userToken;
        headers.append('Authorization', auth);
        headers.append('X-Requested-With', 'text/xml');
        headers.append('Accept', 'application/json');
        console.log(headers);
        var data = {
            vender_id: 1,
            name: this.state.dishname,
            employee_id: null,
            description: this.state.dishdescription,
            is_popular: this.state.isPopular,
            ingredients: ingredientsList,
        };

        if (this.state.dishname != '' && this.state.dishname != null) {
            //return
            fetch('http://dev-fs.8d.ie/api/dishes', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    if (responseJson['dish'] != undefined) {
                        // alert(JSON.stringify(responseJson["dish"]));
                        console.log(responseJson['dish']);
                        ToastAndroid.show('Dish creatded succefully !', ToastAndroid.SHORT);

                        AsyncStorage.setItem('INGREDIENT', '');
                        this.setState({ ingredientexixts: [] });
                    } else {
                        ToastAndroid.show(
                            'Dish does not creatded succefully !',
                            ToastAndroid.SHORT,
                        );
                    }
                });
        } else {
            this.setState({ add_dialog: true });
            ToastAndroid.show('Enter Dish Name !', ToastAndroid.SHORT);
        }
    }

    add_Dish_ingredient() {
        var success = false;
        var isqtyupdate = false;
        var isgroupmax = false;
        var ingredientsList = [];
        var ingredients = {};
        ingredients['id'] = this.state.did;
        ingredients['qty'] = this.state.quantity;

        AsyncStorage.getItem('INGREDIENT', (err, res) => {
            if (!res) {
                var ing = [];
                ing.push(ingredients);
                AsyncStorage.setItem('INGREDIENT', JSON.stringify(ing));
            } else {
                //alert(this.state.did)
                var group_count = 0;
                ingredientsList = JSON.parse(res);
                ingredientsList.map(item => {
                    if (item.id == this.state.did) {
                        if (item.qty == this.state.quantity) {
                            success = true;
                        } else {
                            item.qty = this.state.quantity;
                            isqtyupdate = true;
                        }
                    }
                    if (item.group_id == this.state.ingredient_group_id) {
                        group_count++;
                    }
                });

                if (this.state.groupmax == group_count) {
                    isgroupmax = true;
                }
            }
            if (success) {
                // Toast.show({
                //   text: 'This ingredient already exist !',
                //   position: 'bottom',
                //   type: 'danger',
                //   buttonText: 'Dismiss',
                //   duration: 3000
                // });
                ToastAndroid.show(
                    'This ingredient already exist !',
                    ToastAndroid.SHORT,
                );
                this.getindiexistingqtyAdd(ingredients);
                this.setState({ add_dialog: false });
            } else {
                if (isqtyupdate) {
                    ToastAndroid.show('Ingredient update quantity !', ToastAndroid.SHORT);
                    if (this.state.quantity == 0) {
                        let items = [];
                        ingredientsList.map(item => {
                            if (JSON.stringify(item.id) !== JSON.stringify(this.state.did))
                                items.push(item);
                        });
                        ingredientsList = items;
                        AsyncStorage.setItem('INGREDIENT', JSON.stringify(ingredientsList));
                        this.getindiexistingqtyAdd(ingredients);
                    } else {
                        AsyncStorage.setItem('INGREDIENT', JSON.stringify(ingredientsList));
                        this.getindiexistingqtyAdd(ingredients);
                    }
                } else {
                    if (isgroupmax) {
                        ToastAndroid.show(
                            'You have reached the maximum limit of group qty!',
                            ToastAndroid.SHORT,
                        );
                    } else {
                        ingredientsList.push(ingredients);
                        ToastAndroid.show(
                            'Ingredient added to your dish !',
                            ToastAndroid.SHORT,
                        );
                        AsyncStorage.setItem('INGREDIENT', JSON.stringify(ingredientsList));
                        this.setState({ add_dialog: false });
                        this.getindiexistingqtyAdd(ingredients);
                    }
                }
            }

            // AsyncStorage.getItem("INGREDIENT", (err, res) => {
            //   if (!res) {
            //     global.ingList = []
            //   }
            //   else {
            //     global.ingList = JSON.parse(res)
            //     this.getindiqty(this.state)
            //   }
            // });
        });
    }

    getindiexistingqtyAdd(items) {
        var itemsarray = [];
        AsyncStorage.getItem('INGREDIENT', (err, res) => {
            if (res != null) {
                //alert(res)
                //ingredientsList = JSON.parse(res);
                this.setState({ ingredientexixts: JSON.parse(res) });
                this.state.ingredientexixts.map(item => {
                    if (item.id == items.id) {
                        itemsarray.push(
                            <View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 15,
                                        right: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 15,
                                        width: 15,
                                        backgroundColor: Colors.navbarBackgroundColor,
                                        borderRadius: 200 / 2,
                                    }}>
                                    <Text style={{ color: 'white' }}>{item.qty}</Text>
                                </View>
                            </View>,
                        );
                    }
                });
            }
            return itemsarray;
        });
    }

    componentDidMount() {

    }

    getindiexistingqty(item) {
        var itemsarray = [];
        if (this.state.ingredientexixts.length > 0) {
            this.state.ingredientexixts.map(items => {
                if (item.idingredient == items.id) {
                    {
                        itemsarray.push(
                            <View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 30,
                                        right: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 30,
                                        width: 30,
                                        backgroundColor: Colors.navbarBackgroundColor,
                                        borderRadius: 200 / 2,
                                    }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            marginRight: 3,
                                        }}>
                                        {items.qty}
                                    </Text>
                                </View>
                            </View>,
                        );
                    }
                }
            });
        }
        return itemsarray;
    }

    render() {
        const { isSwitchOn, isPopular } = this.state;
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
                <TouchableOpacity
                    style={{ alignSelf: 'center' }}
                    onPress={() => this.add_dish()}>
                    <FontAwesomeIcon icon={faPlus} color={'white'} size={25} />
                    {/* <Text>Add Dish</Text>> */}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.product()}>
                    <FontAwesomeIcon
                        icon={faPager}
                        color={'white'}
                        size={40}
                        style={{ marginHorizontal: 20, marginTop: 5 }}
                    />
                </TouchableOpacity>

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
                    <Dialog
                        visible={this.state.pro_dialog}
                        dialogStyle={{
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: '#efeff4',
                            width: '45%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#efeff4',
                        }}
                        onTouchOutside={() => this.setState({ pro_dialog: false })}>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    marginBottom: 8,
                                    marginTop: 10,
                                }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ pro_dialog: false })}>
                                    <FontAwesomeIcon
                                        icon={faWindowClose}
                                        color={'#ff9500'}
                                        size={35}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            pagingEnabled={this.state.pro_dialog}
                            data={this.state.dataSourceProduct}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'column', paddingVertical: 10 }}>
                                    <Card containerStyle={styles.cardview}>
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: 230,
                                                borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15,
                                            }}
                                            source={{
                                                uri: 'http://dev-fs.8d.ie/img/dish/' + item.cover,
                                            }}></Image>

                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                            }}>
                                            <View style={{ flex: 0.8, flexDirection: 'column' }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 20,
                                                        paddingTop: 8,
                                                    }}>
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        color: 'grey',
                                                        marginTop: 5,
                                                        paddingBottom: 10,
                                                    }}>
                                                    {item.description}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        color: '#66c2ff',
                                                        fontWeight: 'bold',
                                                        fontSize: 20,
                                                        marginLeft: 10,
                                                        marginTop: 8,
                                                    }}>
                                                    $ 20
                      </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: '#66c2ff',
                                                        height: 35,
                                                        width: 60,
                                                        borderRadius: 10,
                                                        marginTop: 10,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: 'white',
                                                            textAlign: 'center',
                                                        }}>
                                                        Add
                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Card>
                                </View>
                                // </TouchableHighlight>
                            )}
                            keyExtractor={({ id }, index) => id}
                        />
                    </Dialog>

                    <Dialog
                        visible={this.state.add_emp}
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
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'lightgrey',
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        fontSize: 23,
                                    }}>
                                    Take Payment
              </Text>
                            </View>
                            <View style={{ justifyContent: 'center', marginLeft: 40 }}>
                                <TouchableOpacity onPress={() => this.setState({ add_emp: false })}>
                                    <FontAwesomeIcon
                                        icon={faWindowClose}
                                        color={'#ff9500'}
                                        size={35}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                height: 400,
                            }}>
                            <View
                                style={{
                                    flex: 0.5,
                                    borderRightWidth: 1,
                                    borderRightColor: 'lightgrey',
                                }}>
                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'lightgrey',
                                        paddingBottom: 37,
                                    }}>
                                    <View
                                        style={{ flexDirection: 'row', paddingTop: 10, marginTop: 20 }}>
                                        <Text style={{ fontSize: 30, color: '#76726d' }}>Cash:</Text>
                                        <TextInput
                                            style={{
                                                borderColor: 'white',
                                                height: 40,
                                                width: '60%',
                                                paddingLeft: 15,
                                                marginLeft: 60,
                                                borderWidth: 1,
                                                textAlignVertical: 'top',
                                                backgroundColor: 'white',
                                                borderRadius: 50,
                                            }}
                                            placeholder=""
                                            defaultValue={this.state.cash}
                                            onChange={() => this._totalChange()}
                                            keyboardType={'numeric'}
                                            onChangeText={cash => this.setState({ cash: cash })}
                                        />
                                    </View>
                                    <View
                                        style={{ flexDirection: 'row', paddingTop: 10, marginTop: 10 }}>
                                        <Text style={{ fontSize: 30, color: '#76726d' }}>Card:</Text>
                                        <TextInput
                                            style={{
                                                borderColor: 'white',
                                                height: 40,
                                                width: '60%',
                                                paddingLeft: 15,
                                                marginLeft: 60,
                                                borderWidth: 1,
                                                textAlignVertical: 'top',
                                                backgroundColor: 'white',
                                                borderRadius: 50,
                                            }}
                                            placeholder=""
                                            onChangeText={card => this.setState({ card: card })}
                                        />
                                    </View>
                                    <View
                                        style={{ flexDirection: 'row', paddingTop: 10, marginTop: 10 }}>
                                        <Text style={{ fontSize: 30, color: '#76726d' }}>Voucher:</Text>
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
                                            }}
                                            placeholder=""
                                            onChangeText={voucher => this.setState({ voucher: voucher })}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    flex: 0.5,
                                    height: '100%',
                                }}>
                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'lightgrey',
                                        paddingBottom: 20,
                                        flexDirection: 'column',
                                    }}>
                                    <View style={styles.touchable1}>
                                        <TouchableOpacity
                                            style={styles.touchablenumber1}
                                            onPress={() => {
                                                this.onDigitPresssum(7);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                7
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber1}
                                            onPress={() => {
                                                this.onDigitPresssum(8);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                8
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber1}
                                            onPress={() => {
                                                this.onDigitPresssum(9);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                9
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: 'orange',
                                                height: 40,
                                                width: 40,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 10,
                                                marginHorizontal: 10,
                                            }}
                                            onPress={() => {
                                                this.onPercentCash('%');
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                %
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: 'orange',
                                                height: 40,
                                                width: 40,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 10,
                                                marginHorizontal: 10,
                                            }}
                                            onPress={() => { }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                -
                    </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.touchable2}>
                                        <TouchableOpacity
                                            style={styles.touchablenumber1}
                                            onPress={() => {
                                                this.onDigitPresssum(4);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                4
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber1}
                                            onPress={() => {
                                                this.onDigitPresssum(5);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                5
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber1}
                                            onPress={() => {
                                                this.onDigitPresssum(6);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                6
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.print_btn}>
                                            <FontAwesomeIcon icon={faPrint} size={25} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.print_btn}>
                                            <FontAwesomeIcon icon={faReceipt} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            height: 100,
                                            width: '70%',
                                            alignSelf: 'center',
                                            marginRight: 30,
                                        }}>
                                        <View style={{ flex: 0.6 }}>
                                            <View style={{ flexDirection: 'row', margin: 10 }}>
                                                <TouchableOpacity
                                                    style={styles.touchablenumber1}
                                                    onPress={() => {
                                                        this.onDigitPresssum(1);
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: 'grey',
                                                        }}>
                                                        1
                        </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.touchablenumber1}
                                                    onPress={() => {
                                                        this.onDigitPresssum(2);
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: 'grey',
                                                        }}>
                                                        2
                        </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.touchablenumber1}
                                                    onPress={() => {
                                                        this.onDigitPresssum(3);
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: 'grey',
                                                        }}>
                                                        3
                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginHorizontal: 10,
                                                }}>
                                                <TouchableOpacity
                                                    style={styles.touchablenumber1}
                                                    onPress={() => {
                                                        this.onZeroPress(0);
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: 'grey',
                                                        }}>
                                                        0
                        </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.touchablenumber1}
                                                    onPress={() => {
                                                        this.onDoubleZeroPress();
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: 'grey',
                                                        }}>
                                                        00
                        </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.touchablenumber1}
                                                    onPress={() => {
                                                        this.onDigitPresssum('.');
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: 'grey',
                                                        }}>
                                                        .
                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.4, margin: 10 }}>
                                            <TouchableOpacity
                                                style={{
                                                    height: 90,
                                                    width: 100,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 10,
                                                    backgroundColor: 'white',
                                                    marginStart: 8,
                                                }}
                                                onPress={() => {
                                                    this.onClearPress('');
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: 30,
                                                        fontWeight: 'bold',
                                                        color: 'grey',
                                                    }}>
                                                    CE
                      </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View>
                                    <View style={styles.touchable1}>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDigitPresssum(50);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                50
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDigitPresssum(20);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                20
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDigitPresssum(10);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                10
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDigitPresssum(2);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                2
                    </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.touchable1}>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDigitPresssum(1);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                1
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDecimalPointPresssum(0.5);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                0.5
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDecimalPointPresssum(0.2);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                0.2
                    </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.touchablenumber2}
                                            onPress={() => {
                                                this.onDecimalPointPresssum(0.1);
                                            }}>
                                            <Text
                                                style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>
                                                0.1
                    </Text>
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
                            <Text
                                style={{
                                    fontSize: width * 0.03,
                                    alignSelf: 'flex-start',
                                    marginLeft: 10,
                                    flex: 30,
                                    textAlign: 'left',
                                    marginTop: 10,
                                    paddingVertical: 10,
                                    color: 'grey',
                                }}>
                                Total : {this.state.cash}
                            </Text>
                            <Text
                                style={{
                                    fontSize: width * 0.03,
                                    alignSelf: 'center',
                                    flex: 30,
                                    marginLeft: 20,
                                    marginTop: 10,
                                    paddingVertical: 10,
                                    color: 'grey',
                                }}>
                                Return :{' '}
                            </Text>

                            <Switch
                                trackColor={{ true: 'white', false: 'white' }}
                                value={isSwitchOn}
                                style={styles.btnswitch}
                                color="white"
                                thumbColor="orange"
                                onValueChange={() => {
                                    this.setState({ isSwitchOn: !isSwitchOn });
                                }}
                            />

                            <TouchableOpacity style={styles.add_btn}>
                                <Text style={{ fontSize: 30, color: 'white', textAlign: 'center' }}>
                                    Pay
              </Text>
                            </TouchableOpacity>
                        </View>
                    </Dialog>

                    <Dialog
                        visible={this.state.add_dialog}
                        dialogStyle={{
                            borderRadius: 10,
                            borderWidth: 10,
                            borderColor: '#efeff4',
                            width: '80%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#efeff4',
                        }}
                        onTouchOutside={() => this.setState({ add_dialog: false })}>
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
                                    Create Dish
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
                                    padding: 50,
                                }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 150 }}>
                                        <Text style={{ fontSize: width * 0.02, color: '#76726d' }}>
                                            Dish Name:
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
                                        value={this.state.dishname}
                                        onChangeText={text => this.setState({ dishname: text })}
                                    // onChangeText={this.setName}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 15,
                                    }}>
                                    <View style={{ width: 150 }}>
                                        <Text style={{ fontSize: width * 0.02, color: '#76726d' }}>
                                            Dish Description:
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
                                        value={this.state.dishdescription}
                                        onChangeText={text => this.setState({ dishdescription: text })}
                                    //onChangeText={this.setName}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 15,
                                    }}>
                                    <View style={{ width: 150 }}>
                                        <Text style={{ fontSize: width * 0.02, color: '#76726d' }}>
                                            Popular:
                  </Text>
                                    </View>
                                    <CheckBox
                                        style={{ flex: 1, marginLeft: 15 }}
                                        checked={this.state.isPopular}
                                        status={isPopular ? 'checked' : 'unchecked'}
                                        tintColors={{ true: 'orange' }}
                                        value={isPopular}
                                        onChange={() =>
                                            this.setState({ isPopular: !this.state.isPopular })
                                        }
                                    />
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
                                            style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
                                            source={require('../images/profile-circle-picture-8.png')}></Image>
                                    ) : (
                                            <Image
                                                style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
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
                                style={styles.create_btn}
                                onPress={() => this.setState({ add_dialog: false })}>
                                <Text style={{ fontSize: width * 0.03, color: 'white' }}>
                                    Create
              </Text>
                            </TouchableOpacity>
                        </View>
                    </Dialog>

                    <Dialog
                        visible={this.state.show_dialog}
                        dialogStyle={{
                            borderRadius: 10,
                            borderWidth: 10,
                            borderColor: '#efeff4',
                            width: '50%',
                            height: '50%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#efeff4',
                        }}
                        onTouchOutside={() => this.setState({ show_dialog: false })}>
                        <View style={{ height: '100%' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            borderBottomWidth: 1,
                                            borderBottomColor: 'lightgrey',
                                            paddingBottom: 15,
                                            marginBottom: 0,
                                            fontSize: 23,
                                        }}>
                                        Select {this.state.groupname}
                                    </Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ show_dialog: false })}>
                                        <FontAwesomeIcon
                                            icon={faWindowClose}
                                            color={'#ff9500'}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flex: 1, width: 250, maxHeight: 200 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ marginLeft: 20, marginTop: 20 }}>
                                        <Image
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 100,
                                                height: 110,
                                                backgroundColor: 'black',
                                            }}
                                            source={{
                                                uri: 'http://dev-fs.8d.ie/storage/' + this.state.cover,
                                            }}></Image>
                                    </View>
                                    <View style={{ marginLeft: 40, marginTop: 10 }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                            {this.state.name}
                                        </Text>
                                        <Text style={{ fontSize: 16, width: 350, marginTop: 10 }}>
                                            {this.state.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    borderTopWidth: 1,
                                    borderColor: '#ccccde',
                                    flex: 1,
                                    width: 530,
                                    maxHeight: 150,
                                    marginBottom: -100,
                                }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Button
                                        block
                                        icon
                                        transparent
                                        style={{ marginTop: 10 }}
                                        onPress={() =>
                                            this.setState({
                                                quantity:
                                                    this.state.quantity > 0 ? this.state.quantity - 1 : 0,
                                            })
                                        }>
                                        <FontAwesomeIcon icon={faMinus} color={'orange'} size={20} />
                                    </Button>

                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: 20,
                                            marginLeft: 30,
                                            marginTop: 20,
                                        }}>
                                        {this.state.quantity}
                                    </Text>

                                    <Button
                                        block
                                        icon
                                        transparent
                                        style={{ marginLeft: 30, marginTop: 10 }}
                                        onPress={() =>
                                            this.setState({
                                                quantity:
                                                    this.state.quantity >= 0 ? this.state.quantity + 1 : 0,
                                            })
                                        }>
                                        <FontAwesomeIcon icon={faPlus} color={'orange'} size={20} />
                                    </Button>

                                    <TouchableOpacity
                                        style={{
                                            paddingLeft: 30,
                                            paddingRight: 30,
                                            marginBottom: 80,
                                            marginLeft: 320,
                                            borderRadius: 10,
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            backgroundColor: '#ff9500',
                                        }}
                                        onPress={() => this.add_Dish_ingredient()}>
                                        <Text style={{ fontSize: 20, color: 'white' }}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Dialog>

                    <Navbar left={left} right={right} title="Payment" />

                    <View style={{ flex: 0.9, flexDirection: 'row' }}>
                        <FlatList
                            data={this.state.dataSource}
                            keyExtractor={({ id }, index) => id}
                            numColumns={8}
                            renderItem={({ item }) => (
                                <View style={{ padding: 5, flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.ingredients_data(item)}>
                                        <Image
                                            style={{ height: 150, width: 150 }}
                                            source={{ uri: 'http://dev-fs.8d.ie/storage/' + item.cover }}
                                        />
                                        <Text>
                                            {item.name}-{item.id}
                                        </Text>
                                    </TouchableOpacity>
                                    {this.getindiexistingqty(item)}
                                </View>
                            )}
                        />
                    </View>

                    <View
                        style={{
                            flex: 0.1,
                            backgroundColor: '#ff9500',
                            borderTopWidth: 5,
                            borderTopColor: 'white',
                        }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignSelf: 'center' }}
                            onPress={() => this.create_dish()}>
                            <Text style={{ fontSize: width * 0.03, color: 'white' }}>Save</Text>
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
    btnswitch: {
        flex: 10,
        marginTop: 20,
        marginRight: 50,
        marginVertical: 10,
    },
    add_btn: {
        flex: 10,
        marginTop: 20,
        marginRight: 40,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: '#ff9500',
    },
    touchable1: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        marginStart: 50,
    },
    touchable2: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        marginStart: 50,
    },
    touchable3: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        marginStart: 50,
    },
    print_btn: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
    },
    touchable4: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        marginStart: 50,
    },
    touchablenumber1: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 10,
    },
    touchablenumber2: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 10,
    },
    cardview: {
        flexDirection: 'column',
        padding: 0,
        borderRadius: 15,
        // marginLeft: 15,
        // marginRight: 15,
        // marginBottom: 10,
        // marginTop: 10
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
    create_btn: {
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
});
