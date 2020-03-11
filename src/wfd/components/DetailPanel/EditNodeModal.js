import { Modal, Input } from "antd";
import React, {useState} from "react";

const EditNodeModal = ({ onConfirm, onCancel, editNode }) => {
  const [labelValue, setLabelValue] = useState(editNode ? editNode.get('model').label : '')
  console.log('EditNodeModal-->', editNode, labelValue)
  const handleOk = () => {
    if (labelValue) {
      onConfirm(labelValue)
    }
  }
  return (
    <Modal
      title="编辑节点"
      visible
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Input defaultValue={labelValue} onChange={e => setLabelValue(e.currentTarget.value)} />
    </Modal>
  )
};

export default EditNodeModal;
