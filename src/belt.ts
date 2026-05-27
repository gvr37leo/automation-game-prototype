enum Direction{
    up,right,down,left
}

var dirmap = {}
dirmap[Direction.up] = new Vector(0,-1)
dirmap[Direction.right] = new Vector(1,0)
dirmap[Direction.down] = new Vector(0,1)
dirmap[Direction.left] = new Vector(-1,0)

function convertDirection(dir:Direction):Vector{
    return dirmap[dir]
}

class Belt extends Entity{
    direction: Direction
    itemqueue:itemMoveCompletion[] = []
    movespeed = 2
    readyForDelivery:Item
    blocked

    constructor(data){
        super()
        this.type = 'belt'
        Object.assign(this,data)
    }

    update(dt){

        
        if(this.isReadyToAcceptItem()){
            var prevbelt = this.getPrevBelt()
            if(prevbelt?.isReadyToGiveItem()){
                this.acceptItem(prevbelt.takeReadyItem()) 
            }

            var sidebelts = this.getSideLoadingBelts()
            for(var sidebelt of sidebelts){
                if(sidebelt.isReadyToGiveItem()){
                    this.acceptItem(sidebelt.takeReadyItem())
                    break;
                }
            }
        }
        
        //check connecting belts to see if they have an item readyfordelivery
        //move items from right to left
        var maxcompletion = 1
        for(var i = this.itemqueue.length - 1; i >= 0; i--){
            var item = this.itemqueue[i]
            if(item.completion == maxcompletion){
                //belt is blocked
                //still need to check if earlier items can be moved
            }

            item.completion = moveTowards(item.completion, maxcompletion, dt*this.movespeed)
            maxcompletion -= 0.25
            item.item.pos = this.pos.lerp(this.pos.c().add(convertDirection(this.direction)),item.completion)
            if(item.completion == 1){
                this.readyForDelivery = item.item
            }
        }
    }

    isReadyToGiveItem(){
        return this.readyForDelivery != null
    }

    isReadyToAcceptItem():boolean{
        if(this.itemqueue.length >= 4){
            return false
        }
        if(this.itemqueue.length == 0){
            return true
        }
        return this.itemqueue[0].completion >= 0.25
    }

    acceptItem(item:Item){
        if(this.itemqueue.length >= 4){
            return false
        }
        this.itemqueue.unshift(new itemMoveCompletion({
            item:item,
            completion:0,
        }))
        return true
    }

    takeReadyItem():Item{
        this.itemqueue.splice(this.itemqueue.length - 1,1)
        var item = this.readyForDelivery
        this.readyForDelivery = null
        return item
    }

    getPrevBelt():Belt{
        

        var prevpos = this.pos.c().add(convertDirection(this.direction).c().scale(-1)) 
        return beltgrid[`${prevpos.x}:${prevpos.y}`]
    }

    getSideLoadingBelts():Belt[]{
        var sidebelts = []
        var dir = convertDirection(this.direction).c()

        var leftpos = this.pos.c().add(dir.c().rotate2d(0.25))
        var rightpos = this.pos.c().add(dir.c().rotate2d(-0.25))
        sidebelts.push(beltgrid[`${leftpos.x}:${leftpos.y}`]) 
        sidebelts.push(beltgrid[`${rightpos.x}:${rightpos.y}`]) 

        sidebelts = sidebelts.filter(sb => sb != null)
        return sidebelts
    }

    draw(){
        var abspos = this.pos.c().mul(gridsize)
        var center = abspos.c().add(halfgridsize)
        
        // Calculate rotation angle based on direction
        var rotationAngles = {}
        rotationAngles[Direction.up] = 0
        rotationAngles[Direction.right] = Math.PI / 2
        rotationAngles[Direction.down] = Math.PI
        rotationAngles[Direction.left] = 3 * Math.PI / 2
        
        var angle = rotationAngles[this.direction] || 0
        
        // Draw rotated arrow
        if(arrowImage){
            ctxt.save()
            ctxt.translate(center.x, center.y)
            ctxt.rotate(angle)
            ctxt.drawImage(arrowImage, -gridsize.x/2, -gridsize.y/2, gridsize.x, gridsize.y)
            ctxt.restore()
        } else {
            // Fallback to white rectangle if image not loaded
            ctxt.fillStyle = 'white'
            drawRect(abspos,gridsize)
        }
    }
}

function drawRect(pos,size){
    ctxt.fillRect(pos.x,pos.y, size.x, size.y)
}

function drawRectCentered(pos,size){
    var halfsize = size.c().scale(0.5)
    ctxt.strokeRect(pos.x-halfsize.x,pos.y - halfsize.y, size.x, size.y)
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

class itemMoveCompletion{
    item:Item
    completion:number

    constructor(data){
        Object.assign(this,data)
    }
}