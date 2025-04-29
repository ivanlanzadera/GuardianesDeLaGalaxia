import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    // Declaramos los objetos
    player?: any;
    meteorGroup?: Phaser.Physics.Arcade.Group;
    meteorTimer?: Phaser.Time.TimerEvent;
    leftButton?: Phaser.GameObjects.Image;
    rightButton?: Phaser.GameObjects.Image;
    isMovingLeft: boolean = false;
    isMovingRight: boolean = false;

    constructor () {
        super('GameScene');
    }
    
    preload() {
        //Fondo
        this.load.image('bg', 'assets/imgs/background.png');

        // Controles
        this.load.image('cFire', 'assets/imgs/cFire.png');
        this.load.image('cLeft', 'assets/imgs/cLeft.png');
        this.load.image('cRight', 'assets/imgs/cRight.png');

        // Imágenes de la nave
        this.load.image('player', 'assets/imgs/player.png');
        this.load.image('playerLeft', 'assets/imgs/playerLeft.png');
        this.load.image('playerRight', 'assets/imgs/playerRight.png');
        this.load.image('laser', 'assets/imgs/laser.png');
        this.load.image('shot', 'assets/imgs/shot.png');

        // Imágenes meteoritos grandes
        this.load.image('bMet1', 'assets/imgs/met_1_1.png');
        this.load.image('bMet2', 'assets/imgs/met_1_2.png');
        this.load.image('bMet3', 'assets/imgs/met_1_3.png');

        // Imágenes meteoritos pequeños
        this.load.image('sMet1', 'assets/imgs/met_2_1.png');
        this.load.image('sMet2', 'assets/imgs/met_2_2.png');
        this.load.image('sMet3', 'assets/imgs/met_2_3.png');
    }

    create() {
        const { width, height } = this.scale;

        // FONDO
        const bg = this.add.image(0, 0, 'bg')
            .setOrigin(0)
            .setDisplaySize(width, height);

        // JUGADOR
        this.player = this.physics.add.image(width/2, height - 200, 'player');
        this.player.setOrigin(0.5, 0.5);
        this.player.setScale(0.7);
        this.player.setCollideWorldBounds(true);

        // CONTROLES
        this.leftButton = this.add.image(width - 100, height - 100, 'cLeft').setScale(0.7).setInteractive();
        this.rightButton = this.add.image(width - 30, height - 100, 'cRight').setScale(0.7).setInteractive();
        this.add.image(30, height - 100, 'cFire').setScale(0.7).setInteractive();

        this.leftButton.on('pointerdown', () => {
            this.isMovingLeft = true;
            this.player?.setTexture('playerLeft');
        });

        this.leftButton.on('pointerup', () => {
            this.isMovingLeft = false;
            this.player?.setTexture('player');
        });
        
        this.leftButton.on('pointerout', () => {
            this.isMovingLeft = false;
            this.player?.setTexture('player');
        });
        
        this.rightButton.on('pointerdown', () => {
            this.isMovingRight = true;
            this.player?.setTexture('playerRight');
        });
        
        this.rightButton.on('pointerup', () => {
            this.isMovingRight = false;
            this.player?.setTexture('player');
        });
        
        this.rightButton.on('pointerout', () => {
            this.isMovingRight = false;
            this.player?.setTexture('player');
        });

        // METEORITOS
        this.meteorGroup = this.physics.add.group();
        this.meteorTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnMeteor,
            callbackScope: this,
            loop: true
        });
        
        this.physics.add.overlap(this.player, this.meteorGroup, this.gameOver, undefined, this);
    }

    override update() {
        this.meteorGroup!.getChildren().forEach((meteor: Phaser.GameObjects.GameObject) => {
            const m = meteor as Phaser.Physics.Arcade.Image;
            if (m.y > this.scale.height + 50) {
                m.destroy(); // Limpia meteoritos fuera de pantalla
            }
        });

        const speed = 300;
        if (this.player) {
            if (this.isMovingLeft) {
                this.player.setVelocityX(-speed);
            } else if (this.isMovingRight) {
                this.player.setVelocityX(speed);
            } else {
                this.player.setVelocityX(0);
            }
        }
    }

    spawnMeteor() {
        const meteorKeys = ['bMet1', 'bMet2', 'bMet3', 'sMet1', 'sMet2', 'sMet3'];
        const key = Phaser.Utils.Array.GetRandom(meteorKeys);
        
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = -50;

        const meteor = this.meteorGroup!.create(x, y, key) as Phaser.Physics.Arcade.Image;

        meteor.setVelocityY(Phaser.Math.Between(100, 150)); // Baja verticalmente
        meteor.setData('alive', true);
    }

    gameOver() {
        this.scene.start('GameOverScene');
    }
}