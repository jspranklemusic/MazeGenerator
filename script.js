class Cell{
    constructor(x=0,y=0,walls={top:true,right:true}){
        this.x = x;
        this.y = y;
        this.walls = walls
    }
}

class Map{
    constructor(width = 9){
        this.mapWidth = 0;
        this.cells = {};
        this.start = {x:0,y:0}
        this.end = {x:width - 1, y:width - 1}
        this.numCells = width;
        this.cellWidth = 1;
        this.visitedCells = [];
        this.backtracked = [];
        this.scene = document.getElementById("scene");
        this.setScene();
        this.createCells();
        console.log(this.generateMaze());
        this.show();
    
    }

    unique(array, compare){
        for(let elem of array){
            if(elem.x == compare.x && elem.y == compare.y){
                return false
            }
        }
        return true;
     }

    generateMaze(location={x:0,y:0}){
        //creating neighboring cells array
        this.visitedCells.push(location);
        let neighborCells = [];

        //check if adjacent locations are in bounds

        const right = "x"+(location.x+1)+"y"+location.y
        const left = "x"+(location.x-1)+"y"+location.y
        const top = "x"+location.x+"y"+(location.y-1)
        const bottom = "x"+location.x+"y"+(location.y+1)

        if(this.cells[top]) neighborCells.push(this.cells[top])
        if(this.cells[left]) neighborCells.push(this.cells[left])
        if(this.cells[right]) neighborCells.push(this.cells[right])
        if(this.cells[bottom]) neighborCells.push(this.cells[bottom])

        //check if adjacent locations have already been visited

        neighborCells = neighborCells.filter(neighbor=>{
            for(let visited of this.visitedCells){
                if(visited.x == neighbor.x && visited.y == neighbor.y){
                    return false;
                }
            }
            return true;
        })

        //if there are no legal neighbors, return
        if(!neighborCells.length){

            if(!this.backtracked.length){
                return {"BACKTRACKED":this.backtracked, "VISITED":this.visitedCells}
            }else{
                this.backtracked.pop();
                return this.generateMaze(this.backtracked[this.backtracked.length - 1])
            }
           
        }else{
            
            //make new location 
            const newLocation = neighborCells[Math.floor(Math.random()*neighborCells.length)]

            //remove right wall from current cell if going right
            if(newLocation.x > location.x) this.cells["x"+location.x+"y"+location.y].walls.right = false;
            //remove right wall from new cell if going left
            if(newLocation.x < location.x) this.cells["x"+newLocation.x+"y"+newLocation.y].walls.right = false;
            //remove top wall from new cell if going down
            if(newLocation.y > location.y) this.cells["x"+newLocation.x+"y"+newLocation.y].walls.top = false;
             //remove top wall from current cell if going up
             if(newLocation.y < location.y) this.cells["x"+location.x+"y"+location.y].walls.top = false;

             //push location to visited
             
             this.backtracked.push(location);

            //visit new location
            return this.generateMaze(newLocation)
        }

    }

    generatePlayer(){
        const div = document.createElement("div")
        div.id = "player"
        div.style.top = this.start.y + "px";
        div.style.left = this.start.x + "px";
        div.style.width = (this.mapWidth / this.numCells) + "px";
        div.style.height = (this.mapWidth / this.numCells) + "px";
        this.scene.appendChild(div);
        this.player = div;
        this.player.x = this.start.x;
        this.player.y = this.start.y;
    }

    generateCube(cell,color){
        const div = document.createElement("div");
        div.style.width = (this.mapWidth / this.numCells) + "px";
        div.style.height = (this.mapWidth / this.numCells) + "px";
        div.style.position = "absolute";
        div.style.boxSizing = "border-box";
        div.style.left = this.cellWidth*cell.x + "px";
        div.style.top = this.cellWidth*cell.y + "px";
        div.style.borderTop = cell.walls.top ? "2px solid grey" : "none";
        // div.style.borderBottom = cell.walls.bottom ? "2px solid grey" : "none";
        // div.style.borderLeft = cell.walls.left ? "2px solid grey" : "none";
        div.style.borderRight = cell.walls.right || cell.x == this.numCells - 1 ? "2px solid grey" : "none";
        div.style.borderLeft = cell.x == 0 ? "2px solid grey" : "none";
        div.style.borderBottom = cell.y == this.numCells - 1 ? "2px solid grey" : "none";
        div.style.background = color || "white";
        this.scene.appendChild(div);
        return div
    }

