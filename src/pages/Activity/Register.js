import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Icon, Input, Button, Tabs, Form, Checkbox, message, Row, Col, Spin } from 'antd';
import styles from './Register.less';
import '../../services/mobileWidth';

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/addUser'],
}))

@Form.create()
class Register extends PureComponent {
    constructor(props) {
        super(props);
        // console.log(localStorage.a)
        this.state = {
            collapsed: false,
            queryInfo: {},
        };
    }
    //初始化
    componentDidMount() {
        const { dispatch, location: { query } } = this.props;
        console.log(query)
        this.setState({ queryInfo: query });
    }

    handleSubmit = (e) => {
        const { queryInfo } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.emailId = queryInfo.emailId;
                values.email = queryInfo.email;
                // console.log(values);
                // return;
                this.props.dispatch({
                    type: 'login/addUser',
                    payload: values
                }).then(res => {
                    if(res.state == 0){
                        message.success('提交成功，您的捷税官会第一时间和您联系');
                        this.props.form.resetFields();
                        setTimeout(function(){
                            window.location.href = 'http://www.jieshui8.com/';
                        }, 1500);
                    }
                });
            }
        })
    }

    render() {
        const { form: { getFieldDecorator }, submitting } = this.props;
        const { queryInfo } = this.state;
        return (
            <div className={styles.main + ' mgAuto'}>
                <div className={styles.logo}>
                    <img src={require('../../assets/activity/Logo.png')} className={'block'} />
                </div>
                <div className={styles.banner}></div>
                <div className={styles.form + ' flexBox flexVertical flexJtfCen flexAgCen'}>
                    <Form onSubmit={this.handleSubmit} className={styles.regForm}>
                        <FormItem>
                            {getFieldDecorator('customName', {
                                rules: [{ required: true, message: '请输入您的姓名' }, { max: 10, message: '姓名最多十个字' }],
                            })(
                                <Input size='large' prefix={<div className={styles.iconUser}></div>} type="tel" placeholder="您的姓名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('tel', {
                                rules: [{ required: true, message: '请输入您的电话' }],
                            })(
                                <Input size='large' prefix={<div className={styles.iconTel}></div>} type="text" placeholder="您的电话" />
                            )}
                        </FormItem>
                        <Button type="primary" htmlType="submit" className={styles.button + ' mt5'} block>获取专属捷税官</Button>
                    </Form>
                </div>
                <div className={styles.footer + ' ac pt20 pb30'}>普道（上海）信息科技有限公司</div>
                <Spin spinning={!!submitting} />
            </div>
        );
    }

}

export default Register;