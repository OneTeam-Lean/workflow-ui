const workflowAPI = {
  getWorkflow: 'http://ec2-161-189-97-207.cn-northwest-1.compute.amazonaws.com.cn:9005/workflow',
  saveWorkflow: 'http://ec2-161-189-97-207.cn-northwest-1.compute.amazonaws.com.cn:9005/workflow',
  updateWorkflow: 'http://ec2-161-189-97-207.cn-northwest-1.compute.amazonaws.com.cn:9005/workflow',
  runWorkflow: workflowId => `http://ec2-161-189-97-207.cn-northwest-1.compute.amazonaws.com.cn:9005/workflow/${workflowId}/execution`,
}

export default workflowAPI
