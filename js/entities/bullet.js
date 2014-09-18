game.SimpleShot = me.Entity.extend({
    init: function(x, y, settings) {

        settings.spriteheight = 32;
        settings.spritewidth = 32;
        settings.image = "bullet_image";
            // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.direction = game.data.playerDirection;
        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;
        this.isBullet = true;

//        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        // walking & jumping speed
        this.body.setVelocity(16, 16);

        this.body.addShape(
            new me.Ellipse( 16, 16, 8, 8 )
        );
        this.body.setShape(0);

        this.renderable.addAnimation( "idle",            [0], 0 );
//        this.renderable.addAnimation( "explode",         [1, 2, 3], 45 );
        this.renderable.setCurrentAnimation("idle");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);
    },

    /* -----
     update the player pos
     ------            */
    update : function (dt) {
        var bRemove = false;
        if( this.direction == 'right' ) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        } else if( this.direction == 'left' ) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else if( this.direction == 'up' ) {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        } else if( this.direction == 'down' ) {
            this.body.vel.y += this.body.accel.y * me.timer.tick;
        } else if( this.direction == 'right_down' ) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
        } else if( this.direction == 'right_up' ) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        } else if( this.direction == 'left_down' ) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
        } else if( this.direction == 'left_up' ) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        } else {
            bRemove = true;
        }
        if( this.pos.x > me.game.viewport.bounds.width || this.pos.x <= 0 ) {
            bRemove = true;
        }
        if( this.pos.y > me.game.viewport.bounds.height || this.pos.y <= 0 ) {
            bRemove = true;
        }
        this.body.update();

        if( this.direction == 'right' && this.body.vel.x <= 0 ) {
            bRemove = true;
        } else if( this.direction == 'left' && this.body.vel.x >= 0 ) {
            bRemove = true;
        } else if( this.direction == 'up' && this.body.vel.y >= 0 ) {
            bRemove = true;
        } else if( this.direction == 'down' && this.body.vel.y <= 0 ) {
            bRemove = true;
        } else if( this.direction == 'right_down' && ( this.body.vel.y <= 0 || this.body.vel.x <= 0 ) ){
            bRemove = true;
        } else if( this.direction == 'right_up' && ( this.body.vel.y >= 0 || this.body.vel.x <= 0 ) ){
            bRemove = true;
        } else if( this.direction == 'left_down' && ( this.body.vel.y <= 0 || this.body.vel.x >= 0 ) ){
            bRemove = true;
        } else if( this.direction == 'left_up' && ( this.body.vel.y >= 0 || this.body.vel.x >= 0 ) ){
            bRemove = true;
        }
        if( bRemove ) {
            return this.explode();
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
    explode: function() {
        var self = this;
        var explosion = new game.SimpleShotExplode(
            self.pos.x,
            self.pos.y,
            {
                width: 32,
                height: 32
            }
        );
        me.game.world.addChild( explosion, 7 );
        me.game.world.removeChild(this);
        return false; // do not reset to first frame
    },
    collideHandler : function (response) {
        if( typeof( response.b.isEnemy ) != "undefined" ){
            game.data.score += 1;
            return this.explode();
        }
    }
});

game.SimpleShotExplode = me.Entity.extend({
    init: function(x, y, settings) {
        settings.spriteheight = 32;
        settings.spritewidth = 32;
        settings.image = "bullet_image";
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        this.renderable.addAnimation( "explode", [1, 2, 3], 45 );
        game.soundplayer.src = soundBank.shoot[1];
//        game.soundplayer.play();
        this.renderable.setCurrentAnimation("explode", (function () {
            me.game.world.removeChild(this);
            return false; // do not reset to first frame
        }).bind(this));
        this.anchorPoint.set(0.5, 0.5);
        this.alwaysUpdate = true;
        this.body.setVelocity(0, 0);
        this.body.setFriction(0, 0);
    }
});