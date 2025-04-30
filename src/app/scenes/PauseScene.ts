import * as Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload(){
        document.fonts.load('20px kenvector');
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

        // Botón Reanudar
        this.add.text(width / 2, height / 2 - 50, 'Reanudar', { fontFamily: 'kenvector', fontSize: '32px', color: '#fff' })
            .setOrigin(0.5).setInteractive()
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.resume('GameScene');
            });

        // Botón Reiniciar
        this.add.text(width / 2, height / 2 + 20, 'Reiniciar', { fontFamily: 'kenvector', fontSize: '32px', color: '#fff' })
            .setOrigin(0.5).setInteractive()
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.stop('GameScene');
                this.scene.start('GameScene');
            });
    }
}