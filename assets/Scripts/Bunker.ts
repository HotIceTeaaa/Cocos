import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bunker')
export class Bunker extends Component {

    @property
    hp: number = 3;

    reduceHP(){
        if (!this.isValid) return;
        
        this.hp -= 1;

        if(this.hp <= 0){
            this.node.destroy();
        }
    }
}


