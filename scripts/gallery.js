(() => {
const iso = new Isotope('.gallery-grid', {
  itemSelector: '.gallery-item',
  percentPosition: true,
  initLayout: false,
  layoutMode: 'packery',
})

const itemElsByTag = {}

const applyFilters = () => {
  const { hash } = window.location
  const hashFilter = decodeURIComponent(
    (hash.match(/filter\[\]=([^&]+)/i) || [])[1] || '',
  )
  const hashYearFilter = decodeURIComponent(
    (hash.match(/filter-year\[\]=([^&]+)/i) || [])[1] || '',
  )

  iso.arrange({
    filter: (el) => {
      if (!hashFilter && !hashYearFilter) return true
      if (hashFilter) return itemElsByTag[hashFilter].includes(el)
      return el.matches(`[data-gallery-year="${hashYearFilter}"]`)
    }
  })

  document.querySelectorAll('.gallery-filter-list a')
    .forEach((link) => {
      const isActive = hash && hash !== '#/' && link.href.endsWith(hash)

      // If the link is active, temporarily alter the href to clear itself
      if (link.dataset.originalHref) link.href = link.dataset.originalHref
      if (isActive) {
        link.dataset.originalHref = link.href
        link.href = '#/'
      }

      link.classList.toggle('is-active', isActive)
    })
}

const renderFilters = () => {
  const tagMap = new Map()
  const yearMap = new Map()
  const activeNavItem = document.querySelector('.gallery-nav li.is-active')

  // Extract a map of all tags from gallery items
  document.querySelectorAll('.gallery-item')
    .forEach((el) => {
      const year = parseInt(el.dataset.galleryYear, 10)
      const tags = JSON.parse(el.dataset.galleryTags || '[]')

      if (!Number.isNaN(year))
        yearMap.set(year, (yearMap.get(year) || 0) + 1)

      // Normalize tag keys to lowercase alphanumeric to prevent dupes
      const keys = tags
        .map((tag) => tag.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())

      // Store tags in key-label map and in collection of dom elements grouped
      // by key
      tags.forEach((tag, i) => {
        tagMap.set(keys[i], tag)
        if (!itemElsByTag[keys[i]]) itemElsByTag[keys[i]] = []
        itemElsByTag[keys[i]].push(el)
      })
    })

  if (!yearMap.size && !tagMap.size) return

  activeNavItem.insertAdjacentHTML(
    'beforeend',
    '<a href="#/" class="gallery-filters-clear-link">Clear Filters ✕</a>',
  )

  if (yearMap.size) {
    // Sort years
    const years = [...yearMap.keys()]
    years.sort((a, b) => a - b)

    // Append nav item for each year
    const yearNavEl = document.createElement('ul')
    yearNavEl.classList.add('gallery-filter-list')
    years.forEach((year) => {
      // Fly-ify
      const label = String(year).replace(/^200*/, '2K').replace(/^19/, '')
      yearNavEl.insertAdjacentHTML('beforeend', `<li>
        <a href="#/?filter-year[]=${year}">${label} (${yearMap.get(year)})</a>
      </li>`)
    })

    // Append year nav to active item in the gallery nav
    activeNavItem.insertAdjacentHTML(
      'beforeend',
      '<h3 class="filters-heading">By Year</h3>',
    )
    activeNavItem.append(yearNavEl)
  }

  if (tagMap.size) {
    // Sort tags alphabetically
    const tags = [...tagMap.entries()]
    tags.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))

    // Append nav item for each tag
    const tagNavEl = document.createElement('ul')
    tagNavEl.classList.add('gallery-filter-list')
    tags.forEach(([key, label]) => {
      tagNavEl.insertAdjacentHTML('beforeend', `<li>
        <a href="#/?filter[]=${key}">${label} (${itemElsByTag[key].length})</a>
      </li>`)
    })

    // Append tag nav to active item in the gallery nav
    activeNavItem.insertAdjacentHTML(
      'beforeend',
      '<h3 class="filters-heading">By Tag</h3>',
    )
    activeNavItem.append(tagNavEl)
  }
}

renderFilters()
applyFilters()

window.addEventListener('hashchange', applyFilters)
})()
