import { SceneManager } from "./SceneManager";
import * as DOM from "./DOM";

export abstract class SceneBase {
    public sceneManager?: SceneManager;
    constructor() {
    }
    set manager(manager: SceneManager) {
        this.sceneManager = manager;
    }
    get manager(): SceneManager {
        return this.sceneManager!;
    }

    replaceElement(new_element : HTMLElement) {
        var scene = DOM.id("Scene");
        DOM.removeChildren(scene);
        DOM.add(scene, new_element);
    }

    abstract render(): void;
}

export class StartScene extends SceneBase {
    public render(): void {
        //DOM.make(tag_name, inner_html, onclick_handler)
        const start = DOM.make('h1', 'start',
            {onclick:()=>{
                    this.manager.changeScene(new HelloScene());
                    console.log("change scene to hello");
                }
            });
        this.replaceElement(start);
    }
}
 
class HelloScene extends SceneBase {
    public render(): void {
        //DOM.make(tag_name, children, onclick_handler)
        const div = DOM.make('div',
            [
                DOM.make('h1', 'hello', {
                    onclick:()=> {this.sceneManager?.changeScene(new EndScene);}
                }),
                DOM.make('h1', 'back', {
                    onclick:()=> {this.sceneManager?.changeScene(new StartScene);}
                })
            ]        
        );
        this.replaceElement(div);
    }
}

class EndScene extends SceneBase {
    public render(): void {
        const text = document.createElement('h1');
        text.textContent = "end";
        text.onclick = () => {
            this.sceneManager?.changeScene(new StartScene);
        };

        this.replaceElement(text);
    }
}
