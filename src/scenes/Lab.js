import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Dialog from "../entities/Dialog";

export default class Lab extends Scene{
    /** @type {Phaser.Tilemaps.Tilemap} */
    map;
    layers ={};

    /** @type {Player} */
    player;
    touch;

    //** @type {Phaser.Physics.Arcade.Group} */
    groupObjects;

    isTouching = false;

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

        //Importando um Sprint lixeira
        this.load.spritesheet('lixeira1', 'mapas/tiles/lixeiras_spritesheet.png', {
            frameWidth: CONFIG.TILE_SIZE,
            frameHeight: CONFIG.TILE_SIZE * 2
        });

        


    }

    create(){
        this.createMap();
        this.createLayers();
        this.createObjects();  //importante ela estar em baixo do createLayers()(pois vai udar uma função dela)
        this.createPlayer();
        this.createColliders()
        this.createCamera()
        this.createLixeira()

    }

    update(){



    }

    createDialog(){
        const dialog = new Dialog(this, 200, 200, 'Ta reporvado Kennes Eduardo')
        dialog.setVisible(true);
    }

    createPlayer(){
        this.touch = new Touch(this, 144, 90);

        this.player =  new Player(this, 144, 90, this.touch);
        this.player.setDepth(3)

    }
    createLixeira(){

        const lixeiraAmarela = this.add.sprite(184,48, 'lixeira1', 0) ;
        const lixeiraAzul = this.add.sprite(200,48, 'lixeira1', 3) ;
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

    createObjects(){
        //Criar um grupo para os obejtos

        this.groupObjects =this.physics.add.group();

        //Criando Sprites para casa Object que vier sa camada de objetos do Tiled

        //Parametros: Nome da camsa no tiles, propriedades de seleção
        const objects = this.map.createFromObjects('Objects', 'Objects', 'Objects',{
            nome: 'eletronico', nome: 'bebida'
        

            // Qual imagem sera carregada no sprite (se houver!!!!!!)
            // Key: "player"
        });

        //Tornando todos os objetos, Sprites com Physics (QUE POSSUEM BODY)
        this.physics.world.enable(objects); // pode ser selecionado mais de um, ou um vetor

        for ( let i = 0; i <objects.length; i++){
            //Pegando o objeto atual
            const obj = objects[i]

            //Pegando as informações do Objeto definidas no Tiled
            const prop = this.map.objects[0].objects[i]
            
            obj.setDepth(this.layers.length+1);
            obj.setVisible(false);

            this.groupObjects.add( obj);

        }

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

                
                 /* if ( CONFIG.DEBUG_COLLISION ) {
                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                    this.layers[name].renderDebug(debugGraphics, {
                        tileColor: null, // Color of non-colliding tiles
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                    });
                }  */
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

        //Diferença enre COLIDER X OVERLAP
        //COLIDER: colide e impede a passagem
        //OVERLAP: detecta a sobrepossição dos elementos, não impede a passagem


        //criando colisão entre o pLayer e as camadas de colisão do Tiled
        const layerNames = this.map.getTileLayerNames();
        for ( let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            if (name.endsWith('collision')) {

                this.physics.add.collider(this.player, this.layers[name]);
            }
        }

        //Creiando a coçisão entre a "Mãozinha" do player e os obejros da camada de Obejetos
        //objetoc ad camda de Obejects

        //Chama a função this.handleTouch toda vez que o this.touch entre em contato com um objeto do This.groupObejtcs
        this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
    }

    handleTouch(touch, objects){
        //ja realizou o primeiro toque, sai
        if (this.isTouching && this.player.isAction){
            return;
        }


        //Esta tocando mas soltou o ESPAÇO( para de tocar)
        if(this.isTouching && !this.player.isAction){
            this.isTouching = false;
            return;
        }


        // Acabou de apertat o EPAÇO pela primeira vez e ainda não inicoiu o toque
        if (this.player.isAction){
            this.isTouching = true;
            console.log('estou tocando');
            if(objects.name == 'cadeira'){
                if(this.player.body.enable == true){
                    this.player.body.enable = false;
                    this.player.x = objects.x -0;
                    this.player.y = objects.y -8;
                    this.player.direction = 'up';
                    this.player.setDepth(1);
                    console.log('Personagem sentados')
                   
                }else{
                    this.player.body.enable = true;
                    this.player.x = objects.x +16;
                    this.player.y = objects.y -8;
                    this.player.setDepth(3);
                }
            }
        
            
        //Quando clica abre a lixeira azul com lixo     
            if(objects.name == 'lixeiraLaranja'){
                if(this.player.body.enable == true){
                    this.player.body.enable = false;
                    const lixeiraAmarela = this.add.sprite(184,48, 'lixeira1', 2) ;  
                    const dialog = new Dialog(this, 150, 150, 'No lixo tem um Rato!🐀')                   
                }else{
                    this.player.body.enable =true;
                    
                    const lixeiraAmarela = this.add.sprite(184,48, 'lixeira1', 0) ;
                }
            }


            //Quando clica abre a lixeira azul com lixo

            if(objects.name == 'lixeiraAzul'){
                if(this.player.body.enable == true){
                    this.player.body.enable = false;const lixeiraAzul = this.add.sprite(200,48, 'lixeira1', 5) ;
                    const dialog = new Dialog(this, 150, 150, 'Seu preconceito 👌!')
                    
                                      
                }else{
                    this.player.body.enable = true;
                    
                    const lixeiraAzul = this.add.sprite(200,48, 'lixeira1', 3)
                }
            }


            // Quando clicado aparece a mensagem que esta na Placa 1
            }
            if(objects.name == 'bebida'){
                if(this.player.body.enable == true){
                    const dialog = new Dialog(this, 150, 150, 'Proibido consumo de bebidas!')
                    dialog.setVisible(true)
                }

            }

            

            // Quando clicado aparece a mensagem que esta na Placa 2
            if(objects.name == 'eletronico'){
                if(this.player.body.enable == true){
                    const dialog = new Dialog(this, 150, 150, 'Proibido uso de eletronicos!')
                    dialog.setVisible(true)
                }




            // Quando clicado aparece a mensagem que esta no quadro

        }
        if (this.player.isAction){
            this.isTouching = true;
            if(objects.name == 'quadro'){
                const dialog = new Dialog(this, 150, 150, 'Ta reprovado Kennes Eduardo')
                dialog.setVisible(true)
            }
        }
        
    }
}