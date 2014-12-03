game.CharacterFightSmall = me.Entity.extend({
    init: function(x, y, settings) {
        settings.spriteheight = 64;
        settings.spritewidth = 32;
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height ));
        this.alwaysUpdate = true;
        this.renderable.addAnimation( "idle",            [0], 100);
        this.renderable.addAnimation( "idle_active",     [2], 100);
        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(0, 0);
//        this.body.setVelocity(4, 4);
        me.event.subscribe("pointermove", this.mouseMove.bind(this));
    },
    mouseMove: function (event) {
        this.hover = this.body && this.inViewport &&
            this.getBounds().containsPoint(
                event.gameX, event.gameY
            ) &&
            this.body.getShape(0).containsPoint(
                event.gameX - this.pos.x, event.gameY - this.pos.y
            );
    },
    update : function (dt) {
        if( !me.collision.check(this) ) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            this.body.update(dt);
            return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
        }
    },
    onCollision : function (response) {
        if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
            var setX = this.body.accel.x;
            var setY = this.body.accel.y;
            if( response.overlapN.x ) {
                setX = 0;
            }
            if( response.overlapN.y ) {
                setY = 0;
            }
            this.body.setVelocity(setX, setY);
            return true;
//            console.log( response.b );
//            this.pos.sub(response.overlapV);
        } else {
            return false;
        }
    },
    draw: function (renderer) {
        if( this.hover ) {
            this.renderable.setCurrentAnimation("idle_active");
        } else {
            this.renderable.setCurrentAnimation("idle");
        }
        this._super(me.Entity, 'draw', [renderer]);
    }
});