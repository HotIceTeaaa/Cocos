import { _decorator, Component, Prefab, instantiate, Vec3 } from 'cc';
import { DifficultyManager } from './DifficultyManager';

const { ccclass, property } = _decorator;

@ccclass('InvaderGrid')
export class InvaderGrid extends Component {

    @property({ type: [Prefab] })
    prefabs: Prefab[] = [];

    @property
    rows: number = 5;

    @property
    columns: number = 11;

    @property
    speed: number = 20.0;

    private direction: Vec3 = new Vec3(1,0,0);

    onLoad() {
        // this.generateGrid();
    }

    public generateGrid() { //from private
        for (let row = 0; row < this.rows; row++) {
            // Calculate centering offsets
            const width = 30.0 * (this.columns - 1);
            const height = 30.0 * (this.rows - 1);
            const centeringX = -width / 2;
            const centeringY = -height / 2;

            // Base Y position for this row
            const rowY = centeringY + (row * 30.0);

            for (let col = 0; col < this.columns; col++) {
                // Instantiate the prefab for this row
                const invaderNode = instantiate(this.prefabs[row]);
                
                // Set parent to this node (the grid container)
                invaderNode.setParent(this.node);
                
                // Calculate local position
                const posX = centeringX + (col * 30.0);
                invaderNode.setPosition(new Vec3(posX, rowY, 0));
            }
        }
    }

    update(deltaTime: number) {
        //Ambil Speed dari Diff Manager
        const currentSpeed = DifficultyManager.enemySpeed;


        // Move the entire grid
        const movement = this.direction.clone().multiplyScalar(currentSpeed * deltaTime);
        this.node.position = this.node.position.add(movement);

        // Get screen edges in world coordinates
        const leftEdge = 20;
        const rightEdge = 460;

        // Check each invader child
        for (const child of this.node.children) {
            if (!child.activeInHierarchy) continue;

            const childPos = child.worldPosition; // Use world position for edge comparison

            if (this.direction.x > 0 && childPos.x >= (rightEdge - 1.0)) {
                this.advanceRow();
                break; // Only advance once per frame
            } else if (this.direction.x < 0 && childPos.x <= (leftEdge + 1.0)) {
                this.advanceRow();
                break;
            }
        }
    }

    private advanceRow() {
        // Reverse direction
        this.direction.x *= -1;

        // Move down
        const pos = this.node.position.clone();
        pos.y -= 10.0;
        this.node.position = pos;
    }
}