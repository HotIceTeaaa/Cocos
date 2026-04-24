import { _decorator, Component, Node, Button, Label, director } from 'cc';
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
    @property(Node)
    private gameOverPanel: Node = null; 


    //INfo LAbel
    @property(Label)
    private scoreLabel: Label = null; 
    @property(Label)
    private difficultyLabel: Label = null;
    @property(Label)
    private lifeLabel: Label = null;

    @property(InvaderGrid)
    private invaderGrid: InvaderGrid = null;
    
    @property(Boss)
    private bossScript: Boss = null;

    public static invaderHP: number = 1;
    public static enemySpeed: number = 20;
    public static bossHP : number = 5;
    public static currentLife: number = 5;
    public static isGameOver: boolean = false;
    

    ///SCORE INFORMASI
    public static currentScore: number = 0;

    selectDifficulty(button: Button) {
        // Cara tahu tombol mana yang ditekan: Cek namanya
        const nodeName = button.node.name;
        let diffName = "TEMP"

        if (nodeName === "EasyButton") {
            DifficultyManager.invaderHP = 1;
            DifficultyManager.enemySpeed = 20;
            DifficultyManager.bossHP = 5;

            diffName = "Easy";
        } 
        else if (nodeName === "NormalButton") {
            DifficultyManager.invaderHP = 1;
            DifficultyManager.enemySpeed = 40;
            DifficultyManager.bossHP = 10;

            diffName = "Normal";
          
        }else if (nodeName === "HardButton") {
            DifficultyManager.invaderHP = 2;
            DifficultyManager.enemySpeed = 40;
            DifficultyManager.bossHP = 20;
            
            diffName = "Hard";
        }

        if (this.difficultyLabel){
            this.difficultyLabel.string = diffName;
        } 
        
        // Reset jika nanti ada sistem restart
        DifficultyManager.currentScore = 0;
        DifficultyManager.currentLife = 5;
        this.updateInfo();

        // Sembunyikan menu setelah pilih
        this.menuPanel.active = false;
        //Mulai Game
        this.invaderGrid.generateGrid();
        this.bossScript.activateBoss(DifficultyManager.bossHP);
    }

    public static addScore(points: number) {
        DifficultyManager.currentScore += points;
    }

    updateInfo() {
        if (this.scoreLabel) {
            this.scoreLabel.string = "" + DifficultyManager.currentScore;
        }
        if (this.lifeLabel) {
            this.lifeLabel.string = "" + DifficultyManager.currentLife;
        }
    }

    public gameOver() {
        DifficultyManager.isGameOver = true;
        
        if (this.gameOverPanel) {
            this.gameOverPanel.active = true;
        }

        console.log("Game Over!");
        director.pause(); 
    }

    start() {
        this.btnEasy.on(Button.EventType.CLICK, this.selectDifficulty, this);
        this.btnNormal.on(Button.EventType.CLICK, this.selectDifficulty, this);
        this.btnHard.on(Button.EventType.CLICK, this.selectDifficulty, this);
    }

    update(deltaTime: number) {
        console.log("Score: " + DifficultyManager.currentScore);
        this.updateInfo();
    }
}