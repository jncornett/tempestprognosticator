'use strict';

define([
  'jquery',
  'app/dictionary',
  'app/models/appsettings',
  'app/views/app',
  'jquery.webui-popover',
], ($, dictionary, AppSettings, AppView) => {
  $(() => {
    const app = new AppView({
      el: $('#app'),
      model: new AppSettings,
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
