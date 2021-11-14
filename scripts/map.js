import { Utilities } from './utilities.js'
import { CBarChart } from './coronaBarChart.js'
import { Tooltip } from './tooltip.js'

export class SVGMap {
  static MIN_PERCENTAGE = 50
  static MAX_PERCENTAGE = 100

  static CASES_100K = 'cases_per_100k'
  static CASES_7_100K = 'cases7_per_100k'

  /**
   * Combines the passed options with the default options in one attribute so that they are accessible
   * from anywhere in the object. Furthermore required variables are set and a BarChart is created
   *
   * @param {*} svgContainer container where the svg map should be added
   * @param {*} data contains the data about the svg map and the attributes about all counties
   * @param {*} options contains all default options for this SVGMap
   */
  constructor (svgMapContainer = Utilities.requiredParam('svgContainer'),
    data = Utilities.requiredParam('data'),
    {
      strokeColor = 0,
      strokeColorSelected = 360,
      fillColor = 240,
      fillColorSelected = 360,
      fillSelectedCounties = true,
      strokeWidth = 0.007,
      strokeWidthSelected = 0.015,
      casesPer100k = SVGMap.CASES_100K
    } = {}
  ) {
    this._options = { strokeColor, strokeColorSelected, fillColor, fillColorSelected, strokeWidth, strokeWidthSelected, fillSelectedCounties, casesPer100k }
    this._svgContainer = svgMapContainer
    this._data = data
    this._changedPaths = []
    this._searchMax(this._data.features)
    this._build(this._data)
    this._tooltip = new Tooltip(this._countyToAttributeMap)
  }

  /**
   * Creates a SVG map.
   *
   * @param {mapData} mapData Contains all the information needed to create a map of Germany that
   * can display Corona information for all counties
   */
  _build (mapData) {
    this._countyToAttributeMap = new Map(
      // map is build in reverse, otherwise some counties will be in the dom but are not shown (covered by other counties)
      mapData.features.reverse().reduce((accumulator, feature) => {
        accumulator.push([
          feature.attributes.county,
          {
            paths: this._createPathElements(feature),
            attributes: feature.attributes
          }
        ])
        return accumulator
      }, []))
    this._rotateAndMirrorMap()
  }

  /**
   * The map created is initially upside down and mirrored.
   * This function corrects this so that the map is displayed correctly
   */
  _rotateAndMirrorMap () {
    var svgMapGroup = document.querySelector('g')
    const groupBbox = svgMapGroup.getBBox()
    svgMapGroup.setAttribute('transform', ` rotate(180, ${groupBbox.x + groupBbox.width / 2}, ${groupBbox.y + groupBbox.height / 2}) scale(-1 1)  translate(${groupBbox.x + groupBbox.width})`)
    const svg = svgMapGroup.parentElement

    this._setMapViewBox(svg)
  }

  /**
   * Sets Viewbox of the svg so that the maximum of the map is shown
   * @param {Element} svg group element with all path elements of the map
   */
  _setMapViewBox (svg) {
    const svgBbox = svg.getBBox()
    svg.setAttribute('viewBox', `${svgBbox.x} ${svgBbox.y} ${svgBbox.width} ${svgBbox.height}`)
  }

  /**
   * Update all paths with the current settings
   */
  update () {
    this._countyToAttributeMap.forEach((county) => {
      county.paths.forEach(path => {
        const selected = path.classList.contains('selected')
        let fillColor = 0
        let strokeWidth = 0
        let strokeColor = 0

        if (selected) {
          strokeWidth = this._options.strokeWidthSelected
          strokeColor = this._options.strokeColorSelected
        } else {
          strokeWidth = this._options.strokeWidth
          strokeColor = this._options.strokeColor
        }

        if (selected && this._options.fillSelectedCounties) {
          fillColor = this._options.fillColorSelected
        } else {
          fillColor = this._options.fillColor
        }

        path.setAttributeNS(null, 'fill', `hsl(${fillColor}, 100%, ${this.calculateLightness(county.attributes[`${this._options.casesPer100k}`])}%)`)
        path.setAttributeNS(null, 'stroke', `hsl(${strokeColor}, 100%, 50%)`)
        path.setAttributeNS(null, 'stroke-width', strokeWidth)
      })
    })
  }

