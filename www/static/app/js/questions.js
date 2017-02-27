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
  return [
    {
        name: 'Multiple Choice, Word-to-definition',
        help: '',
        minWords: 4,
        generate: function (dict, words) {
          const answer = getWords(dict, words, 1);
          if (!answer) {
            console.log('failed to fetch answer word');
          }
          const otherChoices = getWords(dict, words, this.minWords - 1); // FIXME 'minWords' should be 'numChoices'
          if (!otherChoices) {
            console.log('failed to fetch other choice words');
          }
          console.log('fetch words:', answer, otherChoices);
          allChoices = [answer].concat(otherChoices);
          shuffle(allChoices);
          let answerIndex = -1;
          // Find the index of the correct answer, post shuffling:
          for (let i = 0; i < allChoices.length; i++) {
            if (allChoices[i].word == answer.word) {
              answerIndex = i;
              break;
            }
          }
          console.log('answerIndex', answerIndex);
          // Now add back all non-answer choices so they can be reused
          // FIXME this is a kind-of-dirty hack
          for (const c of otherChoices) {
            words.add(c);
          }
          return {
            question: answer.word,
            choices: allChoices.map(d => d.definition),
            answer: answerIndex
          }
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
        formatQuiz: function(question) {
          return {
            title: 'Which word fits the following example sentence the best?',
            info: question.question.replace(question.choices[question.answer], '________'),
            choices: question.choices
          };
        },
        formatAnswerKey: function(question) { throw 'not implemented'; }
    }
  ];
});
