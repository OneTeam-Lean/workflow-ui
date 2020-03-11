import React, {useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {Button, Form, Input, Switch, message} from 'antd';
import Designer from '../../index';
import axios from 'axios';
import workflowAPI from '../../../api';
import { rawToData } from '../../../util/protocolUtil';
import LogModal from './LogModal'

const height = 700;

function ExistsWorkflow({ form }) {
  const designerRef = useRef(null);
  const [workflowData, setWorkflowData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [isView, setIsView] = useState(true);
  const [timer, setTimer] = useState(-1);

  // log
  const [showLogModal, setShowLogModal] = useState(false);
  const [logData, setLogData] = useState([]);

  const rawDataRef = useRef(rawData);
  const workflowDataRef = useRef(workflowData);
  rawDataRef.current = rawData;
  workflowDataRef.current = workflowData;

  useEffect(() => {
    return function clear() {
      clearInterval(timer);
    }
  }, []);

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

  const handleLogModalShow = () => {
    console.log('rawData:', rawData)
    if (!rawData) {
      return message.warn('请先查询工作流')
    }

    axios.get(
      `${workflowAPI.getWorkflow}/${rawData.id}/executions`,
    ).then(res => {
      console.log(res)
      if (res.data) {
        setLogData(res.data)
        setShowLogModal(true)
      }
    }).catch(e => {
      // handle error
      console.info(e);
    });
  }

  const updateWorkFlowDiagram = useCallback(graphConfig => {
    const originComponents = rawDataRef.current.components
    const nodes = graphConfig.nodes.map(item => {
      const model = item.getModel()

      const component = originComponents.find(c => c.id === model.id)
      // console.log('component:', component)
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
    const edges = graphConfig.edges.map(item => {

      const model = item.getModel()
      console.log(model)

      const component = originComponents.find(c => c.id === model.id)
      console.log('component:', component)
      // update label
      if (component) {
        component.name = model.label
      }

      return {
        diagramType: "EDGE",
        flowId: item.get('id'),
        sourceAnchor: item.getModel().sourceAnchor,
        targetAnchor: item.getModel().targetAnchor
      }
    });

    const diagrams = nodes.concat(edges);
    const newRawData = {};
    const request = Object.assign(newRawData, rawDataRef.current, );
    const newR = Object.assign(newRawData, {diagrams: diagrams});
    console.log(newR);

    axios.put(`${workflowAPI.updateWorkflow}`, request).then(res => {
      console.log(res.status)
    }).catch(e => console.info(e));

  }, [rawDataRef]);

  function updateWorkflowData(data) {
    const { nodes: wfNodes, edges: wfEdges } = workflowDataRef.current;
    const components = (data['componentExecutions']);
    let nodes = components.filter(res => res['component']['componentType'] !== 'SEQUENCE_FLOW');
    let edges = components.filter(res => res['component']['componentType'] === 'SEQUENCE_FLOW');

    nodes = wfNodes.map(node => ({
      ...node,
      componentExecutionStatus: getExecutionStatus(
        nodes.find(
          resNode => resNode['component']['id'] === node.id
        )
      ),
    }));
    edges = wfEdges.map(edge => ({
      ...edge,
      componentExecutionStatus: getExecutionStatus(
        edges.find(
          resEdge => resEdge['component']['id'] === edge.id
        )
      ),
    }));

    // 如果workflowData中没有componentExecutionStatus，则直接更新
    if (!wfNodes[0]['componentExecutionStatus']) {
      return setWorkflowData({nodes, edges});
    }

    // 如果有新日志才更新 workflowData
    let isNodeSame = true;
    let isEdgeSame = true;
    for (let i = 0 ; i < nodes.length; i++) {
      if (nodes[i].startDateTime !== wfNodes[i].startDateTime || nodes[i].endDateTime !== wfNodes[i].endDateTime) {
        isNodeSame = false;
        break;
      }
    }

    if (isNodeSame) {
      for (let i = 0 ; i < edges.length; i++) {
        if (edges[i].startDateTime !== wfEdges[i].startDateTime || edges[i].endDateTime !== wfEdges[i].endDateTime) {
          isEdgeSame = false;
          break;
        }
      }
    }

    if (!(isNodeSame && isEdgeSame)) {
      setWorkflowData({nodes, edges});
    }
  }

  async function handleRunning() {
    try {
      await axios.get(
        `${workflowAPI.getWorkflow}/${rawData.name}`,
      ).then(res => {
        if (res.data) {
          setWorkflowData(rawToData(res.data));
          setRawData(res.data);
        }
      });

      await axios.post(
          workflowAPI.runWorkflow(rawData.id),
      ).then(res => {
        if (res.data) {
          setTimer(setInterval(async () => {
            await axios.get(
              `${workflowAPI.getWorkflow}/${rawData.id}/executions`,
            ).then(res => {
              updateWorkflowData(res.data[res.data.length - 1]);
            }).catch(e => console.info(e));
          }, 1500));
        }
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
        <Form.Item>
          <Button type="primary" onClick={handleLogModalShow} >
            查看日志
          </Button>
        </Form.Item>
      </Form>
      <Designer
        isView
        ref={ designerRef }
        data={ workflowData }
        height={ height }
        updateWorkFlowDiagram={ updateWorkFlowDiagram }
      />
      {showLogModal ? <LogModal data={logData} onClose={() => setShowLogModal(false)} /> : null}
    </>
}

function getExecutionStatus(component) {
  return component['componentExecutionData']['componentExecutionStatus']
}

export default Form.create({ name: 'customized_form_controls' })(ExistsWorkflow)
