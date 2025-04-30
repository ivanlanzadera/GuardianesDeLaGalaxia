import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    // Declaramos los objetos y variables
    player?: any;
    meteorGroup?: Phaser.Physics.Arcade.Group;
    meteorTimer?: Phaser.Time.TimerEvent;
    leftButton?: Phaser.GameObjects.Image;
    rightButton?: Phaser.GameObjects.Image;
    isMovingLeft: boolean = false;
    isMovingRight: boolean = false;
    laserGroup?: Phaser.Physics.Arcade.Group;
    fireButton?: Phaser.GameObjects.Image;
    speedLines?: Phaser.GameObjects.Group;
    score: number = 0;
    scoreText?: Phaser.GameObjects.Text;

    constructor () {
        super('GameScene');
    }
    
    preload() {
        //Fondo
        this.load.image('bg', 'assets/imgs/background.png');
        this.load.image('speed', 'assets/imgs/speed.png');

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
        const bg = this.add.image(0, 0, 'bg').setOrigin(0).setDisplaySize(width, height).setDepth(0);

        // EFECTO DE VELOCIDAD
        this.speedLines = this.add.group();
        this.time.addEvent({
            delay: 800,
            callback: this.spawnSpeedLine,
            callbackScope: this,
            loop: true
        });

        // PUNTUACIONES
        const username = localStorage.getItem('currentUser') || 'Guest';
        const highscore = parseInt(localStorage.getItem(`highscore_${username}`) || '0', 10);
        this.add.text(10, 10, `Highscore: ${highscore}`, {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.scoreText = this.add.text(10, 40, `Score: ${this.score}`, {
            fontSize: '24px',
            color: '#fff'
        });

        // JUGADOR
        this.player = this.physics.add.image(width/2, height - 200, 'player');
        this.player.setOrigin(0.5, 0.5);
        this.player.setScale(0.7);
        this.player.setCollideWorldBounds(true);

        // CONTROLES
        this.leftButton = this.add.image(width - 100, height - 100, 'cLeft').setScale(0.7).setInteractive();
        this.rightButton = this.add.image(width - 30, height - 100, 'cRight').setScale(0.7).setInteractive();
        this.fireButton = this.add.image(30, height - 100, 'cFire').setScale(0.7).setInteractive();
        this.laserGroup = this.physics.add.group();

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

        this.fireButton.on('pointerdown', () => {
            this.fireLaser();
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
        this.physics.add.overlap(this.laserGroup, this.meteorGroup, this.shotMeteor, undefined, this);
    }

    override update() {
        // Animamos las líneas de velocidad
        this.speedLines?.getChildren().forEach((line: Phaser.GameObjects.GameObject) => {
            const speedLine = line as Phaser.GameObjects.Image;
            speedLine.y += 10; // velocidad de descenso
        
            // Eliminar si sale de la pantalla
            if (speedLine.y > this.scale.height + 50) {
                speedLine.destroy();
            }
        });

        // Eliminamos meteoritos que salen de la pantalla
        this.meteorGroup!.getChildren().forEach((meteor: Phaser.GameObjects.GameObject) => {
            const m = meteor as Phaser.Physics.Arcade.Image;
            if (m.y > this.scale.height + 50) {
                m.destroy();
            }
        });

        // Controlamos movimiento de la nave
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

        // Eliminamos los láseres que salen de la pantalla
        this.laserGroup!.getChildren().forEach((laser: Phaser.GameObjects.GameObject) => {
            const l = laser as Phaser.Physics.Arcade.Image;
            if (l.y < -50) {
                l.destroy();
            }
        });
    }

    fireLaser() {
        if (!this.player || !this.laserGroup) return;

        const laser = this.laserGroup.create(this.player.x, this.player.y - this.player.height / 2, 'laser') as Phaser.Physics.Arcade.Image;
        laser.setVelocityY(-500);
        laser.setData('alive', true);
    
        // Efecto óptico del disparo
        const shoot = this.add.image(this.player.x, this.player.y - this.player.height / 2, 'shot').setScale(0.5);
        this.time.delayedCall(100, () => shoot.destroy(), [], this);
    }

    spawnSpeedLine() {
        const x = Phaser.Math.Between(0, this.scale.width);
        const y = -50;

        const speedLine = this.add.image(x, y, 'speed').setAlpha(1.2).setScale(1.5).setDepth(1);;

        this.speedLines?.add(speedLine);
    }

    shotMeteor(laser: any, meteor: any) {
        const m = meteor as Phaser.Physics.Arcade.Image;
        const l = laser as Phaser.Physics.Arcade.Image;

        // Elimina el láser
        l.destroy();

        // Resta vida al meteorito
        let life = m.getData('life') ?? 2;
        life -= 1;

        if (life <= 0) {
            m.destroy();
            
            // Actualizamos score
            this.score++;
            this.scoreText?.setText(`Score: ${this.score}`);

            // Comprobamos y actualizamos highscore
            const username = localStorage.getItem('currentUser');
            const storedHS = parseInt(localStorage.getItem(`highscore_${username}`) || '0', 10);
            if (this.score > storedHS) {
                localStorage.setItem(`highscore_${username}`, this.score.toString());
            }
        } else {
            m.setData('life', life);
        }
    }

    spawnMeteor() {
        const meteorKeys = ['bMet1', 'bMet2', 'bMet3', 'sMet1', 'sMet2', 'sMet3'];
        const key = Phaser.Utils.Array.GetRandom(meteorKeys);
        
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = -50;

        const meteor = this.meteorGroup!.create(x, y, key) as Phaser.Physics.Arcade.Image;

        meteor.setVelocityY(Phaser.Math.Between(100, 200));
        meteor.setData('life', 2);
    }

    gameOver() {
        this.scene.start('GameOverScene');
    }
}