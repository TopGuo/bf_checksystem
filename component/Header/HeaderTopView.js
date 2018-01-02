//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
//定义一个事件接口onEvent
// create a component
class HeaderTopView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
        }
    }
    render() {
        let textStyle1 = styles.bluetext;
        let textStyle2 = styles.blacktext;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.view}
                    onPress={() => {
                        this.setState({
                            selectIndex:0,
                        });
                        this.props.onEvent(1);
                    }}
                >
                    <Text style={this.state.selectIndex==0?textStyle1:textStyle2}>宿舍卫生</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.view}
                    onPress={() => {
                        this.setState({
                            selectIndex:1,
                        });
                        this.props.onEvent(2);
                    }}
                >
                    <Text style={this.state.selectIndex==1?textStyle1:textStyle2}>教室卫生</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        height: 60,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        backgroundColor:'#dcdcdc',

    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bluetext: {
        fontSize: 15,
        color: '#00a0e9',
    },
    blacktext: {
        fontSize: 15,
        color: '#2c2c2c',
    }
});

//make this component available to the app
export default HeaderTopView;
