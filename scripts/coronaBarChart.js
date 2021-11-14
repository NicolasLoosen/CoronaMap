import { Utilities } from './utilities.js'

export class CBarChart {
  static MIN = 50
  static MAX = 100
  static ALL_STATES = 'Alle'

  static CASES_100K = 'cases_per_100k'
  static CASES_7_100K = 'cases7_per_100k'

  /**
   *
   * @param {*} svgContainer svg element where the chart should be inserted
   * @param {*} selectionElement element with the selections
   * @param {*} features contains all information about all counties
   * @param {*} param3 options for the chart
   */
  constructor (svgContainer = Utilities.requiredParam('svgContainer'),
    selectionElement = Utilities.requiredParam('selection'),
    features = Utilities.requiredParam('features'),
    {
      barColor = 240,
      numberOfBars = 5,
      casesPer100k = CBarChart.CASES_100K
    } = {}) {
    this._options = { barColor, numberOfBars, casesPer100k }
    this._svgContainer = svgContainer
    this._features = features
    this._selectionElement = selectionElement
    this._selectionElement.onchange = () => this.buildBarChart()

    this.setCasesPer100k(this._options.casesPer100k)
    this.addSelectionOptions()
    this.onBarChartAnimation = () => {}
    this.onBarChartAnimationStart = () => {}
    this._animationTimeouts = []

    // calls buildBarChart
    this.numberOfBars = numberOfBars
  }

  createDataMap (data) {
    const states = [...new Set(data.map(item => item.BL))]
    states.push(CBarChart.ALL_STATES)
    states.sort()
    return states
      .reduce((accumulator, state) => {
        // creates associative array where the key is the state and the value is a list of the counties
        accumulator[state] = data
        // returns only the attributes where the state name is equal to the given state name
          .filter(item => item.BL === state || state === CBarChart.ALL_STATES)
        return accumulator
      }, [])
  }

  addSelectionOptions () {
    Object.keys(this._dataMap).forEach(key => {
      this.addSelectOption(key)
    })
  }

  cancelAnimationTimeouts () {
    let timeout = this._animationTimeouts.pop()

    while (timeout !== undefined) {
      clearTimeout(timeout)
      timeout = this._animationTimeouts.pop()
    }
  }

  buildBarChart () {
    this._onBarChartAnimationStart()
    this._svgContainer.innerHTML = ''
    this.cancelAnimationTimeouts()
    this._dataMap[this._selectionElement.value]
    // return the number of bar charts the user specified
      .slice(0, this._options.numberOfBars)
      .forEach((data, index) => {
        const timeout = setTimeout(() => {
          this._svgContainer.append(Utilities.createSVGElement('text', {
            x: '11',
            y: 7 * (index + 1),
            class: 'text',
            'text-anchor': 'start'
          }, data.GEN))

          this._svgContainer.append(Utilities.createSVGElement('text', {
            x: '9',
            y: 7 * (index + 1) + 4,
            class: 'text',
            'text-anchor': 'end'
          }, data[`${this._options.casesPer100k}`].toFixed(1)))

          this._svgContainer.append(Utilities.createSVGElement('rect', {
            width: this.scaleBarLength(data[`${this._options.casesPer100k}`]),
            x: '10',
            y: 7 * (index + 1) + 1,
            height: '3',
            fill: `hsl(${this._options.barColor}, 100%, ${this.calculateLightness(data[`${this._options.casesPer100k}`])}%)`,
            class: 'bar bar-chart'
          }))

          this._updateViewBox()
          this._onBarChartAnimation(data.county)
        }, index * 300)
        this._animationTimeouts.push(timeout)
      })
  }

  _updateViewBox () {
    const parent = this._svgContainer.parentElement
    const bbox = this._svgContainer.getBBox()
    const height = Math.ceil(bbox.y) + Math.ceil(bbox.height)

    parent.setAttribute('viewBox', `0 0 90 ${height}`)
  }

  addSelectOption (value) {
    // new selection option
    const option = document.createElement('option')

    // add value to option
    option.setAttribute('value', value)

    // set text
    option.textContent = value
    this._selectionElement.append(option)
  }

  setCasesPer100k (casesPer100k, { updateChart = false } = {}) {
    this._options.casesPer100k = casesPer100k

    const sortedByCasesPer100k = this._features
    // select only content of attributes
      .map(feature => feature.attributes)
    // sort descending by cases_per_100k
      .sort((a, b) => b[`${this._options.casesPer100k}`] - a[`${this._options.casesPer100k}`])

    this.setMinMax(sortedByCasesPer100k)
    this._dataMap = this.createDataMap(sortedByCasesPer100k)

    if (updateChart) {
      this.buildBarChart()
    }
  }

  setMinMax (data) {
    this._max = data[0][`${this._options.casesPer100k}`]
    this._min = data[data.length - 1][`${this._options.casesPer100k}`]
  }

  /**
     * @param {integer} numberOfBars number of bars to be shown
     */
  set numberOfBars (numberOfBars) {
    this._options.numberOfBars = numberOfBars
    this.buildBarChart()
  }

  /**
   * @param {string} color
   */
  set barColor (color) {
    this._options.barColor = color
    this.buildBarChart()
  }

  get barColor () {
    return this._barColor
  }

  scaleBarLength (value) {
    return 1 + ((value - this._min) * (75 - 1)) / (this._max - this._min)
  }

  // Interpolation
  // x1 = 50   y1 = max
  // x2 = 100  y2 = 0
  calculateLightness (value) {
    return ((0 - value) * CBarChart.MIN + (value - this._max) * CBarChart.MAX) / (0 - this._max)
  }

  set onBarChartAnimation (fnct) {
    this._onBarChartAnimation = fnct
  }

  set onBarChartAnimationStart (fnct) {
    this._onBarChartAnimationStart = fnct
  }
}
