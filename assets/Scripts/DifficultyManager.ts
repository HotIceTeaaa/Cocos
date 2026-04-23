import { _decorator, Component, Node, Button } from 'cc';
import { InvaderGrid } from './InvaderGrid';
import { Boss } from './Boss';
const { ccclass, property } = _decorator;

@ccclass('DifficultyManager')
export class DifficultyManager extends Component {

    @property(Node)
    private btnEasy: Node = null;
    @property(Node)
    private btnNormal: Node = null;
    @property(Node)
    private btnHard: Node = null;
    @property(Node)
    private menuPanel: Node = null; 

    @property(InvaderGrid)
    private invaderGrid: InvaderGrid = null;
    
    @property(Boss)
    private bossScript: Boss = null;

    public static invaderHP: number = 1;
    public static enemySpeed: number = 20;
    public static bossHP : number = 5;

    selectDifficulty(button: Button) {
        // Cara tahu tombol mana yang ditekan: Cek namanya
        const nodeName = button.node.name;

        if (nodeName === "EasyButton") {
            DifficultyManager.invaderHP = 1;
            DifficultyManager.enemySpeed = 20;
            DifficultyManager.bossHP = 5;
           
        } 
        else if (nodeName === "NormalButton") {
            DifficultyManager.invaderHP = 1;
            DifficultyManager.enemySpeed = 40;
            DifficultyManager.bossHP = 10;
          
        }else if (nodeName === "HardButton") {
            DifficultyManager.invaderHP = 2;
            DifficultyManager.enemySpeed = 40;
            DifficultyManager.bossHP = 20;
            
        }

        // Sembunyikan menu setelah pilih
        this.menuPanel.active = false;
        //Mulai Game
        this.invaderGrid.generateGrid();
        this.bossScript.activateBoss(DifficultyManager.bossHP);
    }

    start() {
        this.btnEasy.on(Button.EventType.CLICK, this.selectDifficulty, this);
        this.btnNormal.on(Button.EventType.CLICK, this.selectDifficulty, this);
        this.btnHard.on(Button.EventType.CLICK, this.selectDifficulty, this);
    }
}