import { _decorator, Component, PhysicsSystem2D, ERaycast2DType, Vec2, input, Input, EventKeyboard, KeyCode, EventMouse, instantiate, Prefab, Collider2D, Contact2DType, IPhysics2DContact, director } from 'cc';
const { ccclass, property } = _decorator;
import { Projectile } from './Projectile';
import { DifficultyManager } from './DifficultyManager';

@ccclass('Player')
export class Player extends Component {

    @property
    speed: number = 5.0;

    @property
    hp: number = 5;

    @property
    autopilotDirection: number = 1;     // 1 gerak ke kanan, -1 gerak ke kiri

    @property({ type: Prefab}) 
    laserPrefab: Prefab = null;

    @property
    private isLaserActive: boolean = false;

    private isLeftPressed: boolean = false;
    private isRightPressed: boolean = false;

    @property
    private isCheatActivated: boolean = false;

    onLoad() {
        // Register input events
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onDestroy() {
        // Clean up listeners to prevent memory leaks
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                if(!this.isCheatActivated){
                    this.isLeftPressed = true;
                    this.isRightPressed = false;
                    break;
                }
            case KeyCode.KEY_D:
                if(!this.isCheatActivated){
                    this.isRightPressed = true;
                    this.isLeftPressed = false;
                    break;
                }
            case KeyCode.KEY_P:
                this.isRightPressed = false;
                this.isLeftPressed = false;

                if(this.isCheatActivated){
                    this.isCheatActivated = false;
                }else{
                    this.isCheatActivated = true;
                }
                
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.isLeftPressed = false;
                break;
            case KeyCode.KEY_D:
                this.isRightPressed = false;
                break;
        }
    }

    private onMouseDown(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_LEFT) {
            this.shoot();
        }
    }

    private shoot() {
        if (!this.isLaserActive){
            // Instantiate the laser
            const laserNode = instantiate(this.laserPrefab);
                    
            // Set position: spawn on the player
            const playerPos = this.node.position;
            laserNode.setPosition(playerPos.x, playerPos.y, playerPos.z);  // Adjust offset as needed

            // Add to the current scene (or a specific container node)
            this.node.parent.addChild(laserNode);

            // Get the Projectile component
            const projectile = laserNode.getComponent(Projectile);
            if (projectile) {
                // Assign the callback
                projectile.onDestroyed = this.laserDestroyed.bind(this);
                projectile.setdirectionUp() // Shoot upward
            }

            this.isLaserActive = true;
        }
    }

    private laserDestroyed() {
        this.isLaserActive = false;
    }

    update(deltaTime: number) {
        if (!this.node || !this.node.isValid) return;

        let movement = 0;

        if (this.isLeftPressed) {
            movement -= 1;
        }
        if (this.isRightPressed) {
            movement += 1;
        }

        if (movement !== 0) {
            const moveDelta = movement * this.speed * deltaTime;
            this.node.setPosition(
                this.node.position.x + moveDelta,
                this.node.position.y,
                this.node.position.z
            );
        }

        this.handleAutopilot(deltaTime);
    }

    handleAutopilot(deltaTime: number){
        if (!this.node || !this.node.isValid) return;

        if(this.isCheatActivated){
            if(this.autopilotDirection === 1 && this.node.position.x >= 240){    //kena border kanan dan bergerak ke kanan
                this.autopilotDirection *= -1;
            }else if(this.autopilotDirection === -1 && this.node.position.x <= -240)  //kena border kiri dan bergerak ke kiri
                this.autopilotDirection *= -1;

            const moveDelta = this.autopilotDirection * this.speed * deltaTime;
            this.node.setPosition(
                this.node.position.x + moveDelta,
                this.node.position.y,
                this.node.position.z
            );

            if(this.detectEnemy(this.node.position.x) && !this.detectBunker(this.node.position.x)){
                this.shoot();
            }
        }
    }

    reduceHP(){
        this.hp -= 1;

        DifficultyManager.currentLife = this.hp;
        
        if(this.hp <= 0){

            let manager = director.getScene().getComponentInChildren(DifficultyManager)
            if (manager) {
                manager.gameOver();
            }

            setTimeout(() => {
                if (this.node && this.node.isValid) this.node.destroy();
                //Todo: tambahin scene manager untuk pindah ke scene hasil score
            }, 0);
        }
    }

    detectEnemy(xPos: number){
        // Performs a raycast 
        const results = PhysicsSystem2D.instance.raycast(
            new Vec2(xPos, -150),                       // start point
            new Vec2(xPos, 240),                      // end point
            ERaycast2DType.Any,               // type: Closest, Any, All
            0xFFFFFFFF                             // mask 
        );

        return results.length > 0
    }

    detectBunker(xPos: number){
        // Performs a raycast 
        const results = PhysicsSystem2D.instance.raycast(
            new Vec2(xPos, -165),                       // start point
            new Vec2(xPos, -140),                      // end point
            ERaycast2DType.Closest,               // type: Closest, Any, All
            1 << 0                            // mask 
        );

        return results.length > 0
    }
    
}