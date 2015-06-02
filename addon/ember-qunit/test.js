import Ember from 'ember';
import { getContext } from 'ember-test-helpers';
import QUnit from 'npm:qunitjs';

var qunitTest = QUnit.test;

export default function test(testName, callback) {
  function wrapper(assert) {
    var context = getContext();

    var result = callback.call(context, assert);

    function failTestOnPromiseRejection(reason) {
      var message;
      if (reason instanceof Error) {
        message = reason.stack;
      } else {
        message = Ember.inspect(reason);
      }
      ok(false, message);
    }

    Ember.run(function(){
      QUnit.stop();
      Ember.RSVP.Promise.resolve(result)['catch'](failTestOnPromiseRejection)['finally'](QUnit.start);
    });
  }

  qunitTest(testName, wrapper);
}
