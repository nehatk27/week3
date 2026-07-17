class Shape {
  static #nextId = 1;

  constructor(name, color) {
    this.id = Shape.#nextId++;
    this.name = name;
    this.color = color;
  }

  describe() {
    return `This is a ${this.colour} ${this.name}.`;
  }

  static compare(a, b) {
    if (a.area() > b.area()) {
      return a;
    } else if (b.area() > a.area()) {
      return b;
    }
    return "Both shapes have the same area.";
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super("circle", color);
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius * this.radius;
  }
  perimeter() {
    return 2 * Math.PI * this.radius;
  }

  describe() {
    return `${super.describe()} It has a radius of ${this.radius}.`;
  }
}

class Rectangle extends Shape {
  constructor(colour, w, h) {
    super("Rectangle", colour);
    this.w = w;
    this.h = h;
  }

  area() {
    return this.w * this.h;
  }

  perimeter() {
    return 2 * (this.w + this.h);
  }

  describe() {
    return `${super.describe()} It has a width of ${this.w} and a height of ${this.h}.`;
  }
}

class Triangle extends Shape {
  constructor(colour, base, height) {
    super("Triangle", colour);
    this.base = base;
    this.height = height;
  }

  area() {
    return 0.5 * this.base * this.height;
  }

  describe() {
    return `${super.describe()} It has a base of ${this.base} and a height of ${this.height}.`;
  }
}

class ShapeCollection {
  constructor() {
    this.shapes = [];
  }

  add(shape) {
    this.shapes.push(shape);
    return this;
  }

  removeById(id) {
    this.shapes = this.shapes.filter((shape) => shape.id !== id);
  }

  getByType(type) {
    return this.shapes.filter(
      (shape) => shape.name.toLowerCase() === type.toLowerCase(),
    );
  }

  sortByArea(ascending = true) {
    return this.shapes.sort((a, b) =>
      ascending ? a.area() - b.area() : b.area() - a.area(),
    );
  }

  getTotalArea() {
    return this.shapes.reduce((total, shape) => total + shape.area(), 0);
  }
}
const box = new ShapeCollection();

const smallTriangle = new Triangle("green", 10, 5);
const mediumRect = new Rectangle("blue", 10, 5);
const largeCircle = new Circle("red", 5);

box.add(smallTriangle).add(mediumRect).add(largeCircle);
console.log("Total shapes in box:", box.shapes.length);

console.log("Total circles: ", box.getByType("circle").length);

box.sortByArea();
console.log("Smallest shape in the box is: ", box.shapes[0].name);

console.log("Total area:", box.getTotalArea());

const idToRemove = mediumRect.id;
console.log("Shapes left after removal: ", box.shapes.length);

// ------verification---
console.log("Is largeCircle a Circle? ", largeCircle instanceof Circle);
console.log("Is largeCircle a Shape? ", largeCircle instanceof Shape);
console.log("Is largeCircle a Rectangle? ", largeCircle instanceof Rectangle);

console.log(Object.getPrototypeOf(largeCircle));
console.log(Circle.prototype);

console.log(
  "Is prototype of largeCircle standard Circle?",
  Object.getPrototypeOf(largeCircle) === Circle.prototype,
);
console.log(
  "Is parent prototype of Circle standard Shape?",
  Object.getPrototypeOf(Circle.prototype) === Shape.prototype,
);

console.log("smallTriangle class name:", smallTriangle.constructor.name);
console.log("mediumRect class name:", mediumRect.constructor.name);
console.log("largeCircle class name:", largeCircle.constructor.name);
