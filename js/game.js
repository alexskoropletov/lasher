"use strict";
var game = {
    customStates: {},
    pathfinder: {
        graph: null
    },
    //rain effect
    rainEmitter: {},
    setRain: function() {
        game.rainEmitter = new me.ParticleEmitter(
            0,
            0,
            {
                image: me.loader.getImage('redrain'),
                width: 800,
                height: 150,
                totalParticles: 400,
                angle: -0.7853981633974483,
                angleVariation: 3.141592653589793,
                maxLife: 8000,
                speed: 0.047140452079103175,
                speedVariation: 5.300943312279428,
                minStartScale: 0.3,
                maxStartScale: 1,
                gravity: 0.61,
                wind: -0.1,
                frequency: 10
            }
        );
        game.rainEmitter.name = 'redrain';
        game.rainEmitter.z = 110;
    },
    startRain: function() {
        me.game.world.addChild(game.rainEmitter);
        me.game.world.addChild(game.rainEmitter.container);
        game.rainEmitter.streamParticles();
    },
    stopRain: function() {
        me.game.world.removeChild(game.rainEmitter);
        me.game.world.removeChild(game.rainEmitter.container);
//        game.rainEmitter.streamParticles();
    },
    onload: function() {
        if (!me.video.init('screen', me.video.CANVAS, 800, 600, true, 1.0)) {
            alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
            return;
        }
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(this, debugPanel, "debug", me.input.KEY.V);
            });
        }
        me.audio.init("mp3,ogg");
        me.audio.setVolume(0);
        me.sys.gravity = 0;
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.resources);
        me.state.change(me.state.LOADING);
    },
    loaded: function() {
        game.customStates.MAP = me.state.USER + 0;
        me.state.set(me.state.MENU, new game.MainMenuScreen());
        me.state.set(game.customStates.MAP, new game.MapScreen());
//        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.transition("fade","#000", 300);
        me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (keyCode === me.input.KEY.PLUS) {
                me.audio.setVolume(me.audio.getVolume()+0.1);
            } else if (keyCode === me.input.KEY.MINUS) {
                me.audio.setVolume(me.audio.getVolume()-0.1);
            }
            if (keyCode === me.input.KEY.F) {
                if (!me.device.isFullscreen) {
                    me.device.requestFullscreen();
                } else {
                    me.device.exitFullscreen();
                }
            }
        });
        game.setRain();
        me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
            me.event.publish("pointermove", [ event ]);
        });
//        me.state.change(game.customStates.MAP);
        me.state.change(me.state.MENU);
    }
};

