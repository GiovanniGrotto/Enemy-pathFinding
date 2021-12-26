import React, {useState, useEffect} from "react";
import Node from "./Node"
import Astar from "../Algorithm/AStar"
import kdTree from "../Algorithm/kdTree"
import "./Pathfind.css"

const cols=25;
const rows=10;

let NODE_START_ROW = 0;
let NODE_START_COL = 0;
let NODE_END_ROW = rows-1;
let NODE_END_COL = cols-1;
const RENDER_RATE=10;

let Enemies=[];

const grid = new Array(rows);
for(let i=0;i<cols;i++){
  grid[i]=new Array(cols);
}

const Pathfind=()=>{

  const [Grid, setGrid] = useState([]);
  let finalPath
  let visitedNodes

  useEffect(()=>{
    initializeGrid();
  }, []);

  const initializeGrid=()=>{ //chiamato rul return, crea e setta la griglia, i muri vegono generati su create spot
    createSpot(grid);
    setGrid(grid);
  };

  const createSpot=(grid)=>{ //crea un nuovo spot che sarà la casella
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        grid[i][j]=new Spot(i,j);
      }
    }
  };

  const addNeighbours=(grid) =>{ //calcola i vicini
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        grid[i][j].addneighbours(grid);
      }
    }
  };

  function Spot(i,j){  //costruttore di spot
    this.x=i;
    this.y=j;
    this.isStart=setStart(this.x,this.y);
    this.isEnd=false;
    this.g=0;
    this.f=0;
    this.h=0;
    this.neighbours=[];
    this.isWall=false;
    this.isEnemy=false;
    this.prevoius=undefined;
    this.addneighbours=function(grid)
    {
      let i=this.x;
      let j=this.y;
      if(i>0) this.neighbours.push(grid[i-1][j]);
      if(i<rows-1) this.neighbours.push(grid[i+1][j]);
      if(j>0) this.neighbours.push(grid[i][j-1]);
      if(j<cols-1) this.neighbours.push(grid[i][j+1]);
    };
  }

  function setStart(x,y){
    if(x === NODE_START_ROW && y === NODE_START_COL){
      return true;
    }
    return false;
  }

  function setEnd(x,y){
    if(x === NODE_END_ROW && y === NODE_END_COL){
      return true;
    }
    return false;
  }

  const gridwithNode=(   //disegna la griglia
    <div>
      {Grid.map((row,rowIndex)=>{
        return(
          <div key={rowIndex} className="rowWrapper">
            {row.map((col,colIndex)=>{
              const{isStart,isEnd,isWall,isEnemy}=col;
              return(
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  row={rowIndex}
                  col={colIndex}
                  isWall={isWall}
                  isEnemy={isEnemy}
                />
              )
            })}
          </div>
        );
      })}
    </div>
  );

  async function visualizePath(){ //funzione attivata quando si preme il bottone
    setWall();
    addNeighbours(grid);    //aggiungiamo i vicini della nuova griglia
    var startNode=grid[NODE_START_ROW][NODE_START_COL];
    var endNode=grid[NODE_END_ROW][NODE_END_COL];
    startNode.isWall=false;
    endNode.isWall=false;   //ci assicuriamo che start e end non siano muri
    let tmp=startNode;
    if(Enemies.length == 0)alert("No enemies found");
    while(Enemies.length != 0){
      clearGrid();
      let enemyIndex = kdTree(Enemies,tmp);
      let enemy = grid[Enemies[enemyIndex].x][Enemies[enemyIndex].y];
      console.log(Enemies);
      console.log("start:"+tmp.x+" "+tmp.y);
      console.log("end:"+enemy.x+" "+enemy.y);
      let path=Astar(tmp,enemy,0);  //l'algoritmo Astar restituisce il percorso migliore e i nodi visitati
      tmp=enemy;
      Enemies.splice(enemyIndex,1);
      visitedNodes=path.visitedNodes;
      finalPath=path.path
      if(finalPath.length == 0){
        alert("No path found");
        break;
      }
      visualizeShortest(finalPath);
      await sleep(3000);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const visualizeShortest=(shortestPath)=>{  //dato un path in input anima quel path
      for(let i=shortestPath.length-1;i>=0;i--){
        setTimeout(()=>{
          i=shortestPath.length-1-i;
          const node=shortestPath[i];
          if((!node.isStart && !node.isEnd && !node.isEnemy) || i === 0){
            document.getElementById(`node-${node.x}-${node.y}`).className="node node-walking";
          }
        },RENDER_RATE*15*i);
        setTimeout(()=>{
          i=shortestPath.length-1-i;
          if(i<shortestPath.length-1){
            i=shortestPath.length-1-i;
            const node=shortestPath[i];
            if(!node.isStart && !node.isEnd && !node.isEnemy){
              document.getElementById(`node-${node.x}-${node.y}`).className="node node";
            }
          }
        },RENDER_RATE*15*i+180);
      }
      let node = document.createElement('li');
      node.appendChild(document.createTextNode("PathNode:"+shortestPath.length));
      document.querySelector('ul').appendChild(node);
      console.log("PathNode:"+shortestPath.length);
  }

  function clearGrid(){
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        let node=document.getElementById(`node-${i}-${j}`)
        if(grid[i][j].isStart){
          node.className="node node-start";
        }
        else if(grid[i][j].isEnd){
          node.className="node node-end";
        }else if(!grid[i][j].isWall && !grid[i][j].isEnemy){
          document.getElementById(`node-${i}-${j}`).className="node ";
        }
      }
    }
  }

  function setWall(){
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        if(document.getElementById(`node-${i}-${j}`).isWall){
          grid[i][j].isWall=true;
        }
      }
    }
  }

  function setRandomWall(){
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        if(Math.floor((Math.random()*100)+1)<20 && !grid[i][j].isStart && !grid[i][j].isEnd && !grid[i][j].isEnemy){
          grid[i][j].isWall=true;
          document.getElementById(`node-${i}-${j}`).className="node isWall";
        }
      }
    }
  }

  function setRandomEnemies(){
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        if(Math.floor((Math.random()*100)+1)<7 && !grid[i][j].isStart && !grid[i][j].isEnd && !grid[i][j].isWall){
          grid[i][j].isEnemy=true;
          document.getElementById(`node-${i}-${j}`).className="node isEnemy";
          let obj = {x:i,y:j};
          Enemies.push(obj);
        }
      }
    }
  }

  function clearWall(){
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        let node=document.getElementById(`node-${i}-${j}`)
        if(node.className==="node isWall" || node.className==="node isEnemy"){
          grid[i][j].isWall=false;
          document.getElementById(`node-${i}-${j}`).className="node node";
        }
      }
    }
  }

  return(
    <div className="Wrapper">
    <button onClick={visualizePath}>Visualize Path</button>
    <button onClick={setRandomWall}>Generate Wall</button>
    <button onClick={setRandomEnemies}>Generate Enemies</button>
      <h1>Pathfind</h1>
      {gridwithNode}
      <ul id="list"></ul>
    </div>
  );
};


export default Pathfind;
