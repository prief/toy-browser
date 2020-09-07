// TabPanel.js
import { create } from "./creatElement";

export class ListView {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }

  setAttribute(n, v) {
    this[n] = v;
  }
  getAttribute(n) {
    return this[n];
  }
  appendChild(c) {
    this.children.push(c);
  }

  render() {
    let data = this.getAttribute("data");
    return (
      <div class="list-view" style="width:300px;">
        {data.map(this.children[0])}
      </div>
    );
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
