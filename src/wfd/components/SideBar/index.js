import {Icon, Menu, Layout} from 'antd';
import React from 'react';

const { Sider } = Layout;
const { SubMenu } = Menu

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
        <span> 现有Workflow</span>
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="plus"/>
        <span> 新增Workflow</span>
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
            <span> 样例1</span>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="project" />
            <span> 样例2</span>
        </Menu.Item>
        <Menu.Item key="5">
            <Icon type="project" />
            <span> 样例3</span>
        </Menu.Item>
      </SubMenu>
    </Menu>
  </Sider>
}

export default SideBar;
