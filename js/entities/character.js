game.CharacterSmall = me.Entity.extend({
    init: function(x, y, settings, character) {
        settings.spriteheight = 64;
        settings.spritewidth = 32;
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.alwaysUpdate = true;
        this.renderable.addAnimation( "idle",            [0], 100);
        this.renderable.addAnimation( "idle_active",     [2], 100);
        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(0, 0);
        this.floating = true;
        this.hover = false;
        this.baloon = new game.CharacterInfoBaloon( this.pos.x - 64, this.pos.y - 100, { width: 160, height: 96 }, character.text );
        me.game.world.addChild( this.baloon, 60 );
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
//        this.body.update();
//        this._super(me.Entity, 'update', [dt]);
        return true;
    },
    draw: function (renderer) {
        if( this.hover ) {
            this.baloon.showCharacterInfo();
            this.renderable.setCurrentAnimation("idle_active");
        } else {
            this.renderable.setCurrentAnimation("idle");
            this.baloon.hideCharacterInfo();
        }
        this._super(me.Entity, 'draw', [renderer]);
    }
});