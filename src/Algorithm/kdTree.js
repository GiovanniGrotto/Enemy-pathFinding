var createKDTree = require("static-kdtree")

function kdTree(enemies,start){
  let newStart=[start.x,start.y];
  //Create a bunch of points
  var newEnemies=[];
  for(const e of enemies){
    let tmp=[e.x,e.y];
    newEnemies.push(tmp);
  }
  //console.log(newEnemies);

  //Create the tree
  var tree = createKDTree(newEnemies)

  //Nearest neighbor queries
  //console.log("index of closest point to "+ newStart +" is ", tree.nn(newStart))
  //console.log(enemies[tree.nn(newStart)]);
  //return tree.knn(newStart, 4);
  return tree.nn(newStart);

  /*//Iterate over all points in the bounding box
  tree.range([-1, -1, -1], [10, 1, 2], function(idx) {
    console.log("visit:", idx)  //idx = index of point in points array
  })

  //Can also search in spheres
  tree.rnn([0,0,0], 10, function(idx) {
    console.log("point " + idx + " is in sphere at origin with radius=10")
  })

  //Nearest neighbor queries
  console.log("index of closest point to [0,1,2] is ", tree.nn([0,1,2]))

  //And k-nearest neighbor queries
  console.log("index of 10 closest points to [0,1,2] are ", tree.knn([0,1,2], 10))*/

  //For performance, be sure to delete tree when you are done with it
  tree.dispose()
}

export default kdTree;
