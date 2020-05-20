const EOF = Symbol("EOF");
let currentToken = null;
let currentAttribute = null;
let stack = [{type:"document",children:[]}]

function emit(token){
    console.log(token)
    let top = stack[stack.length - 1];
    if(token.type == "startTag"){
        let element = {
            type :"element",
            tagName:token.tagName,
            children:[],
            attributes:[]
        }
        for(let p in token){
            if(p != "type" && p != "tagName"){
                element.attributes.push({
                    name:p,
                    value:token[p]
                })
            }
        }
        top.children.push(element);
        element.parent = top;

        if(!token.isSelfClosing){
            stack.push(element)
        }

        currentTextNode = null;

    }else if(token.type == "endTag"){
        if(top.tagName != token.tagName){
            throw new Error("tag start and tag end doesn'n match !")
        }else{
            stack.pop();
        }
        currentTextNode = null;
    }
}
function data(c){
    if(c == "<"){
        return tagOpen;
    }else if(c == EOF){
        emit({
            type:"EOF"
        })
        return ;
    }else{
        emit({
            type:"text",
            content:c
        })
        return data;
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    }else if(c.match(/^[a-z]$/i)){
        currentToken = {
            type:"startTag",
            tagName:""
        }
        return tagName(c);
    }else{
        emit({
            type:"text",
            content:c
        })
        return;
    }
}

function endTagOpen(c){
    if(c.match(/^[a-z]$/i)){
        currentToken = {
            type : "endTag",
            tagName: ""
        }
        return tagName(c);
    }else if(c == ">"){
        
    }else if(c == EOF ){
        
    }else {

    }
}

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c.match(/^[a-z]$/i)){
        currentToken.tagName += c.toLowerCase();
        return tagName;
    }else if(c ==">"){
        emit(currentToken)
        return data;
    }else{
        currentToken.tagName += c.toLowerCase();
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    }else if(c =="="){
        
    }else{
        currentAttribute = {
            name :"",
            value:""
        }
        return attributeName(c);
    }
}

function attributeName(c){
  if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
    return afterAttributeName(c);
  }else if(c == "="){
    return beforeAttributeValue;
  }else if(c == "\u0000"){

  }else if(c == "\"" || c == "'" || c == "<"){

  }else{
    currentAttribute.name +=c;
    return attributeName;
  }
}
function afterAttributeName(c){

}   

function beforeAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
    return beforeAttributeValue;
  }else if(c == "\""){
    return doubleQuotedAttributeValue;
  }else if(c == "'"){
    return singleQuotedAttributeValue;
  }else if(c == ">"){
      
  }else{
      return unQuotedAttributeValue(c);
  }
}
function doubleQuotedAttributeValue(c){
    if(c == "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}
function singleQuotedAttributeValue(c){
    if(c == "'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else{
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}
function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c == EOF){

    }else{
        // ?
        // currentAttribute.value +=c ;
        // return doubleQuotedAttributeValue
    }
}

function unQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c =="\u0000"){

    }else if(c =="\"" || c =="'" || c =="<" || c =="=" || c =="`" || c =="\""){
        
    }else if(c ==EOF){
        
    }else {
        currentAttribute.value +=c;
        return unQuotedAttributeValue
    }   
}

function selfClosingStartTag(c){
    if(c ==">"){
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }else if(c == EOF){
        
    }else{
        
    }
}


module.exports.parseHTML = function parseHTML(html){
    console.log(html)

    let state = data;
    for(let c of html){
        state = state(c);
    }
    state = state(EOF);  // 标示结束
}