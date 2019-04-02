var table;
var circles;
var cnv;

function preload() {
    table = loadTable("2017.csv", "header");
  }

function setup() {
    cnv = createCanvas(1423, 1000);
    cnv.parent("my_sketch")
    loadData();
}
function draw() {
    background(0);
    // Display all bubbles
    for (var i = 0; i < circles.length; i++) {
      circles[i].display();
      circles[i].rollover(mouseX, mouseY);
    }
    textFont('Georgia')
    textSize(30)
    text("F a m i l y", 695, 700)
    //rotate(PI)
    text("R a n k", 50, 375)
  
  }
function loadData() {
    circles = []

    // You can access iterate over all the rows in a table
    for (var i = 0; i < table.getRowCount(); i++) {
      var row = table.getRow(i);
      // You can access the fields via their column name (or index)
      var Country = row.get("Country");
      var Rank = row.get("Happiness.Rank");
      var Family = row.get("Family");
      var Econ = row.get("Economy..GDP.per.Capita.")
      // Make a Bubble object out of the data read
      circles[i] = new Circle(Family, Rank, Econ, Country);
    }
  }

  class Circle {
    constructor(Family, Rank, Econ, Country) {
      this.x = Number(Family);
      this.y = Number(Rank);
      this.diameter = Number(Econ);
      this.name = Country;
      this.over = false;
    }
  
    // Checking if mouse is over the Bubble
    rollover(px, py) {
      var d = dist(px, py, Math.pow(this.x*6.67, 3), this.y*4);
      if (d < this.diameter*50/1.5) {
        this.over = true;
        print("hovering")
      } else {
        this.over = false;
      }
    }
  
    // Display the Bubble
    display() {
      stroke(255);
      strokeWeight(2);
      noFill();
      ellipse(Math.pow(this.x*6.67, 3), this.y*4, this.diameter*50, this.diameter*50);
      if (this.over){
        textAlign(CENTER);
        noStroke();
        fill(200, 5, 9);
        textSize(15)
        text(this.name + " #"+ this.y, Math.pow(this.x*6.67, 3), this.y*4 + this.diameter/2 + 40);
      }
    }
  }
  