import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    // Declaramos los objetos
    player?: Phaser.GameObjects.Image;

    constructor () {
        super('GameScene');
    }
    
    preload() {
        //Fondo
        this.load.image('bg', 'assets/imgs/background.png');

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

        this.player = this.add.image(width/2, height - 100, 'player');
        this.player.setOrigin(0.5, 0.5);
        this.player.setScale(0.7);
    }
}