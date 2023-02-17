import { setState, luckyDip, app, onState } from './app'


document.body.appendChild(app.view);


const elements = {
    "#start": (el) => {
        el.addEventListener("pointerdown", () => {
            setState("roll");
        });
        return el;
    },

    "#lucky": (el) => {
        el.addEventListener("pointerdown", () => {
            luckyDip();
            document.body.classList.add("ready");
        });
        return el;
    },

    "#reset": (el) => {
        el.addEventListener("pointerdown", () => {
            setState("select");
        });
        return el;
    },

    "#win": (el) => {
        return el;
    }
}

onState((state, data) => {
    console.log(state)
    if(state === "select") {
        document.body.classList.add("select")
    } else {
        document.body.classList.remove("select");
    }

    if(data.selected.length === 6) {
        document.body.classList.add("ready")
    } else {
        document.body.classList.remove("ready");
    }
    
    if(state === "end") {
        document.body.classList.add("end");
        elements["#win"].textContent = data.win ? "WIN " + data.win : "NO WIN"; 
    } else {
        document.body.classList.remove("end");
    }
});

Object.keys(elements).forEach(k => {
    const el = document.querySelector(k);
    if(el) elements[k](el);
    elements[k] = el;
});
