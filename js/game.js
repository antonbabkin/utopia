(function noGlobals() {
    
    // constants
    var cObjects = {
        tree: 0,
        wood: 1
    };
    var cMapGrid = {
        width: 15,
        height: 15
    };
    var cTile = {
        width: 32,
        height: 32
    };

    var mapObjects; // immobile objects on map
    var mapObjectsGrid = []; // 2-dim array of immobile objects' codes
    var ground;
    var hero;
    
    var game = new Phaser.Game(cMapGrid.width * cTile.width, cMapGrid.height * cTile.height, Phaser.AUTO, '', { preload: preload, create: create, update: update });
     
    function preload() {
        game.load.image('grass', 'assets/grass.png');
        game.load.image('tree', 'assets/tree.png');
        game.load.image('wood', 'assets/wood.png');
        game.load.image('hero', 'assets/hero.png');
    }
    


    
    function create() {
        var i, j;
        var tile; // used to fill groups with sprites
        
        // fill ground with grass
        ground = game.add.group();
        trees = game.add.group();
        
        for (i = 0; i < cMapGrid.width; i += 1) {
            mapObjectsGrid[i] = [];
            
            for (j = 0; j < cMapGrid.height; j += 1) {
                //  fill ground with grass
                tile = ground.create(i * cTile.width, j * cTile.height, 'grass');
                tile.body.immovable = true;
                
                // random immobile objects
                if ((i > 2 || j > 2) && Math.random() < 0.3) {
                    mapObjectsGrid[i][j] = cObjects.tree;
                    tile = mapObjects.create(i * cTile.width, j * cTile.height, 'tree');
                    tile.body.immovable = true;
                }
            }
        }
        
        hero = game.add.sprite(0,0,'hero');
        hero.body.collideWorldBounds = true;
        
        // controls
        cursors = game.input.keyboard.createCursorKeys();
    }
     
    function update() {
        
        // don't go through trees
        game.physics.collide(hero, trees);
        
        
//        //  stop hero velocity (movement) if reached next tile
//        if (hero.busy && hero.body.velocity.x < 0 && hero.body.x <= hero.i * 32) // finish move left
//        {
//            hero.body.velocity.x = 0;
//            hero.body.x = hero.i * 32;
//            hero.body.y = hero.j * 32;
//            hero.busy = false;
//        }
//        else if (hero.busy && hero.body.velocity.x > 0 && hero.body.x >= hero.i * 32) // finish move right
//        {
//            hero.body.velocity.x = 0;
//            hero.body.x = hero.i * 32;
//            hero.body.y = hero.j * 32;
//            hero.busy = false;
//        }
//        else if (hero.busy && hero.body.velocity.y < 0 && hero.body.y <= hero.j * 32) // finish move up
//        {
//            hero.body.velocity.y = 0;
//            hero.body.x = hero.i * 32;
//            hero.body.y = hero.j * 32;
//            hero.busy = false;
//        }
//        else if (hero.busy && hero.body.velocity.y > 0 && hero.body.y >= hero.j * 32) // finish move down
//        {
//            hero.body.velocity.y = 0;
//            hero.body.x = hero.i * 32;
//            hero.body.y = hero.j * 32;
//            hero.busy = false;
//        }
//    
//        if (!hero.busy && cursors.left.isDown)
//        {
//            //  Move to the left
//            hero.i = Math.max(0,hero.i-1);
//            hero.body.velocity.x = -150;
//            hero.busy = true;
//    
//        }
//        else if (!hero.busy && cursors.right.isDown)
//        {
//            //  Move to the right
//            hero.i = Math.min(grid.width-1,hero.i+1);
//            hero.body.velocity.x = 150;
//            hero.busy = true;
//        }
//        else if (!hero.busy && cursors.down.isDown)
//        {
//            //  Move down
//            hero.busy = true;
//            hero.j = Math.min(grid.height-1,hero.j+1);
//            hero.body.velocity.y = 150;
//        }
//        else if (!hero.busy && cursors.up.isDown)
//        {
//            //  Move up
//            hero.busy = true;
//            hero.j = Math.max(0,hero.j-1);
//            hero.body.velocity.y = -150;
//        }
    }
}());