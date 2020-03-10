const clazzMap = {
    'START_EVENT': 'start',
    'AUTO_TASK'  : 'scriptTask',
    'MANUAL_TASK': 'scriptTask',
    'END_EVENT'  : 'end',
};

export function rawToData (rawData) {
    const components = (rawData['components']);
    const diagrams = (rawData['diagrams']);

    const resDiagrams = diagrams.filter(res => res['diagramType'] === 'SHAPE');
    const resDiagramsMap = {};
    resDiagrams.forEach(resDiagram => resDiagramsMap[resDiagram['componentId']] = resDiagram);

    const nodes = components.filter(res => res['componentType'] !== 'SEQUENCE_FLOW');
    const edges = components.filter(res => res['componentType'] === 'SEQUENCE_FLOW');

    let resNodes = nodes.map(node => ({
        id   : node['id'],
        label: node['name'],
        clazz: clazzMap[node['componentType']],
        x    : resDiagramsMap[node['id']]['position']['position_x'],
        y    : resDiagramsMap[node['id']]['position']['position_y'],
    }));
    let resEdges = edges.map(edge => ({
        id          : edge['id'],
        source      : edge['fromComponentId'],
        target      : edge['nextComponentIds'][0],
        sourceAnchor: 1,
        targetAnchor: 3,
        clazz       : 'flow',
    }));

    return {nodes: resNodes, edges: resEdges};
}
