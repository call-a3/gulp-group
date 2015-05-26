var chai = require('chai');
chai.use(require('sinon-chai'));

var sinon = require('sinon');
var expect = chai.expect;

delete require.cache[require.resolve('..')];
delete require.cache[require.resolve('gulp')];
var gulp = require('..')();

describe('simple usage', function() {

  describe('single-level group', function() {

    it('should execute it\'s defining function', function() {
      var definition = sinon.spy();
      gulp.group('group', definition);

      expect(definition).to.have.been.calledOnce;
      gulp.reset();
    });

    it('should register a task within the group as prefixed', function() {
      var fn = function() {};
      gulp.group('group', function() {
        gulp.task('task', fn);
      });

      expect(gulp.tasks['group/task']).to.exist;
      expect(gulp.tasks['group/task'].fn).to.equal(fn);
      gulp.reset();
    });

    it('should register a task that encapsulates the entire group', function() {
      var task1 = sinon.spy();
      var task2 = sinon.spy();
      gulp.group('group', function() {
        gulp.task('task1', task1);
        gulp.task('task2', task2);
      });

      expect(gulp.tasks['group']).to.exist;
      gulp.run('group');
      expect(task1).to.have.been.calledOnce;
      expect(task2).to.have.been.calledOnce;
      gulp.reset();
    });

    it('should resolve dependencies within same group', function() {
      var task1 = sinon.spy();
      var task2 = sinon.spy();
      gulp.group('group', function() {
        gulp.task('task1', task1);
        gulp.task('task2', ['./task1'], task2);
      });

      gulp.run('group/task2');
      expect(task2).to.have.been.calledOnce;
      expect(task1).to.have.been.calledOnce;
      gulp.reset();
    });

    it('should resolve dependencies above own group', function() {
      var innerTask = sinon.spy();
      var outerTask = sinon.spy();
      gulp.group('group', function() {
        gulp.task('innerTask', ['../outerTask'], innerTask);
      });
      gulp.task('outerTask', outerTask);

      gulp.run('group/innerTask');
      expect(innerTask).to.have.been.calledOnce;
      expect(outerTask).to.have.been.calledOnce;
      gulp.reset();
    });

    it('should resolve normal dependencies', function() {
      var innerTask = sinon.spy();
      var outerTask = sinon.spy();
      gulp.group('group', function() {
        gulp.task('innerTask', ['outerTask'], innerTask);
      });
      gulp.task('outerTask', outerTask);

      gulp.run('group/innerTask');
      expect(innerTask).to.have.been.calledOnce;
      expect(outerTask).to.have.been.calledOnce;
      gulp.reset();
    });

  });

  describe('multi-level groups', function() {

    it('should resolve multi-level dependencies', function() {
      var innerTask = sinon.spy();
      var outerTask = sinon.spy();
      gulp.group('group', function() {
        gulp.group('group', function() {
          gulp.task('innerTask', ['../../outerTask'], innerTask);
        });
      });
      gulp.task('outerTask', outerTask);

      gulp.run('group/group/innerTask');
      expect(innerTask).to.have.been.calledOnce;
      expect(outerTask).to.have.been.calledOnce;
      gulp.reset();
    });

    it('should resolve multi-level dependencies with redundant parts', function() {
      var innerTask = sinon.spy();
      var outerTask = sinon.spy();
      gulp.group('group', function() {
        gulp.group('group', function() {
          gulp.task('innerTask', ['../.././outerTask'], innerTask);
        });
      });
      gulp.task('outerTask', outerTask);

      gulp.run('group/group/innerTask');
      expect(innerTask).to.have.been.calledOnce;
      expect(outerTask).to.have.been.calledOnce;
      gulp.reset();
    });

    it('should resolve multi-level dependencies with sibling jumps', function() {
      var oneTask = sinon.spy();
      var otherTask = sinon.spy();
      gulp.group('group', function() {
        gulp.group('one', function() {
          gulp.task('oneTask', ['../other/otherTask'], oneTask);
        });
        gulp.group('other', function() {
          gulp.task('otherTask', otherTask);
        });
      });

      gulp.run('group/one/oneTask');
      expect(oneTask).to.have.been.calledOnce;
      expect(otherTask).to.have.been.calledOnce;
      gulp.reset();
    });

  });

});
