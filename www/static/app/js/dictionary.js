define(() => {
  class DictionaryApi {
    constructor(preload) {
      this.cache = preload
    }
    lookupWord(word) {
      return this.cache[word];
    }
  };

  const FakeApi = new DictionaryApi({
    'tempest': {
      word: 'tempest',
      definition: 'a violent windy storm.',
      example: 'When CEO Jamie Dimon first announced the loss in April, he pegged it at just $2 billion, and called it “a tempest in a teapot.”'
    },
    'prognosticator': {
      word: 'prognosticator',
      definition: 'one who forecasts or predicts' ,
      example: 'One Washington prognosticator, however, stands above the rest.'
    }
  });

  return {
    DictionaryApi,
    FakeApi
  };
});
