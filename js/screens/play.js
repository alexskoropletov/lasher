game.PlayScreen = me.ScreenObject.extend({
    /**    
     *  action to perform on state change
     */
    onResetEvent: function() {    
      // load a level
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
    
    /**    
     *  action to perform on state change
     */
    onDestroyEvent: function() {    
    
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
        
        // stop some music
//        me.audio.stopTrack("DST-GameForest");
    }
});
