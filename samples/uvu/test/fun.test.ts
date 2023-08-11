import { test } from "uvu"
import { equalTo, expect, is, mapWith } from "../../../src/index.js"

interface Item {
  id: number
  title: string
}

test("This is a test", () => {
  const map = new Map<string, Array<Item>>()
  map.set("Team 1", [
    { id: 7, title: "Item 7" },
    { id: 4, title: "Item 4" }
  ])
  map.set("Team 2", [
    { id: 9, title: "Item 9" }
  ])

  expect(map, is(mapWith([
    {
      key: equalTo("Team 3"),
    }
  ])))
})

test.run()