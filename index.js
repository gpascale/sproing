const arrayScalarMult = (array, scalar) => {
  // console.log(array, scalar)
  return array.map(x => x * scalar);
};
const arraySubtract = (array1, array2) => {
  return array1.map((x, i) => x - array2[i]);
};
const arrayAdd = (array1, array2) => {
  return array1.map((x, i) => x + array2[i]);
};

const defaultSpringParams = {
  tension: 300,
  damping: 70,
  mass: 1.5
};

function Sproing(current, target, options) {
  // target is optional
  if (!options && typeof target === 'object' && !Array.isArray(target)) {
    options = target;
    target = null;
  }

  options = options || {};

  console.log({ current, target, options });

  // apply defaults
  this.springParams = {
    ...defaultSpringParams,
    ...options.springParams
  };

  if (typeof current === 'number') {
    if (target != null && typeof target !== 'number') {
      throw Error('target must be a scalar or null since current is a scalar');
    }
    this.isScalar = true;
    this.current = current;
    this.target = target != null ? target : current;
    this.velocity = 0;
    this.acceleration = 0;
  } else {
    if (!Array.isArray(current)) {
      throw Error('current must be a number or an array of numbers');
    }
    for (let component of current) {
      if (typeof component !== 'number') {
        throw Error('current must be a number or an array of numbers');
      }
    }
    if (target != null) {
      if (!Array.isArray(target) || target.length != current.length) {
        throw Error(
          'target must be an array with the same number of components as current (' +
            current.length +
            ')'
        );
      }
      for (let component of target) {
        if (typeof component !== 'number') {
          throw Error('target must be a number or an array of numbers');
        }
      }
    }
    this.current = [...current];
    this.target = target ? [...target] : [...current];
    this.numComponents = current.length;
    this.velocity = new Array(current.length).fill(0);
    this.acceleration = new Array(current.length).fill(0);
    this.isScalar = false;
  }

  this.setTarget = function(newTarget) {
    if (this.isScalar) {
      if (this.isScalar && typeof newTarget !== 'number') {
        throw Error('Cannot set target of scalar spring to non-scalar value');
      }
      this.target = newTarget;
    } else {
      if (!Array.isArray(newTarget)) {
        throw Error('newTarget must be an array');
      }
      if (newTarget.length != this.numComponents) {
        throw Error('newTarget must be an array of length ', this.numComponents);
      }
      this.target = [...newTarget];
    }
  };

  this.current = current;

  this.lastUpdateTime = new Date().getTime();

  this.update = function() {
    const now = new Date().getTime();
    const elapsedS = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    if (this.isScalar) {
      const displacement = this.current - this.target;
      const springForce = -this.springParams.tension * displacement;
      const dampingForce = -this.springParams.damping * this.velocity;
      this.acceleration = (springForce + dampingForce) * (1.0 / this.springParams.mass);
      this.velocity += this.acceleration * elapsedS;
      this.current = this.current + this.velocity * elapsedS;
      if (typeof options.min === 'number') {
        this.current = Math.max(this.current, options.min);
      }
      if (typeof options.max === 'number') {
        this.current = Math.min(this.current, options.max);
      }
    } else {
      const displacement = arraySubtract(this.current, this.target);
      const springForce = arrayScalarMult(displacement, -this.springParams.tension);
      const dampingForce = arrayScalarMult(this.velocity, -this.springParams.damping);
      this.acceleration = arrayScalarMult(
        arrayAdd(springForce, dampingForce),
        1.0 / this.springParams.mass
      );
      this.velocity = arrayAdd(
        this.velocity,
        arrayScalarMult(this.acceleration, elapsedS)
      );
      this.current = arrayAdd(this.current, arrayScalarMult(this.velocity, elapsedS));
      if (typeof options.min === 'number') {
        this.current = this.current.map(x => Math.max(x, options.min));
      }
      if (typeof options.max === 'number') {
        this.current = this.current.map(x => Math.min(x, options.max));
      }
    }

    return this.current;
  };
}

export default Sproing;
