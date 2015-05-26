module.exports = function(gulp, config) {
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

  resolveDependency = function(dep, ns) {
    if (dep.indexOf(config.current) === 0) {
      // current token is used
      ns.pop();
      ns.push(dep.slice(config.current.length));
      return ns.join(config.separator);
    } else if (dep.indexOf(config.parent) === 0) {
      // parent token is used
      ns.pop();
      dep = resolveDependency(dep.slice(config.parent.length), ns);
      return resolveDependency(config.current + dep, ns);
    } else {
      // ordinary dependency
      return dep;
    }
  };

  gulp.group = function(name, define) {
    var subTasks, group;

    group = new String(name);
    group.deps = [];
    groups.push(group);

    // console.log(indents.join('') + '├─┬ %s', group);
    // indents.push('│ ');
    subTasks = [];

    define();

    groups.pop();
    gulp.task(group.toString(), group.deps.map(function(dep) {
      return config.current + name + config.separator + dep;
    }));

    // console.log(indents.join('') + '└ ..');
    // indents.pop();
  };

  gulp.task = function(name, deps, func) {
    var resolve, ns;

    // make ns a shallow copy of groups
    ns = groups.slice();
    ns.push(name);

    if (Array.isArray(deps)) {
      // console.log(indents.join('') + '├── %s [%s]', name, deps);
      deps = deps.map(function(dep, idx, arr) {
        return resolveDependency(dep.toString(), ns.slice());
      }, this);
    } else {
      // console.log(indents.join('') + '├── %s', name);
    }

    if (groups.length > 0) {
      groups[groups.length-1].deps.push(name);
    }

    task.call(gulp, ns.join(config.separator), deps, func);
  }

  return gulp;
};
