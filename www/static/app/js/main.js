'use strict';

define([
  'jquery',
  'app/dictionary',
  'app/questions',
  'app/exports',
  'app/models/appsettings',
  'app/views/app',
  'jquery.webui-popover',
], ($, dictionary, questionTypes, exportTypes, AppSettings, AppView) => {
  $(() => {
    const app = new AppView({
      el: $('#app'),
      model: new AppSettings,
      api: dictionary.FakeApi // FIXME will be replaced with 'real' API
    });
    for (const qt of questionTypes) {
      app.model.questionTypes.add(qt);
    }
    for (const et of exportTypes) {
      app.model.exportTypes.add(et);
    }
  });
});
