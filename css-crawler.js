// https://www.w3.org/TR/?tag=css

let standards = []
let lis = document.getElementById("container").children;

for(let li of lis){
    if(li.getAttribute("data-tag").match(/css/)){
        standards.push({
            name:li.children[1].innerText,
            url:li.children[1].children[0].href
        })
    }
}

let iframe = document.createElement("iframe");
document.body.innerHTML = '';
document.body.appendChild(iframe);

function happend(el,event){
    return new Promise(res=>{
        let handler = ()=>{
            res();
            el.removeEventListener(event,handler)
        }
        el.addEventListener(event,handler)
    })
}

void async function(){
    for(var stander of standards){
        iframe.src = stander.url;
        console.log(stander.name);
        await happend(iframe,"load")
    }
}();