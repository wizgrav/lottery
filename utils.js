export function lerp(a, b, v) {
    return b * v + a * ( 1 - v );
}

export function invLerp(a, b, v){
    return (v - a) / (b - a);
}

export function vlerp(va, vb, v, vt) {
    vt.x = lerp(va.x, vb.x, v);
    vt.y = lerp(va.y, vb.y, v);
}

export function randomSet(a, c, ret) {
    ret = ret || [];
    a = a.slice(0);
    for( let i = 0; i < c; i++){
        const index = Math.floor(Math.random() * a.length);
        ret.push(a[index]);
        a.splice(index, 1);
    }
    return ret;
}