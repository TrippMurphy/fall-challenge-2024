// stored data
type TransportLines = Tube | Teleporter;
type TransportLinesArray = TransportLines[];
const transportLines: TransportLinesArray = [];

type TransportPodArray = Pod[];
const transportPods: TransportPodArray = [];

type Buildings = LunarModule | LandingPad;
type BuildingsArray = Buildings[];
const buildings: BuildingsArray = []; 

const MAX_TUBES: number = 5;
const POD_COST: number = 1000;
const POD_RETURN: number = 750;
const TELEPORTER_COST: number = 5000;

class Tube {
  id_: number;
  capacity: number;
  initialCost: number;
  buildingId1: number;
  buildingId2: number;
  constructor(id_: number, buildingId1: number, buildingId2: number, resources: number, capacity: number = 1){
      this.id_ = id_;
      this.capacity = capacity;
      this.initialCost = 0;
      this.buildingId1 = buildingId1;
      this.buildingId2 = buildingId2;

      this.build(resources);
  }
  build(resources: number): void{
    const b1: Building = this.getBuilding(this.buildingId1);
    const b2: Building = this.getBuilding(this.buildingId2);

    const isLegal: boolean = this.isLegal(b1, b2, resources);
    if(isLegal === false) return;

    this.connectTubes(b1, b2);

    console.error(`Tube created between building ${b1.id_} and building ${b2.id_}`);
  }
  getBuilding(id_: number): Building{
    const building: Building | undefined = buildings.find(building => building.id_ === id_);
    if(!building) throw new Error(`Building ${id_} connected to Tube ${this.id_} not found`);
    return building;
  }
  calculateDistance(b1: Building, b2: Building): number{
    return Math.sqrt((b2.x - b1.x) ** 2 + (b2.y - b1.y) ** 2)
  }
  isLegal(b1: Building, b2: Building, resources: number): boolean {
    if(this.canConnect(b1, b2) && this.canAfford(resources, b1, b2) && !this.segmentsIntersect(b1, b2) && !this.pointOnSegment(b1, b2)){
      transportLines.push(this);
      return true;
    }
    console.error(`Tube cannot be created between building ${b1.id_} and building ${b2.id_}`)
    return false;
  }
  canConnect(b1: Building, b2: Building): boolean{
    if(b1.connectedTubes + 1 > MAX_TUBES || b2.connectedTubes + 1 > MAX_TUBES){
      console.error(`Max tubes connected to Building ${b1} or ${b2} exceeded, cannot create tube`);
      return false;
    } return true;
  }
  canAfford(resources: number, b1?: Building, b2?: Building): boolean{
    if(!b1 && !b2) return (resources - this.calculateCost() >= 0);
    else return (resources - this.calculateCost(b1, b2) >= 0);
  }
  calculateCost(b1?: Building, b2?: Building): number{
    if(b1 && b2) this.initialCost = Math.floor(10 * (this.calculateDistance(b1, b2)));
    return this.initialCost * this.capacity;
  }
  segmentsIntersect(b1: Building, b2: Building): boolean{
    for(let i = 0; i < transportLines.length; i++){
      if(transportLines[i] instanceof Teleporter) continue;
      const b3: Building = this.getBuilding((transportLines[i] as Tube).buildingId1);
      const b4: Building = this.getBuilding((transportLines[i] as Tube).buildingId2);
      if(this.orientation(b1, b2, b3) * this.orientation(b1, b2, b4) < 0 && this.orientation(b3, b4, b1) * this.orientation(b3, b4, b2) < 0) return true;
    }
    return false;
  }
  orientation(b1: Building, b2: Building, b3: Building): number{
    const prod = (b3.y - b1.y) * (b2.x - b1.x) - (b2.y - b1.y) * (b3.x - b1.x);
    return this.sign(prod);
  }
  sign(x: number): number{
    if(x > 0) return 1;
    if(x === 0) return 0;
    return -1;
  }
  pointOnSegment(b1: Building, b2: Building): boolean{
    const epsilon = 0.0000001;
    let distance: number;
    for(let i = 0; i < buildings.length; i++){
      distance = this.calculateDistance(b1, b2) + this.calculateDistance(b1, buildings[i]) - this.calculateDistance(b2, buildings[i]);
      if(-epsilon < distance && distance < epsilon) return true;
    }
    return false;
  }
  connectTubes(b1: Building, b2: Building){
    b1.connectedTubes++;
    b2.connectedTubes++;
  }
  canUpgrade(resources: number): boolean{
    this.capacity++;
    if(this.canAfford(resources)){
      this.capacity--;
      return true;
    }
    this.capacity--;
    return false;
  }
  upgrade(): number{
      this.capacity++;
      return this.calculateCost();
  }
}
class Teleporter {
  id_: number;
  cost: number;
  buildingIdEntrance: number;
  buildingIdExit: number;
  constructor(id_: number, buildingIdEntrance: number, buildingIdExit: number, resources: number){
      this.id_ = id_;
      this.cost = TELEPORTER_COST;
      this.buildingIdEntrance = buildingIdEntrance;
      this.buildingIdExit = buildingIdExit;

      this.build(resources)
  }
  build(resources: number): void{
    const b1: Building = this.getBuilding(this.buildingIdEntrance);
    const b2: Building = this.getBuilding(this.buildingIdExit);
    
    const isLegal: boolean = this.isLegal(b1, b2, resources);
    if(isLegal === false) return;

    b1.hasTeleporter = true;
    b2.hasTeleporter = true;

    console.error(`Teleporter created between building ${b1.id_} and building ${b2.id_}`);
  }
  getBuilding(id_: number): Building{
    const building: Building | undefined = buildings.find(building => building.id_ === id_);
    if(!building) throw new Error(`Building ${id_} connected to Teleporter ${this.id_} not found`);
    return building;
  }
  isLegal(b1: Building, b2: Building, resources: number): boolean{
    if(this.canConnect(b1, b2) && this.canAfford(resources)){
      transportLines.push(this)
      return true;
    }
    console.error(`Teleporter cannot be created between building ${b1.id_} and building ${b2.id_}`)
    return false;
  }
  canConnect(b1: Building, b2: Building): boolean{
    if(!b1.hasTeleporter && !b2.hasTeleporter) return true;
    return false;
  }
  canAfford(resources: number): boolean{
    if(resources >= this.cost) return true;
    return false;
  }
}
class Pod {
  id_: number;
  cost: number;
  path: number[];
  constructor(id_: number, path: number[]){
      this.id_ = 0;
      this.cost = POD_COST;
      this.path = [];

      this.build();
  }
  build(){

  }
  isLegal(){

  }
  canAfford(){

  }
  existsTubes(){

  }
  existsCapacity(){

  }
  changePath(){

  }
  updatePath(){
    
  }
  destroy(){

  }
}
class Building {
  id_: number;
  x: number;
  y: number;
  connectedTubes: number;
  hasTeleporter: boolean;
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

// game functions

// game loop
while (true) {
  let resources: number = parseInt(readline());

  let numTravelRoutes: number = parseInt(readline());
  const upgradedTubes: number[] = [];
  for (let i = 0; i < numTravelRoutes; i++) {
    let inputs: string[] = readline().split(' ');
    const buildingId1: number = parseInt(inputs[0]);
    const buildingId2: number = parseInt(inputs[1]);
    const capacity: number = parseInt(inputs[2]);
    if(i + 1 <= transportLines.length) continue;
    if(capacity > 0){
      transportLines.push(new Tube(i, buildingId1, buildingId2, resources, capacity));
      if (!(transportLines[i] instanceof Tube)) throw new Error(`Expected Tube, but got ${typeof transportLines[i]} at index ${i}`);
      resources -= (transportLines[i] as Tube).calculateCost();
    }
    else {
      transportLines.push(new Teleporter(i, buildingId1, buildingId2, resources))
      if (!(transportLines[i] instanceof Teleporter)) throw new Error(`Expected Teleporter, but got ${typeof transportLines[i]} at index ${i}`);
      resources -= (transportLines[i] as Teleporter).cost;
    }
  }

  let numPods: number = parseInt(readline());
  const destroyedPods: number[] = [];
  for (let i = 0; i < numPods; i++) {
      const podProperties: string = readline();
  }

  const numNewBuildings: number = parseInt(readline());
  for (let i = 0; i < numNewBuildings; i++) {
      const buildingProperties: string = readline();
  }

  let actions: string = '';

  while(numTravelRoutes < transportLines.length){
    const addition = transportLines[numTravelRoutes]
    if(addition instanceof Tube) actions += `TUBE ${addition.buildingId1} ${addition.buildingId2};`;
    else if(addition instanceof Teleporter) actions = `TELEPORT ${addition.buildingIdEntrance} ${addition.buildingIdExit};`;
    else throw new Error(`transportLines[numTravelRoutes] not an instance of Tube or Teleporter: ${transportLines[numTravelRoutes]}`);
    numTravelRoutes++;
  }
  for(let i = 0; i < upgradedTubes.length; i++){
    const tube = transportLines[i];
    if(tube instanceof Tube){
      actions += `UPGRADE ${tube.buildingId1} ${tube.buildingId2};`
    } else throw new Error(`Upgraded Tube at transportLines[${i}] is not of type Tube: ${tube}`)
  }
  for(let i = 0; i < destroyedPods.length; i++){
    actions += `DESTROY ${destroyedPods[i]};`;
  }
  while(numPods < transportPods.length){
    actions += `POD ${transportPods[numPods]}`
    for(let i = 0; i < transportPods[numPods].path.length; i++){
      actions += ` ${transportPods[numPods].path[i]}`
    }
    actions += ';'
    numPods++;
  }
  if(actions === '') actions = 'WAIT;';
  actions = actions.slice(0, -1);
  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  console.log(actions);     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT

}
