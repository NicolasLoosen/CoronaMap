export class Tooltip {
  constructor (array) {
    this._dataArray = array
    this._tooltip = ''
    this._modal = document.getElementById('myModal')
    this._modalHeader = document.getElementsByClassName('modal-header')[0]
    this._modalbody = document.getElementsByClassName('modal-body')[0]
    this._tooltipDiv = document.getElementsByClassName('div-tooltip')[0]

    window.onload = () => {
      const tooltipElements = [...document.getElementsByClassName('tooltip-trigger')]
      this.setUpToolTip(tooltipElements)
    }
  }

  setUpToolTip (tooltipElements) {
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.displayTooltip(e, element)
      })
      element.addEventListener('mouseleave', (e) => {
        this.hideTooltip()
        this.hidePopupByLeave()
      })
      element.addEventListener('click', (e) => {
        this.removeTable()
        this.hideTooltip()
        this.showPopupWindow(e, element)
        this.showCountyInformations(e, element, this._dataArray)
      })
    })
  }

  displayTooltip (e, obj) {
    const x = e.clientX
    const y = e.clientY

    this._tooltip = obj.dataset.county
    this._tooltipDiv.innerHTML = this._tooltip
    this._tooltipDiv.style.top = (y + 20) + 'px'
    this._tooltipDiv.style.left = (x + 20) + 'px'
    this._tooltipDiv.style.opacity = 1
  }

  showCountyInformations (e, obj, array) {
    const countyInformation = array.get(obj.dataset.county).attributes
    const countyAttributes = {
      'Name des Kreises:': countyInformation.county,
      'Name des Bundeslandes:': countyInformation.BL,
      'Einwohnerzahl des Kreises:': countyInformation.EWZ,
      'Anzahl aller Infizierten:': countyInformation.cases,
      'Anzahl der Infizierten pro 100.000 Einwohner:': countyInformation.cases_per_100k,
      'Anzahl der Infizierten pro 100.000 Einwohner der letzten 7 Tage:': countyInformation.cases7_per_100k,
      'Anzahl der Toten:': countyInformation.deaths
    }
    this.createTable(countyAttributes)
  }

  removeTable () {
    document.getElementsByClassName('modal-body')[0].innerHTML = ''
  }

  createTable (countyAttributes) {
    const body = document.getElementsByClassName('modal-body')[0]
    const table = document.createElement('table')
    const tbody = document.createElement('tbody')
    table.classList.add('container')
    table.border = 1
    table.style.width = 100 + '%'

    Object.entries(countyAttributes).forEach(([key, value]) => {
      console.log(`${key} ${value}`)
      const tr = document.createElement('tr')
      const tdFirstRow = document.createElement('td')
      const tdSecondRow = document.createElement('td')
      tdFirstRow.appendChild(document.createTextNode(key))
      tdSecondRow.appendChild(document.createTextNode(value))
      tr.appendChild(tdFirstRow)
      tr.appendChild(tdSecondRow)
      tbody.appendChild(tr)
    })
    table.appendChild(tbody)

    body.appendChild(table)
  }

  hideTooltip () {
    this._tooltipDiv.style.opacity = 0
  }

  hidePopupByLeave () {
    setTimeout(() => {
      this._modal.style.display = 'none'
    }, 350)
  }

  showPopupWindow (e, obj) {
    const x = e.clientX
    const y = e.clientY
    console.log(y)
    this._modal.style.display = 'block'
    this._modalHeader.innerHTML = obj.dataset.county
    this.calcTooltipPosition(x, y)
    this._modal.style.left = (x + 20) + 'px'
  }

  calcTooltipPosition (x, y) {
    if (y >= 500) {
      this._modal.style.top = (y - 320) + 'px'
    } else if (y >= 800) {
      this._modal.style.top = (y - 600) + 'px'
    } else {
      this._modal.style.top = (y + 20) + 'px'
    }
  }
}
