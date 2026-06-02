class Inserter extends Entity{

    speed:number
    direction:Direction
    footprint
    holdingslot:Item
    progression:number

    constructor(data){
        super()
        Object.assign(this,data)
    }

    isReadyToAcceptItem():boolean{
        return this.holdingslot == null
    }

    acceptItem(item:Item){
        this.holdingslot = item
        this.progression = 0
    }

    isReadyToGiveItem(){
        return this.progression == 1 && this.holdingslot != null
    }

    giveItem():Item{
        var item = this.holdingslot
        this.holdingslot = null
        return item
    }

    

    update(dt){
        var dst = convertDirection(this.direction)
        var src = dst.c().scale(-1)
        var srcbelt = getBelt(this.pos.c().add(src));
        var dstbelt = getBelt(this.pos.c().add(dst));//should be possible to be a machine aswell
        if(this.isReadyToAcceptItem() && srcbelt.itemqueue.length > 0){
            this.acceptItem(srcbelt.giveItemFirst())
        }

        if(this.holdingslot != null){
            this.progression = moveTowards(this.progression,1,dt * this.speed)
            this.holdingslot.pos = srcbelt.pos.lerp(dstbelt.pos,this.progression)
        }

        if(dstbelt?.isReadyToAcceptItem() && this.isReadyToGiveItem()){
            dstbelt.acceptItem(this.giveItem())
        }
    }

    draw(){
        ctxt.fillStyle = "red"
        drawRect(world2abs(this.pos),gridsize)
        drawImage(handimage,world2abs(this.pos),gridsize)
    }
}