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

  Primms();

  
});

function updateSpeed(e){
    console.log("Hello");
    slow=d3.select(this).property("value")
  }

 async function Primms(){
        var mstSet=[];
        mstSet.push(0);
        animateNode(0);
        var sum=0;
        var min;
        var minIndex;
        var minNode;
        while(!AllIncluded(mstSet)){
            console.log(mstSet);
            min=Number.MAX_VALUE;
            for(var i=0;i<mstSet.length;i++){
                for(var j=0;j<graphEdges.length;j++){
                    if(graphEdges[j].getNode1()==mstSet[i] && mstSet.indexOf(graphEdges[j].getNode2())==-1){
                        if(graphEdges[j].getWeight()<min){
                            min=graphEdges[j].getWeight();
                            minIndex=j;
                            minNode=graphEdges[j].getNode2();
                        }
                    }
                    if(graphEdges[j].getNode2()==mstSet[i] && mstSet.indexOf(graphEdges[j].getNode1())==-1){
                        if(graphEdges[j].getWeight()<min){
                            min=graphEdges[j].getWeight();
                            minIndex=j;
                            minNode=graphEdges[j].getNode1();
                        }
                    }
                }
            }
            await new Promise(r => setTimeout(r, slow));
            mstSet.push(minNode);
            animateNode(minNode);
            coverEdge(graphEdges[minIndex].getId());
            sum=sum+graphEdges[minIndex].getWeight();
            
        }


        console.log(sum);
        document.getElementById("cost").innerHTML=sum;
        
        
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











       
        

        

       
        
