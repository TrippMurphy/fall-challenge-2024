class Tube {
  id_: number;
  capacity: number;
  initialCost: number;
  buildingId1: number;
  buildingId2: number;
  constructor(_id: number, buildingId1: number, buildingId2: number, capacity: number){
      this.id_ = 0;
      this.capacity = capacity;
      this.initialCost = 0;
      this.buildingId1 = buildingId2;
      this.buildingId2 = buildingId1;

  }
  build(){

  }
  calculateCost(){

  }
  upgrade(){
      // increase capacity by 1
      // spend initial construction cost * new capacity
  }
}
class Pod {
  id_: number;
  cost: number;
  path: number[];
  constructor(){
      this.id_ = 0;
      this.cost = 1000;
      this.path = [];
  }
  build(){

  }
  destroy(){

  }
}
class Teleporter {
  id_: number;
  cost: number;
  buildingIdExit: number;
  buildingIdEntrance: number;
  constructor(){
      this.id_ = 0;
      this.cost = 5000;
      this.buildingIdExit = 0;
      this.buildingIdEntrance = 0;
  }
  build(){

  }
}
class Building {
  id_: number;
  x: number;
  y: number;
  hasTeleporter: boolean;
  connectedTubes: number;
  constructor(){
    this.id_ = 0;
    this.x = 0;
    this.y = 0;
    this.connectedTubes = 0;
    this.hasTeleporter = false;
  }

}

class LunarModule extends Building {
  type: string;
  astronauts: number;
  constructor(){
    super();
    this.type = '';
    this.astronauts = 0;
  }
}
class LandingPad extends Building {

}


// stored data
type TransportLines = Tube | Teleporter;
type TransportLinesArray = TransportLines[];
const transportLines: TransportLinesArray = [];

type TransportPodArray = Pod[];
const transportPods: TransportPodArray = [];

type Buildings = LunarModule | LandingPad;
type BuildingsArray = Buildings[];
const buildings: BuildingsArray = []; 

// game loop
while (true) {
  let resources: number = parseInt(readline());
  const numTravelRoutes: number = parseInt(readline());
  for (let i = 0; i < numTravelRoutes; i++) {
    let inputs: string[] = readline().split(' ');
    const buildingId1: number = parseInt(inputs[0]);
    const buildingId2: number = parseInt(inputs[1]);
    const capacity: number = parseInt(inputs[2]);
    if(i + 1 > transportLines.length){
      if(capacity > 0){
        transportLines.push(new Tube(i, buildingId1, buildingId2, capacity));
        if(transportLines[i] instanceof Tube){
          resources -= transportLines[i].calculateCost;
        } else {
          console.error(`Expected Tube, but got Teleporter at index ${i}`);
        }
      }
    }
  }
  const numPods: number = parseInt(readline());
  for (let i = 0; i < numPods; i++) {
      const podProperties: string = readline();
  }
  const numNewBuildings: number = parseInt(readline());
  for (let i = 0; i < numNewBuildings; i++) {
      const buildingProperties: string = readline();
  }
  let actions: string = '';
  console.error(inputs)

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  console.log('TUBE 0 1;TUBE 0 2;POD 42 0 1 0 2 0 1 0 2');     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT

}


function sign(x: number): number{
  if(x < 0) return -1;
  if(x === 0) return 0;
  if(x > 0) return 1;
}
function orientation(p1: number[], p2: number[], p3: number[]): number {
  let prod: number = (p3[Y] - p1[Y]) * (p2[X] - p1[X]) - (p2[Y] - p1[Y]) * (p3[X] - p1[X])
  return sign(prod)
}

function segmentsIntersect(A: number[], B: number[], C: number[], D: number[]): boolean {
  return orientation(A, B, C) * orientation(A, B, D) < 0 && orientation(C, D, A) * orientation(C, D, B) < 0
}
function distance(p1: number[], p2: number[]): number {
  return Math.sqrt((p2[X]-p1[X]) ** 2 + (p2[Y] - p1[Y]) ** 2)
}
function pointOnSegment(A: number[], B: number[], C: number[]): boolean {
  const epsilon: number = 0.0000001;
  const combinedDistance: number = distance(B, A) + distance(A, C) - distance(B, C);
  return -epsilon < combinedDistance && combinedDistance < epsilon;
}