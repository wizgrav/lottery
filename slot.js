import { Container, Text, Graphics, GraphicsGeometry, ColorMatrixFilter, TextStyle, Point } from 'pixi.js';
import { lerp, vlerp } from './utils';

const geometry = new GraphicsGeometry();

const tempV1 = new Point();
const tempV2 = new Point();
const tempV3 = new Point();

const filter = new ColorMatrixFilter();
filter.negative();

const filterOn = [filter];
const filterOff = [];



class Slot extends Container {
    constructor(index) {
        super();
        
        this.index = index;

        const bg = new Graphics(geometry);

        bg.beginFill(0x666666);
        bg.drawCircle(23, 23, 23);
        bg.endFill();

        bg.beginFill(0x333333);
        bg.drawCircle(23, 23, 20);
        bg.endFill();

        
        this.addChild(bg);

        this.style =  new TextStyle({
            fontFamily: 'Arial',
            fill: ['#ffffff'],
            fontSize: 24,
            align: "center",
            strokeThickness: 0
        });

        const text = new Text(index + 1, this.style);
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        text.x = bg.width / 2;
        text.y = bg.height / 2;
        bg.addChild(text);

        this.targetPosition = { x: 0, y: 0};

        this.targetRotation = 0;

        this.cacheAsBitmap = true;

        this.interactive = true;

        this.filters = filterOff;

        this.cursor = "pointer";

        this.interactiveChildren = true;

        this.randomize();

       
    }

    get selected() {
        return this.filters === filterOn;
    }

    set selected(v) {
        this.cacheAsBitmap = false;
        this.filters = v ? filterOn : filterOff;
    }

    updateSlot(data) {
        this.alpha = 1;
        if(!this.cacheAsBitmap) this.cacheAsBitmap = true;
        switch(data.state) {
            case "select": 
              this.updateEnd(data, tempV1);
              this.updateSelect(data, tempV2);
              vlerp(tempV1, tempV2, data.phase, tempV3);
                break;
            case "roll": 
                this.updateSelect(data, tempV1);
                this.updateRoll(data, tempV2);
                vlerp(tempV1, tempV2, data.phase, tempV3);
                break;
            case "end": 
                this.updateRoll(data, tempV1);
                this.updateEnd(data, tempV2);
                vlerp(tempV1, tempV2, data.phase, tempV3);
                break;
        }
        this.x = data.width * tempV3.x;
        this.y = data.height * tempV3.y;
        
    }

    randomize() {
        this.radius = 0.1 + 0.6 * Math.random();
        this.speed = 2 + 3 * Math.random();
        this.wave = 0.25 + 0.75 * Math.random();
        this.minRadius = this.radius *( 0.33 + 0.66 * Math.random() );
        this.waveSpeed = 1 + 2 * Math.random();
    }

    updateSelect(data, target) {
        const X = this.index % 10;
        const Y = Math.floor(this.index / 10);
        target.x = (this.index % 10) / 10;
        target.y = Math.floor(this.index / 10) / 6;
    }


    updateRoll(data, target) {
        const t = data.time;
        const r = lerp(this.radius, this.minRadius, (Math.sin(t * this.waveSpeed) + 1) / 2 );
        target.x = Math.sin(t * this.speed) * r;
        target.y = Math.cos(t * this.speed) * r;
        target.x = (target.x + 1) /2;
        target.y = (target.y + 1) /2;
    }

    updateEnd(data, target) {
        const i = data.drawn.indexOf(this);
        if(i === -1) {
            if(data.state === "end") this.alpha = Math.pow(1 - data.phase, 2);
            target.x = 0.5;
            target.y = 0.5;
        } else {
            this.alpha = 1;
            target.x = i / 6;
            target.y = 0.8;
        }
    }
}

export {Slot}