import { CartItem } from "../types";
import { doXpath } from "../sdk/xpath";

const isEqual = require("lodash/isEqual")
const zip = require("lodash/zip")
const range = require("lodash/range")

export function extractFromTable(element: HTMLElement): { cartItems: CartItem[], rejectedRows: Element[] } {
  const [tableData, rowElements] = parseTable(element)
  if (tableData.length == 0) return { cartItems: [], rejectedRows: [] }

  console.log("table data")
  console.table(tableData)

  const quantitiesColumn = findQuantitiesColumn(tableData)
  if (quantitiesColumn === undefined) {
    console.log("can't find quantities column")
    return { cartItems: [], rejectedRows: [] }
  }

  const cartItems: CartItem[] = []
  const rejectedRows: Element[] = []

  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i]

    if (row.filter(cell => !isNaN(parseFloat(cell.trim()))).length == 0) {
      console.log('filter out possible header of footer row: ', row)
      continue
    }

    let warning = false
    let quantity = parseInt(row[quantitiesColumn])

    if (!quantity) {
      console.log(`can't parse quantity from column ${quantitiesColumn}. Using default value. Row: `, row)
      quantity = 1
      warning = true
    }

    const link = row.find(item => item.indexOf('utkonos.ru') != -1)
    if (!link) {
      console.log("can't find link for this row", row)
      rejectedRows.push(rowElements[i])
      continue
    }

    const id = parseInt(link.match(/utkonos\.ru\/item\/(\d+)/)?.[1] || '')
    if (!id) {
      console.log(`can't find ID for this link: ${link}, row: `, row)
      rejectedRows.push(rowElements[i])
      continue
    }

    cartItems.push({
      id: id,
      quantity: quantity,
      tableRow: rowElements[i],
      warning: warning,
    })
  }
  return { cartItems: cartItems, rejectedRows: rejectedRows }
}

// Returns a text content of a table (and link targets)
function parseTable(element: HTMLElement): [string[][], Element[]] {
  const rowElements = doXpath('.//tr', element)

  const tableData: string[][] = []

  for (const rowElement of rowElements) {
    const rowData: string[] = []
    for (const cell of rowElement.childNodes) {
      const link = document.evaluate('.//a', cell, null, XPathResult.ANY_TYPE).iterateNext()
      if (link !== null) {
        const url = link instanceof HTMLElement ? link.getAttribute('href') : link.textContent
        rowData.push(url || '')
      } else {
        rowData.push(cell.textContent || '')
      }
    }
    tableData.push(rowData)
  }
  return [tableData, rowElements]
}


function findQuantitiesColumn(tableData: string[][]): number | undefined {
  // filter out possible headers/footers
  let filteredRows = tableData.filter(
    row => row.filter(cell => !isNaN(parseFloat(cell.trim()))).length > 0 // there are at least some numeric values
  )

  const avgFilledCellsNumber = Math.round(
    filteredRows
      .map(row => row.filter(x => !!x.trim()).length)
      .reduce((prev, len) => prev + len, 0)
    / filteredRows.length
  )

  filteredRows = filteredRows.filter(
    row => row.filter(cell => !!cell.trim()).length == avgFilledCellsNumber // cells count = avg count
  )

  console.log("Detecting quantities column. This is the filtered data")
  console.table(filteredRows)

  for (let i = 0; i < filteredRows[0]?.length; i++) {
    const columnData = filteredRows.map(row => row[i])
    // if (filteredRows[0][i].indexOf('utkonos.ru') != -1) {
    //   console.log(`column ${i} seems to contain links`)
    //   links = columnData
    //   continue
    // }

    const numericValues = columnData.map(x => parseFloat(x.trim()))
    if (numericValues.find(isNaN) !== undefined) {
      console.log(`column ${i} is not all numbers`)
      continue
    }

    if (numericValues.every((x, i) => {
      return i === 0 || x >= numericValues[i - 1];
    })) {
      console.log(`column ${i} looks like a row numbers`)
      continue
    }
    const avgValue = numericValues.reduce((result, item) => result + item, 0) / columnData.length
    const rateOfRoundValues = numericValues.filter(x => Math.round(x) == x).length / columnData.length

    if (avgValue < 15 && rateOfRoundValues > 0.5) {
      console.log(`column ${i} seems to have a quantities`)
      return i
    }

    console.log(`column ${i} ignored. Average value: ${avgValue}, rate of rounded values: ${rateOfRoundValues})`)
  }
}
