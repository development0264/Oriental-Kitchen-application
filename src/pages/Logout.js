import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';

export default class logout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            loading: false
        }
    }

    page_reloaded = () => {
        this.logout();
    }

    logout = async () => {
        // this.setState({loading:true});
        try {
            const value = await AsyncStorage.removeItem('visited_onces');
            this.props.navigation.navigate('Login');
            console.log(value);
        } catch (error) {
            alert(error);
        }
    };

    componentDidMount() {
        console.log("Logout page");
        this.logout();
    }


    render() {
        return (
            <View style={styles.container}>
                {/* {this.state.loading == true ? <View style={styles.spinner} pointerEvents="none" >
                <ActivityIndicator size="large" color="#f15a25" />
            </View>:null} */}
                <NavigationEvents onDidFocus={() => { this.page_reloaded() }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    spinner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 99999,
        backgroundColor: '#ffffffab',
    },
});  