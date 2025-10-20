export default {
  layout: 'gallery.njk',
  page: {
    scripts: [
      '/scripts/vendor/isotope-with-packery.min.js',
      '/scripts/gallery.js',
    ],
    styles: [
      '/styles/gallery.css',
    ]
  },

  eleventyComputed: {
    gridLayout: ({ images }) =>
      images?.map((img) => img.thumbLayout?.split('x')),

    galleryNavOptions: ({ eleventyNavigation }) => ({
      listClass: 'gallery-nav',
      activeListItemClass: 'is-active',
      activeAnchorClass: 'is-active',
      activeKey: eleventyNavigation.key,
    }),
  },
}
