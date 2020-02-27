import React from 'react';
import './App.css';
import { Layout, Menu, Icon } from 'antd';
import Designer from './wfd';

const { Header, Footer, Sider, Content } = Layout;
const data1 = {
    nodes: [{ id: 'startNode1', x: 50, y: 200, label: '', clazz: 'start', },
            { id: 'startNode2', x: 50, y: 320, label: '', clazz: 'timerStart', },
            { id: 'taskNode1', x: 200, y: 200, label: '主任审批', clazz: 'userTask',  },
            { id: 'taskNode2', x: 400, y: 200, label: '经理审批', clazz: 'scriptTask', },
            { id: 'gatewayNode', x: 400, y: 320, label: '金额大于1000', clazz: 'gateway',  },
            { id: 'taskNode3', x: 400, y: 450, label: '董事长审批', clazz: 'receiveTask', },
            { id: 'catchNode1', x: 600, y: 200, label: '等待结束', clazz: 'signalCatch', },
            { id: 'endNode', x: 600, y: 320, label: '', clazz: 'end', }],
    edges: [{ source: 'startNode1', target: 'taskNode1', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
            { source: 'startNode2', target: 'gatewayNode', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
            { source: 'taskNode1', target: 'catchNode1', sourceAnchor:0, targetAnchor:0, clazz: 'flow' },
            { source: 'taskNode1', target: 'taskNode2', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
            { source: 'taskNode2', target: 'gatewayNode', sourceAnchor:1, targetAnchor:0, clazz: 'flow' },
            { source: 'taskNode2', target: 'taskNode1', sourceAnchor:2, targetAnchor:2, clazz: 'flow' },
            { source: 'gatewayNode', target: 'taskNode3', sourceAnchor:2, targetAnchor:0, clazz: 'flow' },
            { source: 'gatewayNode', target: 'endNode', sourceAnchor:1, targetAnchor:2, clazz: 'flow'},
            { source: 'taskNode3', target: 'endNode', sourceAnchor:1, targetAnchor:1, clazz: 'flow' },
            { source: 'catchNode1', target: 'endNode', sourceAnchor:1, targetAnchor:0, clazz: 'flow' }]
};

const data2 = {
    nodes: [{ id: 'startNode', x: 50, y: 200, label: '', clazz: 'start', },
            { id: 'taskNode', x: 150, y: 200, label: '审批', clazz: 'scriptTask', },
            { id: 'gatewayNode', x: 350, y: 200, label: '获取权限成功', clazz: 'gateway',  },
            { id: 'endNode', x: 450, y: 200, label: '', clazz: 'end', }],
    edges: [{ source: 'startNode', target: 'taskNode', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
            { source: 'taskNode', target: 'gatewayNode', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
            { source: 'gatewayNode', target: 'endNode', sourceAnchor:1, targetAnchor:3, clazz: 'flow' }
    ]
};

const height = 150;
function App() {
    return (
        <div>
            <Layout>
                <Sider collapsible collapsed={false} trigger={null} style={{ height: "100vh"}}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="pie-chart" />
                            <span> 现有Workflow</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="plus" />
                            <span> 新增Workflow</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
              <Layout>
                <Header style={{ color: "grey", "font-size": "large", "font-weight": "900" }}>Workflow Dashboard</Header>
                <Content style={{ height: "calc(100vh - 135px)", bottom: "0", paddingTop: "100px" }}>
                  <Designer data={data2} height={height} isView />
                </Content>
                <Footer style={{ "text-align": "center" }}>Workflow UI Created by 精益引擎</Footer>
              </Layout>
            </Layout>
        </div>
    );
}

export default App;
