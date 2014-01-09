var game = new Phaser.Game(640, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
function preload() {
    game.load.image('grass', 'assets/grass.png');
    game.load.image('tree', 'assets/tree.png');
    game.load.image('wood', 'assets/wood.png');
    game.load.image('hero', 'assets/hero.png');
}

var ground;
var trees;
var hero;

function create() {
    // fill ground with grass
    ground = game.add.group();
    trees = game.add.group();
    
    for (var i = 0; i*32 <= game.world.width; i++)
    {
        for (var j = 0; j*32 <= game.world.height; j++)
        {
            //  Create grass inside of the 'ground' group
            var grass = ground.create(i * 32, j*32, 'grass');
            grass.body.immovable = true;
            
            // random trees
            if (Math.random() < 0.3)
            {
                var tree = trees.create(i*32, j*32, 'tree');
                tree.body.immovable = true;
            }
        }
    }
    
    hero = game.add.sprite(0,0,'hero');
    hero.body.collideWorldBounds = true;
    
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}
 
function update() {
    
    // don't go through trees
    game.physics.collide(hero, trees);
    
        //  Reset the heros velocity (movement)
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        hero.body.velocity.x = -150;

    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        hero.body.velocity.x = 150;
    }
    else if (cursors.down.isDown)
    {
        //  Move down
        hero.body.velocity.y = 150;
    }
    else if (cursors.up.isDown)
    {
        //  Move up
        hero.body.velocity.y = -150;
    }
}