import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";

export default class Lab extends Scene{
    /** @type {Phaser.Tilemaps.Tilemap} */
    map;
    layers ={};

    /** @type {Player} */
    player;
    touch;

    constructor(){
        super('Lab'); //Nome uilizado pra chamar essa cena em outro local.
    }

    preload(){
        //Carregar os dados do mapa
        this.load.tilemapTiledJSON('tiliemap-lab-info', 'mapas/lab_info_test5.json')

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
        this.createPlayer();
        this.createColliders()
        this.createCamera()

    }

    update(){



    }

    createPlayer(){
        this.touch = new Touch(this, 144, 90);

        this.player =  new Player(this, 144, 90, this.touch);
        this.player.setDepth(1)

        
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

    createLayersManual(){
        //Pegando os TilesSets
        const tilesOffice = this.map.getTileset('tiles_office')

        //Iserindo os Layers manualemnte
        //createLayer(Nome da camada, vetor de ties usados pra montar)
        this.map.createLayer('Base',[tilesOffice], 0, 0);
        this.map.createLayer('NivelOne',[tilesOffice], 0, 0);
        this.map.createLayer('Niveltwo',[tilesOffice], 0, 0);
        this.map.createLayer('NivelThree',[tilesOffice], 0, 0);

    }

    createLayers(){
        //Pegar os TilesSets
        const tilesOffice = this.map.getTileset('tiles_office')

        const layerNames = this.map.getTileLayerNames();
        console.log(layerNames)
        for ( let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];
            // this.map.createLayer(name, [tilesOffice], 0, 0);
            this.layers[name] = this.map.createLayer(name, [tilesOffice], 0, 0);

            //Definindo a profuncidade de cada camada
            this.layers[name].setDepth(i);

            //Verificando se o layer possui colisão
            if (name.endsWith('collision')) {
                this.layers[name].setCollisionByProperty({collide: true})

                console.log(name)
                /* if ( CONFIG.DEBUG_COLLISION ) {
                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                    this.layers[name].renderDebug(debugGraphics, {
                        tileColor: null, // Color of non-colliding tiles
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                    });
                } */
            }
        }
    }

    createCamera(){
        const mapWidth =this.map.width * CONFIG.TILE_SIZE;
        const mapHeight =this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player)
    }

    createColliders(){
        const layerNames = this.map.getTileLayerNames();
        for ( let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            if (name.endsWith('collision')) {

                this.physics.add.collider(this.player, this.layers[name]);
            }
        }
    }
}