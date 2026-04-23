import { _decorator, Component, Node, Button } from 'cc';
import { InvaderGrid } from './InvaderGrid';
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

    public static InvaderHP: number = 1;
    public static enemySpeed: number = 20;

    selectDifficulty(button: Button) {
        // Cara tahu tombol mana yang ditekan: Cek namanya
        const nodeName = button.node.name;

        if (nodeName === "EasyButton") {
            DifficultyManager.InvaderHP = 1;
            DifficultyManager.enemySpeed = 20;
           
        } 
        else if (nodeName === "NormalButton") {
            DifficultyManager.InvaderHP = 1;
            DifficultyManager.enemySpeed = 40;
          
        }else if (nodeName === "HardButton") {
            DifficultyManager.InvaderHP = 2;
            DifficultyManager.enemySpeed = 60;
            
        }

        // Sembunyikan menu setelah pilih
        this.menuPanel.active = false;
        //Mulai Game
        this.invaderGrid.generateGrid();
    }

    start() {
        this.btnEasy.on(Button.EventType.CLICK, this.selectDifficulty, this);
        this.btnNormal.on(Button.EventType.CLICK, this.selectDifficulty, this);
        this.btnHard.on(Button.EventType.CLICK, this.selectDifficulty, this);
    }
}