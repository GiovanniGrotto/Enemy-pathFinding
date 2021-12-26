import React from "react"
import "./Node.css"
import Pathfind from"./Pathfind"

let oldRowS=0;
let oldColS=0;
let oldRowE=9;
let oldColE=24;
let isFirst=true;
let isSecond=true;

const Node=({isStart,isEnd,row,col,isWall})=>{
  const classes= isStart ? "node-start" : isWall ? "isWall" :  isEnd ?"node-end" :"";

  function changePropreties(row,col){
    console.log(row+"-"+col);
    if(isFirst){
      document.getElementById(`node-${oldRowS}-${oldColS}`).className="node node";
      document.getElementById(`node-${oldRowS}-${oldColS}`).isStart=false;
      document.getElementById(`node-${row}-${col}`).className="node node-start";
      document.getElementById(`node-${row}-${col}`).isStart=true;
      oldRowS=row;
      oldColS=col;
      isFirst=false;
    }else if(!isFirst && isSecond){
      document.getElementById(`node-${oldRowE}-${oldColE}`).className="node node";
      document.getElementById(`node-${oldRowE}-${oldColE}`).isEnd=false;
      document.getElementById(`node-${row}-${col}`).className="node node-end";
      document.getElementById(`node-${row}-${col}`).isEnd=true;
      oldColE=col;
      oldRowE=row;
      isSecond=false;
    }else{
      if(!document.getElementById(`node-${row}-${col}`).isStart && !document.getElementById(`node-${row}-${col}`).isEnd){
        document.getElementById(`node-${row}-${col}`).className="node isWall";
        document.getElementById(`node-${row}-${col}`).isWall=true;
      }
    }
  }

  return(
    <div className={`node ${classes}`} id={`node-${row}-${col}`} onClick={()=>{changePropreties(row,col)}}></div>
  );
};

export default Node;
