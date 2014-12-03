game.MapScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        game.mapObjects = {
            map: {
                object: new me.ImageLayer("worldmap", 800, 600, "worldmap", 1, 1),
                zindex: 2
            },
            getOut: {
                object: new game.MapGetout( 53, 48, { width: 95, height: 93, spritewidth: 95, spriteheight: 93, image: "gettobase" }, me.state.MENU ),
                zindex: 70
            },
            actionPoint: {
                object: new game.MapActionPoint( game.getRandomInt(150, 730), game.getRandomInt(150, 530), { width: 64, height: 64, spritewidth: 64, spriteheight: 64, image: "skel" } ),
                zindex: 70
            }
        };
        for( k in game.mapObjects ) {
            me.game.world.addChild( game.mapObjects[k].object, game.mapObjects[k].zindex );
        }
    },
    onDestroyEvent: function() {
        for( k in game.mapObjects ) {
            me.game.world.removeChild( game.mapObjects[k].object, true );
        }
        game.mapObjects = {};
    }
});