const images = require("images");
function render(viewport,el){
    if(el.style){
        var img = images(el.style.width,el.style.height);

        if(el.style["background-color"]){
            let color = el.style["background-color"] || "rgb(0,0,0)";
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1),Number(RegExp.$2),Number(RegExp.$3),1)
            viewport.draw(img,el.style.left||0,el.style.top||0)
        }
    }

    if(el.children){
        for(var child of el.children){
            render(viewport,child)
        }
    }
}

module.exports = render;