export default function(G6) {
  G6.registerBehavior('clickEdit', {
    getDefaultCfg() {
      return {
        multiple: false,
      };
    },
    getEvents() {
      return {
        'node:dblclick': 'onClick',

      };
    },
    onClick(e) {
      this.graph.emit('afterEditNodeSelected', e.item);
    },
  });
}
