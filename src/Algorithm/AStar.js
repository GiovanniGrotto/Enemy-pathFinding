var visitedNodes=[];
function Astar(startNode,endNode,mode){
  let openSet=[];
  let closedSet=[];
  let path=[];
  visitedNodes=[];

  openSet.push(startNode);
  while(openSet.length>0){
    let leastIndex=0;
    for(let i=0;i<openSet.length;i++){
      if(openSet[i].f < openSet[leastIndex].f){
        leastIndex=i;
      }
    }

    let current= openSet[leastIndex];
    visitedNodes.push(current);
    if(current === endNode){
      let temp=current;
      path.push(temp);
      while(temp.prevoius){
        path.push(temp.prevoius);
        temp=temp.prevoius;
      }
      for(const n of visitedNodes){
        n.prevoius=undefined;
      }
      return {path,visitedNodes};
    }

    openSet=openSet.filter((elt)=>elt !== current); //crea un nuovo array con tutti gli elementi diversi da current
    closedSet.push(current);
    let neighbours= current.neighbours;
    for(let i=0;i<neighbours.length;i++){
      let neighbour=neighbours[i];
      if(!closedSet.includes(neighbour) && !neighbour.isWall){
        let tempG=current.g+1;
        let newPath=false;
        if(!openSet.includes(neighbour)){
          if(tempG < neighbour.g){
            neighbour.g=tempG;
            newPath=true;
          }else{
            neighbour.g=tempG;
            newPath=true;
            openSet.push(neighbour);
          }

          if(newPath && mode===0){
            neighbour.h=manhattenDistance(neighbour,endNode);
            neighbour.f=neighbour.g+neighbour.h;
            neighbour.prevoius=current;
          }else if(newPath && mode===1){
            neighbour.h=squareHeuristic(neighbour,endNode);
            neighbour.f=neighbour.g+neighbour.h;
            neighbour.prevoius=current;
          }else if(newPath && mode===2){
            neighbour.h=heuristic(neighbour,endNode);
            neighbour.f=neighbour.g+neighbour.h;
            neighbour.prevoius=current;
          }
        }
      }
    }
  }
  return{path,visitedNodes,error:"No path found"}
}

function heuristic(a,b){
  let d=Math.abs(a.x-a.y) + Math.abs(b.x-b.y);
  return d;
}

function squareHeuristic(a,b){
  let d=Math.sqrt(Math.abs(a.x-b.x)+1^2+Math.abs(a.y-b.y)+1^2);
  return d;
}

function manhattenDistance(node, finishNode) {
  let x = Math.abs(node.x - finishNode.x);
  let y = Math.abs(node.y - finishNode.y);
  return x + y;
}

export default Astar;
