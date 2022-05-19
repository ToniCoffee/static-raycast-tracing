// Collision Decorator Pattern Abstraction

// These methods describe the attributes necessary for
// the resulting collision calculations

var Collision = {

  // Elastic collisions refer to the simple cast where
  // two entities collide and a transfer of energy is
  // performed to calculate the resulting speed
  // We will follow Box2D's example of using
  // restitution to represent "bounciness"

  elastic: function(restitution) {
      this.restitution = restitution || .2;
  },

  displace: function() {
      // While not supported in this engine
         // the displacement collisions could include
      // friction to slow down entities as they slide
      // across the colliding entity
  }
};

// The physics entity will take on a shape, collision
// and type based on its parameters. These entities are
// built as functional objects so that they can be
// instantiated by using the 'new' keyword.

var PhysicsEntity = function(collisionName, type) {

  // Setup the defaults if no parameters are given
  // Type represents the collision detector's handling
  this.type = type || PhysicsEntity.DYNAMIC;

  // Collision represents the type of collision
  // another object will receive upon colliding
  this.collision = collisionName || PhysicsEntity.ELASTIC;

  // Take in a width and height
  this.width  = 20;
  this.height = 20;

  // Store a half size for quicker calculations
  this.halfWidth = this.width * .5;
  this.halfHeight = this.height * .5;

  var collision = Collision[this.collision];
  collision.call(this);

  // Setup the positional data in 2D

  // Position
  this.x = 0;
  this.y = 0;

  // Velocity
  this.vx = 0;
  this.vy = 0;

  // Acceleration
  this.ax = 0;
  this.ay = 0;

  // Update the bounds of the object to recalculate
  // the half sizes and any other pieces
  this.updateBounds();
};

// Physics entity calculations
PhysicsEntity.prototype = {

  // Update bounds includes the rect's
  // boundary updates
  updateBounds: function() {
      this.halfWidth = this.width * .5;
      this.halfHeight = this.height * .5;
  },

  // Getters for the mid point of the rect
  getMidX: function() {
      return this.halfWidth + this.x;
  },

  getMidY: function() {
      return this.halfHeight + this.y;
  },

  // Getters for the top, left, right, and bottom
  // of the rectangle
  getTop: function() {
      return this.y;
  },
  getLeft: function() {
      return this.x;
  },
  getRight: function() {
      return this.x + this.width;
  },
  getBottom: function() {
      return this.y + this.height;
  }
};

// Constants

// Engine Constants

// These constants represent the 3 different types of
// entities acting in this engine
// These types are derived from Box2D's engine that
// model the behaviors of its own entities/bodies

// Kinematic entities are not affected by gravity, and
// will not allow the solver to solve these elements
// These entities will be our platforms in the stage
PhysicsEntity.KINEMATIC = 'kinematic';

// Dynamic entities will be completely changing and are
// affected by all aspects of the physics system
PhysicsEntity.DYNAMIC   = 'dynamic';

// Solver Constants

// These constants represent the different methods our
// solver will take to resolve collisions

// The displace resolution will only move an entity
// outside of the space of the other and zero the
// velocity in that direction
PhysicsEntity.DISPLACE = 'displace';

// The elastic resolution will displace and also bounce
// the colliding entity off by reducing the velocity by
// its restituion coefficient
PhysicsEntity.ELASTIC = 'elastic';


////////////////////////////////////////////
// Position equation
p(n + 1) = v * t + p(n)

////////////////////////////////////////////
// Velocity equation
v(n + 1) = a * t + v(n)

///////////////////////////////////////////
// Force equation working out mass
// Our mass is always equal to one
var mass = 1;

// Force = mass * acceleration
var force = mass * acceleration;

// We can work the mass out of the equation
// and it won't change anything
force = acceleration;


///////////////////////////////////////////////////////
// Collision detector collideRect test
// Rect collision tests the edges of each rect to
// test whether the objects are overlapping the other
CollisionDetector.prototype.collideRect = function(collider, collidee) {
    // Store the collider and collidee edges
    var l1 = collider.getLeft();
    var t1 = collider.getTop();
    var r1 = collider.getRight();
    var b1 = collider.getBottom();

    var l2 = collidee.getLeft();
    var t2 = collidee.getTop();
    var r2 = collidee.getRight();
    var b2 = collidee.getBottom();

    // If the any of the edges are beyond any of the
    // others, then we know that the box cannot be
    // colliding
    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
        return false;
    }

    // If the algorithm made it here, it had to collide
    return true;
};

