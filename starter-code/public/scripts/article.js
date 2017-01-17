'use strict';

// REVIEW: Check out all of the functions that we've cleaned up with arrow function syntax.

// Done: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.

(function(module) {
  function Article(opts) {
  // REVIEW: Lets review what's actually happening here, and check out some new syntax!!
  Object.keys(opts).forEach(e => this[e] = opts[e]);
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = rows => {
  rows.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));

  // Done: Refactor this forEach code, by using a `.map` call instead, since want we are trying to accomplish
  // is the transformation of one colleciton into another.

  /* OLD forEach():
    rows.forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
  */

  Article.all = rows.map(ele => new Article(ele));
};

Article.fetchAll = callback => {
  $.get('/articles/all')
  .then(
    results => {
      if (results.rows.length) {
        Article.loadAll(results.rows);
        callback();
      } else {
        $.getJSON('./data/hackerIpsum.json')
        .then(rawData => {
          rawData.forEach(item => {
            let article = new Article(item);
            article.insertRecord();
          })
        })
        .then(() => Article.fetchAll(callback))
        .catch(console.error);
      }
    }
  )
};

// Done: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
Article.numWordsAll = () => {
  return Article.all.map(article => article.body.split(' ').length).reduce((totalWords,words) => totalWords + words);

// DONE: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Article.allAuthors = () => {
  return Article.all.map(ele => Article.author).reduce( (array,author) => {
  if(!array.includes(author)) {
    array.push(author);
  }
  return array;
}, []);


Article.numWordsByAuthor = () => {
  return Article.allAuthors().map(author => {
    // TODO: Transform each author string into an object with properties for
    // the author's name, as well as the total number of words across all articles
    // written by the specified author.
    function map(author,transform) {

    }
    return {
      name: , // TODO: Complete the value for this object property
      numWords: Article.all.filter().map().reduce() // TODO: Complete these three FP methods.
    }
  })
};

Article.truncateTable = callback => {
  $.ajax({
    url: '/articles/truncate',
    method: 'DELETE',
  })
  .then(console.log) // REVIEW: Check out this clean syntax for just passing 'assumend' data into a named function!
  .then(callback);
};

Article.prototype.insertRecord = function(callback) {
  // REVIEW: Why can't we use an arrow function here for .insertRecord()??
  $.post('/articles/insert', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
  .then(console.log)
  .then(callback);
};

Article.prototype.deleteRecord = function(callback) {
  $.ajax({
    url: '/articles/delete',
    method: 'DELETE',
    data: {id: this.article_id}
  })
  .then(console.log)
  .then(callback);
};

Article.prototype.updateRecord = function(callback) {
  $.ajax({
    url: '/articles/delete',
    method: 'DELETE',
    data: {
      author: this.author,
      authorUrl: this.authorUrl,
      body: this.body,
      category: this.category,
      publishedOn: this.publishedOn,
      title: this.title,
      id: this.article_id}
    })
    .then(console.log)
    .then(callback);
  }

module.Article = Article;
})(window);
