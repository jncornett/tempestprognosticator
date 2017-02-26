define(() => {
  class DictionaryApi {
    constructor(preload) {
      this.cache = preload
    }
    lookupWord(word) {
      let data = this.cache[word];
      if (data) {
        return Promises.resolve(data);
      }
      return this.fetchWord(word).then((d) => {
        this.cache[word] = d;
      });
    }
    preload(words) {
      const promises = [];
      for (const w of words) {
        promises.push(this.fetchWord(w));
      }
      Promises.all(promises);
    }
    fetchWord(word) {
      console.log('fetchword', word);
      return fetch('wordnik/' + word).then((resp) => resp.json());
    }
  };

  const FakeApi = new DictionaryApi({
    tempest: {
      word: 'tempest',
      definition: 'a violent windy storm.',
      example: 'When CEO Jamie Dimon first announced the loss in April, he pegged it at just $2 billion, and called it “a tempest in a teapot.”'
    },
    prognosticator: {
      word: 'prognosticator',
      definition: 'one who forecasts or predicts' ,
      example: 'One Washington prognosticator, however, stands above the rest.'
    },
    horse: {
      word: 'horse',
      definition: 'a quadrupedal mammal',
      example: 'I am a horse'
    },
    refrigerator: {
      word: 'refrigerator',
      definition: 'a device for cooling ice cream',
      example: 'The refrigerator houses my frozen desserts'
    }
  });

  return {
    DictionaryApi,
    FakeApi
  };
});
