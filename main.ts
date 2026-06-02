/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="libs/utils/camera.ts" />
/// <reference path="libs/utils/domutils.js" />
/// <reference path="src/entity.ts" />
/// <reference path="src/machine.ts" />
/// <reference path="src/belt.ts" />
/// <reference path="src/item.ts" />
/// <reference path="src/player.ts" />
/// <reference path="src/inserter.ts" />
/// <reference path="src/recipe.ts" />
/// <reference path="src/utils.ts" />
/// <reference path="src/inventory.ts" />






//todo
//player character and UI
//inserters
//machines
//recipes

//UI for selecting building elements


var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
const ctxt = crret.ctxt
var gridsize = new Vector(50,50)
var halfgridsize = gridsize.c().scale(0.5)
var arrowImage:HTMLImageElement
var handimage:HTMLImageElement
var machineImage:HTMLImageElement

var camera = new Camera(ctxt)
var player = new Player({
    pos:new Vector(10,10)
})

loadImages(['/images/arrow.png', '/images/hand.png', '/images/machine.png']).then(images => {
    arrowImage = images[0]
    handimage = images[1]
    machineImage = images[2]
})

var starterbelt = new Belt({
    pos:new Vector(11,9),
    direction:Direction.down,
})
var ironplate = new Item({
    pos:new Vector(10,10),
    name:"iron plate",
})

var entities = [
    starterbelt,
    new Belt({
        pos:new Vector(11,10),
        direction:Direction.right,
    }),
    new Belt({
        pos:new Vector(12,10),
        direction:Direction.right,
    }),
    new Belt({
        pos:new Vector(13,10),
        direction:Direction.right,
    }),
    new Belt({
        pos:new Vector(14,10),
        direction:Direction.down,
    }),
    new Inserter({
        pos:new Vector(12,11),
        direction:Direction.down,
        speed:0.5,
    }),
    new Belt({
        pos:new Vector(12,12),
        direction:Direction.left,
    }),
    new Machine({
        pos:new Vector(11,12),
        footprint:[
            [1,0,1],
            [1,1,1],
            [1,0,1]
        ],
        inputslots:[],
        outputslots:[],
        availableRecipes:[
            new Recipe({
                name:"iron gear",
                inputs:[
                    {name:"iron plate", amount:1},
                ],
                outputs:[
                    {name:"iron gear", amount:1},
                ],
                craftingTime:1,
            })
        ],
        workingspeed:1,
    }),
    ironplate,
    player,
]

var entitygrid = {}
for(var entity of entities){
    entitygrid[`${entity.pos.x}:${entity.pos.y}`] = entity
}

var time = 0

starterbelt.acceptItem(ironplate)
loop((dt) => {
    //update
    time += dt
    dt = clamp(dt,1/60,1/10)
    for(var entity of entities){
        entity.update(dt)
    }

    //render
    ctxt.fillStyle = 'black'
    ctxt.fillRect(0,0,screensize.x,screensize.y)
    camera.pos.overwrite(world2abs(player.pos))
    camera.begin()
    for(var entity of entities){
        entity.draw()
    }
    camera.end()

})

document.addEventListener('keydown',(e) => {
    if(e.key == 'f'){
        if(starterbelt.isReadyToAcceptItem()){
            var item = new Item({
                pos:new Vector(10,10),
                name:"iron plate",
            })
            entities.push(item)
            starterbelt.acceptItem(item)
        }
    }
})

function save2file(filename:string){
    var data = JSON.stringify(entities)
    var blob = new Blob([data], {type: 'text/plain'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function loadFromFile(callback:(data:string) => void){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        var file = (e.target as HTMLInputElement).files[0];
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            var content = readerEvent.target.result as string;
            callback(content)
        }
    }
    input.click();
}