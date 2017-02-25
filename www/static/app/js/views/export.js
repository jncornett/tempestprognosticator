'use strict';

define(['backbone'], Backbone => {
  return Backbone.View.extend({
    events: {
      'click .ctrl-download': 'onDownload'
    },
    initialize: function(options) {
      this.listenTo(this.model.exportTypes, 'add', this.addExportType);
    },
    addExportType: function(model) {
      this.$('.ctrl-export-types').append($('<option>').text(model.get('name')));
    },
    onDownload: function() {
      console.log('onDownload');
    }
  });
});
