game.MapElement = me.Entity.extend({
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
        this.hover = this.body && this.inViewport &&
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

game.MapGetout = game.MapElement.extend({
    init: function(x, y, settings, setState) {
        this._super(me.Entity, 'init', [x, y , settings]);
        this.renderable.addAnimation("idle",   [0]);
        this.renderable.addAnimation("active", [1]);
        this.renderable.setCurrentAnimation("idle");
        this.alwaysUpdate = true;
        this.anchorPoint.set(0, 0);
        this.floating = true;
        this.nextState = setState;
        this.body.addShape( new me.Rect( 0, 0, settings.width, settings.height ) );
        me.event.subscribe("pointermove", this.mouseMove.bind(this));
        me.input.registerPointerEvent('pointerdown', this, this.onSelect.bind(this));
    },
    onSelect : function (event) {
        me.state.change(this.nextState);
        return true;
    },
    onDestroyEvent: function() {
        me.event.unsubscribe("pointermove");
    }
});
