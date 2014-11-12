"use strict";
var game = {
    pathfinder: {
        graph: null
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
        me.state.set(me.state.MENU, new game.MainMenuScreen());
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
        me.state.change(me.state.MENU);
    }
};

