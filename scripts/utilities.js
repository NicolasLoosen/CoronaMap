export class Utilities {
  /**
     *
     * @param {string} element Name of the SVG object to be created (svg, path, rect, ...)
     * @param {Object} svgObject SVG attributes
     */
  static createSVGElement (element, svgAttributes, textContent) {
    const newElement = document.createElementNS('http://www.w3.org/2000/svg', element)
    Object.entries(svgAttributes).forEach(entry => {
      newElement.setAttributeNS(null, entry[0], entry[1])
    })

    if (textContent) {
      newElement.textContent = textContent
    }

    return newElement
  }

  /**
     * Throws an error if the given parameter is not provided
     * @param {string} param parameter name
     */
  static requiredParam (param) {
    const requiredParamError = new Error(`Required parameter, "${param}" is missing.`)
    throw requiredParamError
  }
}
