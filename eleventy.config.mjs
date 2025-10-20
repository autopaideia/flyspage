import fs from 'fs'
import { HtmlBasePlugin } from '@11ty/eleventy'
import eleventyNavigationPlugin from '@11ty/eleventy-navigation'

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin)
  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  eleventyConfig.addGlobalData('layout', 'base.njk')

  // Copy everything in ./public into root directory (not <root>/public/...)
  const publicDir = 'public'
  const publicContents = Object.fromEntries(
    fs.readdirSync(publicDir, { withFileTypes: true })
      .map((entry) => ([`${publicDir}/${entry.name}`, entry.name ]))
  )

  eleventyConfig.addWatchTarget(publicDir)
  eleventyConfig.addPassthroughCopy(publicContents)

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
