import React from 'react';
import './App.css';
import {Layout, Menu, Icon, Form, Input, Select, Button} from 'antd';
import { BrowserRouter, Route } from 'react-router-dom';
import SideBar from './wfd/components/SideBar';
import ExistsWorkflow from './wfd/components/ExistsWorkflow';
import Sample from './wfd/components/Sample';
import Home from './wfd/components/Home';
import './App.css';

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

export default function App() {

  return (
      <BrowserRouter>
        <Layout>
          <SideBar/>
          <Layout>
            <Header
                style={{
                  color: 'white',
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
              <Route exact path="/" component={Home} />
              <Route path="/exists" component={ExistsWorkflow}/>
              <Route path="/sample/:name" component={Sample} />
            </Content>
            <Footer style={{textAlign: 'center'}}>
              Workflow UI Created by 精益引擎
            </Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
  );
}
