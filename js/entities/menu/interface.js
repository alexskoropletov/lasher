game.CharacterInfoBaloon = me.Entity.extend({
    init: function(x, y, settings, text) {
        settings.spritewidth = 160;
        settings.spriteheight = 96;
        settings.image = "interface_character";
        settings.alpha = 0.0;
        this._super(me.Entity, 'init', [x, y , settings]);
        this.alwaysUpdate = true;
        this.anchorPoint.set(0, 0);
        this.floating = true;
        this.body.addShape( new me.Rect( 0, 0, settings.width, settings.height ) );
        this.color = new me.Color(255, 255, 255);
        this.font = new me.Font('Arial', 16, this.color.toHex());
        this.font.textAlign = "left";
        this.renderable.setOpacity(0.0);
        this.text = text ? text : "";
    },
    draw : function(renderer) {
        this._super(me.Entity, 'draw', [renderer]);
        if( this.renderable.getOpacity() ) {
            var context = renderer.getContext();
            this.font.drawStroke(context, this.text, this.pos.x + 10, this.pos.y + 10);
        }
    },
    showCharacterInfo: function() {
        this.renderable.setOpacity(1);
    },
    hideCharacterInfo: function() {
        this.renderable.setOpacity(0);
    },
    update : function (dt) {
        return false;
    }
});