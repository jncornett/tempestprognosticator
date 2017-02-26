'use strict';

define(['backbone', 'app/quiz'], (Backbone, Quiz) => {
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
      const quiz = this.model.get('quiz');
      if (!quiz) {
        alert('There is no content to export');
        return;
      }
      const exportTypeName = this.$('.ctrl-export-types').val();
      const m = this.model.exportTypes.findWhere({name: exportTypeName});
      if (!m) {
        alert('Exporter ' + exportTypeName + ' not found');
        return;
      }
      console.log('quiz', quiz);
      const items = Quiz.renderQuiz(this.model.questionTypes.models.map(m => m.toJSON()), quiz);
      console.log('items', items);
      const exporter = m.toJSON();
      const html = exporter.render(items);
      console.log('html', html);
      const blob = new Blob([html]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = exporter.filename;
      link.click();
    }
  });
});
