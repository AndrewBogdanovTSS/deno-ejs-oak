export default class {
  id:string
  name:string

  constructor(name:string) {
    this.id = new Date().toISOString()
    this.name = name
  }

  update(name:string) {
    this.name = name
  }
}
