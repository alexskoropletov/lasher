game.SimpleShot = me.Entity.extend({
    init: function(x, y, settings, targetX, targetY) {
        settings.spriteheight = 32;
        settings.spritewidth = 32;
        settings.image = "bullet_image";
        this._super(me.Entity, 'init', [x, y , settings]);
        this.direction = game.data.playerDirection;
        this.alwaysUpdate = true;
        this.isBullet = true;
        this.xVel = 0;
        this.yVel = 0;
        this.previousX = x;
        this.previousY = y;
        pathWidth = Math.abs( targetX - x );
        pathHeight = Math.abs( targetY - y );
        if( targetX > x ) {
            this.verticalDirection = "right";
        } else {
            this.verticalDirection = "left";
        }
        if( targetY > y ) {
            this.horixzontalDirection = "down";
        } else {
            this.horixzontalDirection = "up";
        }
        if( pathWidth > pathHeight ) {
            this.yVel = Math.round( 16 * (pathHeight / pathWidth ) );
            this.xVel = 16;
            this.body.setVelocity( 16, this.yVel ? this.yVel : 0 );
        } else {
            this.xVel = Math.round( 16 * (pathWidth / pathHeight) );
            this.yVel = 16;
            this.body.setVelocity( this.xVel ? this.xVel : 0, 16 );
        }
        this.body.addShape(
            new me.Ellipse( 16, 16, 8, 8 )
        );
        this.body.setShape(0);
        this.renderable.addAnimation( "idle", [0], 0 );
        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(0.5, 0.5);
    },
    getGCD: function(x, y) {
        var w;
        while (y != 0) {
            w = x % y;
            x = y;
            y = w;
        }
        return x;
    },
    /* -----
     update the player pos
     ------            */
    update : function (dt) {
        var bRemove = false;
        this.previousX = this.pos.x;
        this.previousY = this.pos.y;
        if( this.verticalDirection == "right" ) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }
        if( this.horixzontalDirection == "down" ) {
            this.body.vel.y += this.body.accel.y * me.timer.tick;
        } else {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }
        if( this.pos.x > me.game.viewport.bounds.width || this.pos.x <= 0 ) {
            bRemove = true;
        }
        if( this.pos.y > me.game.viewport.bounds.height || this.pos.y <= 0 ) {
            bRemove = true;
        }
        this.body.update();
        if( this.previousX == this.pos.x && this.xVel > 0 ) {
            bRemove = true;
        }
        if( this.previousY == this.pos.y && this.yVel > 0 ) {
            bRemove = true;
        }
        if( this.body.vel.y == 0 && this.body.vel.x == 0 ){
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