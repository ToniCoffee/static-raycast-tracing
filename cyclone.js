// http://www.r-5.org/files/books/computers/algo-list/realtime-3d/Ian_Millington-Game_Physics_Engine_Development-EN.pdf
// https://github.com/idmillington/cyclone-physics

var cyclone = cyclone || {};
cyclone.Vector3 = class Vector3 {
  #pad;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.#pad = 0;
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  subs(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this;}
  addScaledVector(v, multiplier) { this.x += v.x * multiplier; this.y += v.y * multiplier; this.z += v.z * multiplier; return this; }
  mult(value) { this.x *= value; this.y *= value; this.z *= value; return this; }
  componentProduct(v) { this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; }
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
  cross(v) {
    this.x = this.y * v.z - this.z * v.y;
    this.y = this.z * v.x - this.x * v.z;
    this.z = this.x * v.y - this.y * v.x;
    return this;
  }
  magnitud() { return Math.sqrt(x * x + y * y + z * z); }
  sqrtMagnitud() { return x * x + y * y + z * z; }
  normalize() {
    let mag = this.magnitud();
    if(mag > 0) this.mult( (1 / mag) );
    return this;
  }

  static add(v1, v2) { return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z); }
  static subs(v1, v2) { return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
  static addScaledVector(v1, v2, multiplier) { new Vector3(v1.x += v2.x * multiplier, v1.y += v2.y * multiplier, v1.z += v2.z * multiplier); }
  static mult(v, value) { return new Vector3(v.x * value, v.y * value, v.z * value); }
  static componentProduct(v1, v2) { return new Vector3(v1.x * v2.x , v1.y * v2.x , v1.z * v2.x ); }
  static dot(v1, v2) { return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; }
  static cross(v1, v2) { return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x); }
  static normalize(v) {
    let mag = v.magnitud();
    if(mag > 0) Vector3.mult(v, (1 / mag) );
  }
  static zero() { return new Vector3(0, 0, 0); }
  static one() { return new Vector3(1, 1, 1); }
  static right() { return new Vector3(1, 0, 0); }
  static left() { return new Vector3(-1, 0, 0); }
  static down() { return new Vector3(0, -1, 0); }
  static up() { return new Vector3(0, 1, 0); }
  static back() { return new Vector3(0, 0, -1); }
  static forward() { return new Vector3(0, 0, 1); }
}

// The Trigonometry of the Scalar Product (Dot product)
    // a · b = ax· bx + ay· by + az· bz = |a|· |b|· cos θ
// So, if we have two normalized vectors, 	a and 	b, then the angle between them is given by:
    // θ = cos−1(a · b)
// If a and b are just regular vectors, then the angle would be given by: 
    // θ = cos−1(a · b / |a| · |b|)

// The Trigonometry of the Vector Product (Cross product)
    // |a × b| = |a|· |b|· sin θ
// This is the same as the scalar product, replacing the cosine with the sine. In fact we can write:
    // |a × b| = |a|· |b| · sqrt(1 − (a · b)^2)
// Using the relationship between cosine and sine:
    // cos^2 θ + sin^2 θ = 1

// Commutativity of the Vector Product (Cross product)
    // a × b != b × a  ---> a × b no es igual a b × a ---> El producto cruz no es commutativo
// In fact, we can see that:
    // a × b = −b × a

/*
"Notas": 
// Cálculo Diferencial: (Derivadas)
    Necesitamos poder entender cómo está cambiando de posición (es decir, su velocidad, la dirección en la que se mueve, si está acelerando o desacelerando)
// Cálculo Integral: (Integrales)
    y los efectos del cambio (es decir, donde estará cuando lleguemos a renderizarlo durante el siguiente fotograma del juego).
*/

cyclone.Particle = class Particle {
  constructor() {
    this.position = cyclone.Vector3.zero();
    this.velocity = cyclone.Vector3.zero();
    this.acceleration = cyclone.Vector3.zero();
    this.damping = 0;
    this.inverseMass = 0;
    this.gravity = new Vector3(0, -20, 0);
  }
}

/*
"Notas":
// LAS TRES LEYES DEL MOVIMIENTO DE NEWTON:
    // 1. Un objeto continúa con una velocidad constante a menos que una fuerza actúe sobre él.
    // 2. Una fuerza que actúa sobre un objeto produce una aceleración proporcional a la masa del objeto.
        // f = m · a = m · p'' = masa por la segunda derivada de la posicion respecto al tiempo (primera derivada dp / dt, segunda derivada d2p / d2t, en este caso p'') (el 2 no es ni por 2 ni elevado a 2 simplemente indica segunda derivada, que seria la aceleracion)
        // p''(aceleracion) = (1 / m) · f = f / m;
// LEY DE LA GRAVITACION UNIVERSAL: Gravedad
    // f = G · ( (m1 · m2) / r^2 )  ---> G = 9.8; r = distancia entre los centros de los objetos
// Debido a que solo nos interesa la atracción de la tierra, podemos simplificar la ecuación 3.3. Primero, podemos asumir que m1 es siempre constante. Segundo, y menos obvio,
podemos asumir que r también es constante. Esto se debe a las enormes distancias involucradas. los
La distancia desde la superficie de la tierra hasta su centro es tan grande (6.400 km) que hay
casi no hay diferencia en la gravedad entre pararse al nivel del mar y pararse en la cima
de una montaña. Para la precisión que necesitamos en un juego, podemos asumir que r
el parámetro es constante. Lo que simplifica la ecuacion a:
    // f = m · g
// Donde m es la masa del objeto que estamos simulando; f es la fuerza, como antes; y g es una
constante que incluye la constante gravitacional universal, la masa de la tierra y
su radio:
    // g = G · (masaDeLaTierra / r^2)
// Observa que la fuerza depende de la masa del objeto. Si calculamos la aceleración usando la ecuación  p''(aceleracion) = (1 / m) · f = f / m, obtenemos: 
    // p''(aceleracion) = (1 / m) · m · g = (m / m) · g = g;
// En otras palabras, no importa qué masa tenga el objeto, siempre acelerará al mismo ritmo debido a la gravedad.
// Lo que esto significa para nuestro motor es que la fuerza más significativa que necesitamos aplicar
se puede aplicar directamente como aceleración. No tiene sentido usar la ecuación f = m · g, para
calcule una fuerza y ​​luego usar la ecuación p''(aceleracion) = (1 / m) · m · g = (m / m) · g = g, para convertirla nuevamente en una aceleración.
En esta iteración del motor, introduciremos la gravedad como la única fuerza que actúa sobre
partículas, y se aplicará directamente como una aceleración.
*/