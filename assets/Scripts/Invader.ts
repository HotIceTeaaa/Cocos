import { _decorator, Component, Sprite, SpriteFrame, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
//DifficutyManager
import { DifficultyManager } from './DifficultyManager';
const { ccclass, property } = _decorator;

@ccclass('Invader')
export class Invader extends Component {
    @property({ type: [SpriteFrame] })
    animationSprites: SpriteFrame[] = [];

    @property
    animationTime: number = 1.0;
    private spriteComponent: Sprite = null;
    private animationFrame: number = 0;

    //ERIK temp
    private currentHP: number = 1;
     private invader_destroyed: boolean = false;
    // public static invader_dead: boolean = false;

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

    //EDIT: kurangin HP
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.currentHP -= 1;

        if (this.currentHP <= 0) {
            //this.node.destroy();
             //Invader.invader_dead = true;
             this.invader_destroyed = true;
        }
    }

    //kyk invokeRepeating
    start() {
        //ADD HP BEDASARKAN DIFFICULTY
        this.currentHP = DifficultyManager.invaderHP;
        this.schedule(this.animateSprite, this.animationTime);
    }

     update(deltaTime: number) {
         // PENTING: Hapus node di sini agar tidak kena error 'enabledContactListener of null'
         if (this.invader_destroyed) {
             this.node.destroy();
         }
         return;
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

