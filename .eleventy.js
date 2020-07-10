const htmlMin = require('html-minifier');
const slugify = require('slugify');

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter('slug', (value) => slugify(value, {lower: true, strict: true}));

  eleventyConfig.addPassthroughCopy('src/assets');

  eleventyConfig.addTransform('htmlMin', (content, outputPath) => (
    outputPath.endsWith('.html')
      ? htmlMin.minify(content, {
        collapseWhitespace: true,
        minifyJS: true,
        processScripts: true,
        useShortDoctype: true
      })
      : content
  ));

  eleventyConfig.setTemplateFormats('md, njk');

  return {
    dir: {
      input: 'src',
      includes: 'includes',
      data: 'data',
      layouts: 'layouts',
      output: 'dist'
    }
  };
};
