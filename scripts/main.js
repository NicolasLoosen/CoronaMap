import { mapData as data } from './map-data.js'
import { options } from './options.js'
import { SVGMap } from './map.js'
import { CBarChart } from './coronaBarChart.js'

// predefined settings:
const predefinedSettings = new Map([
  ['blue', {
    numberOfBars: 5,
    color: 240,
    selectedColor: 210,
    fill: false,
    strokeWidth: 0.0007
  }],
  ['red', {
    numberOfBars: 10,
    color: 360,
    selectedColor: 21,
    fill: true,
    strokeWidth: 0.001
  }],
  ['purple', {
    numberOfBars: 7,
    color: 272,
    selectedColor: 297,
    fill: true,
    strokeWidth: 0.0003
  }]
])

const map = new SVGMap(document.getElementById('map'), data, options)
const barChart = new CBarChart(document.getElementById('svgBarChart'), document.getElementById('state'), data.features, options)

barChart.onBarChartAnimationStart = () => { map.resetAnimatedPaths() }
barChart.onBarChartAnimation = (county) => { map.onBarChartAnimation(county) }

addEventListener('onchange', document.getElementById('numberOfCounties'), setNumberOfCountiesChange)
addEventListener('onchange', document.getElementById('strokeWidth'), setStrokeWidthChange)
addEventListener('onchange', document.getElementById('strokeWidthSelected'), setStrokeWidthSelectedChange)
addEventListener('onchange', document.getElementById('mapColor'), setColorChange)
addEventListener('onchange', document.getElementById('selectedColor'), setSelectedColorChange)
addEventListener('onchange', document.getElementById('predefinedSettingsSelection'), setPredefinedSettings)
addEventListener('onclick', document.getElementById('fillCounties'), fillCounty)
addEventListener('onclick', document.getElementById('cases100K'), toggleCasesPer100K)
addEventListener('onclick', document.getElementById('cases7100k'), toggleCasesPer100K)

function addEventListener (functionName, element, eventFunction) {
  element[functionName] = () => {
    eventFunction(element)
    map.update()
  }
  eventFunction(element)
}

function setStrokeWidthChange (element) {
  const value = parseFloat(element.value)
  if (!Number.isNaN(value)) {
    map.strokeWidth = value / 10000
  }
}

function setStrokeWidthSelectedChange (element) {
  const value = parseFloat(element.value)
  if (!Number.isNaN(value)) {
    map.strokeWidthSelected = value / 10000
  }
}

function setNumberOfCountiesChange (element) {
  const value = parseInt(element.value)
  if (Number.isSafeInteger(value)) {
    barChart.numberOfBars = value
  }
}

function setColorChange (element) {
  const value = parseInt(element.value)
  if (Number.isSafeInteger(value)) {
    map.color = value
    barChart.barColor = value
  }
}

function setSelectedColorChange (element) {
  const value = parseInt(element.value)
  if (Number.isSafeInteger(value)) {
    map.selectedColor = value
  }
}

function fillCounty (element) {
  map.fillSelectedCounties = element.checked
}

function toggleCasesPer100K (element) {
  if (document.getElementById('cases100K').checked) {
    map.casesPer100k = SVGMap.CASES_100K
    barChart.setCasesPer100k(CBarChart.CASES_100K, { updateChart: true })
  } else {
    map.casesPer100k = SVGMap.CASES_7_100K
    barChart.setCasesPer100k(CBarChart.CASES_7_100K, { updateChart: true })
  }
  map.update()
}

function setPredefinedSettings (element) {
  if (element.value === 'custom') {
    loadCustomSettings()
  } else {
    document.getElementById('customSettings').classList.add('hide')
    const settings = predefinedSettings.get(element.value)
    barChart.numberOfBars = settings.numberOfBars
    map.strokeWidth = settings.strokeWidth
    map.color = settings.color
    barChart.barColor = settings.color
    map.selectedColor = settings.selectedColor
    map.fillSelectedCounties = settings.fill
  }
}

function loadCustomSettings () {
  document.getElementById('customSettings').classList.remove('hide')

  setStrokeWidthChange(document.getElementById('strokeWidth'))
  setStrokeWidthSelectedChange(document.getElementById('strokeWidthSelected'))
  setNumberOfCountiesChange(document.getElementById('numberOfCounties'))
  setColorChange(document.getElementById('mapColor'))
  setSelectedColorChange(document.getElementById('selectedColor'))
  fillCounty(document.getElementById('fillCounties'))
}
