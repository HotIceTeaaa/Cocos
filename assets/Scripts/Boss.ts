import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, Sprite, Node, math, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Component {
    @property
    hp: number = 3;

    @property({ type: Node })
    playerNode: Node | null = null;

    @property
    followSpeed: number = 2.0;

    // seruduk
    @property
    nyeruduk: boolean = true;

    @property
    dashInterval: number = 4.0;

    @property
    bottomY: number = -300;

    private spriteComponent: Sprite = null;
    private originalY: number = 0;
    private isDashing: boolean = false;

    onLoad() {
        this.spriteComponent = this.getComponent(Sprite);
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            console.log("invader collider set")
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    start() {
        // simpen y awal
        this.originalY = this.node.position.y;

        if(this.nyeruduk) this.schedule(this.startDash, this.dashInterval);
    }

    private startDash() {
        if (this.isDashing || !this.isValid) return;

        // console.log("Bos Nyeruduk!");
        this.isDashing = true;

        // ambil posisi X bos saat ini biar dia nyeruduk lurus ke bawah
        let currentX = this.node.position.x;

        tween(this.node)
            .to(0.5, { position: new Vec3(currentX, this.bottomY, 0) }, { easing: 'cubicIn' })
            .delay(0.2)
            .to(1.0, { position: new Vec3(currentX, this.originalY, 0) }, { easing: 'quadOut' })
            
            // mulai lerp lagi
            .call(() => {
                this.isDashing = false;
                console.log("Bos kembali ke atas");
            })
            .start();
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name === "Player") {
            // hp player berkurang
            return; 
        }

        if (otherCollider.node.name === "Invader") return;
        if (otherCollider.node.name === "Bunker") return;
        
        this.hp -= 1;

        if (this.hp <= 0) {
            this.node.destroy();
        }
    }

    update(deltaTime: number) {
        if (this.playerNode && !this.isDashing) {
            let targetX = this.playerNode.position.x;
            let currentX = this.node.position.x;
            let newX = math.lerp(currentX, targetX, deltaTime * this.followSpeed);
            this.node.setPosition(newX, this.node.position.y, this.node.position.z);
        }
    }
}