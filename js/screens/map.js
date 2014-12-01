game.MapScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        game.mapObjects = {
            //background
//            background: {
//                object: new me.ImageLayer("background", 800, 600, "map_bg", 1, 1),
//                zindex: 1
//            },
            map: {
                object: new me.ImageLayer("worldmap", 800, 600, "worldmap", 1, 1),
                zindex: 2
            },
            getOut: {
                object: new game.MapGetout( 449, 500, { width: 64, height: 64, spritewidth: 64, spriteheight: 64, image: "getout" }, me.state.MENU ),
                zindex: 70
            },
            actionPoint: {
                object: new game.MapActionPoint( 250, 250, { width: 64, height: 64, spritewidth: 64, spriteheight: 64, image: "skel" } ),
                zindex: 70
            }
        };
        for( k in game.mapObjects ) {
            me.game.world.addChild( game.mapObjects[k].object, game.mapObjects[k].zindex );
        }
//        game.startRain();
    },
    onDestroyEvent: function() {
        for( k in game.mapObjects ) {
            me.game.world.removeChild( game.mapObjects[k].object, true );
        }
        game.mapObjects = {};
    }
});