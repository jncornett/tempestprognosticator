const generateQuiz = (function() {
    const defaultParams = {
        numQuestions: 20,
        generators: [],
    };

    function generateQuiz(api, words, params) {
      const sample = new Random.Sample(words);
      const d = new Random.DistBuilder(types.map((x) => [x, 1])).dist();
      const out = [];
      for (const i = 0; i < n; i++) {
        q = d.next();
        out.push(q(api, sample));
      }
      return out;
    }

    return generateQuiz;
})();
