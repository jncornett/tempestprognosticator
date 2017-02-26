'use strict';

define(function() {
  // getWords retrieves all the (needed) words safely
  function getWords(dict, words, n) {
    const rollback = [];
    const onErr = () => rollback.forEach(w => words.add(w));
    const result = [];
    for (let i = 0; i < n; i++) {
      const w = words.next();
      rollback.push(w);
      const d = dict.lookupWord(w);
      if (!d) {
        onErr();
        return;
      }
      result.push(d);
    }
    return result;
  };
  // shuffle shuffles an array in place
  function shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }
  return [
    {
        name: 'Multiple Choice, Word-to-definition',
        help: '',
        minWords: 4,
        generate: function (dict, words) {
          const data = getWords(dict, words, this.minWords);
          if (!data) {
            console.log('failed to fetch words');
            return;
          }
          shuffle(data);
          const answerIndex = Math.floor(Math.random() * data.length);
          return {
            question: data[answerIndex].word,
            choices: data.map(d => d.definition),
            answer: answerIndex
          }
        },
        formatQuiz: function(question) { throw 'not implemented'; },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    },
    {
        name: 'Multiple Choice, Definition-to-word',
        help: '',
        minWords: 4,
        generate: function (dict, words) {
          const data = getWords(dict, words, this.minWords);
          if (!data) {
            console.log('failed to fetch words');
            return;
          }
          shuffle(data);
          const answerIndex = Math.floor(Math.random() * data.length);
          return {
            question: data[answerIndex].definition,
            choices: data.map(d => d.word),
            answer: answerIndex
          }
        },
        formatQuiz: function(question) { throw 'not implemented'; },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    },
    {
        name: 'Multiple Choice, Example sentence',
        help: '',
        minWords: 4,
        generate: function (dict, words) {
          const data = getWords(dict, words, this.minWords);
          if (!data) {
            console.log('failed to fetch words');
            return;
          }
          shuffle(data);
          const answerIndex = Math.floor(Math.random() * data.length);
          return {
            // Don't forget to sanitize the word out!
            question: data[answerIndex].example,
            choices: data.map(d => d.word),
            answer: answerIndex
          }
        },
        formatQuiz: function(question) { throw 'not implemented'; },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    }
  ];
});
