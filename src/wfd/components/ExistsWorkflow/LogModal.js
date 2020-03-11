import { Modal, List, Card } from "antd";
import React, {} from "react";
import moment from 'moment'

const LogModal = ({ onClose, data }) => {
  const handleOk = () => {
  }

  const FORMAT = 'M-D HH:mm:ss'
  const COMPONENT_FORMAT = 'HH:mm:ss'

  const renderComponents = (componentExecutions) => {
    return componentExecutions.map((item, index) => {
      return (
        <div key={index} style={{marginBottom: '10px'}}>
          {item.component.name || item.componentId}：
          <div>{moment(item.startDateTime).format(COMPONENT_FORMAT)} - {moment(item.startDateTime).format(COMPONENT_FORMAT)}，{item.componentExecutionData.componentExecutionStatus}</div>
        </div>
      )
    })
  }

  const renderList = () => {
    return data.map((item, index) => {
      return (
        <List.Item key={index} style={{border: 'none'}}>
          <Card title={`时间：${moment(item.startDateTime).format(FORMAT)} - ${moment(item.endDateTime).format(FORMAT)}， 状态：${item.workflowExecutionStatus}`}>
            {renderComponents(item.componentExecutions)}
          </Card>
        </List.Item>
      )
    })
  }

  return (
    <Modal
      width={700}
      title="查看日志"
      visible
      onOk={onClose}
      onCancel={onClose}
    >
      <List>{renderList()}</List>
    </Modal>
  )
};

export default LogModal;
