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
  Kruskall();

  
});

function updateSpeed(e){
    console.log("Hello");
    slow=d3.select(this).property("value")
  }

 async function Kruskall(){
           
            
            var edgeIndexes=[];
            var temp;
            var visited=[];
            for(var i=1;i<graphEdges.length;i++){
                edgeIndexes.push(i);
            }
            for(var i=0;i<edgeIndexes.length;i++){
                for(var j=0;j<edgeIndexes.length-1;j++){
                    if(graphEdges[edgeIndexes[j]].getWeight()>graphEdges[edgeIndexes[j+1]].getWeight()){
                        temp=edgeIndexes[j];
                        edgeIndexes[j]=edgeIndexes[j+1];
                        edgeIndexes[j+1]=temp;
                    }
                }
            }
            
            
            console.log("Edges: "+edgeIndexes);
            
            var currentGraph=[];
            var sum=0;
            for(var i=0;i<edgeIndexes.length;i++){
                if(!isCycle(edgeIndexes[i],currentGraph)){
                    await new Promise(r => setTimeout(r, slow));
                    animateNode(graphEdges[edgeIndexes[i]].getNode1());
                    coverEdge(graphEdges[edgeIndexes[i]].getId());
                    animateNode(graphEdges[edgeIndexes[i]].getNode2());
                    currentGraph.push(edgeIndexes[i]);
                    console.log("Pushed edge:"+edgeIndexes[i]);
                    console.log("cost+ "+graphEdges[edgeIndexes[i]].getWeight());
                    console.log("Sum+ "+sum);
                    sum=sum+graphEdges[edgeIndexes[i]].getWeight();
                }
            }
            console.log(sum);
            document.getElementById("cost").innerHTML=sum;
            
}


function isCycle(edgeIndex,currentGraph){
    
    if(currentGraph.length==0){
        return false;
    }
    currentGraph.push(edgeIndex);
    var visited=[];
    visited.push(graphEdges[currentGraph[0]].getNode1());
    visited.push(graphEdges[currentGraph[0]].getNode2());
    
    
    

    for(var i=1;i<currentGraph.length;i++){
        
       
        if(visited.indexOf(graphEdges[currentGraph[i]].getNode2())==-1){
            visited.push(graphEdges[currentGraph[i]].getNode2());
        }
        // else if(visited.indexOf(graphEdges[currentGraph[i]].getNode1())==-1 && visited.indexOf(graphEdges[currentGraph[i]].getNode2())==-1){
            
        //     visited.push(graphEdges[currentGraph[i]].getNode2());
            
        // }
       
       
        
        else{
            currentGraph.pop();
            return true;
        }
    }
    currentGraph.pop();
    return false;
   
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
        d3.select("#node"+id).attr("r",5+i).attr("stroke","white").attr('stroke-width',1).attr('fill','yellow');
    }
}

async function resetNode(id){
    for(var i=0;i<10;i++){
        await new Promise(r => setTimeout(r, 50));
        d3.select("#node"+id).attr("r",10-i).attr("stroke","green").attr('stroke-width',2).attr('fill','yellow');
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











       
        

        

       
        
