import { create } from "./creatElement";
import { Carousel } from "./Carousel.js";
import { TabPanel } from "./TabPanel.js";
import { ListView } from "./ListView.js";
let c = (
  <Carousel
    data={[
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    ]}
  ></Carousel>
);
c.mountTo(document.body);

let tabPanel = (
  <TabPanel>
    <span title="title1">this is content1</span>
    <span title="title2">this is content2</span>
    <span title="title3">this is content3</span>
    <span title="title4">this is content4</span>
  </TabPanel>
);
tabPanel.mountTo(document.body);

let listViewData = [
  {
    title: "miaomiao1",
    url:
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  },
  {
    title: "miaomiao2",
    url:
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  },
  {
    title: "miaomiao3",
    url:
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  },
  {
    title: "miaomiao4",
    url:
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
  },
];
let listView = (
  <ListView data={listViewData}>
    {(record) => (
      <figure>
        <img src={record.url} />
        <figcaption>{record.title}</figcaption>
      </figure>
    )}
  </ListView>
);
listView.mountTo(document.body);
