import {svg} from "./grid.js";
import {graphNodes} from "./index.js";
import GraphNode from "./nodes.js";

export default class GraphEdges{
    constructor(id,source,target,weight){
        this.id=id;
        this.node1=source;
        this.node2=target;
        this.weight=weight;
       
    }

    getId(){
        return this.id;
    }
    getNode1(){
        return this.node1;
    }
    getNode2(){
        return this.node2;
    }
    getWeight(){
        return this.weight;
    }

   
    PlotEdge(){
        var sourceX;
        var sourceY;
        var targetX;
        var targetY;
        for(var i=0;i<graphNodes.length;i++){

            if(graphNodes[i].GetId()==this.node1){
                sourceX=graphNodes[i].GetX();
                sourceY=graphNodes[i].GetY();
            }
            if(graphNodes[i].GetId()==this.node2){
                targetX=graphNodes[i].GetX();
                targetY=graphNodes[i].GetY();
            }
        }
        
        
            
        console.log("source x: "+sourceX);
        console.log("source y: "+sourceY);
        svg.append('line').attr('x1', sourceX).attr('y1', sourceY).attr('x2',targetX).attr('y2', targetY).attr('stroke', 'steelblue').attr('stroke-width',1.5).attr('id',"edge"+this.id);
        svg.append('text').attr('x', (sourceX+targetX)/2).attr('y', (sourceY+targetY)/2).style("font-size", 20).attr('fill','#D0dbe6').attr('id','weight'+this.id).attr('class','weight'+this.id);
        

    }

    
}