    show(){
        this.scene.innerHTML = ""
        for(let cell in this.cells){
            this.generateCube(this.cells[cell])
        }
        //generate player
        this.generatePlayer();
        //generate ending cell
        const end = this.generateCube(new Cell(this.end.x,this.end.y),"green");
        end.style.borderTop = "2px solid transparent";

    }

    createCells(){
        for(let y = 0; y < this.numCells; y++){
            for(let x = 0; x < this.numCells; x++){
                const cell = new Cell(x,y);
                this.cells["x"+x+"y"+y] = cell
            }
        }
        console.log(this.cells)
    }

    setScene(){
        this.scene = document.getElementById("scene");
        this.scene.style.background = "white";
        //portrait
        if(window.innerHeight > window.innerWidth){
            this.mapWidth = window.innerWidth;
            this.scene.style.width = this.mapWidth + "px";
            this.scene.style.height = this.mapWidth + "px";
        //landscape
        }else{
            this.mapWidth = window.innerHeight;
            this.scene.style.width = this.mapWidth + "px";
            this.scene.style.height = this.mapWidth + "px";
        }
        this.cellWidth = this.mapWidth / this.numCells;
    }
   
}

let number; 

function getNum(message = "Enter a map size between 5 - 50."){
    number = parseInt(window.prompt(message));
    if(!number | number > 50 | number < 5){
        getNum("Oops, looks that number wasn't valid. Enter a map size between 5 - 50.");
    }
}

getNum();

const map = new Map(number);

function handleInput(e){

    let x = map.player.x
    let y = map.player.y

    switch(e.key){
        case "ArrowLeft":
            if(!map.cells["x"+(x-1)+"y"+y]?.walls.right)
                x -= x <= 0 ? 0 : 1;
            break;
        case "ArrowRight":
            if(!map.cells["x"+x+"y"+y]?.walls.right)
                x += x >= (map.numCells - 1) ? 0 : 1; 
            break;
        case "ArrowUp":
            if(!map.cells["x"+x+"y"+y]?.walls.top)
                y -= y <= 0 ? 0 : 1; 
            break;
        case "ArrowDown":
            if(!map.cells["x"+x+"y"+(y+1)]?.walls.top)
                y += y >= (map.numCells - 1) ? 0 : 1; 
            break;

    }

    switch(e.target.id){
        case "controls-right":
            if(!map.cells["x"+(x-1)+"y"+y]?.walls.right)
                x -= x <= 0 ? 0 : 1;
            break;
        case "controls-left":
            if(!map.cells["x"+x+"y"+y]?.walls.right)
                x += x >= (map.numCells - 1) ? 0 : 1; 
            break;
        case "controls-up":
            if(!map.cells["x"+x+"y"+y]?.walls.top)
                y -= y <= 0 ? 0 : 1; 
            break;
        case "controls-down":
            if(!map.cells["x"+x+"y"+(y+1)]?.walls.top)
                y += y >= (map.numCells - 1) ? 0 : 1; 
            break;

    }


    map.player.x = x;
    map.player.y = y;

    map.player.style.top = (map.player.y * map.cellWidth )+ "px";
    map.player.style.left = (map.player.x * map.cellWidth) + "px";
}

window.addEventListener('resize',()=>{
    map.setScene();
    map.show();
})

document.querySelectorAll(".mobile-controls > *").forEach(elem=>{
    elem.addEventListener("click",(e)=>{
        handleInput(e);
    })
})

document.addEventListener('keydown',e=>{
    handleInput(e);
})

