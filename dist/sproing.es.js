function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var arrayScalarMult = function arrayScalarMult(array, scalar) {
  // console.log(array, scalar)
  return array.map(function (x) {
    return x * scalar;
  });
};

var arraySubtract = function arraySubtract(array1, array2) {
  return array1.map(function (x, i) {
    return x - array2[i];
  });
};

var arrayAdd = function arrayAdd(array1, array2) {
  return array1.map(function (x, i) {
    return x + array2[i];
  });
};

var defaultSpringParams = {
  tension: 300,
  damping: 70,
  mass: 1.5
};

function Sproing(current, target, options) {
  // target is optional
  if (!options && _typeof(target) === 'object' && !Array.isArray(target)) {
    options = target;
    target = null;
  }

  options = options || {};
  console.log({
    current: current,
    target: target,
    options: options
  }); // apply defaults

  this.springParams = _objectSpread({}, defaultSpringParams, options.springParams);

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

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = current[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _component = _step.value;

        if (typeof _component !== 'number') {
          throw Error('current must be a number or an array of numbers');
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (target != null) {
      if (!Array.isArray(target) || target.length != current.length) {
        throw Error('target must be an array with the same number of components as current (' + current.length + ')');
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = target[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var component = _step2.value;

          if (typeof component !== 'number') {
            throw Error('target must be a number or an array of numbers');
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    this.current = _toConsumableArray(current);
    this.target = target ? _toConsumableArray(target) : _toConsumableArray(current);
    this.numComponents = current.length;
    this.velocity = new Array(current.length).fill(0);
    this.acceleration = new Array(current.length).fill(0);
    this.isScalar = false;
  }

  this.setTarget = function (newTarget) {
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

      this.target = _toConsumableArray(newTarget);
    }
  };

  this.current = current;
  this.lastUpdateTime = new Date().getTime();

  this.update = function () {
    var now = new Date().getTime();
    var elapsedS = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    if (this.isScalar) {
      var displacement = this.current - this.target;
      var springForce = -this.springParams.tension * displacement;
      var dampingForce = -this.springParams.damping * this.velocity;
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
      var _displacement = arraySubtract(this.current, this.target);

      var _springForce = arrayScalarMult(_displacement, -this.springParams.tension);

      var _dampingForce = arrayScalarMult(this.velocity, -this.springParams.damping);

      this.acceleration = arrayScalarMult(arrayAdd(_springForce, _dampingForce), 1.0 / this.springParams.mass);
      this.velocity = arrayAdd(this.velocity, arrayScalarMult(this.acceleration, elapsedS));
      this.current = arrayAdd(this.current, arrayScalarMult(this.velocity, elapsedS));

      if (typeof options.min === 'number') {
        this.current = this.current.map(function (x) {
          return Math.max(x, options.min);
        });
      }

      if (typeof options.max === 'number') {
        this.current = this.current.map(function (x) {
          return Math.min(x, options.max);
        });
      }
    }

    return this.current;
  };
}

export default Sproing;
//# sourceMappingURL=sproing.es.js.map
