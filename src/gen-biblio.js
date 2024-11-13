import { htmlToHast } from './html-transform-node.js'

/**
 * Generate bibliography in html and convert it to hast
 *
 * @param {*} citeproc
 */
export const genBiblioNode = (citeproc) => {
  const [params, bibBody] = citeproc.makeBibliography()

  // Replace any URLs with <a> tags
  const linkedBibBody = bibBody.map((entry) => 
    entry.replace(/(http[s]?:\/\/[^\s<]+)/g, (url) => `<a href="${url}" target="_blank">${url}</a>`)
  )

  const bibliography =
    '<div id="refs" class="references csl-bib-body">\n' + linkedBibBody.join('') + '</div>'

  const biblioNode = htmlToHast(bibliography)

  // Add citekey id to each bibliography entry.
  biblioNode.children
    .filter((node) => node.properties?.className?.includes('csl-entry'))
    .forEach((node, i) => {
      const citekey = params.entry_ids[i][0].toLowerCase()
      node.properties = node.properties || {}
      node.properties.id = 'bib-' + citekey
    })

  return biblioNode
}
