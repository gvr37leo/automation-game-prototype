class Machine extends Entity{

    footprint
    inputslots:Item[]
    outputslots:Item[]
    availableRecipes:Recipe[]

    progression
    workingspeed
    productivity
    

    constructor(data){
        super()
        Object.assign(this,data)
    }

    isReadyToAcceptItem():boolean{
        
    }

    acceptItem(item:Item){

    }

    isReadyToGiveItem():boolean{
        return this.outputslots.length > 0
    }

    giveItem():Item{
        return this.outputslots[0]
    }

    update(dt){
        var activeRecipe:Recipe

        activeRecipe.craftingTime
        this.progression = moveTowards(this.progression,1,dt * this.workingspeed / activeRecipe.craftingTime)
    }

    draw(){
        
    }
}

class itemSlot{

}