/**
 * a coin (collectable) entiry
 */
game.TargetLocationCross = me.Entity.extend({
    init: function(x, y, settings) {
        settings.spriteheight = 32;
        settings.spritewidth = 32;
        settings.image = "target_location_cross";
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        this.renderable.addAnimation( "idle", [0, 1, 2, 3, 4, 5], 45 );
        this.renderable.setCurrentAnimation("idle", (function () {
            me.game.world.removeChild(this);
            game.data.targetEntityShowed = false;
            return false; // do not reset to first frame
        }).bind(this));
//        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(0.5, 0.5);
        this.alwaysUpdate = true;
        this.body.setVelocity(0, 0);
        this.body.setFriction(0, 0);
    }
});