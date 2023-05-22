import Phaser from "phaser";

export default class Dialog extends Phaser.GameObjects.Container {
    
    constructor(scene, x, y, text){
        super(scene, x, y);

        //Criando o balão

        this.balloon = scene.add.graphics();
        this.balloon.fillStyle(0xffffff, 0.9);
        this.balloon.fillRoundedRect(-115, 190, 200, 50, 10);    //Posiciona e da as dimenções do balão


        //Criando o texto do balão 

        this.text = scene.add.text(-10, 210, text, {
            color: '#000000',
            fontSize: '13px',
            wordWrap: {width: 180},
            align:'center'
        });

        this.text.setOrigin(0.5);

        //Adicionando o balão e o texto a cena
        this.add(this.balloon);
        this.add(this.text);

        //Adiciona o dialogo a cena
        scene.add.existing(this);

        //Adicionando o tempo maximo da mensagem na tela
        setTimeout(() => {
            this.setVisible(false);
            this.destroy;
        }, 4000); 

    }
}