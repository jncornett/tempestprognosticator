'use strict';

define(['app/random'], function(Random) {
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
  };
  function escapeRegexp(s) {
    return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	};
  return [
    {
        name: 'Multiple Choice, Word-to-definition',
        help: '',
        minWords: 4,
        generate: function (dict, words) {
          // FIXME 'minWords' should be 'numChoices'
          const choices = getWords(dict, words, self.minWords);
          if (!choices) {
            console.log('failed to fetch words');
            return
          }
          console.log('fetched words', choices);
          const answerIndex = Math.floor(Math.random()*choices.length);
          shuffle(choices);
          // 'give back' the words that aren't the answer
          for (let i = 0; i < choices.length; i++) {
            if (i != answerIndex) {
              words.add(choices[i].word);
            }
          }
          return {
            question: choices[answerIndex].word,
            choices: choices.map(d => d.definition),
            answer: answerIndex
          };
        },
        formatQuiz: function(question) {
          return {
            title: 'Define "' + question.question + '"',
            choices: question.choices
          };
        },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    },
    {
        name: 'Multiple Choice, Definition-to-word',
        help: '',
        minWords: 4,
        generate: function (dict, words) {
          const choices = getWords(dict, words, this.minWords);
          if (!choices) {
            console.log('failed to fetch words');
            return
          }
          console.log('fetched words', choices);
          const answerIndex = Math.floor(Math.random()*choices.length);
          shuffle(choices);
          // 'give back' the words that aren't the answer
          for (let i = 0; i < choices.length; i++) {
            if (i != answerIndex) {
              words.add(choices[i].word);
            }
          }
          return {
            question: choices[answerIndex].definition,
            choices: choices.map(d => d.word),
            answer: answerIndex
          };
        },
        formatQuiz: function(question) {
          return {
            title: 'Which word more closely matches the following definition?',
            info: question.question,
            choices: question.choices
          };
        },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    },
    {
        name: 'Multiple Choice, Example sentence',
        help: '',
        minWords: 4,
        generate: function (dict, words) {
          const choices = getWords(dict, words, this.minWords);
          if (!choices) {
            console.log('failed to fetch words');
            return;
          }
          console.log('fetched words', choices);
          const answerIndex = Math.floor(Math.random()*choices.length);
          shuffle(choices);
          // 'give back' the words that aren't the answer
          for (let i = 0; i < choices.length; i++) {
            if (i != answerIndex) {
              words.add(choices[i].word);
            }
          }
          return {
            // Don't forget to sanitize the word out!
            question: choices[answerIndex].example,
            choices: choices.map(d => d.word),
            answer: answerIndex
          };
        },
        formatQuiz: function(question) {
					const toReplace = new RegExp(
						'\\b' + escapeRegexp(question.choices[question.answer]) + '\\b',
						'ig'
					);
          const info = question.question.replace(toReplace, '________');
          return {
            title: 'Which word fits the following example sentence the best?',
            info: info,
            choices: question.choices
          };
        },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    }
  ];
});
