game.MainMenuItem = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        this.renderable.addAnimation( "idle", [0], 0 );
        this.renderable.addAnimation( "hover", [1], 0 );
        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(0.5, 0.5);
        this.alwaysUpdate = true;
        this.floating = true;
        this.body.setVelocity(0, 0);
        this.body.setFriction(0, 0);
    }
});

game.MainMenuItems = {
    team : {
        name: "Team",
        x: 32,
        y: 32,
        width: 96,
        height: 32,
        image: "team_menu_item",
        object: null
    },
    missions:  {
        name: "Missions"
    },
    credits:  {
        name: "Credits"
    }
};

