import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, Sprite, Node, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Component {
    @property
    hp: number = 3;

    @property
    private modeSeruduk: boolean = false;

    @property({ type: Node })
    playerNode: Node | null = null;

    @property
    followSpeed: number = 2.0;

    private spriteComponent: Sprite = null;

    onLoad() {
        this.spriteComponent = this.getComponent(Sprite);
        
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

        if (this.hp <= 0) {
            console.log("Bos Hancur!");
            this.node.destroy();
        }
    }

    update(deltaTime: number) {
        if (this.playerNode) {
            let targetX = this.playerNode.position.x;
            let currentX = this.node.position.x;
            let newX = math.lerp(currentX, targetX, deltaTime * this.followSpeed);
            this.node.setPosition(newX, this.node.position.y, this.node.position.z);
        }
    }
}