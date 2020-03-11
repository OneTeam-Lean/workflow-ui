import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {Button, Form, Input} from 'antd';
import Designer from '../../index';
import axios from 'axios';
import workflowAPI from '../../../api';
import { rawToData } from '../../../util/protocolUtil';

const height = 750;

function ExistsWorkflow({ form }) {
    const designerRef = useRef(null);
    const [workflowData, setWorkflowData] = useState(null);
    const [rawData, setRawData] = useState(null);
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
      const nodes = graphConfig.nodes.map(item => ({

        diagramType: "SHAPE",
        componentId: item._cfg.model.id,
        size: {
          width: item._cfg.model.size[0],
          height: item._cfg.model.size[1]
        },
        position: {
          position_x: item._cfg.model.x,
          position_y: item._cfg.model.y
        }

      }));
      const edges = graphConfig.edges.map(item => ({
        diagramType: "EDGE",
        flowId: item._cfg.id,
        sourceAnchor: item._cfg.model.sourceAnchor,
        targetAnchor: item._cfg.model.targetAnchor
      }));

      const diagrams = nodes.concat(edges);
      const newRawData = {};
      const request = Object.assign(newRawData, rawDataRef.current);
      const newR = Object.assign(newRawData, {diagrams: diagrams});
      console.log(newR);

      axios.put(`${workflowAPI.updateWorkflow}`, request).then(res => {
        console.log(res.status)
      }).catch(e => console.info(e));

    }, [rawDataRef]);

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
          </Form.Item>
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

export default Form.create({ name: 'customized_form_controls' })(ExistsWorkflow)
