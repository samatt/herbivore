export default class Grid {

  constructor (w, h) {
    this.width = parseInt(w)
    this.height = parseInt(h)
  }

  init () {
    this.cells = []
    this.gridSize = 30
    this.populateCells()
  }

  populateCells () {
    // FIXME: Make grid dimensions dynamic AND sensible
    for (let i = 0; i < this.width / this.gridSize; i++) {
      for (let j = 0; j < 30; j++) {
        let cell

        cell = {
          x: i * this.gridSize + (j % 2) * this.gridSize * 0.6,
          y: j * this.gridSize * 0.85
        }

        this.cells.push(cell)
      }
    }
  }

  sqdist (a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
  }

  occupyNearest (p) {
    let minDist = 1000000
    let d
    let candidate = null

    for (let i = 0; i < this.cells.length; i++) {
      if (!this.cells[i].occupied && (d = this.sqdist(p, this.cells[i])) < minDist) {
        minDist = d
        candidate = this.cells[i]
      }
    }

    if (candidate) {
      candidate.occupied = true
    }
    return candidate
  }

}

