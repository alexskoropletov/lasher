game.gridEntiry = me.Entity.extend({
    init: function(x, y, settings) {
        settings.spriteheight = 32;
        settings.spritewidth = 32;
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height ));
        this.anchorPoint.set(0, 0);
    }
});