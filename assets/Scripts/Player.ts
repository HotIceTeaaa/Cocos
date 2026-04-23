import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode, EventMouse, instantiate, Prefab} from 'cc';
const { ccclass, property } = _decorator;
import { Projectile } from './Projectile';

@ccclass('Player')
export class Player extends Component {

    @property
    speed: number = 5.0;

    @property({ type: Prefab}) 
    laserPrefab: Prefab = null;

    @property
    private isLaserActive: boolean = false;

    private isLeftPressed: boolean = false;
    private isRightPressed: boolean = false;

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
                this.isLeftPressed = true;
                break;
            case KeyCode.KEY_D:
                this.isRightPressed = true;
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
            laserNode.setPosition(playerPos.x, playerPos.y + 20, playerPos.z);  // Adjust offset as needed

            // Add to the current scene (or a specific container node)
            this.node.parent.addChild(laserNode);

            // Get the Projectile component
            const projectile = laserNode.getComponent(Projectile);
            if (projectile) {
                // Assign the callback
                projectile.onDestroyed = this.laserDestroyed.bind(this);
                projectile.direction = new Vec3(0, 1, 0); // Shoot upward
            }

            this.isLaserActive = true;
        }
    }

    private laserDestroyed() {
        this.isLaserActive = false;
    }

    update(deltaTime: number) {
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
    }
}