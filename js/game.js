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
    var cDirections = {
        up: 0,
        right: 1,
        down: 2,
        left: 3
    };
    var cItems = {
        wood: 0
    }
    



    var mapObjects = []; // immobile objects on map
    var mapGround; // tileset for map ground
    var player;
    var controls; // keyboard controls
    var i, j, t1, t2, t3; // multi-purpose temp vars
    
    var game = new Phaser.Game(cMapGrid.width * cTile.width, cMapGrid.height * cTile.height, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
    
    

    
    
    
    // load assets
    function preload() {
        game.load.spritesheet('hero', 'assets/hero_frames.png', 32, 32);
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
        
        for (i = 0; i < cMapGrid.width; i += 1) {
            mapObjects[i] = [];
            
            for (j = 0; j < cMapGrid.height; j += 1) {
                //  fill ground with grass
                tile = mapGround.create(i * cTile.width, j * cTile.height, 'grass');
                tile.body.immovable = true;
                
                // random immobile objects
                if (i > 2 || j > 2) {
                    rand = Math.random();
                    if (rand < 0.2) {
                        mapObjects[i][j] = {
                            type: cObjects.tree,
                            obj: game.add.sprite(i * cTile.width, j * cTile.height, 'tree')
                        };
                        mapObjects[i][j].obj.body.immovable = true;
                    } else if (rand < 0.3) {
                        mapObjects[i][j] = {
                            type: cObjects.rock,
                            obj: game.add.sprite(i * cTile.width, j * cTile.height, 'rock')
                        };
                        mapObjects[i][j].obj.body.immovable = true;
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
        };
        player.posNext = {
            i: 0,
            j: 0
        };
        player.facing = cDirections.down; // used to change sprites and interact with objects
        player.frame = 2;
        player.inventory = [
            {
                id: cItems.wood,
                quantity: 0
            }
        ];

        
        // keyboard controls
        controls = {
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            get: game.input.keyboard.addKey(Phaser.Keyboard.E),
            put: game.input.keyboard.addKey(Phaser.Keyboard.R)
        }

    }
    
    // do update() every frame, 60 FPS
    function update() {
        
// --------------------
// movement and actions
// --------------------
        // if not moving, then can change facing and start moving, get and put objects
        if (player.body.velocity.x === 0 && player.body.velocity.y === 0) { 
            // movement
            if (controls.left.isDown) {
                player.facing = cDirections.left;
                player.frame = 3;
                if (!game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) && player.posCurrent.i > 0 && mapObjects[player.posCurrent.i - 1][player.posCurrent.j] === undefined) {
                    player.body.velocity.x = -player.speed;
                    player.posNext.i -= 1;
                }
            } else if (controls.right.isDown) {
                player.facing = cDirections.right;
                player.frame = 1;
                if (!game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) && player.posCurrent.i < cMapGrid.width - 1 && mapObjects[player.posCurrent.i + 1][player.posCurrent.j] === undefined) {
                    player.body.velocity.x = player.speed;
                    player.posNext.i += 1;
                }
            } else if (controls.up.isDown) {
                player.facing = cDirections.up;
                player.frame = 0;
                if (!game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) && player.posCurrent.j > 0 && mapObjects[player.posCurrent.i][player.posCurrent.j - 1] === undefined) {
                    player.body.velocity.y = -player.speed;
                    player.posNext.j -= 1;
                }
            } else if (controls.down.isDown) {
                player.facing = cDirections.down;
                player.frame = 2;
                if (!game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) && player.posCurrent.j < cMapGrid.height - 1 && mapObjects[player.posCurrent.i][player.posCurrent.j + 1] === undefined) {
                    player.body.velocity.y = player.speed;
                    player.posNext.j += 1;
                }

            // get objects
            } else if (controls.get.isDown) {
                // check if player is facing an object
                i = player.posCurrent.i + (player.facing % 2) * (2 - player.facing);
                j = player.posCurrent.j + ((player.facing - 1) % 2);
                if (mapObjects[i][j] !== undefined) { // object exists
                    switch (mapObjects[i][j].type) {
                    case cObjects.tree:
                        mapObjects[i][j].obj.kill();
                        mapObjects[i][j] = undefined;
                        player.inventory[0].quantity += 1;
                        document.getElementById('inv').innerHTML = 'Inventory: ' + player.inventory[0].quantity + ' wood'
                        break;
                    case cObjects.wood:
                        mapObjects[i][j].obj.kill();
                        mapObjects[i][j] = undefined;
                        player.inventory[0].quantity += 1;
                        document.getElementById('inv').innerHTML = 'Inventory: ' + player.inventory[0].quantity + ' wood'
                        break;
                    case cObjects.rock:
                        // need mining skill or tool to remove rocks
                        break;
                    }
                }
                
            // put objects
            } else if (controls.put.isDown && player.inventory[0].quantity > 0) {
                // check if player is facing an object
                i = player.posCurrent.i + (player.facing % 2) * (2 - player.facing);
                j = player.posCurrent.j + ((player.facing - 1) % 2);
                if (mapObjects[i][j] === undefined && i >= 0 && i < cMapGrid.width && j >= 0 && j < cMapGrid.height) { //object does not exist
                    // place wood block
                    mapObjects[i][j] = {
                        type: cObjects.wood,
                        obj: game.add.sprite(i * cTile.width, j * cTile.height, 'wood')
                    };
                    mapObjects[i][j].obj.body.immovable = true;
                    player.inventory[0].quantity -= 1;
                    document.getElementById('inv').innerHTML = 'Inventory: ' + player.inventory[0].quantity + ' wood'
                }
            }
                
        // already moving. check if destination reached
        } else { 
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