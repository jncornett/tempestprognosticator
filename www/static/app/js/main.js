'use strict';

define([
  'jquery',
  'app/models',
  'app/dictionary',
  'app/views/app',
  'jquery.webui-popover',
], ($, models, dictionary, AppView) => {
  $(() => {
    const app = new AppView({
      el: $('#app'),
      model: new models.AppSettings,
      api: dictionary.FakeApi // FIXME will be replaced with 'real' API
    });
    app.model.questionTypes.add({
      name: 'Foo',
      help: 'Some help'
    });
    app.model.questionTypes.add({
      name: 'Bar',
      help: 'Some other help'
    });
    app.model.exportTypes.add({
      name: 'Javascript (JSON)'
    });
  });
});
