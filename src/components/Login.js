import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoffee, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import DeviceInfo from 'react-native-device-info';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            email: '',
            showPassword: true,
            device_id: DeviceInfo.getDeviceId(),
            device_type: Platform.OS,
            errorText: "",
            hasError: false
        }
    }

    login = () => {
        this.props.navigation.navigate('Employee');
        // if(this.state.email==""){
        //     alert("Email cannot be black");
        // }
        // else if(this.state.password==""){
        //     alert("Password cannot be black");
        // }
        // else if(this.state.email=="" && this.state.password==""){
        //     alert("Username and Password cannot be blank");
        // }else{
        //     var data = new FormData()
        //     data.append('email', this.state.email);
        //     data.append('password', this.state.password);
        //     console.log(data);
        //     // var headers = new Headers();
        //     // headers.append('Accept', 'application/json');
        //     //return;
        //     fetch("http://dev-fs.8d.ie/api/kitchen/login", {
        //       method: "POST",
        //       body: data
        //     })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //     console.log(responseJson);
        //     if(responseJson){
        //         this.props.navigation.navigate('Employee');
        //     }else{
        //         alert("Something is wrong");
        //     }
        //     }).catch((error) => {
        //     //alert(error);
        //     this.setState({ hasError: true, errorText: error });
        //     //alert(error);
        //     });
        // }
    }

    render() {
        var { height, width } = Dimensions.get('window');
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={{ paddingTop: 20, flex: 0.4, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../images/logo.png')}
                    />
                </View>
                <View style={{ flex: 0.5, marginTop: 10, alignItems: 'center' }}>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <TextInput
                            style={{ borderBottomColor: 'white', paddingLeft: 15, borderBottomWidth: 1, textAlignVertical: "top", width: '70%', color: 'white', flexWrap: 'wrap' }}
                            placeholder="Username -or- Email"
                            placeholderTextColor="white"
                            numberOfLines={1}
                            onChangeText={(email) => this.setState({ email })}
                        />
                    </View>
                    <View style={{ position: 'relative', width: '100%', alignItems: 'center' }}>
                        <TextInput
                            style={{ borderBottomColor: 'white', paddingLeft: 15, marginTop: 20, borderBottomWidth: 1, textAlignVertical: "top", width: '70%', color: 'white', flexWrap: 'wrap' }}
                            placeholder="Password"
                            placeholderTextColor="white"
                            numberOfLines={1}
                            onChangeText={(password) => this.setState({ password })}
                            secureTextEntry={this.state.showPassword}
                        />
                        <View style={{ position: 'absolute', right: width * 0.18, top: 40 }}>
                            {this.state.showPassword == true ? <TouchableOpacity onPress={() => { this.setState({ showPassword: false }) }}><FontAwesomeIcon icon={faEyeSlash} color={'white'} /></TouchableOpacity> : <TouchableOpacity onPress={() => { this.setState({ showPassword: true }) }}><FontAwesomeIcon icon={faEye} color={'white'} /></TouchableOpacity>}
                        </View>
                        {this.state.hasError ? <Text style={{ color: "#c0392b", textAlign: 'center', marginTop: 10 }}>{this.state.errorText}</Text> : null}
                    </View>
                    <TouchableOpacity style={{ backgroundColor: "white", borderRadius: 9, marginTop: 20 }} onPress={() => this.login()}>
                        <Text style={{ color: '#808080', fontSize: width * 0.025, textAlign: 'center', padding: 10, paddingRight: 80, paddingLeft: 80 }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff9500b3',
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