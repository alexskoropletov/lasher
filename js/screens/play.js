/*
 game.PlayScreen = me.ScreenObject.extend({
 onResetEvent: function() {
 me.levelDirector.loadLevel("map_maze");
 var collideMap = [];
 for( Col in me.game.collisionMap.layerData ) {
 for( Row in me.game.collisionMap.layerData[Col] ) {
 if( typeof collideMap[Col] == "undefined" ) {
 collideMap[Col] = [];
 }
 collideMap[Col][Row] = me.game.collisionMap.layerData[Col][Row] ? 0 : 1;
 }
 }

 game.pathfinder.graph = new Graph(collideMap);
 game.pathfinder.graph.diagonal = 1;

 //        game.pathfinder.grid = new PF.Grid(
 //            me.game.collisionMap.cols,
 //            me.game.collisionMap.rows,
 //            collideMap
 //        );
 //        game.pathfinder.gridBackup = collideMap;

 // reset the score
 game.data.score = 0;

 // add our HUD to the game world
 this.HUD = new game.HUD.Container();
 me.game.world.addChild(this.HUD);

 game.player = me.game.world.getChildByName("mainPlayer")[0];
 //        var fogOfWar = new game.PlayerFogOfWar(
 //            game.player.pos.x - 80,
 //            game.player.pos.y - 80,
 //            {
 //                width: 160,
 //                height: 160
 //            }
 //        );
 //        me.game.world.addChild( fogOfWar, 800 );
 //        game.fogOfWar = fogOfWar;

 // play some music
 //        me.audio.playTrack("DST-GameForest");
 },

 onDestroyEvent: function() {

 // remove the HUD from the game world
 me.game.world.removeChild(this.HUD);

 // stop some music
 //        me.audio.stopTrack("DST-GameForest");
 }
 });
 */
game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        game.startRain();

        this.gridForThisLevel = game.pathfinder.gridTypes["grid" + game.getRandomInt( 1, 1 )];
        game.pathfinder.graph = new Graph(this.gridForThisLevel._map);

        this.pointerPosition = {
            x: this.gridForThisLevel.x,
            y: this.gridForThisLevel.y,
            mapX: 1,
            mapY: 1
        };

        this.gridList = {};

        this.playerPosition = {
            x: this.gridForThisLevel.x,
            y: ( this.gridForThisLevel.y - 32 ),
            mapX: 1,
            mapY: 1
        };
        for( var playerY in this.gridForThisLevel._location ) {
            for( var playerX in this.gridForThisLevel._location[playerY] ) {
                if( this.gridForThisLevel._location[playerY][playerX] == 1 ) {
                    this.playerPosition.x += playerX * 32;
                    this.playerPosition.y += playerY * 32;
                    this.playerPosition.mapX = playerX;
                    this.playerPosition.mapY = playerY;
                }
            }
        }

        game.fightObjects = {
            //background
            backgroundLayer: {
                object: new me.ImageLayer("forest", 800, 600, "forest", 1, 1),
                zindex: 2
            },
            grid: {
                object: new me.Sprite(this.gridForThisLevel.x, this.gridForThisLevel.y, me.loader.getImage(this.gridForThisLevel.image)),
                zindex: 4
            },
            //characters
            joseCharacter:  {
                object: new game.CharacterFightSmall( this.playerPosition.x, this.playerPosition.y, { width: 32, height: 64, image: "jose_small" } ),
                zindex: 50
            },
//            pedroCharacter:  {
//                object: new game.CharacterFightSmall( 468, 344, { width: 32, height: 64, image: "pedro_small" } ),
//                zindex: 50
//            },
//            pepeCharacter: {
//                object: new game.CharacterFightSmall( 248, 408, { width: 32, height: 64, image: "pepe_small" } ),
//                zindex: 50
//            },
            getOut: {
//                object: new game.MainBaseGetout( 49, 500, { width: 64, height: 64, spritewidth: 64, spriteheight: 64, image: "getout" }, game.customStates.MAP ),
//                zindex: 70
            }
        };

        game.fightGrid = {};
        for( mapX = 0; mapX < this.gridForThisLevel._map.length; mapX++ ) {
            for( mapY = 0; mapY < this.gridForThisLevel._map[mapX].length; mapY++ ) {
                game.fightGrid['active' + mapX + mapY] = {
                    object: new game.gridEntiry(
                        this.gridForThisLevel.x + mapY * 32,
                        this.gridForThisLevel.y + mapX * 32,
                        { width: 32, height: 32, image: "active_grid" }
                    ),
                    zindex: 5
                };
                game.fightGrid['activenoway' + mapX + mapY] = {
                    object: new game.gridEntiry(
                        this.gridForThisLevel.x + mapY * 32,
                        this.gridForThisLevel.y + mapX * 32,
                        { width: 32, height: 32, image: "active_grid_noway" }
                    ),
                    zindex: 5
                };
            }
        }

        for( k in game.fightObjects ) {
            if( game.fightObjects[k].object ) {
                me.game.world.addChild( game.fightObjects[k].object, game.fightObjects[k].zindex );
            }
        }

        this.hideGrid();
        for( k in game.fightGrid ) {
            if( game.fightGrid[k].object ) {
                me.game.world.addChild( game.fightGrid[k].object, game.fightGrid[k].zindex );
            }
        }
        me.event.subscribe("pointermove", this.mouseMove.bind(this));
    },
    onDestroyEvent: function() {
        game.stopRain();
    },
    showGrid: function( showThisGrid ) {
        for( var gridIndex = 0; gridIndex < showThisGrid.length; gridIndex++ ) {
            game.fightGrid[showThisGrid[gridIndex]].object.renderable.setOpacity(1);
        }
    },
    hideGrid: function() {
        for( k in game.fightGrid ) {
            if( game.fightGrid[k].object ) {
                game.fightGrid[k].object.renderable.setOpacity(0);
            }
        }
    },
    mouseMove: function( e ) {
        if( game.fightObjects.grid.object.containsPoint( e.gameWorldX, e.gameWorldY ) ) {
            this.pointerPosition.x = e.gameWorldX;
            this.pointerPosition.y = e.gameWorldY;
            this.pointerPosition.mapX = Math.floor( ( e.gameWorldX - this.gridForThisLevel.x ) / 32 );
            this.pointerPosition.mapY = Math.floor( ( e.gameWorldY - this.gridForThisLevel.y ) / 32 );
            this.showPath();
        } else {
            this.hideGrid();
        }
    },
    showPath: function( toX, toY ) {
        if( typeof game.pathfinder.graph.grid[parseInt(this.pointerPosition.mapY)] != 'undefined' ) {
            var result = astar.search(
                game.pathfinder.graph,
                game.pathfinder.graph.grid[parseInt(this.playerPosition.mapY)][parseInt(this.playerPosition.mapX)],
                game.pathfinder.graph.grid[parseInt(this.pointerPosition.mapY)][parseInt(this.pointerPosition.mapX)],
                { closest: true }
            );
            if( result.length ) {
                this.hideGrid();
                var showThisGrid = [];
                for( k in result ) {
                    if( typeof result[k].x != 'undefined' && typeof result[k].y != 'undefined' ) {
                        showThisGrid.push( ( k > 3 ? "activenoway" : "active" ) + result[k].x + result[k].y);
                    }
                }
                this.showGrid( showThisGrid );
            }
        }
    }
});
