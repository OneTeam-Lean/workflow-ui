import React, {Component} from 'react';
import styles from './index.less';
import G6 from '@antv/g6';
import { getShapeName } from './util/clazz'
import locale from './locales/index';
import Command from './plugins/command'
import Toolbar from './plugins/toolbar'
import AddItemPanel from './plugins/addItemPanel'
import CanvasPanel from './plugins/canvasPanel'
import {exportXML} from "./util/bpmn";
import LangContext from "./util/context";
import DetailPanel from "./components/DetailPanel";
import ItemPanel from "./components/ItemPanel";
import ToolbarPanel from "./components/ToolbarPanel";
import EditNodeModal from "./components/DetailPanel/EditNodeModal"
import registerShape from './shape'
import registerBehavior from './behavior'
registerShape(G6);

const tooltip = {
  type: 'tooltip', // Node提示框
  formatText(model) {
    return `名称：${model.label || '暂无名称'}`;
  },
  shouldUpdate: e => {
    return true;
  },
};

const edgeTooltip = {
  type: 'edge-tooltip',
  formatText(model) {
    const text = 'Source: ' + model.source
        + '<br/> Target: ' + model.target;
    return text;
  },
  shouldUpdate: e => {
    return true;
  },
};

const editBehavior = [
    'zoom-canvas',
    'drag-canvas',
    'hoverNodeActived',
    'hoverAnchorActived',
    'dragNode',
    'dragEdge',
    'dragPanelItemAddNode',
    'clickSelected',
    'clickEdit',
    'deleteItem',
    'itemAlign',
    'dragPoint',
];

