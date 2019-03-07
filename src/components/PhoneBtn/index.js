import React, { Component } from 'react'

import styles from './index.less'

class PhoneBtn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.initState()
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    render() {
        const { data, rotate, fz, color } = this.state
        return (
            <Button size="large" block onClick={this.prop.onGetCaptcha}>获取验证码</Button>
        )
    }
}

export default PhoneBtn;