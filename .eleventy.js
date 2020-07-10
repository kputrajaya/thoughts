const htmlMin = require('html-minifier');
const pluginSass = require('eleventy-plugin-sass');
const slugify = require('slugify');

module.exports = (eleventyConfig) => {
  const SITE_NAME = 'Thoughts';
  const SITE_OWNER = 'Kevin Putrajaya';

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
  eleventyConfig.addFilter('pageTitle', (title) => `${title || SITE_NAME} - ${SITE_OWNER}`);
  eleventyConfig.addFilter('unsplash', (slug) => `https://ik.imagekit.io/kvn/${slug}?tr=w-1920,h-480`);

  eleventyConfig.addShortcode('sitename', () => SITE_NAME);
  eleventyConfig.addShortcode('year', () => new Date().getFullYear().toString());

  return config;
};
