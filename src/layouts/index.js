import { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Layout, Icon, message, Card, Breadcrumb, } from 'antd';
import SiderMenu from "../components/SiderMenu/SiderMenu";
import { getMenuData } from '../common/menu';
import logo1 from '../assets/logo11.png';
import logo2 from '../assets/logo99.png';
import logo3 from '../assets/logo32.png';
import GlobalHeader from "../components/GlobalHeader";
import { getStorage, rmStorage } from '../services/utils';
import router from 'umi/router';

const { Content, Header, Footer } = Layout;


class BasicLayout extends PureComponent {
    constructor(props) {
        super(props);
        // console.log(localStorage.a)
        this.state = {
            collapsed: false,
            navList: []
        };
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        if (location.pathname == '/') {
            router.push('/procurement/planOrder');
        }
        // dispatch({
        //     type: 'user/currentUser',
        // });
    }

    handleMenuCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    //退出登录
    signOutClick = (userId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/loginOut',
            payload: {
                //userId: userId
            },
        }).then(res => {
            //if(res == 0){
                rmStorage('userInfo');
                router.push('/user/login');
            //}
        });
    };

    render() {
        const { children, location } = this.props;
        const { collapsed } = this.state;
        //const logo = collapsed ? logo1 : logo2;
        const logo = logo3;
        const menuData = getMenuData();
        const currentUrl = this.props.location.pathname;

        // console.log(getMenuData(),'pro')
        if (location.pathname == '/') {
            // return <div></div>
            router.push('/procurement/planOrder');
        }
        if (location.pathname == '/user/login' || location.pathname.indexOf('/exception/') >= 0 || location.pathname.indexOf('/activity/') >= 0) {
            return <div>{children}</div>
        }

        //面包屑
        const listNav = () => {
            let headers = []
            let num = 1
            const maps = (path) => {
                path.forEach(function (v, i) {
                    if (v.path.split('/')[num] === currentUrl.split('/')[num]) {
                        headers.push({ name: v.name, path: v.path })
                        if (v.children) {
                            num = 2
                            maps(v.children)
                        }
                    }
                })
            }
            maps(menuData);
            return (
                (headers.length ? <div className={'wtBc pt20 pb10 pl25 pr25'}>
                    <Breadcrumb>
                        {headers.map(d => <Breadcrumb.Item key={d.path}>{d.name}</Breadcrumb.Item>)}
                    </Breadcrumb>
                    {/* <h2 style={{ margin: 0, lineHeight: 1 }}>{headers[headers.length - 1].name}</h2> */}
                </div> : '')
            )
        }

        const PageTitle = () => {
            let title = [];
            let num = 1;
            const maps = (path) => {
                path.forEach((v) => {
                    if (v.path.split('/')[num] === currentUrl.split('/')[num]) {
                        num == 2 && title.unshift(v.name);
                        if (v.children) {
                            num = 2
                            maps(v.children)
                        }
                    }
                })
            };
            maps(menuData);
            return title.join(' - ') + ' - 捷记';
        }

        return (
            <DocumentTitle title={PageTitle()}>
                <Layout>
                    <SiderMenu
                        logo={logo}
                        collapsed={collapsed}
                        menuData={getMenuData()}
                        location={location}
                        onCollapse={this.handleMenuCollapse}
                    />
                    <Layout>
                        <Header style={{ padding: 0 }}>
                            <GlobalHeader
                                logo={logo}
                                collapsed={collapsed}
                                onCollapse={this.handleMenuCollapse}
                                signOutClick={this.signOutClick}
                            />
                        </Header>
                        <Content style={{minWidth:920}}>
                            {listNav()}
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </DocumentTitle>
        );
    }
}

export default connect(({ user, setting }) => ({
    user: user,
    ...setting,
}))(BasicLayout);
