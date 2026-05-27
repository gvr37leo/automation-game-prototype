class Item extends Entity{

    name:string

    constructor(data){
        super()
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