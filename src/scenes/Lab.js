import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";

export default class Lab extends Scene{
    /** @type {Phaser.Tilemaps.Tilemap} */
    map;
    layers;

    /** @type {Player} */
    player;


    constructor(){
        super('Lab'); //Nome uilizado pra chamar essa cena em outro local.
    }

    preload(){
        //Carregar os dados do mapa
        this.load.tilemapTiledJSON('tiliemap-lab-info', 'mapas/lab_info.json')

        //Carregar os Tiles sets do mapa
        this.load.image('tiles-office', 'mapas/tiles/tiles_office.png')

        //Importando um SpriteHeet
        this.load.spritesheet('player', 'mapas/tiles/herick_pixel.png', {
            frameWidth: CONFIG.TILE_SIZE,
            frameHeight: CONFIG.TILE_SIZE * 2
        });


    }

    create(){
        this.createMap();
        this.createLayers();
        this.player =  new Player(this, 144, 90);

        this.createCamera()

    }

    update(){



    }

    createMap(){
        this.map = this.make.tilemap({
            key: 'tiliemap-lab-info',
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SCALE
        });

        //Fazendo a corresponencia ente as imagens usadas no Tiled
        //e as carregadas pelo Phaser
        //addTilesetImage(nome da imahem no Tiled, nome da imahem carregada no Phaser)

        this.map.addTilesetImage('tiles_office', 'tiles-office')
    }

    createLayers(){
        //Pegando os TilesSets
        const tilesOffice = this.map.getTileset('tiles_office')

        //Iserindo os Layers manualemnte
        //createLayer(Nome da camada, vetor de ties usados pra montar)
        this.map.createLayer('Base',[tilesOffice], 0, 0);
        this.map.createLayer('NivelOne',[tilesOffice], 0, 0);
        this.map.createLayer('Niveltwo',[tilesOffice], 0, 0);
        this.map.createLayer('NivelThree    ',[tilesOffice], 0, 0);

    }

    createCamera(){
        const mapWidth =this.map.width * CONFIG.TILE_SIZE;
        const mapHeight =this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player)
    }
}