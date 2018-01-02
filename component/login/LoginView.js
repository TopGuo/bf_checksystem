//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ToastAndroid,
    Dimensions,
} from 'react-native';

import {
    showHUDLoading,
    hidenHUDLoading,
    showHUDMessage,
} from '../Loading/HUD/HUD';
// //引入LoginManager
import LoginManager from '../../service/LoginManager';
import RoomManager from '../../service/RoomManager';
import CheckItemManager from '../../service/CheckItemManager';


import {images} from '../../constant/img';
// create a component
class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            pwd: "",
        }
        this._checkLogin = this._checkLogin.bind(this);
    }
    static navigationOptions = {
        title: '登录',
        headerStyle: ({
            backgroundColor: "#0EABE8",
            elevation: 0,
        }),
        headerTitleStyle: ({
            alignSelf: 'center'
        }),
        headerTintColor: '#fff',
    }
    componentDidMount() {
        //加载数据 Room
        RoomManager.getRoomInfoToSqlite((result, sql) => {
            if (result) {
                console.log('数据成功插入到SQLite');
            } else {
                console.log('数据插入时发生异常');
            }
        });
        //加载数据 CheckItem
        CheckItemManager.getCheckItemInfoToSqlite((result) => {
            if (result) {
                console.log('数据成功插入到SQLite');
            } else {
                console.log('数据插入时发生异常');
            }
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logoView}
                    source={images.logo} />
                <Text style={styles.logoText}>卫生检查</Text>

                <TextInput
                    style={styles.textInput}
                    placeholder={'请输入用户名'}
                    autoFocus={true}
                    onChangeText={(name) => this.setState({ name })}
                    underlineColorAndroid='transparent'
                />
                <TextInput
                    style={styles.textInput}
                    placeholder={'请输入密码'}
                    underlineColorAndroid='transparent'
                    secureTextEntry={true}
                    onChangeText={(pwd) => {
                        this.setState({ pwd })
                    }}
                />
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                        this._checkLogin();
                    }}
                >
                    <Text style={styles.loginButtonText}>点击登录</Text>
                </TouchableOpacity>

            </View>
        );
    }

    //处理登录
    _checkLogin() {
        // this.props.navigation.navigate('MainView');
        const userinfo = {
            name: this.state.name,
            pwd: this.state.pwd,
        }
        if (this.state.name == "" || this.state.pwd == "") {
            ToastAndroid.show("用户名或密码不能为空！", ToastAndroid.SHORT);
            return;
        }
        showHUDLoading();
        // setTimeout(() => {
        //     hidenHUDLoading();
            
        //     this.props.navigation.navigate('MainView');
        // }, 2000);
        LoginManager.checkLogin(userinfo, (result) => {
            if (result) {
                hidenHUDLoading();
                this.props.navigation.navigate('MainView');
            } else {
                ToastAndroid.show("用户名或密码错误！", ToastAndroid.SHORT);
                hidenHUDLoading();
            }
        });
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoView: {
        marginTop: 40,
    },
    logoText: {
        marginTop: 14,
        color: '#00a0e9',
        fontSize: 18,
        fontWeight: 'bold'
    },
    top: {
        flex: 2,
    },
    bottom: {
        flex: 2,
    },
    center: {
        flex: 2,
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 180,
    },
    textinput: {
        flex: 4,
    },
    btn: {
        backgroundColor: "#1aa7eb",
        borderRadius: 10,
        marginHorizontal: 10,

    },
    btntext: {
        color: "#fff",
        fontSize: 18,
        marginLeft: 180,

    },
    textborder: {
        fontSize: 18, borderWidth: 1, borderColor: '#1aa7eb', marginTop: 50, marginHorizontal: 10, borderRadius: 10,
    },
    textInput: {
        width: Dimensions.get('window').width - 40,
        paddingLeft: 10,
        marginTop: 20,
        borderRadius: 5,
        height: 44,
        borderWidth: 1,
        borderColor: 'gray',

    },
    loginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#00a0e9',
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
        height: 44,
    },
    loginButtonText: {
        flex: 1,
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

//make this component available to the app
export default LoginView;

