import * as Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
    constructor () {
        super('StartScene');
    }

    preload() {
        this.load.image('bg', 'assets/imgs/background.png');
    }

    create() {

        const { width, height } = this.scale;

        // FONDO
        const bg = this.add.image(0, 0, 'bg')
            .setOrigin(0)
            .setDisplaySize(width, height);

        // TÍTULO
        this.add.text(width / 2, height * 0.1, 'Guardianes de la Galaxia', {
            fontSize: `${Math.floor(height * 0.03)}px`,
            color: '#ffffff',
            fontFamily: 'Arial Black',
            align: 'center',
          }).setOrigin(0.5);

        // PANEL DE FONDO
        const panelWidth = width * 0.8;
        const panelHeight = height * 0.4;
        const panelX = (width - panelWidth) / 2;
        const panelY = height * 0.25;

        const panel = this.add.graphics();
        panel.fillStyle(0x7e5a8c, 0.8);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);

        // Texto de nombre
        this.add.text(width / 2, panelY + 30, 'Introduce tu nombre:', {
            fontSize: `${Math.floor(height * 0.03)}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);
  
        // Input HTML (con DOMElement)
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Tu nombre';
        input.style.padding = '10px';
        input.style.fontSize = '18px';
        input.style.borderRadius = '8px';
        input.style.border = '2px solid #ffffff';
        input.style.outline = 'none';
        input.style.width = '70%';
        input.style.height = '40px';
        input.style.position = 'absolute';
        input.style.zIndex = '2';
        input.style.transform = 'translateX(-50%)';
        input.style.background = '#b895d5';
        input.style.color = '#ffffff';
        input.style.fontWeight = 'bold';
        input.style.textAlign = 'center';
        input.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.4)';
    
        const inputElement = this.add.dom(width / 2, panelY + 80, input);
    
        // Botón
        const buttonWidth = width * 0.5;
        const buttonHeight = height * 0.08;
        const buttonX = (width - buttonWidth) / 2;
        const buttonY = panelY + panelHeight - buttonHeight - 20;
    
        const button = this.add.graphics();
        button.fillStyle(0x9f7ebd, 1);
        button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
    
        const text = this.add.text(width / 2, buttonY + buttonHeight / 2, 'JUGAR', {
            fontSize: `${Math.floor(height * 0.035)}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);
    
        const hitArea = this.add.zone(buttonX, buttonY, buttonWidth, buttonHeight)
            .setOrigin(0)
            .setInteractive();
    
        // Hover
        hitArea.on('pointerover', () => {
            button.clear();
            button.fillStyle(0xb895d5, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        });
        hitArea.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x9f7ebd, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        });
    
        // Click
        hitArea.on('pointerdown', () => {
            const playerName = input.value.trim();
            if (!playerName) {
            alert('Por favor, introduce un nombre.');
            return;
            }
    
            localStorage.setItem('playerName', playerName);
            // En el futuro puedes también inicializar aquí un array de puntuaciones si no existe
            this.scene.start('GameScene');
        });
    }
}