import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Layout, Menu, Icon, Form, Input, Select, Button } from 'antd';
import Designer from './wfd';
import axios from 'axios';
import  {isEmpty} from 'lodash'
import { rawToData } from './util/protocolUtil';

const {Header, Footer, Sider, Content} = Layout;
const demoData = {
    nodes: [{id: 'startNode', x: 50, y: 200, label: '', clazz: 'start',},
            {id: 'taskNode', x: 150, y: 200, label: '审批', clazz: 'scriptTask',},
            {id: 'gatewayNode', x: 350, y: 200, label: '获取权限成功', clazz: 'gateway',},
            {id: 'endNode', x: 450, y: 200, label: '', clazz: 'end',}],
    edges: [{source: 'startNode', target: 'taskNode', sourceAnchor: 1, targetAnchor: 3, clazz: 'flow'},
            {source: 'taskNode', target: 'gatewayNode', sourceAnchor: 1, targetAnchor: 3, clazz: 'flow'},
            {source: 'gatewayNode', target: 'endNode', sourceAnchor: 1, targetAnchor: 3, clazz: 'flow'},
    ],
};

const height = 150;
class App extends React.Component {
    designerRef= undefined;

    state = {
        workflowData: undefined,

    };

    componentDidMount () {

    }

    handleSubmit = (e, target) => {
        e.preventDefault();
        console.log(e, target)
        axios.get(`https://www.fastmock.site/mock/e0f98190bbbc0813bc919a3a0bee31c8/workflow/workflow`)
             .then(res => {
                 const workflowData = res.data;
                 console.log(this.designerRef)
                 ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this.designerRef))
                 this.setState({ workflowData: rawToData(workflowData) });
             })
    };

    render () {
        const data = this.state.workflowData;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Layout>
                    <Sider collapsible collapsed={false} trigger={null} style={{height: '100vh'}}>
                        <div className="logo"/>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1">
                                <Icon type="pie-chart"/>
                                <span> 现有Workflow</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="plus"/>
                                <span> 新增Workflow</span>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{color: 'grey', 'font-size': 'large', 'font-weight': '900'}}>Workflow
                            Dashboard</Header>
                        <Content style={{height: 'calc(100vh - 135px)', bottom: '0', paddingTop: '100px'}}>
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <Form.Item label="workflow id">
                                    {getFieldDecorator('workflowQuery')(<Input
                                        type="text"
                                        style={{ width: '65%', marginRight: '3%' }}
                                    />)}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Designer ref={(ref) => {this.designerRef = ref }} data={data} height={height} isView/>
                        </Content>
                        <Footer style={{'text-align': 'center'}}>Workflow UI Created by 精益引擎</Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default Form.create({ name: 'customized_form_controls' })(App);
