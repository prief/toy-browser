let parser = require("./parser.js");
module.exports = function (src, map) {
  console.log("myLoader::", this.resourcePath);
  let tree = parser.parseHTML(src);
  //   console.log(tree.children[1].children[0].content);

  let template = null;
  let script = null;

  for (let node of tree.children) {
    if (node.tagName == "template") {
      template = node.children.filter(n=>n.type !== 'text')[0];
    }
    if (node.tagName == "script") {
      script = node.children[0].content;
    }
  }
  console.log(template);

  let visit = (node) => {
    if (node.type == "text") {
      return JSON.stringify(node.content);
    }
    let attrs = {};

    for (let attr of node.attributes) {
      attrs[attr.name] = attr.value;
    }
    let children = node.children.map((node) => visit(node));
    return `create("${node.tagName}",${JSON.stringify(attrs)},${children})`;
  };
  visit(template);

  return `
  import { create } from "./creatElement.js"
 export class Carousel{

    setAttribute(name,value){
        this[name] = value;
    }
    render(){
        return ${visit(template)};
    }
    mountTo(parent){
        this.render().mountTo(parent);
    }
}
  `;
};
