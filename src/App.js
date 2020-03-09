import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Layout, Menu, Icon, Form, Input, Select, Button } from 'antd';
import Designer from './wfd';
import axios from 'axios';
import  {isEmpty} from 'lodash'
import { rawToData } from './util/protocolUtil';
import SideBar from './wfd/components/SideBar';
import workflowAPI from './api';

const {Header, Footer, Content} = Layout;
const demoData = {
  "id": "be4767b1-324e-400a-b670-6c5d53e24c20",
  "name": "workflowName",
  "lanes": [
    {
      "id": null,
      "name": "testLane",
      "componentIds": null
    }
  ],
  "components": [
    {
      "componentType": "Component",
      "id": "startEventId",
      "nextComponentIds": null
    },
    {
      "componentType": "Component",
      "id": null,
      "nextComponentIds": null
    },
    {
      "componentType": "Component",
      "id": "autoTaskId",
      "nextComponentIds": null
    },
    {
      "componentType": "Component",
      "id": null,
      "nextComponentIds": null
    },
    {
      "componentType": "Component",
      "id": "manualTaskId",
      "nextComponentIds": null
    },
    {
      "componentType": "Component",
      "id": null,
      "nextComponentIds": null
    },
    {
      "componentType": "Component",
      "id": "endEventId",
      "nextComponentIds": null
    }
  ],
  "diagrams": [
    {
      "diagramType": "SHAPE",
      "componentId": "startEventId",
      "size": {
        "width": 5,
        "height": 10
      },
      "position": {
        "position_x": 30,
        "position_y": 40
      }
    },
    {
      "diagramType": "EDGE",
      "flowId": "sequenceFlowId_1",
      "sourceAnchor": 1,
      "targetAnchor": 2
    },
    {
      "diagramType": "SHAPE",
      "componentId": "autoTaskId",
      "size": {
        "width": 10,
        "height": 20
      },
      "position": {
        "position_x": 30,
        "position_y": 40
      }
    },
    {
      "diagramType": "EDGE",
      "flowId": "sequenceFlowId_2",
      "sourceAnchor": 1,
      "targetAnchor": 3
    },
    {
      "diagramType": "SHAPE",
      "componentId": "autoTaskId",
      "size": {
        "width": 10,
        "height": 20
      },
      "position": {
        "position_x": 30,
        "position_y": 40
      }
    },
    {
      "diagramType": "EDGE",
      "flowId": "sequenceFlowId_3",
      "sourceAnchor": 4,
      "targetAnchor": 1
    },
    {
      "diagramType": "SHAPE",
      "componentId": "manualTaskId",
      "size": {
        "width": 10,
        "height": 20
      },
      "position": {
        "position_x": 30,
        "position_y": 40
      }
    },
    {
      "diagramType": "SHAPE",
      "componentId": "endEventId",
      "size": {
        "width": 5,
        "height": 10
      },
      "position": {
        "position_x": 30,
        "position_y": 40
      }
    }
  ],
  "workflowExecutions": null
};

const height = 600;
class App extends React.Component {
    designerRef= undefined;

    state = {
        workflowData: undefined,

    };

    componentDidMount () {

    }

    handleSubmit = (e, target) => {
        e.preventDefault();
        const { workflowQuery } = this.props.form.getFieldsValue();

        axios.get(
            `${workflowAPI.getWorkflow}/${workflowQuery || 'workflowName'}`,
            // 'https://www.fastmock.site/mock/e0f98190bbbc0813bc919a3a0bee31c8/workflow/workflow'
        ).then(res => {
          console.log(this.designerRef);
          ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this.designerRef));
          this.setState({ workflowData: rawToData(res.data) });
        }).catch(e => {
          // handle error
          console.info(e);
        })
    };

    render () {
        const data = this.state.workflowData;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Layout>
                    <SideBar />
                    <Layout>
                        <Header
                            style={{
                              color: 'grey',
                              fontSize: 'large',
                              fontWeight: '900'
                            }}
                        >
                          Workflow Dashboard
                        </Header>
                        <Content
                            style={{
                                height: 'calc(100vh - 135px)',
                                bottom: '0',
                            }}
                        >
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <Form.Item style={{ width: '400px' }} label="请输入工作流名称">
                                    {
                                      getFieldDecorator('workflowQuery')(<Input
                                        type="text"
                                        style={{ marginRight: '3%' }}
                                      />)
                                    }
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Designer ref={(ref) => {this.designerRef = ref }} data={data} height={height} isView/>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            Workflow UI Created by 精益引擎
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default Form.create({ name: 'customized_form_controls' })(App);
