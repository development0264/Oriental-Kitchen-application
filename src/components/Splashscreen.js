import React from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Splashscreen extends React.Component {
    constructor(props) {
        super(props)
        this._retrieveData();
    }
    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('visited_onces');
            console.log("userId::" + value);
            let valueRecieve = JSON.parse(value);

            if (value !== null) {
                this.setState({ userId: JSON.parse(value) });
                if (valueRecieve.roleName == "vender") {
                    this.props.navigation.navigate('Employee');
                } else if (valueRecieve.roleName == "cashier") {
                    this.props.navigation.navigate('Payment');
                } else if (valueRecieve.roleName == "kitchenstaff") {
                    this.props.navigation.navigate('Home_kitchen');
                }
            } else {
                this.props.navigation.navigate('Login');
            }
        } catch (error) {
            alert(error);
        }
    };
    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                1000
            )
        )
    }
    async componentDidMount() {
        // Preload data from an external API
        // Preload data using AsyncStorage
        setTimeout(() => {
            this._retrieveData();
        }, 4000)
    }



    render() {
        return (
            <View style={styles.viewStyles}>
                <Image source={require('../images/logo.png')} />
            </View>
        );
    }
}
const styles = {
    viewStyles: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffb200'
    },

}