'use strict';

define([
  'jquery',
  'app/dictionary',
  'app/questions',
  'app/exports',
  'app/models/appsettings',
  'app/views/app',
  'jquery.webui-popover',
], ($, dictionary, questionTypes, exports, AppSettings, AppView) => {
  $(() => {
    const app = new AppView({
      el: $('#app'),
      model: new AppSettings,
      api: new dictionary.Api
    });
    for (const qt of questionTypes) {
      app.model.questionTypes.add(qt);
    }
    for (const et of exports.exportTypes) {
      app.model.exportTypes.add(et);
    }
  });
});
