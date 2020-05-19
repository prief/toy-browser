// 在字符串中找到 'abcdef' 状态机版本
/**
 * js中的状态机
 * 每个状态用函数表示，函数的参数就是输入，函数体内做处理后返回下一个状态即下一个函数
 * 调用时用while(input){state = state(input)}
 * state一般有个start和end表示初始和结束状态
 * 
 * 状态机适合处理流式数据
 * 
 */

function match(string){
    let state = start;
    for(let c of string){
        state = state(c)
    }
    return state === end;
}

function start(c){
    if(c == "a"){
        return foundA;
    }
    return start; // 状态不变
 }

 function end(c){
     return end;
 }

 function foundA(c){
    if(c == "b"){
        return foundB;
    }
    return start(c);
 }
 function foundB(c){
    if(c == "c"){
        return foundC;
    }
    return start(c);
 }
 function foundC(c){
    if(c == "d"){
        return foundD;
    }
    return start(c);
 }
 function foundD(c){
    if(c == "e"){
        return foundE;
    }
    return start(c);
 }
 function foundE(c){
    if(c == "f"){
        return end;
    }
    return start(c);
 }

 console.log(match("I abcdef groot"))
 
 console.log(match("I aabcdef groot"))