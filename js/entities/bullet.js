game.SimpleShot = me.Entity.extend({
    init: function(x, y, settings) {

        settings.spriteheight = 32;
        settings.spritewidth = 32;
        settings.image = "bullet_image";
            // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        // walking & jumping speed
        this.body.setVelocity(8, 8);

        this.body.addShape(
            new me.PolyShape(
                x,
                y,
                [
                    new me.Vector2d(0,0),
                    new me.Vector2d(32,0),
                    new me.Vector2d(32,32),
                    new me.Vector2d(0,32)
                ],
                true )
        );
        this.body.setShape(0);

        this.renderable.addAnimation( "idle",            [0], 0 );
        this.renderable.setCurrentAnimation("idle");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);
    },

    /* -----
     update the player pos
     ------            */
    update : function (dt) {
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.body.vel.y += this.body.accel.y * me.timer.tick;
        this.body.update();
        this._super(me.Entity, 'update', [dt]);
        return true;
    }
});