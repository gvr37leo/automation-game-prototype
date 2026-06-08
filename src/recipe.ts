class Recipe extends Entity{

    craftingTime
    inputs
    outputs


    constructor(data){
        super()
        this.type = 'recipe'
        Object.assign(this,data)
    }

    update(){
        
    }

    draw(){
        
    }
}

var recipeMap = {
    'iron-gear-wheel': new Recipe({
        craftingTime: 0.5,
        inputs:[
            {name:'iron-plate', amount:2},
        ],
        outputs:[
            {name:'iron-gear-wheel', amount:1},
        ],
    }),
}