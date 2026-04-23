import { _decorator, Component, Vec3, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Projectile')
export class Projectile extends Component {

    @property
    direction: Vec3 = new Vec3(0, 1, 0);

    @property
    speed: number = 10.0;

    public onDestroyed: (() => void) | null = null;
    
    // Tambahkan flag untuk menandai penghancuran
    private isPendingDestroy: boolean = false;

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // Jangan langsung destroy, tandai dulu!!!!!
        this.isPendingDestroy = true;
    }

    update(deltaTime: number) {
        // Cek apakah harus dihancurkan di sini (di luar proses physics)
        if (this.isPendingDestroy) {
            if (this.onDestroyed) {
                this.onDestroyed();
            }
            this.node.destroy();
            return; 
        }

        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        let newY = this.node.position.y + movement.y;

        this.node.setPosition(
            this.node.position.x + movement.x,
            newY,
            this.node.position.z + movement.z
        );
    }
}