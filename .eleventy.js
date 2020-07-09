module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('src/assets');

  return {
    dir: {
      input: 'src',
      includes: 'includes',
      layouts: 'layouts',
      output: 'dist'
    }
  };
};
