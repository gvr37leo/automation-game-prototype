
function drawRect(pos,size){
    ctxt.fillRect(pos.x,pos.y, size.x, size.y)
}

function drawRectCentered(pos,size,stroke = false){
    var halfsize = size.c().scale(0.5)
    if(stroke){
        ctxt.strokeRect(pos.x-halfsize.x,pos.y - halfsize.y, size.x, size.y)
    }else{
        ctxt.fillRect(pos.x-halfsize.x,pos.y - halfsize.y, size.x, size.y)
    }
}

function moveTowards(current,target,maxdelta){
    var to = target - current
    var dist = Math.abs(to)

    if(dist <= maxdelta){
        return target
    }

    return current + Math.sign(to) * maxdelta
}

function world2abs(pos){
    return pos.c().mul(gridsize)
}

function getBelt(pos:Vector):Belt{
    var entity = entitygrid[`${pos.x}:${pos.y}`]
    if(entity?.type == 'belt'){
        return entity as Belt
    }
    return null
}