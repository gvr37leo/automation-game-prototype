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
/// <reference path="src/assembler.ts" />
/// <reference path="src/belt.ts" />
/// <reference path="src/item.ts" />
/// <reference path="src/player.ts" />




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
var camera = new Camera(ctxt)
var player = new Player({
    pos:new Vector(10,10)
})

loadImages(['/images/arrow.png']).then(images => {
    arrowImage = images[0]
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
    ironplate,
    player,
]

var beltgrid = {}
for(var entity of entities){
    if(entity.type == 'belt'){
        beltgrid[`${entity.pos.x}:${entity.pos.y}`] = entity
    }
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