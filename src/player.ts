class Player extends Entity{

    speed = 4

    constructor(data){
        super()
        this.type = 'player'
        Object.assign(this,data)
    }

    update(dt){
        var movement = getMoveInputYFlipped()
        
        player.pos.add(movement.scale(dt * this.speed))
    }

    draw(){
        ctxt.strokeStyle = 'grey'
        var abspos = this.pos.c().mul(gridsize)
        abspos.add(halfgridsize)
        drawRectCentered(abspos,new Vector(40,80))
        
    }

}