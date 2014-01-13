(function noGlobals() {
    
    // constants
    var cObjects = {
        tree: 0,
        wood: 1,
        rock: 2
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
    var mapGround; // tileset for map ground
    var player;
    var controls; // keyboard controls    
    
    var game = new Phaser.Game(cMapGrid.width * cTile.width, cMapGrid.height * cTile.height, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
    
    

    
    
    
    // load assets
    function preload() {
        game.load.image('hero', 'assets/hero.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('tree', 'assets/tree.png');
        game.load.image('wood', 'assets/wood.png');
        game.load.image('rock', 'assets/rock.png');
    }
    


    // initialize
    function create() {
        var i, j;
        var tile; // used to fill groups with sprites
        var rand;
        
        // fill ground with grass
        mapGround = game.add.group();
        mapObjects = game.add.group();
        
        for (i = 0; i < cMapGrid.width; i += 1) {
            mapObjectsGrid[i] = [];
            
            for (j = 0; j < cMapGrid.height; j += 1) {
                //  fill ground with grass
                tile = mapGround.create(i * cTile.width, j * cTile.height, 'grass');
                tile.body.immovable = true;
                
                // random immobile objects
                if (i > 2 || j > 2) {
                    rand = Math.random();
                    if (rand < 0.2) {
                        mapObjectsGrid[i][j] = cObjects.tree;
                        tile = mapObjects.create(i * cTile.width, j * cTile.height, 'tree');
                        tile.body.immovable = true;
                    } else if (rand < 0.3) {
                        mapObjectsGrid[i][j] = cObjects.rock;
                        tile = mapObjects.create(i * cTile.width, j * cTile.height, 'rock');
                        tile.body.immovable = true;
                    }
                }
            }
        }
        
        player = game.add.sprite(0,0,'hero');
        //player.busy = false; // busy while moving between tiles
        player.speed = 80;
        player.posCurrent = { // position on map grid
            i: 0, // horizontal
            j: 0 // vertical
        }
        player.posNext = { // position on map grid
            i: 0, // horizontal
            j: 0 // vertical
        }

        
        // keyboard controls
        controls = {
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            up: game.input.keyboard.addKey(Phaser.Keyboard.W)
        }

    }
    
    // do update() every frame, 60 FPS
    function update() {
        
        // movement        
        if (player.body.velocity.x === 0 && player.body.velocity.y === 0) { // can start moving
            if (controls.left.isDown && player.posCurrent.i > 0 && mapObjectsGrid[player.posCurrent.i - 1][player.posCurrent.j] === undefined) {
                player.body.velocity.x = -player.speed;
                player.posNext.i -= 1;
            } else if (controls.right.isDown && player.posCurrent.i < cMapGrid.width - 1 && mapObjectsGrid[player.posCurrent.i + 1][player.posCurrent.j] === undefined) {
                player.body.velocity.x = player.speed;
                player.posNext.i += 1;
            } else if (controls.up.isDown && player.posCurrent.j > 0 && mapObjectsGrid[player.posCurrent.i][player.posCurrent.j - 1] === undefined) {
                player.body.velocity.y = -player.speed;
                player.posNext.j -= 1;
            } else if (controls.down.isDown && player.posCurrent.j < cMapGrid.height - 1 && mapObjectsGrid[player.posCurrent.i][player.posCurrent.j + 1] === undefined) {
                player.body.velocity.y = player.speed;
                player.posNext.j += 1;
            }
        } else { // already moving. check if destination reached
            if ((player.posNext.i - player.posCurrent.i) * player.body.x >= (player.posNext.i - player.posCurrent.i) * player.posNext.i * cTile.width && (player.posNext.j - player.posCurrent.j) * player.body.y >= (player.posNext.j - player.posCurrent.j) * player.posNext.j * cTile.height) {
                player.posCurrent.i = player.posNext.i;
                player.posCurrent.j = player.posNext.j;
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
                player.body.x = player.posCurrent.i * cTile.width;
                player.body.y = player.posCurrent.j * cTile.height;
            }
        }
            
        
    
    }
    
    
    
    function render() {

//        game.debug.renderSpriteCollision(player, 0, 20, 'rgb(255, 0, 0)');
//        game.debug.renderText('player.posCurrent: ' + player.posCurrent.i.toString() + ',' + player.posCurrent.j.toString(), 0, 150, 'rgb(0, 0, 0)');
//        game.debug.renderText('player.posNext: ' + player.posNext.i.toString() + ',' + player.posNext.j.toString(), 0, 170, 'rgb(0, 0, 0)');
//        game.debug.renderSpriteInfo(player, 0, 240, 'rgp(0, 0, 255)');

    }
}());