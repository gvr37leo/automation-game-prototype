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
        var src = convertDirection(this.direction)
        var dst = src.c().scale(-1)
        var srcbelt = getBelt(this.pos.c().add(src));
        var dstbelt = getBelt(this.pos.c().add(dst));//should be possible to be a machine aswell
        if(this.isReadyToAcceptItem() && srcbelt.isReadyToGiveItem()){
            this.acceptItem(srcbelt.giveItem())
        }

        if(this.holdingslot != null){
            this.progression = moveTowards(this.progression,1,dt * this.speed)
            this.holdingslot.pos = srcbelt.pos.lerp(dstbelt.pos,this.progression)
        }

        if(dstbelt.isReadyToAcceptItem() && this.isReadyToGiveItem()){
            dstbelt.acceptItem(this.giveItem())
        }
        

    }

    draw(){
        ctxt.fillStyle = "red"
        drawRectCentered(world2abs(this.pos),new Vector(20,20))
    }
}