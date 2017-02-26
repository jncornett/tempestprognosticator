define(['underscore', 'app/random'], (_, Random) => {
    const defaultParams = {
        numQuestions: 20,
        questionTypes: [],
    };

    function generateQuiz(dict, words, params) {
      params = _.extend({}, defaultParams, params);
      const sample = new Random.Sample(words);
      const db = new Random.DistBuilder;
      for (const qt of params.questionTypes) {
        db.push([qt, 1]);
      }
      const dist = db.dist();
      const questions = [];
      for (let i = 0; i < params.numQuestions; i++) {
        const qt = dist.next();
        if (sample.size < qt.minWords) {
          console.log('out of words, stopping...');
          break;
        }
        try {
          const data = qt.generate(dict, sample);
          if (data) {
            questions.push({
              type: qt.name,
              data: data
            });
          } else {
            console.log('generator for "' + qt.name + '" returned a null result');
          }
        } catch (err) {
          console.log('generator for "' + qt.name + '" threw', err);
        }
      }
      return questions;
    }

    function renderQuiz(questionTypes, quiz) {
      const questionMap = {};
      for (const qt of questionTypes) {
        questionMap[qt.name] = qt;
      }
      const out = [];
      for (const q of quiz) {
        out.push(questionMap[q.type].formatQuiz(q.data));
      }
      return out;
    }

    return {
      generateQuiz,
      renderQuiz
    };
});
