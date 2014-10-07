game.Enemy1 = me.Entity.extend({
    init: function(x, y, settings) {
        settings.image = "enemy_image" + ( Math.floor(Math.random() * 3) + 1 );
        this._super(me.Entity, 'init', [x, y , settings]);
        this.image = settings.image;
        this.alwaysUpdate = true;
        this.walkThisPath = [];
        this.isEnemy = 1;
        this.body.setVelocity(1, 1);
        this.body.setFriction(0.5, 0.5);
        this.renderable.addAnimation( "idle",            [0, 0, 0, 0, 8, 9, 10, 11 ], 50 );
        this.renderable.addAnimation( "horizontal",      [0, 1, 2,  1], 45 );
        this.renderable.addAnimation( "vertical",        [0, 3, 4,  3], 45 );
        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(0.5, 0.5);
    },
    update : function (dt) {
        this.movingX = 0;
        this.movingY = 0;
        if( this.distanceTo( game.player ) <= 200 ) {
            this.currentTileX = Math.floor( this.pos.x / me.game.currentLevel.tilewidth );
            this.currentTileY = Math.floor( this.pos.y / me.game.currentLevel.tileheight );
            this.currentTileXExtra = Math.ceil( this.pos.x / me.game.currentLevel.tilewidth );
            this.currentTileYExtra = Math.ceil( this.pos.y / me.game.currentLevel.tileheight );
            this.nextTileX = Math.floor( game.player.pos.x / me.game.currentLevel.tilewidth );
            this.nextTileY = Math.floor( game.player.pos.y / me.game.currentLevel.tileheight );
            this.walkThisPath = astar.search(
                game.pathfinder.graph,
                game.pathfinder.graph.grid[this.currentTileX][this.currentTileY],
                game.pathfinder.graph.grid[this.nextTileX][this.nextTileY],
                {
                    closest: 1
                }
            );
            if( this.walkThisPath[0] && this.walkThisPath[0].x == this.currentTileX && this.walkThisPath[0].y == this.currentTileY ) {
                this.walkThisPath.splice(0, 1);
            }
            if( this.walkThisPath[0] ) {
                if( this.walkThisPath[0].x != this.currentTileX ) {
                    if( this.walkThisPath[0].x > this.currentTileX ) {
                        this.body.vel.x += this.body.accel.x * me.timer.tick;
                        this.movingX = 1;
                    } else {
                        this.body.vel.x -= this.body.accel.x * me.timer.tick;
                        this.movingX = -1;
                    }
                }
                if( this.walkThisPath[0].y != this.currentTileY ) {
                    if( this.walkThisPath[0].y > this.currentTileY ) {
                        this.body.vel.y += this.body.accel.y * me.timer.tick;
                        this.movingY = 1;
                    } else {
                        this.body.vel.y -= this.body.accel.y * me.timer.tick;
                        this.movingY = -1;
                    }
                }
                if( this.currentTileX != this.currentTileXExtra && !this.movingX ) {
                    if( this.currentTileX > this.currentTileXExtra ) {
                        this.movingX = 1;
                    } else {
                        this.movingX = -1;
                    }
                }
                if( this.currentTileY != this.currentTileYExtra && !this.movingY ) {
                    if( this.currentTileY > this.currentTileYExtra ) {
                        this.movingY = 1;
                    } else {
                        this.movingY = -1;
                    }
                }
            }
            if (this.movingX && !this.movingY ) {
                this.renderable.setCurrentAnimation("horizontal");
            } else if (this.movingY && !this.movingX ) {
                this.renderable.setCurrentAnimation("vertical");
            }
            if( !this.movingX ){
                this.body.vel.x = 0;
            }
            if( !this.movingY ){
                this.body.vel.y = 0;
            }
        }
        if( !this.movingX && !this.movingY ) {
            this.renderable.setCurrentAnimation("idle");
        }
        this.body.update();
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
    collideHandler : function (response) {
        if( typeof( response.b.isBullet ) != "undefined" ){
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            var self = this;
            if( response.b.completeDirection == 'right' || response.b.completeDirection == 'left' ) {
                var death = new game.EnemyDeathHorizontal(
                    self.pos.x + ( response.b.completeDirection == 'right' ? 16 : -32 ),
                    self.pos.y,
                    {
                        width: 64,
                        height: 32,
                        image: self.image
                    },
                    response.b.completeDirection
                );
                me.game.world.addChild( death, 7 );
            } else if( response.b.completeDirection == 'down' || response.b.completeDirection == 'up'  ) {
                var death = new game.EnemyDeathVertical(
                    self.pos.x,
                    self.pos.y + ( response.b.completeDirection == 'down' ? 16 : -16 ),
                    {
                        width: 64,
                        height: 32,
                        image: self.image
                    },
                    response.b.completeDirection
                );
                me.game.world.addChild( death, 7 );
            }
            me.game.world.removeChild(this);
            return false;
        }
    }
});

game.EnemyDeathHorizontal = me.Entity.extend({
    init: function(x, y, settings, direction) {
        settings.spriteheight = 32;
        settings.spritewidth = 64;
        this._super(me.Entity, 'init', [x, y , settings]);
//        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        this.isCorpse = true;
        this.body.addShape(
            new me.Rect(0, 0, 64, 32)
        );
        this.body.setShape(0);
        this.renderable.addAnimation( "death_right", [12, 13, 14, 15], 40 );
        this.renderable.addAnimation( "death_left", [16, 17, 18, 19], 40 );
        this.renderable.setCurrentAnimation("death_" + direction, (function () {
            me.game.world.removeChild(this);
            return false; // do not reset to first frame
        }).bind(this));
        this.anchorPoint.set(0.5, 0.5);
        this.alwaysUpdate = true;
        this.body.setVelocity(0, 0);
        this.body.setFriction(0, 0);
    }
});

game.EnemyDeathVertical = me.Entity.extend({
    init: function(x, y, settings, direction) {
        settings.spriteheight = 64;
        settings.spritewidth = 32;
        this._super(me.Entity, 'init', [x, y , settings]);
        this.isCorpse = true;
        this.body.addShape(
            new me.Rect(0, 0, 32, 64)
        );
        this.body.setShape(0);
//        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        this.renderable.addAnimation( "death_up", [28, 29, 30, 31], 40 );
        this.renderable.addAnimation( "death_down", [24, 25, 26, 27], 40 );
        this.renderable.setCurrentAnimation("death_" + direction, (function () {
            me.game.world.removeChild(this);
            return false; // do not reset to first frame
        }).bind(this));
        this.anchorPoint.set(0.5, 0.5);
        this.alwaysUpdate = true;
        this.body.setVelocity(0, 0);
        this.body.setFriction(0, 0);
    }
});