////////////////////////////////////////////////////////////////
// Displacement collision resolution
CollisionDetector.prototype.resolveElastic = function(player, entity) {
  // Find the mid points of the entity and player
  var pMidX = player.getMidX();
  var pMidY = player.getMidY();
  var aMidX = entity.getMidX();
  var aMidY = entity.getMidY();

  // To find the side of entry calculate based on
  // the normalized sides
  var dx = (aMidX - pMidX) / entity.halfWidth;
  var dy = (aMidY - pMidY) / entity.halfHeight;

  // Calculate the absolute change in x and y
  var absDX = abs(dx);
  var absDY = abs(dy);

  // If the distance between the normalized x and y
  // position is less than a small threshold (.1 in this case)
  // then this object is approaching from a corner
  if (abs(absDX - absDY) < .1) {

      // If the player is approaching from positive X
      if (dx < 0) {

          // Set the player x to the right side
          player.x = entity.getRight();

      // If the player is approaching from negative X
      } else {

          // Set the player x to the left side
          player.x = entity.getLeft() - player.width;
      }

      // If the player is approaching from positive Y
      if (dy < 0) {

          // Set the player y to the bottom
          player.y = entity.getBottom();

      // If the player is approaching from negative Y
      } else {

          // Set the player y to the top
          player.y = entity.getTop() - player.height;
      }

      // Randomly select a x/y direction to reflect velocity on
      if (Math.random() < .5) {

          // Reflect the velocity at a reduced rate
          player.vx = -player.vx * entity.restitution;

          // If the object's velocity is nearing 0, set it to 0
          // STICKY_THRESHOLD is set to .0004
          if (abs(player.vx) < STICKY_THRESHOLD) {
              player.vx = 0;
          }
      } else {

          player.vy = -player.vy * entity.restitution;
          if (abs(player.vy) < STICKY_THRESHOLD) {
              player.vy = 0;
          }
      }

  // If the object is approaching from the sides
  } else if (absDX > absDY) {

      // If the player is approaching from positive X
      if (dx < 0) {
          player.x = entity.getRight();

      } else {
      // If the player is approaching from negative X
          player.x = entity.getLeft() - player.width;
      }

      // Velocity component
      player.vx = -player.vx * entity.restitution;

      if (abs(player.vx) < STICKY_THRESHOLD) {
          player.vx = 0;
      }

  // If this collision is coming from the top or bottom more
  } else {

      // If the player is approaching from positive Y
      if (dy < 0) {
          player.y = entity.getBottom();

      } else {
      // If the player is approaching from negative Y
          player.y = entity.getTop() - player.height;
      }

      // Velocity component
      player.vy = -player.vy * entity.restitution;
      if (abs(player.vy) < STICKY_THRESHOLD) {
          player.vy = 0;
      }
  }
};


///////////////////////////////////////////////////////////////
// Physics engine
Engine.prototype.step = function(elapsed) {
  var gx = GRAVITY_X * elapsed;
  var gy = GRAVITY_Y * elapsed;
  var entity;
  var entities = this.entities;

  for (var i = 0, length = entities.length; i < length; i++) {
      entity = entities[i];
      switch (entity.type) {
          case PhysicsEntity.DYNAMIC:
              entity.vx += entity.ax * elapsed + gx;
              entity.vy += entity.ay * elapsed + gy;
              entity.x  += entity.vx * elapsed;
              entity.y  += entity.vy * elapsed;
              break;
          case PhysicsEntity.KINEMATIC:
              entity.vx += entity.ax * elapsed;
              entity.vy += entity.ay * elapsed;
              entity.x  += entity.vx * elapsed;
              entity.y  += entity.vy * elapsed;
              break;
      }
  }

  var collisions = this.collider.detectCollisions(
      this.player,
      this.collidables
  );

  if (collisions != null) {
      this.solver.resolve(this.player, collisions);
  }
};