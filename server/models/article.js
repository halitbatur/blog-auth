const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const hljs = require('highlight.js');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlightAuto(code).value;
  },
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

articleSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }

  if (!this.snippet) {
    const dom = new JSDOM().window.document;
    const el = dom.createElement('div');
    el.innerHTML = this.sanitizedHtml;
    this.snippet = `${el.textContent.split('\n')[0].slice(0, 400)}...`;
  }

  next();
});

const autoPopulateAuthor = function (next) {
  this.populate('author');
  next();
};

articleSchema
  .pre('findOne', autoPopulateAuthor)
  .pre('find', autoPopulateAuthor);

module.exports = mongoose.model('Article', articleSchema);
