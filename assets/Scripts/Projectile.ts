import { _decorator, Component, Vec3, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;
import { Player } from './Player';
import { Bunker } from './Bunker';

@ccclass('Projectile')
export class Projectile extends Component {

    @property
    direction: Vec3;

    @property
    speed: number = 10.0;

    public onDestroyed: (() => void) | null = null;

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.destroyProjectile();

        //nurunin HP player atau bunker tergantung otherCollidernya punya node mana
        const otherNode = otherCollider.node;

        // Check by name
        if (otherNode.name === "Bunker") {
            const bunker = otherNode.getComponent(Bunker);
            bunker.reduceHP();
        }else if(otherNode.name === "Player"){
            const player = otherNode.getComponent(Player);
            player.reduceHP();
        }
    }

    private destroyProjectile() {

        if (this.onDestroyed) {
            this.onDestroyed();
        }

        this.node.destroy();
    }

    update(deltaTime: number) {
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        let newY = this.node.position.y + movement.y;

        this.node.setPosition(
            this.node.position.x + movement.x,
            newY,
            this.node.position.z + movement.z
        );
    }

    setdirectionUp(){
        this.direction = new Vec3(0, 1, 0);
    }

    setdirectionDown(){
        this.direction = new Vec3(0, -1, 0);
    }
}