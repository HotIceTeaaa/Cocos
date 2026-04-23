import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bunker')
export class Bunker extends Component {

    @property
    hp: number = 3;

    reduceHP(){
        this.hp -= 1;
        if(this.hp <= 0){
            setTimeout(() => {
                if (this.node && this.node.isValid) this.node.destroy();
            }, 0);
        }
    }
}