class Designer extends Component {
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.toolbarRef = React.createRef();
    this.itemPanelRef = React.createRef();
    this.detailPanelRef = React.createRef();
    this.resizeFunc = ()=>{};
    this.state = {
      selectedModel: {},
      processModel: {
        id: '',
        name: '',
        clazz: 'process',
        dataObjs: [],
        signalDefs: [],
        messageDefs: [],
      },

      showEditNodeModal: false,
      editNode: null
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.data !== this.props.data){
      if (!this.props.data) {
        return this.graph.clear();
      }
      if(this.graph){
        this.graph.read(this.initShape(this.props.data));
        this.graph.setMode(this.props.mode);
        // this.graph.emit('canvas:click');
        if(this.cmdPlugin){
          this.cmdPlugin.initPlugin(this.graph);
        }
        if(this.props.isView){
          this.graph.fitView(5);
        }
        this.graph.refresh();
      }
    }
  }

  componentDidMount() {
    registerBehavior(G6, this.props.updateWorkFlowDiagram);
    const { isView,mode } = this.props;
    const height = this.props.height-1;
    const width = this.pageRef.current.offsetWidth;
    let plugins = [];
    if(!isView){
      this.cmdPlugin = new Command();
      const toolbar = new Toolbar({container:this.toolbarRef.current});
      const addItemPanel = new AddItemPanel({container:this.itemPanelRef.current});
      const canvasPanel = new CanvasPanel({container:this.pageRef.current});
      plugins = [this.cmdPlugin, toolbar, addItemPanel, canvasPanel];
    }
    this.graph = new G6.Graph({
      plugins: plugins,
      container: this.pageRef.current,
      height: height,
      width: width,
      modes: {
        default: [
            'drag-canvas',
            'clickSelected',
        ],
        view: [],
        edit: [...editBehavior, tooltip, edgeTooltip],
      },
      defaultEdge: {
        shape: 'flow-polyline-round',
      },
    });
    this.graph.saveXML = (createFile = true) => exportXML(this.graph.save(),this.state.processModel,createFile);
    if(isView){
      this.graph.setMode('view');
    }else{
      this.graph.setMode(mode);
    }
    console.log(this.props.data)
    this.graph.data(this.props.data ? this.initShape(this.props.data) : { nodes: null, edges: null });
    this.graph.render();
    if(isView && this.props.data && this.props.data.nodes){
      this.graph.fitView(5)
    }
    this.initEvents();
  }

  initShape(data){
    if(data && data.nodes){
      return {
        nodes: data.nodes.map(node => {
          return {
            shape: getShapeName(node.clazz),
            ...node,
          }
        }),
        edges: data.edges
      }
    }
    return data;
  }

  initEvents(){
    this.graph.on('afteritemselected',(items)=>{
      if(items && items.length > 0) {
        let item = this.graph.findById(items[0]);
        if(!item){
          item = this.getNodeInSubProcess(items[0])
        }
        this.setState({selectedModel: {...item.getModel()}});
      } else {
        this.setState({selectedModel: this.state.processModel});
      }
    });

    this.graph.on('afterEditNodeSelected',(item) => {
      // console.log('afterEditNodeSelected', item)
      this.setState({
        showEditNodeModal: true,
        editNode: item,
      })
    })


    const page = this.pageRef.current;
    const graph = this.graph;
    const height = this.props.height-1;
    this.resizeFunc = ()=>{
      graph.changeSize(page.offsetWidth,height);
    };
    window.addEventListener("resize", this.resizeFunc);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunc);
    this.graph.getNodes().forEach(node => {
      node.getKeyShape().stopAnimate();
    });
  }

  onItemCfgChange(key,value){
    const items = this.graph.get('selectedItems');
    if(items && items.length > 0){
      let item = this.graph.findById(items[0]);
      if(!item){
        item = this.getNodeInSubProcess(items[0])
      }
      if(this.graph.executeCommand) {
        this.graph.executeCommand('update', {
          itemId: items[0],
          updateModel: {[key]: value}
        });
      }else {
        this.graph.updateItem(item, {[key]: value});
      }
      this.setState({selectedModel: {  ...item.getModel() }});
    } else {
      const canvasModel = { ...this.state.processModel, [key]: value};
      this.setState({selectedModel: canvasModel});
      this.setState({processModel: canvasModel });
    }
  }

  getNodeInSubProcess(itemId){
    const subProcess = this.graph.find('node', (node) => {
      if (node.get('model')) {
        const clazz = node.get('model').clazz;
        if (clazz === 'subProcess') {
          const containerGroup = node.getContainer();
          const subGroup = containerGroup.subGroup;
          const item = subGroup.findById(itemId);
          return subGroup.contain(item);
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    if(subProcess) {
      const group = subProcess.getContainer();
      return group.getItem(subProcess, itemId);
    }
    return null;
  }

  handleEditNodeConfirm = (val) => {
    const { editNode } = this.state;

    this.setState({
      showEditNodeModal: false,
      editNode: null,
    })

    editNode.update({ label: val })

    this.props.updateWorkFlowDiagram(this.graph.cfg)
  }

  handleEditNodeCancel = () => {
    console.log('handleEditNodeCancel')
    this.setState({ showEditNodeModal: false })
  }

  renderEditNodeModal() {
    const { showEditNodeModal, editNode } = this.state;

    if (!showEditNodeModal) {
      return null
    }
    return <EditNodeModal
      editNode={editNode}
      onConfirm={this.handleEditNodeConfirm}
      onCancel={this.handleEditNodeCancel}
    />
  }

  render() {
    const height = this.props.height;
    const { isView,mode,users,groups,lang } = this.props;
    const { selectedModel,processModel, showEditNodeModal, editNode } = this.state;
    const { signalDefs, messageDefs } = processModel;
    const i18n = locale[lang.toLowerCase()];
    const readOnly = mode !== "edit";
    return (
      <LangContext.Provider value={{i18n,lang}}>
        <div className={styles.root}>
          <div ref={this.pageRef} className={styles.canvasPanel} style={{height,width:isView?'100%':'70%',borderBottom:isView?0:null}}/>
          { !isView && <ToolbarPanel ref={this.toolbarRef} /> }
          <div>
            { !isView && <ItemPanel ref={this.itemPanelRef} height={height}/> }
            { !isView && <DetailPanel ref={this.detailPanelRef}
                                      height={height}
                                      model={selectedModel}
                                      readOnly={readOnly}
                                      users={users}
                                      groups={groups}
                                      signalDefs={signalDefs}
                                      messageDefs={messageDefs}
                                      onChange={(key,val)=>{this.onItemCfgChange(key,val)}} />
            }
          </div>
        </div>
        {this.renderEditNodeModal()}
      </LangContext.Provider>
    );
  }
}

Designer.defaultProps = {
  height: 500,
  isView: false,
  mode: 'edit',
  lang: 'zh',
};

export default Designer;
