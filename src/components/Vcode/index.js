import React, { Component } from 'react';
import { Button } from 'antd';

import styles from './index.less'

class VCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.initState()
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        // let codes = [];
        // for(let i = 49 ;i <= 150; i++){
        //     codes.push(String.fromCharCode(i));
        // }
        // console.log(codes.join(''));
    }

    getRandom(max, min, num) {
        const asciiNum = ~~(Math.random() * (max - min + 1) + min)
        if (!Boolean(num)) {
            return asciiNum
        }
        const arr = []
        for (let i = 0; i < num; i++) {
            arr.push(this.getRandom(max, min))
        }
        return arr
    }

    //获取验证码字符
    getRndCode = () => {
        const codes = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        // let aa = [];
        // for(let i = 0; i < codes.length; i++){
        //     aa.push(codes.substr(i, 1));
        // }
        // console.log(aa)
        let d = [];
        for(let i = 0; i < 4; i++){
            d.push( codes.substr(parseInt(Math.random() * 61) - 1, 1) );
        }
        // console.log(d)
        return d;
    }

    initState() {
        const data = this.getRndCode();     //this.getRandom(109, 48, 4)
        const rotate = this.getRandom(35, -35, 4)
        const fz = this.getRandom(20, 28, 4)
        const color = [this.getRandom(100, 255, 3), this.getRandom(100, 255, 4), this.getRandom(100, 255, 3), this.getRandom(100, 255, 3)]
        this.codeimgs(data);
        return { data, rotate, fz, color }
    }

    codeimgs(data) {
        // const datas = data.map((v) => {
        //     return String.fromCharCode(v > 57 && v < 84 ? v + 39 : (v <= 57 ? v : v + 13))
        // })
        const { imgCode } = this.props;
        imgCode(data);
        console.log(data)
    }

    onCode = () => { this.setState({ ...this.initState() }) }


    render() {
        const { data, rotate, fz, color } = this.state
        return (
            <Button size="large" block onClick={this.onCode}>
            <div className={styles.vcodewrap + ' flexBox flexSpace pl5 pr5'}>
                {data.map((v, i) =>
                    <div
                        key={i}
                        className={styles.itemStr}
                        style={{
                            transform: `rotate(${rotate[i]}deg)`,
                            fontSize: `${fz[i]}px`,
                            color: `rgb(${color[i].toString()})`
                        }}
                    >   
                        {v}
                        {/* {String.fromCharCode(v > 57 && v < 84 ? v + 7 : (v < 57 ? v : v + 13))} */}
                    </div>
                )}
                <div className={styles.mask} />
            </div>
            </Button>
        )
    }
}

export default VCode;