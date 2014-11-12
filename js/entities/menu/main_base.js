//game.MainBaseHill = me.Entity.extend({
//    init: function(x, y, settings) {
//        this.parallax = { x: 0, y: 0 };
//        this.parallax.x = settings.parallax_x;
//        this.parallax.y = settings.parallax_y;
//        this._super(me.Entity, 'init', [x, y , settings]);
//        this.gravity = 0;
//        this.anchorPoint.set(0, 0);
//        this.alwaysUpdate = true;
//        this.floating = true;
//        this.body.addShape( new me.Rect( 0, 0, settings.width, settings.height ) );
//        this.body.setShape(0);
//    },
//    update: function(dt) {
//        return false;
//    }
//} );

game.MainBaseElement = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
        this.renderable.addAnimation("idle",   [0]);
        this.renderable.addAnimation("active", [0]);
        this.renderable.setCurrentAnimation("idle");
        this.alwaysUpdate = true;
        this.anchorPoint.set(0, 0);
        this.floating = true;
        this.body.addShape( new me.Rect( 0, 0, settings.width, settings.height ) );
        me.event.subscribe("pointermove", this.mouseMove.bind(this));
    },
    mouseMove: function (event) {
        this.hover = this.inViewport &&
            this.getBounds().containsPoint(
                event.gameX, event.gameY
            ) &&
            this.body.getShape(0).containsPoint(
                event.gameX - this.pos.x, event.gameY - this.pos.y
            );
    },
    update : function (dt) {
        return false;
    },
    draw: function (renderer) {
        if( this.hover ) {
            this.renderable.setCurrentAnimation("active");
        } else {
            this.renderable.setCurrentAnimation("idle");
        }
        this._super(me.Entity, 'draw', [renderer]);
    }
});

game.MainBaseCherch = game.MainBaseElement.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
        this.renderable.addAnimation("idle",   [0]);
        this.renderable.addAnimation("active", [1]);
        this.renderable.setCurrentAnimation("idle");
        this.alwaysUpdate = true;
        this.anchorPoint.set(0, 0);
        this.floating = true;
        this.body.addShape( new me.Rect( 0, 0, settings.width, settings.height ) );
        me.event.subscribe("pointermove", this.mouseMove.bind(this));
    }
});

game.MainBaseChicken = game.MainBaseElement.extend({
    init: function(x, y, settings, character) {
        this._super(me.Entity, 'init', [x, y , settings]);
        this.renderable.addAnimation("idle",   [0]);
        this.renderable.addAnimation("active", [1]);
        this.renderable.setCurrentAnimation("idle");
        this.alwaysUpdate = true;
        this.anchorPoint.set(0, 0);
        this.floating = true;
        this.body.addShape( new me.Rect( 0, 0, settings.width, settings.height ) );
        me.event.subscribe("pointermove", this.mouseMove.bind(this));
        this.baloon = new game.CharacterInfoBaloon( this.pos.x - 50, this.pos.y - 100, { width: 160, height: 96 }, character.text );
        me.game.world.addChild( this.baloon, 70 );
    },
    draw: function (renderer) {
        if( this.hover ) {
            this.baloon.showCharacterInfo();
        } else {
            this.baloon.hideCharacterInfo();
        }
        this._super(game.MainBaseElement, 'draw', [renderer]);
    }
});

game.MainBaseCloud = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(settings.speed, 0);
        this.body.setFriction(0, 0);
        this.anchorPoint.set(0, 0);
        this.floating = true;
        this.body.addShape( new me.Rect( 0, 0, settings.width, settings.height ) );
    },
    update : function (dt) {
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        if( this.pos.x + this.width < 0 ) {
            this.pos.x = me.game.viewport.getWidth();
            this.updateBounds();
        }
        this.body.update();
        this._super(me.Entity, 'update', [dt]);
        return true;
    }
});