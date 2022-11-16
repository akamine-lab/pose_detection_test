
function make(tag:string, html_or_children?:string|HTMLElement[], 
    options?: { id_?:string, class_?:string, onclick?:()=>void }    
    ):HTMLElement {
        const new_element = document.createElement(tag);

    if(html_or_children) {
        if(typeof html_or_children === "string") {
            new_element.innerHTML = html_or_children;
        }else {
            for(const n of html_or_children) {
                new_element.appendChild(n);
            }
        }
    }

    if(options !== undefined) {
        new_element.onclick = (e)=> {  
            if(options.onclick) {
                options.onclick();
            } 
        }
    }

    return new_element;
}

function id(id:string) : HTMLElement {
    const elm = document.getElementById(id);
    if(!elm) {
        throw Error("Can't find the element named "+id);
    }
    return elm;
}

function add(parent:Node, child:Node) {
    parent.appendChild(child);
}

function removeChildren(node:Node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

export {make, id, add, removeChildren}
