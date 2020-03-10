import React from 'react';
import { Link } from 'react-router-dom'
import {Icon, Menu, Layout} from 'antd';
import './index.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideBar = () => {
  return <Sider
      collapsible
      collapsed={false}
      trigger={null}
      style={{height: '100vh'}}
  >
    <div className="logo"/>
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      <Menu.Item key="1">
        <Icon type="pie-chart"/>
        <Link to="/exists">
          <span> 现有Workflow</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="plus"/>
        <Link to="/add">
          <span> 新增Workflow</span>
        </Link>
      </Menu.Item>
      <SubMenu
          key="sub1"
          title={
            <span>
                <Icon type="file-done"/>
                <span> 展示样例</span>
              </span>
          }
      >
        <Menu.Item key="3">
            <Icon type="project" />
            <Link to="/sample/workflowName">
              <span> 样例1</span>
            </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="project" />
          <Link to="/sample/workflowName100">
            <span> 样例2</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Icon type="project" />
          <Link to="/sample/workflowName200">
            <span> 样例3</span>
          </Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  </Sider>
}

export default SideBar;
