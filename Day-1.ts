class Tube {
  id_: number;
  capacity: number;
  initialCost: number;
  buildingId1: number;
  buildingId2: number;
  constructor(){
      this.id_ = 0;
      this.capacity = 1;
      this.initialCost = 0;
      this.buildingId1 = 0;
      this.buildingId2 = 0;

  }
  build(){

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

function BuildTubes(){

}
function BuildTeleporters(){

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

// game loop
while (true) {
  const resources: number = parseInt(readline());
  const numTravelRoutes: number = parseInt(readline());
  for (let i = 0; i < numTravelRoutes; i++) {
      var inputs: string[] = readline().split(' ');
      const buildingId1: number = parseInt(inputs[0]);
      const buildingId2: number = parseInt(inputs[1]);
      const capacity: number = parseInt(inputs[2]);
  }
  const numPods: number = parseInt(readline());
  for (let i = 0; i < numPods; i++) {
      const podProperties: string = readline();
  }
  const numNewBuildings: number = parseInt(readline());
  for (let i = 0; i < numNewBuildings; i++) {
      const buildingProperties: string = readline();
  }

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  console.log('TUBE 0 1;TUBE 0 2;POD 42 0 1 0 2 0 1 0 2');     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT

}