  _createPathElements (feature) {
    const data = feature.attributes
    return feature.geometry.rings.reduce((accumulator, ring) => {
      const t = `M${ring[0][0]},${ring[0][1]}`
      const pathLines = ring.reduce((acc, cur) => {
        acc += ` ${cur[0]},${cur[1]} `
        return acc
      }, t)
      const path = Utilities.createSVGElement('path', {
        d: pathLines,
        'stroke-width': this._options.strokeWidth,
        stroke: this._options.strokeColor,
        fill: `hsl(${this._options.fillColor}, 100%, ${this.calculateLightness(data[`${this._options.casesPer100k}`])}%)`,
        display: 'table-cell',
        class: 'tooltip-trigger',
        'data-bl': data.BL,
        'data-county': data.county
      })
      path.addEventListener('mouseenter', () => { path.setAttributeNS(null, 'filter', 'url(#shadow)') })
      path.addEventListener('mouseleave', () => { path.setAttributeNS(null, 'filter', '') })
      this._svgContainer.append(path)
      accumulator.push(path)
      return accumulator
    }, [])
  }

  getDataAttributesByCounty (countyName) {
    var obj = this._countyToAttributeMap.get(countyName)
    return obj
  }

  onBarChartAnimation (county) {
    const countyInformation = this._countyToAttributeMap.get(county)

    countyInformation.paths.forEach(element => {
      element.setAttributeNS(null, 'stroke', `hsl(${this._options.strokeColorSelected}, 100%, 50%)`)
      element.setAttributeNS(null, 'stroke-width', this._options.strokeWidthSelected)
      if (this._options.fillSelectedCounties) {
        element.setAttributeNS(null, 'fill', `hsl(${this._options.fillColorSelected}, 100%, ${this.calculateLightness(countyInformation.attributes[`${this._options.casesPer100k}`])}%)`)
      }
      element.classList.toggle('border-animation')
      element.classList.toggle('selected')
      this._changedPaths.push({
        path: element,
        cases: this._countyToAttributeMap.get(county).attributes[`${this._options.casesPer100k}`]
      })
    })
  }

  resetAnimatedPaths () {
    let element = this._changedPaths.pop()
    while (element !== undefined) {
      element.path.setAttributeNS(null, 'stroke', this._options.strokeColor)
      element.path.setAttributeNS(null, 'stroke-width', this._options.strokeWidth)
      element.path.setAttributeNS(null, 'fill', `hsl(${this._options.fillColor}, 100%, ${this.calculateLightness(element.cases)}%)`)
      element.path.classList.toggle('border-animation')
      element.path.classList.toggle('selected')
      element = this._changedPaths.pop()
    }
  }

  _searchMax (data) {
    this._max = Math.max(...data.map(element => { return element.attributes[`${this._options.casesPer100k}`] }))
  }

  /**
   * Interpolation for the fill/border color
   * Percentage   number of cases
   * x1 = 50      y1 = max
   * x2 = 100     y2 = 0
   * formel: x = ((y2 - y) * x1 + (y - y1) * x2) / (y2 - y1)
   * @param {Int} value
   */
  calculateLightness (value) {
    return ((0 - value) * SVGMap.MIN_PERCENTAGE + (value - this._max) * SVGMap.MAX_PERCENTAGE) / (0 - this._max)
  }

  set color (color) {
    this._options.fillColor = color
  }

  set selectedColor (color) {
    this._options.strokeColorSelected = color
    this._options.fillColorSelected = color
  }

  set casesPer100k (casesPer100k) {
    this._options.casesPer100k = casesPer100k
    this._searchMax(this._data.features)
  }

  set strokeWidth (strokeWidth) {
    if (!Number.isNaN(Number.parseFloat(strokeWidth))) {
      this._options.strokeWidth = strokeWidth
    }
  }

  set strokeWidthSelected (strokeWidthSelected) {
    if (!Number.isNaN(Number.parseFloat(strokeWidthSelected))) {
      this._options.strokeWidthSelected = strokeWidthSelected
    }
  }

  set fillSelectedCounties (fillSelectedCounties) {
    this._options.fillSelectedCounties = fillSelectedCounties
  }
}
