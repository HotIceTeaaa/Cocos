import { DifficultyManager } from './DifficultyManager';
import { _decorator, Component, Prefab, instantiate, Vec3, math } from 'cc';
import { Invader } from './Invader';
import { Projectile } from './Projectile';

const { ccclass, property } = _decorator;

@ccclass('InvaderGrid')
export class InvaderGrid extends Component {

    @property({ type: [Prefab] })
    prefabs: Prefab[] = [];

    @property({ type: Prefab}) 
    misslePrefab: Prefab = null;

    @property
    rows: number = 5;

    @property
    columns: number = 11;

    @property
    speed: number = 20.0;

    @property
    invaderKilled: number = 0;

    @property
    firerate: number = 2;       //dalam detik

    private direction: Vec3 = new Vec3(1,0,0);
    private totalInvaders: number = this.rows * this.columns;

    onLoad() {
        // this.generateGrid();
    }

    start(){
        this.schedule(this.doMissleAttack, this.firerate);
    }

    public generateGrid() { //Prev Private
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

                // set callback
                const invader = invaderNode.getComponent(Invader);
                invader.onDestroyed = this.incrementKillCount.bind(this);
                invader.onDestroyed = this.increaseSpeed.bind(this);
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
        const rightEdge = 390;

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

    private incrementKillCount() {
        this.invaderKilled += 1;
    }

    private increaseSpeed() {
        this.speed += 1;
    }

    private doMissleAttack(){
        for (const child of this.node.children) {
            if (!child.activeInHierarchy) continue;
            
            const treshold = math.randomRange(0, this.totalInvaders) - 1;
            if(this.invaderKilled >= treshold){
                // Instantiate the laser
                const missleNode = instantiate(this.misslePrefab);
                                    
                // Set position: spawn on the invader
                const invaderPos = child.position;
                missleNode.setPosition(invaderPos.x, invaderPos.y, invaderPos.z);  // Adjust offset as needed
                
                // Add to the current scene (or a specific container node)
                this.node.parent.addChild(missleNode);
                
                // Get the Projectile component
                const projectile = missleNode.getComponent(Projectile);
                if (projectile) {
                    projectile.setdirectionDown() // Shoot downward
                }
            }
        }
    }
}