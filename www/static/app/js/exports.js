'use strict';

define(['jquery', 'handlebars'], function($, Handlebars) {
  function indexToLetter(i) {
    if (!(i >= 0 && i < 26)) {
      throw 'indexToLetter index out of range';
    }
    return String.fromCharCode('A'.charCodeAt(0) + i);
  }
  Handlebars.registerHelper('oneIndex', function(i) {
    return i + 1;
  });
  Handlebars.registerHelper('alphaIndex', function(i) {
    return indexToLetter(i);
  });
  const exportHTMLTemplate = Handlebars.compile(`
    <ol>
      {{#each questions}}
        <li>
          <h4>{{title}}</h4>
          <blockquote>{{info}}</blockquote>
          <ol type="A">
            {{#each choices}}
              <li>{{.}}</li>
            {{/each}}
          </ol>
        </li>
      {{/each}}
    </ol>`);
  function exportHTML(data) {
    return exportHTMLTemplate({questions: data});
  }
  const exportTextTemplate = Handlebars.compile(`{{#each questions}}
{{oneIndex @index}}. {{title}}
    {{info}}
{{#each choices}}
  {{alphaIndex @index}}. {{.}}
{{/each}}

{{/each}}`);
  function exportText(data) {
    return exportTextTemplate({questions: data});
  }
  return {
    exportHTML,
    exportTypes: [
      /*
      {
        name: 'Javascript (JSON)',
        render: function() { throw 'not implemented'; },
      },
      {
        name: 'Document (RTF)',
        render: function() { throw 'not implemented'; },
      },
      {
        name: 'Spreadsheet (CSV)',
        render: function() { throw 'not implemented'; },
      },
      */
      {
        name: 'Text (TXT)',
        filename: 'quiz.txt',
        render: exportText
      },
      {
        name: 'Web (HTML)',
        filename: 'quiz.html',
        render: exportHTML
      }
    ]
  };
});
