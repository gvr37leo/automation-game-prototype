class Machine extends Entity{

    footprint:number[][]
    inputslots:Item[] = [null,null,null,null,null,null]
    outputslots:Item[]
    availableRecipes:Recipe[]

    progression
    workingspeed
    productivity

    buffs
    //speed, productivity, efficiency

    

    constructor(data){
        super()
        this.type = 'machine'
        Object.assign(this,data)
    }

    isReadyToAcceptItem():boolean{
        return this.inputslots.some(function(slot){ return !slot })
    }

    acceptItem(item:Item){
        if(!item || !item.name){
            return false
        }

        if(this.inputslots.some(function(slot){
            return slot && slot.name == item.name
        })){
            return false
        }

        var emptyIndex = this.inputslots.findIndex(function(slot){ return !slot })
        if(emptyIndex == -1){
            return false
        }

        var amount = item.amount || item.stackSize || 1
        var maxStack = item.maxStackSize || amount
        var acceptedAmount = Math.min(amount, maxStack)

        this.inputslots[emptyIndex] = new Item({
            name: item.name,
            amount: acceptedAmount,
            maxStackSize: maxStack,
        })

        return true
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
        if(ingredientsAreMet){
            this.progression = moveTowards(this.progression,1,dt * this.workingspeed / activeRecipe.craftingTime)
        }
        if(this.progression == 1){
            this.progression = 0
            //consume ingredients
            for(var input of activeRecipe.inputs){
                var slot = this.inputslots.find(s => s.name == input.name && s.amount >= input.amount)
                if(slot){
                    slot.amount -= input.amount
                }
            }
            this.outputslots.push(...activeRecipe.outputs.map(o => new Item({name:o.name, amount:o.amount * this.productivity})))
        }
    }

    draw(){
        for(var y = 0; y < this.footprint.length; y++){
            for(var x = 0; x < this.footprint[y].length; x++){
                if(this.footprint[y][x] == 1){
                    drawImage('machine.png',world2abs(new Vector(this.pos.x + x,this.pos.y + y)),gridsize)
                }
            }
        }
    }
}

class itemSlot{

}