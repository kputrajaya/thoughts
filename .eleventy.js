const htmlMin = require('html-minifier');
const pluginSass = require('eleventy-plugin-sass');
const slugify = require('slugify');

module.exports = (eleventyConfig) => {
  const constants = {
    sitename: 'Thoughts',
    firstName: 'Kevin',
    lastName: 'Putrajaya',
    hostname: 'https://thoughts.kvn.pt',
    description: 'A blog for personal thoughts, random ideas, and reflections of events.',
    keywords: 'blog, personal, thoughts, random, ideas, reflections, events, philosophy, story',
    year: new Date().getFullYear().toString()
  };
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
  eleventyConfig.addFilter('pageTitle', (title) => (
    `${title || constants.sitename} - ${constants.firstName} ${constants.lastName}`
  ));
  eleventyConfig.addFilter('unsplash', (slug) => `https://atcntscqfp.cloudimg.io/v7/https://images.unsplash.com/${slug}?w=1920&h=480&q=70`);
  eleventyConfig.addShortcode('const', (key) => constants[key]);

  return config;
};
