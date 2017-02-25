'use strict';

const QuestionTypes = {
    MultipleChoiceWordToDefinition: {
        name: 'Multiple Choice, Word-to-definition',
        generate: function (dict, words) { throw 'not implemented'; },
        formatQuiz: function(question) { throw 'not implemented'; },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    },

    MultipleChoiceDefinitionToWord: {
        name: 'Multiple Choice, Definition-to-word',
        generate: function(dict, words) { throw 'not implemented'; },
        formatQuiz: function(question) { throw 'not implemented'; },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    },

    MultipleChoiceExampleSentence: {
        name: 'Multiple Choice, Example sentence',
        generate: function(dict, words) { throw 'not implemented'; },
        formatQuiz: function(question) { throw 'not implemented'; },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    }
};
