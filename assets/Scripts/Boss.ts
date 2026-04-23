import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Component {

    @property
    hp: number = 3;

    @property
    private modeSeruduk: boolean = false;

    private spriteComponent: Sprite = null;

    onLoad() {
        this.spriteComponent = this.getComponent(Sprite);
        
        //Collider
        const collider = this.getComponent(Collider2D);
        if (collider) {
            console.log("invader collider set")
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name === "Player") {
            console.log("kena player");
            return; 
        }
        
        this.hp -= 1;
        console.log("Bos kena hit! Sisa HP: " + this.hp);

        // Cek kalau HP sudah habis
        if (this.hp <= 0) {
            console.log("Bos Hancur!");
            this.node.destroy();
        }
    }
}