import { CartItem } from "../utkonos/cart";
import { doXpath } from "./helpers";

const isEqual = require("lodash/isEqual")
const zip = require("lodash/zip")
const range = require("lodash/range")

export function extractFromTable(element: HTMLElement): CartItem[] {
  const tableData = parseTable(element)
  if (tableData.length == 0) return []

  let links: string[] = []
  let quantities: number[] = []

  // check if the first row looks like a header (no number values)
  if (tableData[0].filter(item => !isNaN(parseFloat(item.trim()))).length == 0) {
    tableData.shift()
  }
  console.log("table data")
  console.table(tableData)

  for (let i = 0; i < tableData[0].length; i++) {
    const columnData = tableData.map(row => row[i])
    if (tableData[0][i].indexOf('utkonos.ru') != -1) {
      console.log(`column ${i} seems to contain links`)
      links = columnData
      continue
    }

    const numericValues = columnData.map(x => parseFloat(x))
    if (numericValues.find(isNaN) !== undefined) {
      console.log(`column ${i} is not all numbers`)
      continue
    }

    if (isEqual(numericValues, range(1, tableData.length + 1))) {
      console.log(`column ${i} looks like a row numbers`)
      continue
    }
    const avgValue = numericValues.reduce((result, item) => result + item, 0) / columnData.length
    const rateOfRoundValues = numericValues.filter(x => Math.round(x) == x).length / columnData.length

    if (avgValue < 15 && rateOfRoundValues > 0.5) {
      console.log(`column ${i} seems to have a quantities`)
      quantities = numericValues
      continue
    }

    console.log(`column ${i} ignored. Average value: ${avgValue}, rate of rounded values: ${rateOfRoundValues})`)
  }

  const ids = links
    .map(link => link.match(/utkonos\.ru\/item\/(\d+)/)?.[1])
    .map(x => parseInt(x || ''))
    .filter(Boolean)

  if (ids.length == quantities.length) {
    return ids.map((id, i) => ({
      id: id,
      quantity: quantities[i],
    }))
  }
  return ids.map(id => ({
    id: id,
    quantity: 1,
  }))
}

// Returns a text content of a table (and link targets)
function parseTable(element: HTMLElement): string[][] {
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
  return tableData
}

