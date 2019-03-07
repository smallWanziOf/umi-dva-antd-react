
// ref: https://umijs.org/config/
export default {
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: true,
            title: 'jsb-scm',
            dll: false,
            locale: {
                enable: true, // default false
                default: 'zh-CN', // default zh-CN
                baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
            },
            hardSource: false,
            routes: {
                exclude: [
                    /components/,
                ],
            },
        }],
    ],
    proxy: {
        // '/data': {
        //     target: 'http://172.16.5.23:9090',
        //     changeOrigin: true,
        //     // pathRewrite: { '^/server': '' },
        // },
        '/scm/': {
            // target: 'http://data.paat.net',
            // target: 'http://172.16.5.23:9090',
            target: 'http://jieji.paat.org',
            // target: 'http://172.16.5.23:9090',
            changeOrigin: true,
           // pathRewrite: { '^/app': '' },
        }

    },
    targets: {
        ie: 11,
    },
    externals:{
        'BMap':'BMap'
    },
    hash: true
}
