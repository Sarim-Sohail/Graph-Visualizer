import GraphNode from "./nodes.js";
import GraphEdges from "./edges.js";
import {svg} from "./grid.js";
import { Tooltip } from "./grid.js";
export let graphNodes=[];
let graphEdges=[];
var showWeights=true;
var slow=1000;
fetch("./data.json")
.then(response => {
   return response.json();
})
.then(function(data){
  
  for(var key of Object.keys(data["nodes"])){
    var id=data["nodes"][key].id;
    var x=data["nodes"][key].x;
    var y=data["nodes"][key].y;
    graphNodes.push(new GraphNode(id,x,y));
    graphNodes[key].PlotNode();
    
  }
  
  for(var key of Object.keys(data["edges"])){
    var id=data["edges"][key].id;
    var source=data["edges"][key].source;
    var target=data["edges"][key].target;
    var weight=data["edges"][key].weight;
    graphEdges.push(new GraphEdges(id,source,target,weight));
    d3.select("#weight"+id).text(weight);
    graphEdges[key].PlotEdge();
  }

  
  
  document.getElementById("showHide").addEventListener("click",()=>{
    showWeights=!showWeights;
    
    if(showWeights){
        d3.selectAll("text").style("opacity",1)
        document.getElementById("showHide").innerHTML="Hide Weights";
        
    }
    else{
        d3.selectAll("text").style("opacity",0)
        document.getElementById("showHide").innerHTML="Show Weights";
    }
  });
  document.getElementById("speedControl").addEventListener('change',updateSpeed);
  Djikstra();

  
});

function updateSpeed(e){
  console.log("Hello");
  slow=d3.select(this).property("value")
}

 async function Djikstra(){
      
      var sptSet=[];
      var throughSet=[];
      var distSet=[];
      var nodeSet=[];
      for(var i=0;i<graphNodes.length;i++){
        if(graphNodes[i].GetId()==5){
          animateNode(graphNodes[i].GetId());
          distSet.push(5);
        }
        else{
          distSet.push(Number.MAX_VALUE);
        }
        
        nodeSet.push(graphNodes[i].GetId());
      }
      var min=Number.MAX_VALUE;
      var minNode;
      while(!AllIncluded(sptSet)){
        min=Number.MAX_VALUE;
        for(var i=0;i<distSet.length;i++){
          if(distSet[i]<min && sptSet.indexOf(nodeSet[i])==-1){
            min=distSet[i];
            minNode=nodeSet[i];
          }
        }
        updateDistances(distSet,nodeSet,min,minNode,throughSet);
        sptSet.push(minNode);
       
      }
       
      
      for(var i=1;i<graphNodes.length;i++){
        for(var j=0;j<graphEdges.length;j++){
          if(graphEdges[j].getNode1()==i && graphEdges[j].getNode2()==throughSet[i] || graphEdges[j].getNode2()==i && graphEdges[j].getNode1()==throughSet[i]){
            coverEdge(graphEdges[j].getId());
            changeWeight(graphEdges[j].getId(),distSet[i]);
            await new Promise(r => setTimeout(r, slow));
          }
        }
      }
      console.log(distSet);
      console.log(throughSet);
      var sum=0;
      for(var i=0;i<distSet.length;i++){
        sum+=distSet[i];
      }
      console.log("Sum +"+sum);
}


function updateDistances(distSet,nodeSet,min,nodeId,throughSet){
  for(var i=0;i<graphEdges.length;i++){
    if(graphEdges[i].getNode1()==nodeId && min+graphEdges[i].getWeight()<distSet[nodeSet.indexOf(graphEdges[i].getNode2())]){
      
      distSet[nodeSet.indexOf(graphEdges[i].getNode2())]=min+graphEdges[i].getWeight();
      throughSet[nodeSet.indexOf(graphEdges[i].getNode2())]=graphEdges[i].getNode1();
      
    }
    else if(graphEdges[i].getNode2()==nodeId && min+graphEdges[i].getWeight()<distSet[nodeSet.indexOf(graphEdges[i].getNode1())]){
      distSet[nodeSet.indexOf(graphEdges[i].getNode1())]=min+graphEdges[i].getWeight();
      throughSet[nodeSet.indexOf(graphEdges[i].getNode1())]=graphEdges[i].getNode2();
    }
  }
  
}

        
        
        
    
function changeWeight(id,weight){
  var newW=parseFloat(weight).toFixed(2);
  d3.select("#weight"+id).text(newW);
  
}


function notIn(id,mstSet){
    if(mstSet.indexOf(id)==-1){
        return true;
    }
}

function coverEdge(id){
    d3.select("#edge"+id).attr('stroke','green').attr('stroke-width',5);
}

async function animateNode(id){
    for(var i=0;i<10;i++){
        await new Promise(r => setTimeout(r, 50));
        d3.select("#node"+id).attr("r",10+i).attr("stroke","white").attr('stroke-width',1).attr('fill','yellow');
    }
}

async function resetNode(id){
    for(var i=0;i<10;i++){
        await new Promise(r => setTimeout(r, 50));
        d3.select("#node"+id).attr("r",20-i).attr("stroke","green").attr('stroke-width',2).attr('fill','yellow');
    }
}






function AllIncluded(mstSet){
    for(var i=0;i<graphNodes.length;i++){
        if(mstSet.indexOf(graphNodes[i].GetId())==-1){
            return false;
        }
    }
    return true;
}











       
        

        

       
        
