define(() => {
  function synchronousGet(url, json) {
    let result;
    $.ajax({
      url: url,
      type: 'post',
      async: false,
      dataType: 'json',
      data: JSON.stringify(json),
      contentType: "application/json; charset=utf-8",
      success: (data) => {
        console.log('received data', data);
        result = data;
      }
    });
    return result;
  }
  class Api {
    constructor(preload) {
      this.cache = preload || {};
    }
    lookupWord(word) {
      let data = this.cache[word];
      if (data) {
        return data;
      }
      const result = synchronousGet('wordnik/' + encodeURIComponent(word), null);
      if (result) {
        this.cache[word] = result;
      }
      return result;
    }
    preload(words) {
      const needed = [];
      for (const w of words) {
        if (!(w in this.cache)) {
          needed.push(w);
        }
      }
      const result = synchronousGet('wordnikPreload', needed);
      if (result) {
        for (const w of result) {
          this.cache[w.name] = w
        }
      }
    }
  };

  const FakeApi = new Api({
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
    Api,
    FakeApi
  };
});
