module.exports = function (gulp, config) {
  var groups, task, resolveDependency;

  // get gulp if not provided
  if (typeof gulp === 'undefined') {
    gulp = require('gulp');
  }

  // seed config
  config = config || {};
  config.separator = config.separator || '/';
  config.current = config.current || './';
  config.parent = config.parent || '../';

  // console.log(' Gulp tasks:');
  // var indents = ['  '];

  groups = [];
  task = gulp.task;

  resolveDependency = function (dep, ns) {
    var resolvedDep;
    if (dep.indexOf(config.current) === 0) {
      // current token is used
      dep = dep.slice(config.current.length);
      resolvedDep = resolveDependency(dep, ns);
      if (dep === resolvedDep) {
        ns.push(dep);
        return ns.join(config.separator);
      } else {
        return resolvedDep;
      }
    } else if (dep.indexOf(config.parent) === 0) {
      // parent token is used
      ns.pop();
      dep = dep.slice(config.parent.length);
      resolvedDep = resolveDependency(dep, ns);
      if (dep === resolvedDep) {
        ns.push(dep);
        return ns.join(config.separator);
      } else {
        return resolvedDep;
      }
    } else {
      // ordinary dependency
      return dep;
    }
  };

  gulp.group = function (name, define) {
    var group;

    group = {
      deps: [],
      toString: function () {
        return name
      }
    };
    groups.push(group);

    // console.log(indents.join('') + '├─┬ %s', group);
    // indents.push('│ ');

    define();

    groups.pop();
    gulp.task(group.toString(), group.deps.map(function (dep) {
      return config.current + name + config.separator + dep;
    }));

    // console.log(indents.join('') + '└ ..');
    // indents.pop();
  };

  gulp.task = function (name, deps, func) {
    var ns;

    // make ns a shallow copy of groups
    ns = groups.slice();

    if (Array.isArray(deps)) {
      // console.log(indents.join('') + '├── %s [%s]', name, deps);
      deps = deps.map(function (dep) {
        return resolveDependency(dep.toString(), ns.slice());
      }, this);
    } else {
      // console.log(indents.join('') + '├── %s', name);
    }

    if (groups.length > 0) {
      groups[groups.length - 1].deps.push(name);
    }

    ns.push(name);
    task.call(gulp, ns.join(config.separator), deps, func);
  };

  return gulp;
};
