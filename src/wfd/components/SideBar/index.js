import React from 'react';
import { Link } from 'react-router-dom'
import {Icon, Menu, Layout} from 'antd';
import { useHistory } from 'react-router-dom';
import './index.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuItems = [
  {
    to: '/exists',
    icon: 'pie-chart',
    text: '现有Workflow',
  },
  // {
  //   to: '/add',
  //   icon: 'plus',
  //   text: '现有Workflow',
  // },
  {
    icon: 'file-done',
    text: '展示样例',
    key: 'sample',
    sub: [
      {
        to: '/sample/workflowName',
        icon: 'project',
        text: '样例1',
      },{
        to: '/sample/workflowName100',
        icon: 'project',
        text: '样例2',
      },{
        to: '/sample/workflowName200',
        icon: 'project',
        text: '样例3',
      },
    ],
  },
];

function generateMenuItem(item) {
  if (!item.sub) {
    return <Menu.Item key={item.to}>
      <Icon type={item.icon}/>
      <Link to={item.to}>
        <span> {item.text}</span>
      </Link>
    </Menu.Item>
  }
  return <SubMenu
    key={item.key}
    title={
      <span>
        <Icon type={item.icon}/>
        <span> {item.text}</span>
      </span>
    }
  >
    {
      item.sub.map(generateMenuItem)
    }
  </SubMenu>
}

export default function SideBar({ match }) {
  const history = useHistory();

  return <Sider
      collapsible
      collapsed={false}
      trigger={null}
      style={{height: '100vh'}}
  >
    <div className="logo"/>
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[history.location.pathname]}>
      {
        MenuItems.map(generateMenuItem)
      }
    </Menu>
  </Sider>
}
