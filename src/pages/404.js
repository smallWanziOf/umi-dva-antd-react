import { Button } from "antd";
import router from "umi/router";

export default () => {
    return (
        <div className={'pt50'}>
            <div className={'page404Img mgAuto'} style={{backgroundImage: 'url(https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg)'}} ></div>
            <div className={'mt20 fz30 ac'}>您访问的页面不存在</div>
            <Button type="primary" size="large" className={'mgAuto block mt20'} onClick={() => router.goBack() }>返回</Button>
        </div>
    );
};