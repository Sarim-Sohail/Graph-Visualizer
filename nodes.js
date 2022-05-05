
import {svg} from "./grid.js"


export default class GraphNode{
    constructor(id,x,y){
        this.id=id;
        this.x=x;
        this.y=y;
       
    }

    GetX(){
        return this.x;
    }
    GetY(){
        return this.y;
    }
    GetId(){
        return this.id;
    }

    PlotNode(){
        
        svg.append('circle').attr('cx',this.x).attr('cy',this.y).attr('r',5).attr('fill','steelblue').attr('stroke','white').attr('stroke-width',2).attr('id',"node"+this.id);
    }

    
}
