
import { _decorator, Component, Vec3, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Projectile')
export class Projectile extends Component {

    @property
    direction: Vec3 = new Vec3(0, 1, 0);

    @property
    speed: number = 10.0;

    // The callback equivalent to System.Action
    public onDestroyed: (() => void) | null = null;

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // Destroy this projectile when it hits anything
        this.destroyProjectile();
    }

    private destroyProjectile() {
        // Invoke the callback if it exists
        if (this.onDestroyed) {
            this.onDestroyed();
        }
        this.node.destroy();
    }

    update(deltaTime: number) {
        // Calculate movement
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        
        // Apply movement using setPosition (node.position is read-only)
        this.node.setPosition(
            this.node.position.x + movement.x,
            this.node.position.y + movement.y,
            this.node.position.z + movement.z
        );
    }
}
