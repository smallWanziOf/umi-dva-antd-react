/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
    return reg.test(path);
}

const menuData = [
    {
        name: '采购管理',
        icon: 'database',
        path: 'procurement',
        children: [
            {
                name: '采购计划单',
                path: 'planOrder',
            },{
                name: '采购单',
                path: 'orderList'
            }
        ],
    },
    {
        name: '供应商管理',
        icon: 'solution',
        path: 'supplierManage',
        children: [
            {
                name: '供应商名单',
                path: 'supplierList',
            }
        ],
    },
    {
        name: '商品管理',
        icon: 'appstore',
        path: 'productManage',
        children: [
            {
                name: '商品信息',
                path: 'productList',
            }
        ],
    },
    // {
    //     name: '销售管理',
    //     icon: 'appstore',
    //     path: 'salesManage',
    //     children: [
    //         {
    //             name: '客户信息',
    //             path: 'customerMessage',
    //         }
    //     ],
    // },
    // {
    //     name: '客户数据',
    //     icon: 'database',
    //     path: 'customers',
    //     children: [
    //         {
    //             name: '客户列表',
    //             path: 'list',
    //         }
    //     ],
    // },
    // {
    //     name: '合同模板',
    //     icon: 'solution',
    //     path: 'contract',
    //     children: [
    //         {
    //             name: '合同模板',
    //             path: 'list',
    //         },
    //     ],
    // },
    // {
    //     name: '档案库',
    //     icon: 'file-text',
    //     path: 'files',
    //     children: [
    //         {
    //             name: '公司档案管理',
    //             path: 'company',
    //         },
    //         {
    //             name: '档案类型管理',
    //             path: 'type',
    //         },
    //     ],
    // },
    // {
    //     name: '公司档案管理',
    //     icon: 'layout',
    //     path: 'company',
    //     children: [
    //         {
    //             name: '公司档案管理',
    //             path: 'companylist',
    //         },
    //     ],
    // },
    // {
    //     name: '档案类型管理',
    //     icon: 'appstore',
    //     path: 'filetype',
    //     children: [
    //         {
    //             name: '合同模板',
    //             path: 'typelist',
    //         },
    //     ],
    // },
    // {
    //     name: '邮箱库',
    //     icon: 'mail',
    //     path: 'mail',
    //     children: [
    //         {
    //             name: '群发任务管理',
    //             path: 'list',
    //         },
    //         {
    //             name: '邮件模板',
    //             path: 'template',
    //         },
    //         {
    //             name: '邮箱管理',
    //             path: 'mails',
    //         },
    //     ],
    // },
    // {
    //     name: '园区企业库',
    //     icon: 'bank',
    //     path: 'campus',
    //     children: [
    //         {
    //             name: '园区企业库',
    //             path: 'list',
    //         },
    //     ],
    // },
];

function formatter(data, parentPath = '/', parentAuthority) {
    return data.map(item => {
        let { path } = item;
        if (!isUrl(path)) {
            path = parentPath + item.path;
        }
        const result = {
            ...item,
            path,
            authority: item.authority || parentAuthority,
        };
        if (item.children) {
            result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
        }
        return result;
    });
}

export const getMenuData = () => formatter(menuData);
