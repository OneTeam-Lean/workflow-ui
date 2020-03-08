import {Icon, Menu, Layout} from "antd";
import React from "react";

const {Sider} = Layout

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
    </Menu>
  </Sider>
}

export default SideBar;
