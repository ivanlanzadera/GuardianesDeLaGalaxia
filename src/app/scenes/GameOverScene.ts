import * as Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    constructor () {
        super('GameOverScene');
    }

    preload() {
        //Fondo
        this.load.image('background', 'assets/imgs/background.png');

        // Imagenes
        this.load.image('nave', 'assets/imgs/player.png');
        this.load.image('bMet1', 'assets/imgs/met_1_1.png');
        this.load.image('bMet2', 'assets/imgs/met_1_2.png');

        // Fuente
        document.fonts.load('20px kenvector');

        // Musica
        this.load.audio('gameoverMenu', 'assets/sound/gameoverMenu.flac');
    }

    create() {
        const music = this.sound.add('gameoverMenu', {
            loop: true,
            volume: 0.1
        });

        music.play();

        const { width, height } = this.scale;

        // FONDO
        const bg = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

        // PANEL
        const panelMargin = 60;
        const panelWidth = width - panelMargin * 2;
        const panelHeight = 400;
        const panelX = panelMargin;
        const panelY = height / 2 - panelHeight / 2;
        const padding = 30;

        const panel = this.add.graphics();
        panel.fillStyle(0xcccccc, 1);
        panel.lineStyle(4, 0xffffff, 1);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 30);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 30);

        // Score del usuario
        const userScore = parseInt(localStorage.getItem('score') || '0', 10);
        const scoreText = this.add.text(width / 2, panelY + padding + 30, `Your Score: ${userScore}`, {
            fontFamily: 'kenvector',
            fontSize: '20px',
            color: '#111111',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Espacio después del score del usuario para evitar solapamiento
        const spaceAfterUserScore = 60;

        // Título de Highscores
        this.add.text(width / 2, panelY + padding + scoreText.height + spaceAfterUserScore, 'Highscores', {
            fontFamily: 'kenvector',
            fontSize: '20px',
            color: '#111111',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Top 3 puntuaciones
        const scores = this.getTopScores();
        scores.forEach((entry, i) => {
            this.add.text(width / 2, panelY + padding + scoreText.height + spaceAfterUserScore + (i + 1) * 35, `${i + 1}. ${entry.username}: ${entry.score}`, {
                fontFamily: 'kenvector',
                fontSize: '16px',
                color: '#222222',
            }).setOrigin(0.5);
        });

        // BOTONES
        const buttonWidth = 200;
        const buttonHeight = 50;

        const createButton = (x: number, y: number, color: number, text: string, callback: () => void) => {
            const container = this.add.container(x, y);

            const bg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, color, 1)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            const label = this.add.text(0, 0, text, {
                fontFamily: 'kenvector',
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold',
            }).setOrigin(0.5);

            bg.on('pointerdown', callback);

            container.add([bg, label]);
            return container;
        };

        const playAgainBtn = createButton(width / 2, panelY + panelHeight - padding - 70, 0x4CAF50, 'Play Again', () => {
            music.stop();
            this.scene.start('GameScene');
        });

        const menuBtn = createButton(width / 2, panelY + panelHeight - padding - 10, 0xF44336, 'Back to Menu', () => {
            music.stop();
            this.scene.start('StartScene');
        });

        // Imágenes de meteoritos y nave encima del panel
        const meteorSize = 90; // Tamaño del meteorito
        const naveSize = 125;   // Tamaño de la nave

        // Meteorito izquierdo
        const meteorLeft = this.add.image(panelX + 85, panelY - meteorSize / 8, 'bMet1').setDisplaySize(meteorSize, meteorSize);

        // Meteorito derecho
        const meteorRight = this.add.image(panelX + panelWidth - 85, panelY - meteorSize / 8, 'bMet2').setDisplaySize(meteorSize, meteorSize);
        
        // Nave en el centro
        const nave = this.add.image(width / 2, panelY - naveSize / 4, 'nave').setDisplaySize(naveSize, naveSize);
    }

    getTopScores(): { username: string, score: number }[] {
        const scores: { username: string, score: number }[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('highscore_')) {
                const username = key.replace('highscore_', '');
                const score = parseInt(localStorage.getItem(key) || '0', 10);
                scores.push({ username, score });
            }
        }

        return scores.sort((a, b) => b.score - a.score).slice(0, 3);
    }
}
