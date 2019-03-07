import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Upload , Message , Icon , Button , Modal} from 'antd';
import { uploadAction } from '@/services/setting';
import styles from './index.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const ProductModal = Form.create()(props => {

    const {
        form: { getFieldDecorator },
        data: { editProduct:{commodityInfoVO,supplierInfoList} , supplierList},
        modalType,
        //fileList,
        //setFileList
    } = props;

    if(modalType !== 'add'){
        if(!commodityInfoVO){
            return false;
        }
    }

    // let tempFile = modalType !== 'add'?{
    //     fileId:commodityInfoVO.fileId,
    //     fileName:commodityInfoVO.fileName,
    //     fileFormat:commodityInfoVO.fileFormat
    // }:[];

    // const uploadProps = {
    //     //name: 'file',
    //     multiple: true,
    //     listType:"picture",
    //     action: uploadAction,
    //     onChange(info) {
    //         const status = info.file.status;
    //         if (status !== 'uploading') {
    //             //console.log(info.file, info.fileList);
    //         }
    //         if (status === 'done') {
    //             Message.success(`${info.file.name} 上传成功`);
    //             let { response } = info.fileList.pop();
    //             tempFile = {
    //                 fileId:response.fileId,
    //                 fileName:response.fileName,
    //                 fileFormat:response.extName
    //             };
    //         } else if (status === 'error') {
    //             Message.error(`${info.file.name} 上传失败`);
    //         }
    //     },
    //     //showUploadList:{showRemoveIcon:false},
    //     defaultFileList:modalType === "add"?[]:fileList,
    //     disabled:modalType === "add"?false:fileList.length>0?true:false,
    //     onRemove: () => {
    //         setFileList([])
    //     }
    // };

    const Dragger = Upload.Dragger;

    // if( modalType === "add"){
    //     debugger
    //     props.form.resetFields();
    // }

    // 表单提交
    const handleSearch = e => {
        e.preventDefault();
        const { dispatch, form } = props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let param = {
                ...fieldsValue,
                //...tempFile
            }
            if(param['purchasePriceStr']){
                param['purchasePriceStr'] = parseFloat(param['purchasePriceStr']);
            }
            props.onCancel()
            if(modalType == 'add'){
                props.addProduct(param);
            }else{
                param['id'] = commodityInfoVO.id
                props.editSaveProduct(param);
            }
            
        });
    };

    const handleChange = () => {

    }

    const handleImgCancel = () => {
        props.handleImgCancel()
    }

    const handlePreview = (file) => {
        props.handlePreview(file)
    }

    const handleImgChange = (info) => {
        props.handleImgChange(info);
    }

    const { previewVisible, previewImage, fileList } = props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传商品图片</div>
      </div>
    );

    return (
        <Form onSubmit={handleSearch} layout="vertical" >
            <h3><b>基础信息</b></h3>
            <div className="ant-divider ant-divider-horizontal mt10"></div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="商品名称">
                        {getFieldDecorator('commodityName',{
                                initialValue:modalType === "add"?'':commodityInfoVO.commodityName,
                                rules: [{ required: true, message: '请输入商品名称' }],
                            })(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                    <FormItem label="计量单位">
                        {getFieldDecorator('measureUnit',{
                                initialValue:modalType === "add"?'':commodityInfoVO.measureUnit,
                            })(
                            <Input placeholder="请输入计量单位" />
                        )}
                    </FormItem>
                    <FormItem label="采购单价">
                        {getFieldDecorator('purchasePriceStr',{
                                initialValue:modalType === "add"?'':commodityInfoVO.purchasePriceStr,
                            })(
                            <Input placeholder="请输入采购单价" />
                        )}
                    </FormItem>
                    <FormItem label="供应商">
                        {getFieldDecorator('supplierId',{
                                initialValue:(modalType === "add" )?'':commodityInfoVO.supplierId,
                                rules: [{ required: true, message: '请选择供应商' }],
                            })(
                            <Select onChange={handleChange}>
                                {
                                    supplierList.length>0?
                                    supplierList.map( (item,k) => {
                                        return <Option value={item.supplierId} key={item.supplierId}>{item.companyName}</Option>
                                    })
                                    :
                                    <Option value={'null'}></Option>
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="商品编码">
                        {getFieldDecorator('commodityCode',{
                                initialValue:modalType === "add"?'':commodityInfoVO.commodityCode,
                            })(
                            <Input placeholder="请输入商品编码" />
                        )}
                    </FormItem>
                    <FormItem label="规格/型号">
                        {getFieldDecorator('commodityModel',{
                                initialValue:modalType === "add"?'':commodityInfoVO.commodityModel,
                            })(
                            <Input placeholder="请输入规格/型号" />
                        )}
                    </FormItem>
                    <FormItem label="生产厂家">
                        {getFieldDecorator('manufacturer',{
                                initialValue:modalType === "add"?'':commodityInfoVO.manufacturer,
                            })(
                            <Input placeholder="请输入生产厂家" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    {/* <Dragger {...uploadProps} >
                        <p className="ant-upload-drag-icon">
                            <Icon type="upload" />
                        </p>
                        <p className="ant-upload-text">点击上传商品图片</p>
                        <p className="ant-upload-hint"></p>
                    </Dragger> */}
                    <Upload
                        action={uploadAction}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleImgChange}
                        changeStatus={props.changeStatus}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={handleImgCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24} className={"ar"}>
                    <Button type="default" className={'mr10'} onClick={props.onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit" >提交</Button>
                </Col>
            </Row>
            {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="联系方式">
                        {getFieldDecorator('connectWay')(
                            <Input placeholder="请输入联系方式" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <Button type="primary" htmlType="submit" className={'mr10'}>查询</Button>
                    <Button type="default">重 置</Button>
                </Col>
            </Row> */}
        </Form>
    );

})

export default ProductModal;