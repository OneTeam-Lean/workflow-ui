import React, {useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {Button, Form, Input, Switch, message} from 'antd';
import Designer from '../../index';
import axios from 'axios';
import workflowAPI from '../../../api';
import { rawToData } from '../../../util/protocolUtil';

const height = 750;

function ExistsWorkflow({ form }) {
  const designerRef = useRef(null);
  const [workflowData, setWorkflowData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [isView, setIsView] = useState(true);

  const rawDataRef = useRef(rawData);
  rawDataRef.current = rawData;

  const handleSubmit = useCallback((e, target) => {
    e.preventDefault();
    const { workflowQuery } = form.getFieldsValue();

    if (!workflowQuery) {
      return setWorkflowData(null);
    }

    axios.get(
        `${workflowAPI.getWorkflow}/${workflowQuery}`,
    ).then(res => {
      if (!res.data) {
        return setWorkflowData(null);
      }
      console.log(designerRef);
      // ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(designerRef.current));
      setWorkflowData(rawToData(res.data));
      setRawData(res.data);
    }).catch(e => {
      // handle error
      console.info(e);
    });
  }, [rawData, workflowData]);

  const updateWorkFlowDiagram = useCallback(graphConfig => {
    const originComponents = rawDataRef.current.components
    const nodes = graphConfig.nodes.map(item => {
      const model = item.getModel()

      const component = originComponents.find(c => c.id === model.id)
      console.log('component:', component)
      // update label
      if (component) {
        component.name = model.label
      }
      return {
        diagramType: "SHAPE",
        componentId: model.id,
        size: {
          width: model.size[0],
          height: model.size[1]
        },
        position: {
          position_x: model.x,
          position_y: model.y
        }
      }
    });
    const edges = graphConfig.edges.map(item => ({
      diagramType: "EDGE",
      flowId: item.get('id'),
      sourceAnchor: item.getModel().sourceAnchor,
      targetAnchor: item.getModel().targetAnchor
    }));

    const diagrams = nodes.concat(edges);
    const newRawData = {};
    const request = Object.assign(newRawData, rawDataRef.current, );
    const newR = Object.assign(newRawData, {diagrams: diagrams});
    console.log(newR);

    axios.put(`${workflowAPI.updateWorkflow}`, request).then(res => {
      console.log(res.status)
    }).catch(e => console.info(e));

  }, [rawDataRef]);

  function handleRunning() {
    try {
      axios.post(
          workflowAPI.runWorkflow(rawData.id),
      ).then(res => {
        const { workflowExecutionStatus } = res.data;
        if (workflowExecutionStatus !== 'SUCCESS') {
          return message.error('运行失败');
        }

        message.success('运行成功');

        const components = (res.data['componentExecutions']);
        let nodes = components.filter(res => res['component']['componentType'] !== 'SEQUENCE_FLOW');
        let edges = components.filter(res => res['component']['componentType'] === 'SEQUENCE_FLOW');
        nodes = workflowData.nodes.map(node => ({
          ...node,
          componentExecutionStatus: getExecutionStatus(
            nodes.find(
              resNode => resNode['component']['id'] === node.id
            )
          ),
        }));
        edges = workflowData.edges.map(edge => ({
          ...edge,
          componentExecutionStatus: getExecutionStatus(
            edges.find(
              resEdge => resEdge['component']['id'] === edge.id
            )
          ),
        }));
        setWorkflowData({nodes, edges});
      });
    } catch (e) {
      console.info(e);
    }
  }

    return <>
        <Form layout="inline" onSubmit={handleSubmit}>
          <Form.Item>
            {
              form.getFieldDecorator(
                  'workflowQuery',
              )(<Input
                  placeholder="请输入工作流名称"
                  type="text"
                  style={{ margin: '0 24px', width: '240px' }}
              />)
            }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button type="primary" onClick={handleRunning}>
              运行
            </Button>
          </Form.Item>
          {/*<Form.Item>*/}
          {/*  <Switch*/}
          {/*    checkedChildren="查看模式"*/}
          {/*    unCheckedChildren="编辑模式"*/}
          {/*    checked={isView}*/}
          {/*    onChange={val => setIsView(val)}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
        </Form>
        <Designer
            isView
            ref={ designerRef }
            data={ workflowData }
            height={ height }
            updateWorkFlowDiagram={ updateWorkFlowDiagram }
        />
    </>;
}

function getExecutionStatus(component) {
  return component['componentExecutionData']['componentExecutionStatus']
}

export default Form.create({ name: 'customized_form_controls' })(ExistsWorkflow)
