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

  document.getElementById("speedControl").addEventListener('change',updateSpeed);
  
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

  Bellman();

  
});

function updateSpeed(e){
  console.log("Hello");
  slow=d3.select(this).property("value")
}

 async function Bellman(){
      
      var sptSet=[];
      var throughSet=[];
      var distSet=[];
      var nodeSet=[];
      for(var i=0;i<graphNodes.length;i++){
        if(graphNodes[i].GetId()==0){
          animateNode(graphNodes[i].GetId());
          distSet.push(0);
          throughSet.push(0);
        }
        else{
          distSet.push(Number.MAX_VALUE);
        }
        
        nodeSet.push(graphNodes[i].GetId());
      }
      console.log("Distance");
      console.log(distSet);
      

      for(var i=0;i<graphNodes.length-1;i++){
          for(var j=0;j<graphEdges.length;j++){
              var u=graphEdges[j].getNode1();
              var v=graphEdges[j].getNode2();
              var weight=graphEdges[j].getWeight();
              if(distSet[nodeSet.indexOf(u)]!=Number.MAX_VALUE &&  distSet[nodeSet.indexOf(u)]+weight<distSet[nodeSet.indexOf(v)]){
                distSet[nodeSet.indexOf(v)]=distSet[nodeSet.indexOf(u)]+weight;
                throughSet[nodeSet.indexOf(v)]=u;
              }
          }
      }

      for(var i=0;i<graphNodes.length-1;i++){
        for(var j=0;j<graphEdges.length;j++){
            var u=graphEdges[j].getNode2();
            var v=graphEdges[j].getNode1();
            var weight=graphEdges[j].getWeight();
            if(distSet[nodeSet.indexOf(u)]!=Number.MAX_VALUE &&  distSet[nodeSet.indexOf(u)]+weight<distSet[nodeSet.indexOf(v)]){
              distSet[nodeSet.indexOf(v)]=distSet[nodeSet.indexOf(u)]+weight;
              throughSet[nodeSet.indexOf(v)]=u;
            }
        }
    }

      for(var i=0;i<graphEdges.length;i++){
        var u=graphEdges[i].getNode1();
        var v=graphEdges[i].getNode2();
        var weight=graphEdges[i].getWeight();
        if(distSet[nodeSet.indexOf(u)]!=Number.MAX_VALUE && distSet[nodeSet.indexOf(u)]+weight<distSet[nodeSet.indexOf(v)]){
            console.log("Negative cycle");
          }
      }
      console.log("Through set");
      console.log(throughSet);
      for(var i=0;i<distSet.length;i++){
       
          
            for(var k=0;k<graphEdges.length;k++){
              if((graphEdges[k].getNode1()==i && graphEdges[k].getNode2()==throughSet[i]) || (graphEdges[k].getNode2()==i && graphEdges[k].getNode1()==throughSet[i])){
                await new Promise(r => setTimeout(r, slow));
                coverEdge(graphEdges[k].getId());
                changeWeight(graphEdges[k].getId(),distSet[i]);
              }
            }
          }
        
      
     
       
      
      console.log(distSet);
      var sum=0;
      for(var i=0;i<distSet.length;i++){
        sum+=distSet[i];
      }
      console.log("Sum +"+sum);
     
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











       
        

        

       
        
