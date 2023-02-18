import { Application } from 'pixi.js';
import { Slot } from './slot';
import { randomSet } from './utils';

const app = new Application({
    width: 512, 
    height: 512,
    resolution: 1,
    antialias: true,
    background: "#111111"
});

const Data = {
    time: 0,
    state: "select",
    phase: 1,
    selected: [],
    slots: [],
    drawn:[],
    width: 512,
    height:512,
    win: 0
};


let stateCb;

export function onState(cb) {
    stateCb = cb;
}

for ( let i = 0; i < 59; i++) {
    const slot = new Slot(i);
    slot.on("pointerdown",  function() {
        if(Data.state !== "select" || Data.phase !== 1) return;
        const index = Data.selected.indexOf(this);
        if(index === -1) {
            if(Data.selected.length < 6){
                Data.selected.push(this);
                slot.selected = true;
            }
        } else {
            Data.selected.splice(index, 1);
            slot.selected = false;
        }
        if(stateCb) stateCb("select", Data);
    });
    Data.slots.push(slot);
    app.stage.addChild(slot);
}


export function setState(state){
    if(state === "end") {
        Data.drawn.length = 0;
        randomSet(Data.slots, 6, Data.drawn);
        let count = 0;
        Data.selected.forEach((slot) => {
            if(Data.drawn.indexOf(slot) !== -1) count++;
        });
        Data.win = count > 2 ? [50, 100, 200, 500][count - 3] : 0;
    } else if(state === "select") {
        Data.slots.forEach((slot) => {
            slot.selected = false;
            slot.randomize();
        });
    
        Data.selected.length = 0;
    }
    Data.state = state;
    Data.phase = 0;
    if(stateCb) stateCb(state, Data);
};


export function luckyDip(){
    Data.selected.forEach((slot) => {
        slot.selected = false;
    });

    Data.selected.length = 0;

    randomSet(Data.slots, 6, Data.selected);

    Data.selected.forEach((slot) => {
        slot.selected = true;
    })
};

app.ticker.add((time) => {
    Data.time += app.ticker.elapsedMS / 1000;
    const delays = {
        "select": 1000,
        "roll": 3000,
        "end": 2000
    }
    Data.phase = Math.min(1, Data.phase + app.ticker.elapsedMS / delays[Data.state]);
    if(Data.state === "roll" && Data.phase === 1) {
        setState("end");
    } else if(Data.state === "select" && Data.phase === 1 && Data.drawn.length) {
        Data.drawn.length = 0;
        Data.slots.forEach((slot) => {
            slot.cacheAsBitmap = false;
        })
    }
    Data.slots.forEach((slot) => {
        slot.updateSlot(Data);
    })
});

export { app };