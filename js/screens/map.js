game.MapScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        game.mapObjects = {
            //background
            background: {
                object: new me.ImageLayer("background", 800, 600, "map_bg", 1, 1),
                zindex: 1
            },
            map: {
                object: new me.ImageLayer("map", 800, 600, "map", 1, 1),
                zindex: 2
            },
            getOut: {
                object: new game.MapGetout( 49, 500, { width: 64, height: 64, spritewidth: 64, spriteheight: 64, image: "getout" }, me.state.MENU ),
                zindex: 70
            }
        };
        for( k in game.mapObjects ) {
            me.game.world.addChild( game.mapObjects[k].object, game.mapObjects[k].zindex );
        }
        //mousemove event
        me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
            me.event.publish("pointermove", [ event ]);
        });

//        game.startRain();
    },
    onDestroyEvent: function() {
        me.input.releasePointerEvent('pointermove', me.game.viewport);
        for( k in game.mapObjects ) {
            me.game.world.removeChild( game.mapObjects[k].object );
        }
        game.mapObjects = {};
    }
});