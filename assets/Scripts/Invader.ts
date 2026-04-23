import { _decorator, Component, Sprite, SpriteFrame, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Invader')
export class Invader extends Component {
    @property({ type: [SpriteFrame] })
    animationSprites: SpriteFrame[] = [];

    @property
    animationTime: number = 1.0;
    private spriteComponent: Sprite = null;
    private animationFrame: number = 0;

    //kyk unity awake
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
        if (otherCollider.node.name === "Invader") return;
        
        this.node.destroy();
    }

    //kyk invokeRepeating
    start() {
        this.schedule(this.animateSprite, this.animationTime);
    }

    private animateSprite() {
        this.animationFrame++;

        //ngulang dr sprite awal
        if (this.animationFrame >= this.animationSprites.length) {
            this.animationFrame = 0;
        }

        this.spriteComponent.spriteFrame = this.animationSprites[this.animationFrame];
    }
}

/*

import { _decorator, Component, Sprite, SpriteFrame, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Invader')
export class Invader extends Component {
    @property({ type: [SpriteFrame] })
    animationSprites: SpriteFrame[] = [];

    @property
    animationTime: number = 1.0;
    private spriteComponent: Sprite = null;
    private animationFrame: number = 0;

    //kyk unity awake
    onLoad() {
        this.spriteComponent = this.getComponent(Sprite);
    }

    //kyk invokeRepeating
    start() {
        this.schedule(this.animateSprite, this.animationTime);
    }

    private animateSprite() {
        this.animationFrame++;

        //ngulang dr sprite awal
        if (this.animationFrame >= this.animationSprites.length) {
            this.animationFrame = 0;
        }

        this.spriteComponent.spriteFrame = this.animationSprites[this.animationFrame];
    }

}


*/

