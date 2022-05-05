import GraphNode from "./nodes.js";
import GraphEdges from "./edges.js";
import {svg} from "./grid.js";
import { Tooltip } from "./grid.js";
export let graphNodes=[];
var slow=1000;
let graphEdges=[];
var showWeights=true;
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

  Boruvka();

  
});


//make same code and fill data in it

 function Boruvka(){
     
      var g = new Graph(graphNodes.length);
      for(var i=0;i<graphEdges.length;i++){
          g.addEdge(graphEdges[i].getNode1(),graphEdges[i].getNode2(),graphEdges[i].getWeight(),graphEdges[i].getId());
      }
	
      g.boruvkaMST();
		
       
      
      
     
}

class Edge
{
	constructor(weight, src, dest,id)
	{
		this.weight = weight;
		this.dest = dest;
		this.src = src;
		this.next = null;
        this.id=id;
	}
}
class State
{
	constructor(parent, rank)
	{
		this.parent = parent;
		this.rank = rank;
	}
}
class Graph
{
	constructor(vertices)
	{
		this.vertices = vertices;
		this.graphEdge = [];
		for (var i = 0; i < this.vertices; ++i)
		{
			this.graphEdge.push([]);
		}
	}
	addEdge(src, dest, w,id)
	{
		if (dest < 0 || dest >= this.vertices || 
            src < 0 || src >= this.vertices)
		{
			return;
		}
		// add node edge
		this.graphEdge[src].push(new Edge(w, src, dest,id));
		if (dest == src)
		{
			return;
		}
		this.graphEdge[dest].push(new Edge(w, dest, src,id));
	}
	
	find(subsets, i)
	{
		if (subsets[i].parent != i)
		{
			subsets[i].parent = this.find(subsets, subsets[i].parent);
		}
		return subsets[i].parent;
	}
	findUnion(subsets, x, y)
	{
		var a = this.find(subsets, x);
		var b = this.find(subsets, y);
		if (subsets[a].rank < subsets[b].rank)
		{
			subsets[a].parent = b;
		}
		else if (subsets[a].rank > subsets[b].rank)
		{
			subsets[b].parent = a;
		}
		else
		{
			subsets[b].parent = a;
			subsets[a].rank++;
		}
	}
	async boruvkaMST()
	{
		// Contain weight sum in mst path
		var result = 0;
		var selector = this.vertices;
		var subsets = Array(this.vertices).fill(null);
		var cheapest = Array(this.vertices).fill(null);
		for (var v = 0; v < this.vertices; ++v)
		{
			subsets[v] = new State(v, 0);
		}
		while (selector > 1)
		{
			for (var v = 0; v < this.vertices; ++v)
			{
				cheapest[v] = null;
			}
			for (var k = 0; k < this.vertices; k++)
			{
				for (var i = 0; i < this.graphEdge[k].length; ++i)
				{
					var set1 = this.find(subsets, 
                                         this.graphEdge[k][i].src);
					var set2 = this.find(subsets, 
                                         this.graphEdge[k][i].dest);
					if (set1 != set2)
					{
						if (cheapest[k] == null)
						{
							cheapest[k] = this.graphEdge[k][i];
						}
						else if (cheapest[k].weight >
                                 this.graphEdge[k][i].weight)
						{
							cheapest[k] = this.graphEdge[k][i];
						}
					}
				}
			}
			for (var i = 0; i < this.vertices; i++)
			{
				if (cheapest[i] != null)
				{
					var set1 = this.find(subsets, cheapest[i].src);
					var set2 = this.find(subsets, cheapest[i].dest);
					if (set1 != set2)
					{
						// Reduce a edge
						selector--;
						this.findUnion(subsets, set1, set2);
						// Display the edge connection
						
						// Add weight
						result += cheapest[i].weight;
					}
				}
			}
		}
		console.log("\n Calculated total weight of MST is " + result);
		document.getElementById("cost").innerHTML=result;
        console.log(cheapest);
        console.log(cheapest[0]);
        
        for(var i=0;i<cheapest.length;i++){
            await new Promise(r => setTimeout(r, slow));
			try{
				coverEdge(cheapest[i].id);
            animateNode(cheapest[i].src);
            animateNode(cheapest[i].dest);
			
			}
			catch{

			}
            
        }
		console.log(result);
	}
	
	
}

function updateSpeed(e){
	console.log("Hello");
	slow=d3.select(this).property("value")
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











       
        

        

       
        
