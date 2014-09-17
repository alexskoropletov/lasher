//var Pathfinder = {
//
//}
/**
 * main
 */
var game = {

    /**
     * object where to store game global data
     */
    data : {
        // score
        canFire: true,
        fireRate: 100,
        fireInterval: null,
        rightKey: false,
        playerDirection: "right",
        targetEntityShowed: false,
        score : 0,
        cursorDown: false,
        playerTargetX: 0,
        playerTargetY: 0,
        playerTargetChanged: false
    },

    pathfinder: {
        graph: null
    },

    soundplayer: new Audio(),

    player: null,

/**
     *
     * Initialize the application
     */
    onload: function() {

        // init the video
//        if (!me.video.init('screen', me.video.CANVAS, 640, 480, true, 'auto')) {
        if (!me.video.init('screen', me.video.CANVAS, 640, 480, true, 1.0)) {
            alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(this, debugPanel, "debug", me.input.KEY.V);
            });
        }

        // initialize the "sound engine"
        me.audio.init("mp3,ogg");
        me.audio.setVolume(0);

        me.sys.gravity = 0;

        me.input.registerPointerEvent( 'pointerdown', me.game.viewport, game.mouseDown, false );
        me.input.registerPointerEvent( 'pointerup', me.game.viewport, game.mouseUp, false );
        me.input.registerPointerEvent( 'pointermove', me.game.viewport, game.mouseMove, false );

        // set all ressources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set all ressources to be loaded
        me.loader.preload(game.resources);

        // load everything & display a loading screen
        me.state.change(me.state.LOADING);
    },

    showTargetLocationCross: function(x, y) {
        if( !game.data.targetEntityShowed ) {
            game.data.targetEntityShowed = true;
            var target = me.pool.pull(
                "tager_location",
                x - 16,
                y - 16,
                {
                    height: 32,
                    width: 32
                }
            );
            me.game.world.addChild( target, 10000 );
        }
    },

    fireBullet: function() {
//        if( game.data.canFire ) {
//            game.data.canFire = false;
            var simple_shot = new game.SimpleShot(
                game.player.pos.x,
                game.player.pos.y,
                {
                    width: 32,
                    height: 32
                }
            );
            me.game.world.addChild( simple_shot, 6 );
//            setTimeout( function() {
//                game.data.canFire = true;
//            }, 500 );
//        }
    },

    mouseDown: function( e ) {
        game.data.cursorDown = true;
        game.data.playerTargetChanged = true;
        game.data.playerTargetX = e.gameWorldX;
        game.data.playerTargetY = e.gameWorldY;
        game.showTargetLocationCross(e.gameWorldX, e.gameWorldY);
        if(e.button == me.input.mouse.RIGHT ) {
//            game.data.rightKey = true;
            game.fireBullet();
            game.data.fireInterval = me.timer.setInterval(
                function() {
                    game.fireBullet();
                },
                game.data.fireRate
            );
        }
    },
    mouseUp: function( e ) {
//        if(e.button == me.input.mouse.RIGHT ) {
//            console.log( game.player.pos.x );
//            console.log( game.player.pos.y );
//            console.log( e.gameWorldX );
//            console.log( e.gameWorldY );
////            game.fireBullet();
//        }
        me.timer.clearInterval( game.data.fireInterval );
        game.data.rightKey = false;
        game.data.cursorDown = false;
    },
    mouseMove: function( e ) {
        if( game.data.cursorDown ) {
            game.showTargetLocationCross(e.gameWorldX, e.gameWorldY);
            game.data.playerTargetChanged = true;
            game.data.playerTargetX = e.gameWorldX;
            game.data.playerTargetY = e.gameWorldY;
        }
    },


    /**
     * callback when everything is loaded
     */
    loaded: function ()    {

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // set the fade transition effect
        me.state.transition("fade","#FFFFFF", 250);

        // register our objects entity in the object pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("possibleEnemy", game.Enemy1);
        me.pool.register("tager_location", game.TargetLocationCross);
        me.pool.register("simple_shot", game.SimpleShot);

        // load the texture atlas file
        // this will be used by object entities later
        game.texture = new me.TextureAtlas(me.loader.getJSON("texture"), me.loader.getImage("texture"));

        // add some keyboard shortcuts
        me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {

            // change global volume setting
            if (keyCode === me.input.KEY.PLUS) {
                // increase volume
                me.audio.setVolume(me.audio.getVolume()+0.1);
            } else if (keyCode === me.input.KEY.MINUS) {
                // decrease volume
                me.audio.setVolume(me.audio.getVolume()-0.1);
            }

            // toggle fullscreen on/off
            if (keyCode === me.input.KEY.F) {
                if (!me.device.isFullscreen) {
                    me.device.requestFullscreen();
                } else {
                    me.device.exitFullscreen();
                }
            }
        });

        // switch to PLAY state
        me.state.change(me.state.PLAY);
    }
};

