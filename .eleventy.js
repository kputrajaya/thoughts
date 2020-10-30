const htmlMin = require('html-minifier');
const pluginSass = require('eleventy-plugin-sass');
const slugify = require('slugify');
const workbox = require('workbox-build');

module.exports = (eleventyConfig) => {
  const constants = {
    sitename: 'Thoughts',
    firstName: 'Kevin',
    lastName: 'Putrajaya',
    hostname: 'https://thoughts.kvn.pt',
    description: 'A blog for personal thoughts, random ideas, and reflections of events.',
    keywords: 'blog, personal, thoughts, random, ideas, reflections, events, philosophy, story',
    year: new Date().getFullYear().toString(),
  };
  const config = {
    dir: {
      input: 'src',
      includes: 'includes',
      data: 'data',
      layouts: 'layouts',
      output: 'dist',
    },
  };

  eleventyConfig.setTemplateFormats(['md', 'njk']);

  const copyConfig = {};
  copyConfig[`${config.dir.input}/static`] = '/'; // Copy to root
  copyConfig[`${config.dir.input}/assets/**/!(*.scss)`] = null; // Keep current structure
  eleventyConfig.addPassthroughCopy(copyConfig);

  eleventyConfig.addPlugin(pluginSass, { watch: `${config.dir.input}/**/*.{scss,sass}` });

  eleventyConfig.addTransform('htmlMin', (content, outputPath) => (
    outputPath.endsWith('.html') ?
      htmlMin.minify(content, {
        collapseWhitespace: true,
        minifyJS: true,
        processScripts: true,
        useShortDoctype: true,
      }) :
      content
  ));

  eleventyConfig.on('afterBuild', async () => {
    await workbox.generateSW({
      cacheId: constants.siteName,
      skipWaiting: true,
      clientsClaim: true,
      swDest: `${config.dir.output}/sw.js`,
      globDirectory: config.dir.output,
      globPatterns: ['**/*.{html,css,js,mjs,map,jpg,png,gif,webp,ico,svg,woff2,woff,eot,ttf,otf,ttc,json}'],
      runtimeCaching: [
        {
          urlPattern: ({ url: { hostname, pathname } }) => (
            pathname === '/assets/scss/index.css' ||
            hostname === 'fonts.googleapis.com' ||
            hostname === 'fonts.gstatic.com' ||
            hostname === 'atcntscqfp.cloudimg.io'
          ),
          handler: 'StaleWhileRevalidate',
        },
      ],
    });
  });

  eleventyConfig.addFilter('slug', (value) => slugify(value, { lower: true, strict: true }));
  eleventyConfig.addFilter('pageTitle', (title) => `${title || constants.sitename} - ${constants.firstName} ${constants.lastName}`);
  eleventyConfig.addFilter('unsplash', (slug) => `https://atcntscqfp.cloudimg.io/v7/https://images.unsplash.com/${slug}?w=1920&h=480&q=60`);
  eleventyConfig.addShortcode('const', (key) => constants[key]);

  return config;
};
