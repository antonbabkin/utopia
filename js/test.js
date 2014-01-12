var mapObjects = []; // 2-dim array to store map immobile objects

for (var i = 0; i<10; i++) {
    mapObjects[i] = [];
    for (var j=0; j<5; j++) {
        mapObjects[i][j]=10*i+j;
    }
}