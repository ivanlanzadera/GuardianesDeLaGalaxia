import * as Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
    constructor () {
        super('StartScene');
    }

    preload() {
        // Imagenes
        this.load.image('bg', 'assets/imgs/background.png');
        this.load.image('nave', 'assets/imgs/player.png');
        this.load.image('bMet1', 'assets/imgs/met_1_1.png');
        this.load.image('bMet3', 'assets/imgs/met_1_3.png');

        // Fuente
        document.fonts.load('20px kenvector');

        // Musica
        this.load.audio('music', 'assets/sound/mainMenu.mp3');
    }

    create() {
        const music = this.sound.add('music', {
            loop: true,
            volume: 0.1
        });

        music.play();

        const { width, height } = this.scale;

        // FONDO
        const bg = this.add.image(width / 2, height / 2, 'bg').setDisplaySize(width, height);
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

        // TÍTULO
        this.add.text(width / 2, height * 0.1, 'Guardianes de la Galaxia', {
            fontSize: `${Math.floor(height * 0.025)}px`,
            color: '#ffffff',
            fontFamily: 'kenvector',
            align: 'center',
          }).setOrigin(0.5);

        // PANEL DE FONDO
        const panelMargin = 60;
        const panelWidth = width - panelMargin * 2;
        const panelHeight = 350;
        const panelX = panelMargin;
        const panelY = height / 2 - panelHeight / 2;

        const panel = this.add.graphics();
        panel.fillStyle(0xcccccc, 1);
        panel.lineStyle(4, 0xffffff, 1);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 30);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 30);

        // Texto de nombre
        this.add.text(width / 2, panelY + 100, 'Enter your name', {
            fontSize: '20px',
            fontFamily: 'kenvector',
            color: '#333333',
        }).setOrigin(0.5);
  
        // Input HTML (con DOMElement)
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Player name...';
        input.style.fontFamily = 'kenvector';
        input.style.padding = '10px';
        input.style.fontSize = '18px';
        input.style.borderRadius = '2px';
        input.style.border = '2px solid #888';
        input.style.outline = 'none';
        input.style.width = '60%';
        input.style.height = '40px';
        input.style.textAlign = 'center';
        input.style.background = '#eeeeee';
        input.style.color = '#333';
        input.style.fontWeight = 'bold';
        input.style.position = 'absolute';
    
        const inputElement = this.add.dom(width / 2, panelY + 150, input);
    
        // Botón
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonY = panelY + panelHeight - 60;

        const buttonContainer = this.add.container(width / 2, buttonY);
        const buttonBg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x4CAF50, 1)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(0, 0, 'PLAY', {
            fontSize: '20px',
            fontFamily: 'kenvector',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonText]);

        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x66BB6A);
        });

        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x4CAF50);
        });

        buttonBg.on('pointerdown', () => {
            const playerName = input.value.trim();
            if (!playerName) {
                alert('Por favor, introduce un nombre.');
                return;
            }
            music.stop();
            localStorage.setItem('currentUser', playerName);
            this.scene.start('GameScene');
        });


        // Imágenes de meteoritos y nave encima del panel
        const meteorSize = 90; // Tamaño del meteorito
        const naveSize = 125;   // Tamaño de la nave

        // Meteorito izquierdo
        const meteorLeft = this.add.image(panelX + 85, panelY + 20, 'bMet3').setDisplaySize(meteorSize, meteorSize);

        // Meteorito derecho
        const meteorRight = this.add.image(panelX + panelWidth - 85, panelY + 20, 'bMet1').setDisplaySize(meteorSize, meteorSize);
        
        // Nave en el centro
        const nave = this.add.image(width / 2, panelY, 'nave').setDisplaySize(naveSize, naveSize);
    }
}