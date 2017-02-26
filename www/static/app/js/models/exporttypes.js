'use strict';

define(['backbone', 'app/models/exporttype'], (Backbone, ExportTypeModel) => {
  return Backbone.Collection.extend({
    model: ExportTypeModel
  });
});
