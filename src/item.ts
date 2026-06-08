class Item extends Entity{

    name:string
    amount:number
    stackSize:number
    maxStackSize:number

    constructor(data){
        super()
        this.type = 'item'
        Object.assign(this,data)
    }

    update(){
        
    }

    draw(){
        ctxt.fillStyle = 'grey'
        ctxt.strokeStyle = 'grey'
        var itemsize = new Vector(25,25)
        var abspos = this.pos.c().mul(gridsize)
        abspos.add(halfgridsize)
        drawRectCentered(abspos,itemsize)
    }
}