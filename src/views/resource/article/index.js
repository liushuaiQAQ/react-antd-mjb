import React, { Component } from 'react'
import { getMediaList } from '@/axios/api';
import { Form, Input, Button, Select, Table, Divider, message } from 'antd';
import { object } from 'prop-types';

const { Option } = Select;

const columns = [
    {
        title: '操作',
        dataIndex: 'name',
        key: 'name',
        width: 180,
        render: (text) => {
            return (
                <div className="table-button">
                    <span>编辑</span>
                    <Divider type="vertical" />
                    <span>自发配置</span>
                    <Divider type="vertical" />
                    <span>下架</span>
                </div>
            )
        },
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 70
    },
    {
        title: '媒体名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '发布类型',
        dataIndex: 'publish_cate_list',
        key: 'publish_cate_list',
        ellipsis: true
    },
    {
        title: '收录',
        dataIndex: 'record_name',
        key: 'record_name',
    },
    {
        title: '结算价',
        dataIndex: 'settlement_price',
        key: 'settlement_price',
        width: 80
    },
    {
        title: '下单备注',
        dataIndex: 'remark',
        key: 'remark',
        ellipsis: true
    },
]

class ResourceArticle extends Component {
    state = {
        params: {},
        columns: [],
        tableData: [],
        totalCount: 0,
        tableLoading: false
    }

    render(){
        const { params } = this.state;
        const paginationProps = {
            page: params.page,
            onChange : (page) => this.handleTableChange(page),
            total: this.state.totalCount,
        }
        return (
            <div>
                <Form layout="inline">
                    <Form.Item label="媒体名称">
                        <Input value={this.state.params.title} name="title" onChange={this.changeSearchContent} />
                    </Form.Item>
                    <Form.Item label="案例地址">
                        <Input value={this.state.params.case_address} name="case_address" onChange={this.changeSearchContent} />
                    </Form.Item>
                    <Form.Item label="用户名">
                        <Select
                            value={this.state.params.member_id}
                            showSearch
                            style={{ width: 200 }}
                            name="member_id"
                            onChange={(e) => this.changeSearchMember(e, 'member_id')}
                        >
                            <Option value="1">Jack</Option>
                            <Option value="2">Lucy</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="收录效果">
                        <Select
                            value={this.state.params.record}
                            showSearch
                            style={{ width: 200 }}
                            name="member_id"
                            onChange={(e) => this.changeSearchMember(e, 'record')}
                        >
                            <Option value="1">200</Option>
                            <Option value="2">404</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <div className="button-wrap">
                    <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                    <Button type="primary">下载</Button>
                </div>

                <Table 
                    rowKey={ record => record.id } 
                    pagination={paginationProps} 
                    columns={columns} 
                    dataSource={this.state.tableData} 
                    loading={this.state.tableLoading}
                />
            </div>
        )
    }

    componentDidMount() {
        this.init();
    }

    init(){
        this.setState({ tableLoading: true })
        getMediaList(this.state.params).then(res => {
            this.setState({ tableLoading: false })
            if(res.code === 200){
                this.setState({ 
                    tableData: res.data.list,
                    totalCount: res.data.totalCount,
                    tableLoading: false 
                });
            }else{
                message.warning(res.message);
            }
        })
    }

    //分页
    handleTableChange = page => {
        let data = Object.assign({}, this.state.params, { page: page });
        this.setState({ params: data }, () => {
            this.init();
        });
    }

    changeSearchContent = (e) => {
        let key = e.target.name;
        let value = e.target.value;
        this.setFromState(key, value);
    }

    changeSearchMember = (value, key) => {
        this.setFromState(key, value);
    }

    setFromState = (key, value) =>{
        this.setState({
            params: Object.assign({}, this.state.params, { [key]: value })
        })
    }

    //搜索
    handleSearch = () => {
        this.init();
    }
}

export default ResourceArticle;