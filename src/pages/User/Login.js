import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Layout, Menu, Breadcrumb, Icon, Input, Button, Tabs, Form, Checkbox, message, Row, Col, Spin } from 'antd';
// import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './Login.less';
import Vcode from '@/components/Vcode';
import { isMobile, setStorage } from '../../services/utils'
const { Header, Content, Footer } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

message.config({
    top: 200
})

@connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login'],
}))

@Form.create()
class Login extends PureComponent {

    state = {
        notice: '',
        type: 'tab2',
        autoLogin: true,
        codeinput: '',
        imgCodes: '',
        downSeconds: 0
    };

    componentWillUnmount() {
        this.downTimer && clearTimeout(this.downTimer);
    };

    downTimer = '';

    //登录表单提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // if (values.userName === 'user') {
                //     if (values.password === 'user') {
                //         router.push('/')
                //     } else {
                //         message.error('密码应为user');
                //     }
                // } else {
                //     message.error('账号应为user');
                // }
                delete values.imgCode;
                const { dispatch } = this.props;
                // const formData = new FormData();
                // formData.append("tel",values.tel);
                // formData.append("checkCode",values.code);
                dispatch({
                    type: 'login/login',
                    payload: {
                        tel:values.tel,
                        checkCode:values.code
                    },
                }).then(res => {
                    if (res.state) {
                        message.error(res.msg);
                    } else {
                        setStorage('userInfo', res.resultInfo);
                        message.success(res.msg)
                        router.push('/procurement/planOrder');
                    }
                });
                /*const me = this;
                const formData = new FormData();
                formData.append("tel",values.tel);
                formData.append("checkCode",values.code);
                fetch(`http://jieji.paat.org//scm/login/login`,{
                    method: "post",
                    body:formData
                }).then(res=>{
                    return res.json();
                }).then(data=>{
                    debugger
                    if(data.state != 0){
                        message.error(data.msg)
                    }else{
                        message.success(data.msg)
                        router.push('/procurement/planOrder');
                    }
                }).catch(err=>{
                })*/

            }
        });
    }

    imgCode = (data) => {
        let codes = data.join('').toLowerCase();
        this.setState({
            imgCodes: codes,
        });
        // console.log(codes);
    }

    onRef = (ref) => {
        this.child = ref
    }

    //手机号格式验证
    mobileValidator = (rule, value, call) => {
        if (!value) call();
        if (isMobile(value)) {
            call();
        } else {
            call(new Error());
        }
    }

    //输入的图形码
    onCode = (e) => {
        const { value } = e.target;
        this.setState({
            codeinput: value,
        });
    }

    //倒计时
    downTime = (time) => {
        time--;
        this.setState({ downSeconds: time });
        if (time < 1) {
            return;
        }
        this.downTimer = setTimeout(() => {
            this.downTime(time);
        }, 1000);
    }

    //获取手机验证码
    onGetCaptcha = () => {
        this.props.form.validateFields(['tel'], {}, (err, values) => {
            // console.log(err)
            // console.log(values)
            if (err) {
                return;
            } else {
                const { codeinput, imgCodes } = this.state;
                // console.log(codeinput,imgCodes,'codeinput')
                if (imgCodes !== codeinput.toLowerCase()) {
                    message.error('验证码错误');
                    this.child.onCode()
                    return
                }
                //const formData = {"tel":values.tel};
                //formData.append("tel",values.tel)
                //console.log(formData)
                const { dispatch } = this.props;
                dispatch({
                    type: 'login/getPhonecode',
                    payload: {
                        tel:values.tel
                    }
                }).then(res => {
                    if (res.state !=0 ) {
                        message.error(res.msg);
                    } else {
                        this.downTime(121);
                    }
                });
                /*const me = this;
                const formData = new FormData();
                formData.append("tel",values.tel)
                fetch(`http://jieji.paat.org/scm/login/sendCheckCode`,{
                    method: "post",
                    body:formData
                }).then(res=>{
                    return res.json();
                }).then(data=>{
                    if(data.state != 0){
                        message.error(data.msg)
                    }else{
                        me.downTime(121);
                    }
                }).catch(err=>{
                })*/
            }
        });
    };

    render() {
        const { form: { getFieldDecorator }, submitting } = this.props;
        const { downSeconds } = this.state;
        // console.log(submitting)
        return (
            <DocumentTitle title='登录 - 捷记'>
                <div className={styles.login}>
                    <Layout className={styles.layout}>
                        <Content>
                            <div className={styles.top}>
                                <div className={styles.logo}></div>
                                <p>浦东新区最具影响力的企服数据平台</p>
                            </div>
                            <Tabs defaultActiveKey="1" className={styles.tabs} animated={false}>
                                <TabPane tab="快捷登录" key="1">
                                    <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                                        <FormItem className={'mt20'}>
                                            {getFieldDecorator('tel', {
                                                rules: [{ required: true, message: '请输入手机号码' }, { validator: this.mobileValidator, message: '手机号码格式不正确' }],
                                            })(
                                                <Input size='large' prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} type="tel" placeholder="手机号" />
                                            )}
                                        </FormItem>
                                        <Row>
                                            <Col span={15}>
                                                <FormItem>
                                                    {getFieldDecorator('imgCode', {
                                                        rules: [{ required: true, message: '请输入图片验证码' }],
                                                    })(
                                                        <Input size='large' onChange={this.onCode} prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="输入图片验证码" />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={9} className={'pl10'}>
                                                <Vcode imgCode={this.imgCode.bind(this)} onRef={this.onRef} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={15}>
                                                <FormItem>
                                                    {getFieldDecorator('code', {
                                                        rules: [{ required: true, message: '请输入手机验证码' }],
                                                    })(
                                                        <Input size='large' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="输入手机验证码" />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={9} className={'pl10'}>
                                                <Button size="large" block onClick={this.onGetCaptcha} disabled={downSeconds > 0}>{downSeconds > 0 ? downSeconds : '获取验证码'}</Button>
                                            </Col>
                                        </Row>
                                        <Button type="primary" size='large' htmlType="submit" className={styles.loginFormButton}>
                                            登录
                                    </Button>
                                    </Form>
                                </TabPane>
                                <TabPane tab="账户密码登录" key="2" disabled >
                                    {/* <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                                    <FormItem>
                                        {getFieldDecorator('userName', {
                                            rules: [{ required: true, message: 'Please input your username!' }],
                                        })(
                                            <Input size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入账号" />
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: 'Please input your Password!' }],
                                        })(
                                            <Input size='large' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
                                        )}
                                    </FormItem>
                                    <Button type="primary" size='large' htmlType="submit" className={styles.loginFormButton}>
                                        登录
                                    </Button>
                                </Form> */}
                                </TabPane>
                            </Tabs>
                        </Content>
                        <Footer className={styles.footer + ' mt20'}>
                            Copyright <Icon type="copyright" /> 2018 普道企服体验技术部出品
                        </Footer>
                    </Layout>
                    <Spin spinning={!!submitting} />
                </div>
            </DocumentTitle>
        );
    }
}

export default Login;