import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import * as Phaser from 'phaser';

import { StartScene } from '../scenes/StartScene';
import { GameScene } from '../scenes/GameScene';
import { GameOverScene } from '../scenes/GameOverScene';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
})

export class HomePage {
  game?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      width: innerWidth,
      height: innerHeight,
      parent: "game",
      scene: [StartScene, GameScene, GameOverScene],
      type: Phaser.AUTO,
      dom: {
        createContainer: true, // NECESARIO para usar input DOM
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            y: 0,
            x: 0
          },
          debug: false
        }
      }
    }
  }

  ngOnInit() {
    this.game = new Phaser.Game(this.config);
  }
}
