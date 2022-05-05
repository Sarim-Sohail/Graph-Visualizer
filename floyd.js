import GraphNode from "./nodes.js";
import GraphEdges from "./edges.js";
import {svg} from "./grid.js";

export let graphNodes=[];
let graphEdges=[];
var showWeights=true;
var pass=true;
var slow=3000;
var skip=false;
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

  // var slider = d3.select("body").append("input")
  //   .attr("type", "range")
  //   .attr("value", 0)
  //   .attr("min", 0)
  //   .attr("max", 1000)
  //   .attr("step", 100)
  //   .attr("id",'speedControl')
  //   .on("change",updateSpeed);

  // var button=d3.select("body").append("button")
  // .attr("class","btn btn-primary")
  // .text("Hide Weights").on("click",showHideWeights);
    
  

  
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
  document.getElementById("skipButton").addEventListener("click",()=>{
    
    skip=true;
     
   });
  document.getElementById("nextButton").addEventListener("click",()=>{
    d3.selectAll("line").attr('stroke', 'steelblue').attr('stroke-width',1.5)
    
    pass=false;
  });
  document.getElementById("speedControl").addEventListener('change',updateSpeed);
  

  Floyd();

  
});
function updateSpeed(e){
  console.log("Hello");
  slow=d3.select(this).property("value")
}

function showHideWeights(d){
  
}

 async function Floyd(){
      
      var graph=Array(graphNodes.length).fill().map(entry => Array(graphNodes.length))
      
    for(var i=0;i<graphNodes.length;i++){
        for(var j=0;j<graphNodes.length;j++){
            graph[i][j]=Number.MAX_VALUE;
        }
    }

      for(var i=0;i<graphNodes.length;i++){
          for(var j=0;j<graphNodes.length;j++){
            if(i==j){
                graph[i][j]=0;
            }
            else{
                for(var k=0;k<graphEdges.length;k++){
                    if(graphEdges[k].getNode1()==graphNodes[i].GetId() && graphEdges[k].getNode2()==graphNodes[j].GetId()){
                        graph[i][j]=graphEdges[k].getWeight();
                    }
                }
            }
          }
      }
      
      
      
      var dist = Array.from(Array(graphNodes.length), () => new Array(graphNodes.length).fill(0));
      var pred = Array.from(Array(graphNodes.length), () => new Array(graphNodes.length).fill(0));
          var i, j, k;
  
          // Initialize the solution matrix
          // same as input graph matrix
          // Or we can say the initial
          // values of shortest distances
          // are based on shortest paths
          // considering no intermediate
          // vertex
          for (i = 0; i < graphNodes.length; i++) {
            for (j = 0; j < graphNodes.length; j++) {
              dist[i][j] = graph[i][j];
              pred[i][j]=i;
            }
          }

          for (k = 0; k < graphNodes.length; k++) {
            // Pick all vertices as source
            // one by one
            for (i = 0; i < graphNodes.length; i++) {
              // Pick all vertices as destination
              // for the above picked source
              for (j = 0; j < graphNodes.length; j++) {
                // If vertex k is on the shortest
                // path from i to j, then update
                // the value of dist[i][j]
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                  dist[i][j] = dist[i][k] + dist[k][j];
                  pred[i][j]=pred[k][j];
                }
              }
            }
          }
          console.log(dist);
          console.log(pred);
          
          for(var i=0;i<graphNodes.length;i++){
              animateNode(i);
              for(var j=0;j<graphNodes.length;j++){
                  if(i!=j){
                      for(var k=0;k<graphEdges.length;k++){
                          
                          if(graphEdges[k].getNode1()==pred[i][j] && graphEdges[k].getNode2()==j){
                            await new Promise(r => setTimeout(r, slow));
                              coverEdge(graphEdges[k].getId());
                              changeWeight(graphEdges[k].getId(),dist[i][j]);
                          }
                      }
                  }
              }
              while(pass && !skip){
                await new Promise(r => setTimeout(r, 1000));
                console.log("Waiting");
              }
              pass=true;
              resetNode(i);
          }
       
      await new Promise(r => setTimeout(r, slow));
      
     
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











       
        

        

       
        
