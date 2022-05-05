import GraphNode from "./nodes.js";
import GraphEdges from "./edges.js";
import {svg} from "./grid.js";
import { Tooltip } from "./grid.js";
export let graphNodes=[];
let graphEdges=[];
var showWeights=true;
var slow=1000;
var skip=false;
var pass=true;
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

  document.getElementById("nextButton").addEventListener("click",()=>{
    d3.selectAll("line").attr('stroke', 'steelblue').attr('stroke-width',1.5)
    
    pass=false;
  });
  document.getElementById("skipButton").addEventListener("click",()=>{
    
   skip=true;
    
  });
  document.getElementById("speedControl").addEventListener('change',updateSpeed);
  Cluster();

  
});

function updateSpeed(e){
    console.log("Hello");
    slow=d3.select(this).property("value")
  }

 async function Cluster(){
        
        var cc=[];
        var sum=0.0;
        for(var i=0;i<graphNodes.length;i++){
            animateNode(i);
            var neighbors=[];
            for(var j=0;j<graphEdges.length;j++){
                if(graphEdges[j].getNode1()==i && neighbors.indexOf(graphEdges[j].getNode2()==-1)){
                    neighbors.push(graphEdges[j].getNode2());
                }
                // else if(graphEdges[j].getNode2()==i && neighbors.indexOf(graphEdges[j].getNode1()==-1)){
                //     neighbors.push(graphEdges[j].getNode1());
                // }
            }

            
            var degree=neighbors.length;
            var nv=0;
            for(var k=0;k<neighbors.length;k++){
                for(var m=0;m<neighbors.length;m++){
                    if(k!=m){
                        for(var l=0;l<graphEdges.length;l++){
                            if((graphEdges[l].getNode1()==neighbors[k] && graphEdges[l].getNode2()==neighbors[m])){
                                
                                await new Promise(r => setTimeout(r, slow));
                                coverEdge(graphEdges[l].getId());
                                nv++;
                            }
                        }
                    }
                }
            }
            while(pass && !skip){
                await new Promise(r => setTimeout(r, 1000));
            }
            pass=true;
            
            console.log("neighbors: "+neighbors);
            
            
            console.log("nv: "+nv);
            console.log("degree: "+degree);
            var up=2*(nv);
            var down=degree*(degree-1);
            var coeff;
            if(up==0 && down==0){
                coeff=0;
            }
            else{
                up=2*(nv);
                coeff=up/down;
            }
            console.log("up: "+up);
            console.log("down: "+down);
            console.log(coeff);
            sum=sum+coeff;
            cc.push(coeff);
            
            
            
            resetNode(i);
        }
        
        
        console.log("Average+ "+sum/graphNodes.length);
        document.getElementById("coeff").innerHTML=sum/graphNodes.length;
        console.log(cc);
        
        
        await new Promise(r => setTimeout(r, slow));
                   
            
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
        
        if(visited.indexOf(graphEdges[currentGraph[i]].getNode1())==-1 && visited.indexOf(graphEdges[currentGraph[i]].getNode2())!=-1){
            visited.push(graphEdges[currentGraph[i]].getNode1());
        }
        else if(visited.indexOf(graphEdges[currentGraph[i]].getNode2())==-1 && visited.indexOf(graphEdges[currentGraph[i]].getNode1())!=-1){
            visited.push(graphEdges[currentGraph[i]].getNode2());
        }
        // else if(visited.indexOf(graphEdges[currentGraph[i]].getNode2())==-1 && visited.indexOf(graphEdges[currentGraph[i]].getNode1())==-1){
        //     visited.push(graphEdges[currentGraph[i]].getNode2());
        //     visited.push(graphEdges[currentGraph[i]].getNode1());
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











       
        

        

       
        
