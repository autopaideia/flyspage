export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('public')
  eleventyConfig.addWatchTarget('public')

  return {
    dir: {
      input: 'src',
      includes: '_partials',
      layouts: '_layouts',
      data: '_data',
      output: 'build',
    },
  }
}
