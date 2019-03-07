import request from './http';
import { OrderStatusList } from './setting';

// /*查询*/
// export async function getInfo(params) {
//   // console.log('查询')
//   return result.post(`/data/entInfo/getEntInfoList`, params);
// }

// 发送验证码
export async function loginCode(params) {
    return request(`/data/login/code`, {
        method: 'POST',
        body: {
            tel: params,
            'codeFlag': '1001'
        },
    });
}

// 验证码登录
export async function loginByTel(params) {
    return request(`/scm/login/login`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 查询客户列表
export async function getInfo(params) {
    console.log('查询')
    return request(`/data/entInfo/getEntInfoList`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 客服列表-删除
export async function removeInfo(params) {
    return request(`/paatData/entInfo/removeInfo`, {
        method: 'POST',
        body: params,
    });
}

// 城市
export async function getCity() {
    return request(`/data/common/address`);
}

// 获取合同列表信息
export async function contractList(params) {
    return request(`/data/contract/getList`, {
        method: 'POST',
        body: params,
    });
}

// 添加+编辑合同
export async function contractAdd(params) {
    return request(`/data/contract/add`, {
        method: 'POST',
        body: params,
    });
}

// 合同模板 - 操作日志
export async function getLogList(params) {
    return request(`/data/contract/getLogList${params}`);
}

// 保存客户信息
export async function saveInfo(params) {
    return request(`/data/entInfo/saveEntInfo`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 下载量
export async function downloads(params) {
    return request(`/data/contract/download?id=${params}`);
}

// export async function ossAuth() {
//     return request(`http://oss.paat.com/oss/auth`, {
//         header: {
//             'accept': 'application/json',
//             'appid': 'data-lake'
//         }
//     });
// }

// 退出登录
export async function loginOut(params) {
    console.log(params)
    return request(`/scm/login/logout`, {
        method: 'POST',
        params: params,
    });
}

// 查询邮件信息
export async function emailList(params) {
    return request(`/data/email/getList`, {
        method: 'POST',
        body: params,
    });
}

// 新建邮件发送任务
export async function emailAdd(params) {
    return request(`/data/email/add`, {
        method: 'POST',
        body: params,
    });
}

// 查询邮件统计信息（邮箱总数、邮件已读数量、邮件激活用户数量）
export async function emailCount(params) {
    return request(`/data/email/count`, {
        method: 'POST',
        body: params,
        postType: 2,
    });
}

// 添加编辑邮件模板
export async function emailTemplateAdd(params) {
    return request(`/data/emailTemplate/add`, {
        method: 'POST',
        body: params,
    });
}

// 查询邮件模板
export async function emailTemplateList(params) {
    return request(`/data/emailTemplate/getList`, {
        method: 'POST',
        body: params,
    });
}

// 邮箱注册用户列表查询
export async function emailRegList(id, params) {
    return request(`/data/email/registerList/${id}`, {
        method: 'POST',
        body: params,
    });
}

// 公司档案管理 园区模糊查询
export async function epInfo(params) {
    return request(`/data/company/epInfo`, {
        method: 'POST',
        body: params,
        postType: 2,
    });
}

// 选择OCR类型时带出固定字段
export async function ocrField(params) {
    return request(`/data/archivesType/ocrField`, {
        method: 'GET',
        params: params,
    });
}

// 档案类型添加
export async function archivesTypeAdd(params) {
    return request(`/data/archivesType/add`, {
        method: 'POST',
        body: params,
    });
}

// 根据Id查询档案类型
export async function archivesTypeById(params) {
    return request(`/data/archivesType/byId`, {
        method: 'GET',
        params: params,
    });
}

// check档案类型字段是否可以删除
export async function checkField(params) {
    return request(`/data/archivesType/checkField`, {
        method: 'GET',
        params: params,
    });
}

// 查询档案类型信息列表
export async function archivesTypeList(params) {
    return request(`/data/archivesType/getList`, {
        method: 'POST',
        body: params,
    });
}

// check档案类型是否可以删除
export async function checkDelete(params) {
    return request(`/data/archivesType/checkDelete`, {
        method: 'GET',
        params: params,
    });
}

// 删除档案类型
export async function archivesTypeDel(params) {
    return request(`/data/archivesType/delete`, {
        method: 'GET',
        params: params,
    });
}

// 公司列表查询
export async function companyList(params) {
    return request(`/data/company/getList`, {
        method: 'POST',
        body: params,
    });
}

// 查询公司信息
export async function companyInfo(params) {
    return request(`/data/company/companyInfo`, {
        method: 'POST',
        body: params,
        postType: 2,
    });
}

// 公司档案列表
export async function getArchivesList(params) {
    return request(`/data/company/getArchivesList`, {
        method: 'POST',
        body: params,
    });
}

// 根据公司的档案Id查询公司档案信息
export async function byIdArchives(params) {
    return request(`/data/company/byIdArchives`, {
        method: 'POST',
        body: params,
        postType: 2,
    });
}

// 档案类型下拉
export async function listType(params) {
    return request(`/data/company/listType/${params.id}`, {
        method: 'POST',
        body: () => { delete params.id;return params},
        postType: 2,
    });
}

// 新增公司档案 选择档案Id带出档案信息
export async function selectArchivesFiled(params) {
    return request(`/data/company/selectArchivesFiled`, {
        method: 'POST',
        body: params,
        postType: 2,
    });
}

// 新增 编辑公司档案信息
export async function addArchives(params) {
    return request(`/data/company/addArchives`, {
        method: 'POST',
        body: params,
    });
}

// 删除档案文件
export async function deleteFile(params) {
    return request(`/data/company/deleteFile`, {
        method: 'POST',
        body: params,
        postType: 2,
    });
}

// 档案文件列表
export async function downloadFile(params) {
    return request(`/data/company/downloadFile`, {
        method: 'POST',
        body: params,
        postType: 2,
    });
}

// 邮件： 客户提交信息
export async function addUser(params) {
    return request(`/data/email/addUser`, {
        method: 'POST',
        body: params,
    });
}

// 加载采购计划单的数据
export async function procurementList(params) {
    // ToDO 修改接口
    return request(`/data/email/getList`, {
        method: 'POST',
        body: params,
    });
}


/***************************************************销售管理 */

// 客户信息-查询goPage
export async function customerMessageGoPage(params) {
    // ToDO 修改接口
    return request(`/scm/customerInfo/goPage`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 客户信息-查询条数
export async function customerMessageTotal(params) {
    // ToDO 修改接口
    return request(`/scm/customerInfo/search`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 客户信息-编辑客户信息
export async function editSaveCustomer(params) {
    // ToDO 修改接口
    return request(`/scm/customerInfo/editSave`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 客户信息-新建客户信息
export async function addCustomer(params) {
    // ToDO 修改接口
    return request(`/scm/customerInfo/save`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 客户信息-编辑回显
export async function customerEdit(params) {
    // ToDO 修改接口
    return request(`/scm/customerInfo/editShow`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 客户信息-员工导出
export async function importCustomer(params) {
    // ToDO 修改接口
    return request(`/scm/customerInfo/expertExcel`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 客户信息-批量删除
export async function deleteCustomer(params) {
    // ToDO 修改接口
    return request(`/scm/customerInfo/batchDelete`, {
        method: 'POST',
        body: params,
        postType:2
    });
}



/***************************************************商品管理 */

// 商品信息-查询goPage
export async function productMessageGoPage(params) {
    // ToDO 修改接口
    return request(`/scm/commodityInfo/goPage`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 商品信息-查询条数
export async function productMessageTotal(params) {
    // ToDO 修改接口
    return request(`/scm/commodityInfo/search`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 商品信息-编辑商品信息
export async function editSaveProduct(params) {
    // ToDO 修改接口
    return request(`/scm/commodityInfo/editSave`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 商品信息-新建商品信息
export async function addProduct(params) {
    // ToDO 修改接口
    return request(`/scm/commodityInfo/save`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 商品信息-编辑回显
export async function productEdit(params) {
    // ToDO 修改接口
    return request(`/scm/commodityInfo/editShow`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 商品信息-商品导出
export async function importProduct(params) {
    // ToDO 修改接口
    return request(`/scm/commodityInfo/expertExcel`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 商品信息-批量删除
export async function deleteProduct(params) {
    // ToDO 修改接口
    return request(`/scm/commodityInfo/batchDelete`, {
        method: 'POST',
        body: params,
        postType:2
    });
}


/***************************************************供应商管理 */

// 供应商信息-查询goPage
export async function supplierMessageGoPage(params) {
    // ToDO 修改接口
    return request(`/scm/supplierInfo/goPage`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 供应商信息-查询条数
export async function supplierMessageTotal(params) {
    // ToDO 修改接口
    return request(`/scm/supplierInfo/search`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 供应商信息-编辑保存
export async function editSaveSupplier(params) {
    // ToDO 修改接口
    return request(`/scm/supplierInfo/editSave`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 供应商信息-新增保存
export async function addSupplier(params) {
    // ToDO 修改接口
    return request(`/scm/supplierInfo/save`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 供应商信息-编辑回显
export async function supplierEdit(params) {
    // ToDO 修改接口
    return request(`/scm/supplierInfo/editShow`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 供应商信息-导出
export async function importSupplier(params) {
    // ToDO 修改接口
    return request(`/scm/supplierInfo/expertExcel`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 供应商信息-批量操作-删除
export async function deleteSupplier(params) {
    // ToDO 修改接口
    return request(`/scm/supplierInfo/batchDelete`, {
        method: 'POST',
        body: params,
        postType:2
    });
}


/***************************************************采购计划 */

// 采购计划列表页-查询goPage
export async function procureMessageGoPage(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/goPage`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-查询search
export async function procureMessageTotal(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/search`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划/采购订单列表页-批量操作-删除
export async function batchDelete(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/batchDelete`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-转为进货单按钮
export async function changeOrderStatus(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/changeStatus`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-编辑回显-列表
export async function planOrderEditShow(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/editShow`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-编辑回显-查询条目数
export async function planOrderEditShowTotal(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/searchDetail`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-编辑回显后-删除
export async function planOrderEditDelete(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/delete`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-编辑回显后-批量操作-删除
export async function planOrderEditDeleteAll(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/batchDeleteDetail`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-编辑回显后-批量操作-删除
export async function planOrderSubmit(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/save`, {
        method: 'POST',
        body: params,
    });
}

// 采购计划列表页-添加商品按钮-列表商品信息（根据供应商id/+商品名称）
export async function addPlanProductList(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/findCommodity`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-添加商品按钮-列表商品信息（根据供应商id/+商品名称）
export async function addPlanProductListTotal(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/findCommodityCount`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购计划列表页-加入计划按钮
export async function addPlanOrder(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/joinPlan`, {
        method: 'POST',
        body: params,
        postType:2
    });
}


// 采购订单列表页-查询goPage
export async function procureOrderList(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/goPage`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购订单列表页-查询search
export async function procureOrderListTotal(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/search`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购订单详情页-编辑回显
export async function procureOrderEditShow(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/editShowDetail`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 付款确认页
export async function procuremetPay(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/payConfirm`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 入库确认页
export async function procuremetWareHouse(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderDetailInfo/receiverConfirm`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

// 采购订单列表页-导出
export async function procuremeExpertExcel(params) {
    // ToDO 修改接口
    return request(`/scm/purchaseOrderInfo/expertExcel`, {
        method: 'POST',
        body: params,
        postType:2
    });
}

/***************************************************通用API */

// 商品信息-新增商品时-下拉供应商列表
export async function getSupplierInfoList() {
    return request(`/scm/common/getSupplierInfoList`, {
        method: 'POST',
    })
}

// 客户信息-新增客户时-下拉地址列表
export async function getAddressList() {
    return request(`/scm/common/getAddressList`, {
        method: 'POST',
    })
}

// 获取短信验证码
export async function getPhoneCode(params){
    return request(`/scm/login/sendCheckCode`, {
        method: 'POST',
        body: params,
        postType:2
    })
}