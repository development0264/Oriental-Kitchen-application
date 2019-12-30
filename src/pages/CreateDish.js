import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, CheckBox, AsyncStorage, ToastAndroid } from 'react-native';
import { Button, Left, Right, Toast } from 'native-base';
import Navbar from '../components/Navbar';
import { faBars, faArrowUp, faArrowDown, faPlus, faMinus, faWindowClose, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Card } from 'react-native-elements';
import { Dialog } from 'react-native-simple-dialogs';
import RNImagePicker from 'react-native-image-picker';
import Colors from '../Colors';
import SideMenuDrawer from '../components/SideMenuDrawer';

export default class CreateDish extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dishname: null,
            dishdescription: '',
            token: "",
            dataSource: [],
            dataSource_inside: {},
            add_dialog: false,
            show_dialog: false,
            img_uri: "",
            avatar: "",
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
            //id: null,
            venderid: 1,
            dishrate: '',
            ingredient_group_id: null,
            groupmax: 0
        }

        AsyncStorage.setItem("INGREDIENT", "")
        AsyncStorage.getItem("INGREDIENT", (err, res) => {
            if (res != null) {
                this.setState({ ingredientexixts: JSON.parse(res) })
            }
            this.callvenderingredient();
        })

    }


    callvenderingredient() {
        // this.setState({ qty: '' });
        var headers = new Headers();
        let auth = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU2MTE1NTZiYTJmZjUxZDlmNTg4ZWY0N2MxY2EzNDZiN2Q2NWQ5YjEyZGIxYzJkZWZkZTRlMjg3NzU2YTQ4NjE0YmY4YWU0OWQ0ZDZkM2VjIn0.eyJhdWQiOiIxIiwianRpIjoiNTYxMTU1NmJhMmZmNTFkOWY1ODhlZjQ3YzFjYTM0NmI3ZDY1ZDliMTJkYjFjMmRlZmRlNGUyODc3NTZhNDg2MTRiZjhhZTQ5ZDRkNmQzZWMiLCJpYXQiOjE1NzIwMTExMTcsIm5iZiI6MTU3MjAxMTExNywiZXhwIjoxNjAzNjMzNTE3LCJzdWIiOiIzMSIsInNjb3BlcyI6W119.tbhBgFC_mbmVdP924vH0RcIhmOa7Vd8tPnLIGeFMjFz9TptGIFXDf9jp44yEYSAR5JZq31kz3yth92lQnMgdSg-ah1vqyo_OWETzMTxlQaRbpSnuWX9tFGT53wbbR4QHCrTMGi72cumIvMV0E4z-XqxKJnMjiWN91HhPznGiVlT5gu1Y9AUDpxn1vXuNRNYhHO_3jxqJIqxucCln-ZMeZ38-jUgcj_bi7b5gS62mX08KuLqpNMJTzC3PLjW7krbuHS0Ac8TLVDrYH0sDgK4waXmDaNNY8Sp1wx1MHUN1Jzmwog1ACUvyrasT4J2aoxbr0L_Mvyqu-nSpMexZw4CkrM8h8h1sAjPp4JCxKRtzVyBKTaFzXg6ZNWYEzo19MgWHa0Noj23t2TZeVULO3udmt5wyMY4W9rKpFW1JoaUb5inmFTCDTdUSdFXNpMBGYi-Jx3lP5H1pkPI4IFfzOvgFEy0FrekPClC622JNRlLoVllJSTNFN-660kcwQltG6vETH8Xb4isF03GeLhwew7z4P0cGyw_wIsvhyCOx3uEB2vJnpf5QTCVD1knqZYkwxnfbPs7zcos1oWJOmFADkbNeBx1Ti3hBzW16eXN3kKGmoY9W5FVTZSq0M9W_rQI_n7tvl9BqaTukiSpRwMJw1FuDFpr9T5P3ANFR6m8LzhOkPhs';
        headers.append("Authorization", auth);
        fetch("http://dev-fs.8d.ie/api/venders/1/ingredient-groups", {
            method: "GET",
            headers: headers,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson) {

                    //this.props.navigation.navigate('AfterLogin',{Json_value:responseJson.data});

                    let ingredientGroups = [];

                    for (var i = 0; i < responseJson.ingredientGroups.length; i++) {
                        responseJson.ingredientGroups[i].isgroup = true;
                        responseJson.ingredientGroups[i].name = responseJson.ingredientGroups[i].name + 'Group'
                        ingredientGroups.push(responseJson.ingredientGroups[i])
                        for (var j = 0; j < responseJson.ingredientGroups[i].ingredients.length; j++) {
                            responseJson.ingredientGroups[i].ingredients[j].idingredient = responseJson.ingredientGroups[i].ingredients[j].id;
                            responseJson.ingredientGroups[i].ingredients[j].isexisting = false;
                            responseJson.ingredientGroups[i].ingredients[j].iscreate = false;
                            responseJson.ingredientGroups[i].ingredients[j].isgroup = false;
                            responseJson.ingredientGroups[i].ingredients[j].groupmax = responseJson.ingredientGroups[i].max;
                            responseJson.ingredientGroups[i].ingredients[j].groupname = responseJson.ingredientGroups[i].name;
                            ingredientGroups.push(responseJson.ingredientGroups[i].ingredients[j])
                        }
                    }
                    console.log(responseJson.ingredientGroups);
                    this.setState({ dataSource: ingredientGroups, dataSource_inside: responseJson.ingredientGroups.ingredients });
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    add_dish = () => {
        this.setState({ add_dialog: true });
    }

    handleAddDish = () => {
        if (this.state.dishname == "") {
            alert("Please Enter Dish Name.");
        } else if (this.state.dishdescription == "") {
            alert("Please Enter Dish Description.");
        } else if (this.state.dishrate == "") {
            alert("Please Enter Dish Rate.");
        } else {
            ToastAndroid.show('Continue Please..', ToastAndroid.SHORT);
            this.setState({ add_dialog: false });
        }

    }

    ingredients_data = (item) => {
        //this.setState({ qty: '' });
        if (item.isgroup == false) {
            this.setState({ did: item.idingredient });
            this.setState({ groupname: item.groupname });
            this.setState({ max: item.max });
            this.setState({ name: item.name });
            this.setState({ description: item.description });
            this.setState({ ingredient_group_id: item.ingredient_group_id });
            this.setState({ groupmax: item.groupmax });
            this.setState({ quantity: 1 });
            this.state.ingredientexixts.map((items) => {
                if (item.id == items.id) {
                    this.setState({ quantity: items.qty });
                }
            })
            this.setState({ show_dialog: true });
        }
    }

    opencamera = () => {
        const options = {
            noData: true,
        }
        RNImagePicker.showImagePicker(options, (response) => {
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
                    avatar: response
                });
            }
        });
    }

    addQuantity() {
        if ((this.state.quantity + 1) <= this.state.max) {
            this.setState({ quantity: this.state.quantity + 1 })
        }
        else {
            ToastAndroid.show('You have reached the maximum limit of qty!', ToastAndroid.SHORT);
        }
    }


    create_dish() {

        var ingredientsList = [];

        for (var i = 0; i < this.state.ingredientexixts.length; i++) {
            var obj = new Object();
            obj.id = this.state.ingredientexixts[i].id;
            obj.qty = this.state.ingredientexixts[i].qty;
            ingredientsList.push(obj)
        }

        // let auth = 'Bearer ' + this.state.access_token;
        let auth = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU2MTE1NTZiYTJmZjUxZDlmNTg4ZWY0N2MxY2EzNDZiN2Q2NWQ5YjEyZGIxYzJkZWZkZTRlMjg3NzU2YTQ4NjE0YmY4YWU0OWQ0ZDZkM2VjIn0.eyJhdWQiOiIxIiwianRpIjoiNTYxMTU1NmJhMmZmNTFkOWY1ODhlZjQ3YzFjYTM0NmI3ZDY1ZDliMTJkYjFjMmRlZmRlNGUyODc3NTZhNDg2MTRiZjhhZTQ5ZDRkNmQzZWMiLCJpYXQiOjE1NzIwMTExMTcsIm5iZiI6MTU3MjAxMTExNywiZXhwIjoxNjAzNjMzNTE3LCJzdWIiOiIzMSIsInNjb3BlcyI6W119.tbhBgFC_mbmVdP924vH0RcIhmOa7Vd8tPnLIGeFMjFz9TptGIFXDf9jp44yEYSAR5JZq31kz3yth92lQnMgdSg-ah1vqyo_OWETzMTxlQaRbpSnuWX9tFGT53wbbR4QHCrTMGi72cumIvMV0E4z-XqxKJnMjiWN91HhPznGiVlT5gu1Y9AUDpxn1vXuNRNYhHO_3jxqJIqxucCln-ZMeZ38-jUgcj_bi7b5gS62mX08KuLqpNMJTzC3PLjW7krbuHS0Ac8TLVDrYH0sDgK4waXmDaNNY8Sp1wx1MHUN1Jzmwog1ACUvyrasT4J2aoxbr0L_Mvyqu-nSpMexZw4CkrM8h8h1sAjPp4JCxKRtzVyBKTaFzXg6ZNWYEzo19MgWHa0Noj23t2TZeVULO3udmt5wyMY4W9rKpFW1JoaUb5inmFTCDTdUSdFXNpMBGYi-Jx3lP5H1pkPI4IFfzOvgFEy0FrekPClC622JNRlLoVllJSTNFN-660kcwQltG6vETH8Xb4isF03GeLhwew7z4P0cGyw_wIsvhyCOx3uEB2vJnpf5QTCVD1knqZYkwxnfbPs7zcos1oWJOmFADkbNeBx1Ti3hBzW16eXN3kKGmoY9W5FVTZSq0M9W_rQI_n7tvl9BqaTukiSpRwMJw1FuDFpr9T5P3ANFR6m8LzhOkPhs';
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Authorization", auth);

        var data = {
            "vender_id": 1,
            "name": this.state.dishname,
            "employee_id": null,
            "description": this.state.dishdescription,
            "is_popular": this.state.isPopular,
            //"rate": this.state.dishrate,
            "ingredients": ingredientsList,
        }

        if (this.state.dishname != "" && this.state.dishname != null) {
            //return
            fetch("http://dev-fs.8d.ie/api/dishes", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    //console.log(responseJson);
                    alert(JSON.stringify(responseJson["dish"]));
                    if (responseJson["dish"] != undefined) {
                        ToastAndroid.show('Dish creatded successfully !', ToastAndroid.SHORT);

                        AsyncStorage.setItem("INGREDIENT", "");
                        this.setState({ ingredientexixts: [] })
                        alert(JSON.stringify(responseJson["dish"][0].id));
                        console.log(responseJson);
                        var headers = new Headers();
                        headers.append('Content-Type', 'application/json');

                        var rdata = {
                            "dish_id": responseJson["dish"][0].id,
                            "vender_id": this.state.venderid,
                            "rate": this.state.dishrate
                        }

                        fetch("http://dev-fs.8d.ie/api/dishes/add_dish_rate", {
                            method: "POST",
                            headers: headers,
                            body: JSON.stringify(rdata)
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                //console.log(responseJson);

                                if (responseJson.status == "success") {
                                    this.setState({ resp: responseJson, networkError: false });
                                    //alert("Please check dishrate if");
                                    ToastAndroid.show('Dish creatded successfully !', ToastAndroid.SHORT);

                                    AsyncStorage.setItem("INGREDIENT", "");
                                    this.setState({ ingredientexixts: [] })
                                } else {
                                    //alert("Please check dishrate else");
                                    ToastAndroid.show('Dish does not creatded successfully !', ToastAndroid.SHORT);
                                }
                            })
                    } else {
                        //ToastAndroid.show('Dish does not creatded successfully !', ToastAndroid.SHORT);
                        ToastAndroid.show('Please Check your Code !', ToastAndroid.SHORT);
                    }
                })
        }
        else {
            this.setState({ add_dialog: true })
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
        ingredients['group_id'] = this.state.ingredient_group_id;
        AsyncStorage.getItem("INGREDIENT", (err, res) => {
            if (!res) {
                var ing = [];
                ing.push(ingredients)
                AsyncStorage.setItem("INGREDIENT", JSON.stringify(ing));
            }
            else {
                //alert(this.state.did)
                var group_count = 0;
                ingredientsList = JSON.parse(res);
                ingredientsList.map((item) => {
                    if (item.id == this.state.did) {
                        if (item.qty == this.state.quantity) {
                            success = true;
                        } else {
                            item.qty = this.state.quantity
                            isqtyupdate = true
                        }
                    }

                    if (item.group_id == this.state.ingredient_group_id) {
                        group_count++
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
                ToastAndroid.show('This ingredient already exist !', ToastAndroid.SHORT);
                this.getindiexistingqtyAdd(ingredients)
                this.setState({ add_dialog: false })
            }
            else {
                if (isqtyupdate) {
                    ToastAndroid.show('Ingredient update quantity !', ToastAndroid.SHORT);
                    if (this.state.quantity == 0) {
                        let items = [];
                        ingredientsList.map((item) => {
                            if (JSON.stringify(item.id) !== JSON.stringify(this.state.did))
                                items.push(item);
                        });
                        ingredientsList = items;
                        AsyncStorage.setItem("INGREDIENT", JSON.stringify(ingredientsList));
                        this.getindiexistingqtyAdd(ingredients)
                    } else {
                        AsyncStorage.setItem("INGREDIENT", JSON.stringify(ingredientsList));
                        this.getindiexistingqtyAdd(ingredients)
                    }
                } else {
                    if (isgroupmax) {
                        ToastAndroid.show('You have reached the maximum limit of group qty!', ToastAndroid.SHORT);
                    } else {
                        ingredientsList.push(ingredients);
                        ToastAndroid.show('Ingredient added to your dish !', ToastAndroid.SHORT);
                        AsyncStorage.setItem("INGREDIENT", JSON.stringify(ingredientsList));
                        this.setState({ add_dialog: false })
                        this.getindiexistingqtyAdd(ingredients)
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
        AsyncStorage.getItem("INGREDIENT", (err, res) => {
            if (res != null) {
                //alert(res)
                //ingredientsList = JSON.parse(res);
                this.setState({ ingredientexixts: JSON.parse(res) })
                this.state.ingredientexixts.map((item) => {
                    if (item.id == items.id) {
                        itemsarray.push(
                            <View >
                                <View style={{ position: 'absolute', bottom: 15, right: 15, justifyContent: 'center', alignItems: 'center', height: 15, width: 15, backgroundColor: Colors.navbarBackgroundColor, borderRadius: 200 / 2 }}>
                                    <Text style={{ color: 'white' }}>{item.qty}</Text>
                                </View>
                            </View >
                        );
                    }
                })
            }
            return itemsarray
        })
    }


    getindiexistingqty(item) {
        var itemsarray = [];
        if (this.state.ingredientexixts.length > 0) {
            this.state.ingredientexixts.map((items) => {
                if (item.idingredient == items.id) {
                    {
                        itemsarray.push(
                            <View >
                                <View style={{ position: 'absolute', bottom: 30, right: 10, justifyContent: 'center', alignItems: 'center', height: 30, width: 30, backgroundColor: Colors.navbarBackgroundColor, borderRadius: 200 / 2 }}>
                                    <Text style={{ color: 'white', textAlign: 'center', marginRight: 3 }}>{items.qty}</Text>
                                </View>
                            </View >
                        )
                    }
                }
            })
        }
        return itemsarray
    }


    render() {
        var { height, width } = Dimensions.get('window');
        console.log(width);
        var left = (
            <Left style={{ flex: 1 }}>
                <Button onPress={() => this._sideMenuDrawer.open()} transparent>
                    <FontAwesomeIcon icon={faBars} color={'white'} />
                </Button>
            </Left>
        );
        var right = (
            // <Right style={{ flex: 1 }}>
            //     <View style={{ paddingRight: 10 }}>
            //         <Button onPress={() => this.add_dish()} transparent title="Add Dish">
            //             <FontAwesomeIcon icon={faPlus} color={'white'} size={20} />
            //             {/* <Text>Add Dish</Text>> */}
            //         </Button>
            //     </View>
            //     <FontAwesomeIcon style={{ marginBottom: 15 }} icon={faBars} color={'white'} />
            //     <FontAwesomeIcon style={{ marginBottom: 15 }} icon={faBars} color={'white'} />
            //     <FontAwesomeIcon style={{ marginBottom: 15 }} icon={faBars} color={'white'} />
            // </Right>

            <Right style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => this.add_dish()} title="Create Dish">
                    <Image
                        style={{ width: 45, height: 45 }}
                        source={require('../images/add_employee.png')}
                    />
                </TouchableOpacity>
            </Right>
        );
        return (
            <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref} style={{ zIndex: 1 }} navigation={this.props}>
                <View style={styles.container} >
                    <Dialog
                        visible={this.state.add_dialog}
                        dialogStyle={{ borderRadius: 10, borderWidth: 10, borderColor: '#efeff4', width: '80%', justifyContent: 'center', alignSelf: 'center', backgroundColor: '#efeff4' }}
                        onTouchOutside={() => this.setState({ add_dialog: false })} >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.95 }}>
                                <Text style={{ textAlign: 'center', borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: 15, marginTop: 0, fontSize: 23 }}>Create Dish</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.setState({ add_dialog: false })}>
                                    <FontAwesomeIcon icon={faWindowClose} color={'#ff9500'} size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.6, borderRightWidth: 1, borderRightColor: 'lightgrey', padding: 50 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 150 }}>
                                        <Text style={{ fontSize: width * 0.02, color: '#76726d' }}>Dish Name:</Text>
                                    </View>
                                    <TextInput
                                        style={{ borderColor: 'white', height: 40, width: '60%', paddingLeft: 15, marginLeft: 15, borderWidth: 1, textAlignVertical: "top", backgroundColor: "white", borderRadius: 50, flexWrap: 'wrap' }}
                                        placeholder="Type message here.."
                                        value={this.state.dishname}
                                        onChangeText={(dishname) => this.setState({ dishname })}
                                    // onChangeText={this.setName}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                    <View style={{ width: 150 }}>
                                        <Text style={{ fontSize: width * 0.02, color: '#76726d' }}>Dish Description:</Text>
                                    </View>
                                    <TextInput
                                        style={{ borderColor: 'white', height: 40, width: '60%', paddingLeft: 15, marginLeft: 15, borderWidth: 1, textAlignVertical: "top", backgroundColor: "white", borderRadius: 50, flexWrap: 'wrap' }}
                                        placeholder="Type message here.."
                                        value={this.state.dishdescription}
                                        onChangeText={(dishdescription) => this.setState({ dishdescription })}
                                    //onChangeText={this.setName}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                    <View style={{ width: 150 }}>
                                        <Text style={{ fontSize: width * 0.02, color: '#76726d' }}>Dish Rate:</Text>
                                    </View>
                                    <TextInput
                                        style={{ borderColor: 'white', height: 40, width: '60%', paddingLeft: 15, marginLeft: 15, borderWidth: 1, textAlignVertical: "top", backgroundColor: "white", borderRadius: 50, flexWrap: 'wrap' }}
                                        placeholder="Type message here.."
                                        value={this.state.dishrate}
                                        onChangeText={(dishrate) => this.setState({ dishrate })}
                                    // onChangeText={this.setName}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                    <View style={{ width: 150 }}>
                                        <Text style={{ fontSize: width * 0.02, color: '#76726d' }}>Popular:</Text>
                                    </View>
                                    {/* <CheckBox
                                    style={{ flex: 1, marginLeft: 15 }}
                                    value={this.state.isPopular}
                                    //onValueChange={() => this.toggleStatus()}
                                    onValueChange={() => this.setState({ isPopular: !this.state.isPopular })}
                                    leftText={"PopularCheck"}
                                /> */}
                                </View>
                            </View>
                            <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ position: 'relative' }}>
                                    {this.state.img_uri == ""
                                        ? <Image style={{ width: 200, height: 200, borderRadius: 200 / 2 }} source={require("../images/profile-circle-picture-8.png")}  >
                                        </Image>
                                        : <Image style={{ width: 200, height: 200, borderRadius: 200 / 2 }} source={{ uri: this.state.img_uri }}  >
                                        </Image>
                                    }
                                    <View style={styles.camera_icon}>
                                        <TouchableOpacity onPress={() => this.opencamera()}>
                                            <FontAwesomeIcon icon={faCamera} color={'black'} size={45} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: 20, borderTopColor: 'lightgrey', borderTopWidth: 1 }}>
                            <TouchableOpacity style={styles.add_btn} onPress={() => this.handleAddDish()}>
                                <Text style={{ fontSize: width * 0.03, color: 'white' }}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </Dialog>

                    {/* Quantity Dialog */}

                    <Dialog visible={this.state.show_dialog}
                        dialogStyle={{ borderRadius: 10, borderWidth: 10, borderColor: '#efeff4', width: '50%', height: '50%', justifyContent: 'center', alignSelf: 'center', backgroundColor: '#efeff4' }}
                        onTouchOutside={() => this.setState({ show_dialog: false })}>
                        <View style={{ height: '100%' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: 'center', borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: 15, marginBottom: 0, fontSize: 23 }}>Select {this.state.groupname}</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this.setState({ show_dialog: false })}>
                                        <FontAwesomeIcon icon={faWindowClose} color={'#ff9500'} size={25} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flex: 1, width: 250, maxHeight: 200 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ marginLeft: 20, marginTop: 20 }}>
                                        <Image
                                            style={{ justifyContent: 'center', alignItems: 'center', width: 100, height: 110, backgroundColor: 'black' }}
                                            source={{ uri: "http://dev-fs.8d.ie/storage/" + this.state.cover }}
                                        ></Image>
                                    </View>
                                    <View style={{ marginLeft: 40, marginTop: 10 }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.name}</Text>
                                        <Text style={{ fontSize: 16, width: 350, marginTop: 10 }}>{this.state.description}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: '#ccccde', flex: 1, width: 530, maxHeight: 150, marginBottom: -100 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Button block icon transparent style={{ marginTop: 10 }} onPress={() => this.setState({ quantity: this.state.quantity > 0 ? this.state.quantity - 1 : 0 })} >
                                        <FontAwesomeIcon icon={faMinus} color={'orange'} size={20} />
                                    </Button>

                                    <Text style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 20, marginLeft: 30, marginTop: 20 }}>{this.state.quantity}</Text>

                                    <Button block icon transparent style={{ marginLeft: 30, marginTop: 10 }} onPress={() => this.addQuantity()} >
                                        <FontAwesomeIcon icon={faPlus} color={'orange'} size={20} />
                                    </Button>

                                    <TouchableOpacity style={{
                                        paddingLeft: 30,
                                        paddingRight: 30,
                                        marginBottom: 80,
                                        marginLeft: 320,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        backgroundColor: '#ff9500',
                                    }} onPress={() => this.add_Dish_ingredient()}>
                                        <Text style={{ fontSize: 20, color: 'white' }}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <View style={{ borderTopWidth: 1, borderColor: '#ccccde', flex: 1, width: 250, maxHeight: 200, marginBottom: -100 }}>
              <View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Button block icon transparent onPress={() => this.setState({ quantity: this.state.quantity > 0 ? this.state.quantity - 1 : 0 })} >
                    <Icon name='ios-remove' style={{ color: Colors.navbarBackgroundColor }} />
                  </Button>

                  <Text style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 14, marginLeft: 10 }}>{this.state.quantity}</Text>


                  <Button block icon transparent onPress={() => this.addingredient()}>
                    <Icon style={{ color: Colors.navbarBackgroundColor }} name='ios-add' />
                  </Button>
                </View>
                <View style={{ paddingTop: 10 }}>
                  {this.state.isexisting == true ?
                    < Dialog.Button label="Add" style={{ width: 60, height: 30, marginRight: -20, padding: 3, textAlign: 'center', color: 'white', borderRadius: 100, borderWidth: 1, backgroundColor: 'orange', borderColor: 'orange' }} onPress={() => this.addToBasketExisting()} />
                    :
                    <Dialog.Button label="Add" style={{ width: 60, height: 30, marginRight: -20, padding: 3, textAlign: 'center', color: 'white', borderRadius: 100, borderWidth: 1, backgroundColor: 'orange', borderColor: 'orange' }} onPress={() => this.addToBasket()} />
                  }
                </View>

              </View>
            </View> */}
                        </View>
                    </Dialog >
                    <Navbar left={left} right={right} title={this.state.dishname == null ? "Create Dish" : this.state.dishname} />
                    <View style={{ flex: 0.9, flexDirection: 'row' }}>
                        <FlatList
                            data={this.state.dataSource}
                            keyExtractor={({ id }, index) => id}
                            numColumns={8}
                            renderItem={({ item }) =>
                                <View style={{ padding: 5, flexDirection: 'row', }}>

                                    <TouchableOpacity onPress={() => this.ingredients_data(item)}>
                                        <Image
                                            style={{ height: 150, width: 150 }}
                                            source={{ uri: 'http://dev-fs.8d.ie/storage/' + item.cover }}
                                        />
                                        <Text>{item.name}-{item.id}</Text>
                                    </TouchableOpacity>
                                    {this.getindiexistingqty(item)}

                                </View>}
                        />
                    </View>
                    <View style={{ flex: 0.1, backgroundColor: '#ff9500' }}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignSelf: 'center' }}
                            onPress={() => this.create_dish()}>
                            <Text style={{ fontSize: width * 0.03, color: 'white' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View >
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
        alignItems: 'center'
    },
    add_btn: {
        marginTop: 10,
        marginRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 45,
        paddingRight: 45,
        borderRadius: 25,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        backgroundColor: '#ff9500',
    },
});  