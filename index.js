import GraphNode from "./nodes.js";
import GraphEdges from "./edges.js";
import {svg} from "./grid.js";
export let graphNodes=[];
let graphEdges=[];
fetch("./data.json")
.then(response => {
   return response.json();
})
.then(function(data){
  console.log(data);
  for(var key of Object.keys(data["nodes"])){
    var id=data["nodes"][key].id;
    var x=data["nodes"][key].x;
    var y=data["nodes"][key].y;
    graphNodes.push(new GraphNode(id,x,y));
    graphNodes[key].PlotNode();
    console.log(graphNodes.length);
  }
  
  for(var key of Object.keys(data["edges"])){
    var id=data["edges"][key].id;
    var source=data["edges"][key].source;
    var target=data["edges"][key].target;
    var weight=data["edges"][key].weight;
    graphEdges.push(new GraphEdges(id,source,target,weight));
    graphEdges[key].PlotEdge();
  }
});








       
        

        

       
        
