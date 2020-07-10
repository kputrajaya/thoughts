const htmlMin = require('html-minifier');
const pluginSass = require('eleventy-plugin-sass');
const slugify = require('slugify');

module.exports = (eleventyConfig) => {
  const config = {
    dir: {
      input: 'src',
      includes: 'includes',
      data: 'data',
      layouts: 'layouts',
      output: 'dist'
    }
  };

  eleventyConfig.setTemplateFormats(['ico', 'md', 'njk']);

  eleventyConfig.addTransform('htmlMin', (content, outputPath) => outputPath.endsWith('.html')
    ? htmlMin.minify(content, {
      collapseWhitespace: true,
      minifyJS: true,
      processScripts: true,
      useShortDoctype: true
    })
    : content
  );

  eleventyConfig.addPlugin(pluginSass, {
    watch: config.dir.input + '/**/*.{scss,sass}'
  });

  eleventyConfig.addFilter('slug', (value) => slugify(value, {lower: true, strict: true}));

  eleventyConfig.addShortcode('year', () => new Date().getFullYear().toString());

  return config;
};
