const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext("2d")
console.log(ctx)

function get_random(list) {
  return list[Math.floor((Math.random()*list.length))];
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight

//canvas settings
ctx.fillStyle = 'white'
ctx.lineWidth = 1

class Particle {
  constructor(effect){
    this.effect = effect
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
    this.speedX 
    this.speedY
    this.speedModifier = Math.floor(Math.random() * 3 + 1)
    this.history = [{x: this.x, y: this.y}]
    this.maxLength = Math.floor(Math.random() * 300 + 10)
    this.angle 
    this.timer = this.maxLength * 2
  }

  draw(context){
    context.beginPath()
    context.moveTo(this.history[0].x, this.history[0].y)
    for(let i = 0; i < this.history.length; i++){
      context.lineTo(this.history[i].x, this.history[i].y)
    }
    context.stroke()
  }
  update(){
    this.timer--

    if(this.timer >= 1){
      let x = Math.floor(this.x / this.effect.cellSize)
      let y = Math.floor(this.y / this.effect.cellSize)
     let index = y * this.effect.cols + x
      this.angle = this.effect.flowField[index]

      this.speedX = (Math.cos(this.angle) * this.speedModifier)
      this.speedY = (Math.sin(this.angle) * this.speedModifier)
      this.x += this.speedX
      this.y += this.speedY

      this.history.push({x: this.x, y: this.y})
      if(this.history.length > this.maxLength){
        this.history.shift() 
     }
    } else if(this.history.length > 1){
      this.history.shift()
    } else {
      this.reset()
    }
  }
  reset(){
      this.x = Math.floor(Math.random() * this.effect.width)
      this.y = Math.floor(Math.random() * this.effect.height)
      this.history = [{x: this.x, y: this.y}]
      this.timer = this.maxLength * 2

    }

}

class Effect {
  constructor(width, height){
    this.width = width
    this.height = height
    this.particle = []
    this.numberOfParticle = 600
    this.cellSize = 0.9
    this.rows
    this.cols
    this.flowField = []
    this.curve = 24
    this.zoom = 0.98
    this.color = ["blue", "red", "purple", "green", "yellow", "pink"]
    this.init()
  }

  init(){
    //create flow field
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    for(let x = 0; x < this.rows; x++){
      for(let y = 0; y < this.cols; y++){
        let angle = ((Math.cos(x *  this.zoom)) + (Math.sin(y * this.zoom))) * this.curve
        this.flowField.push(angle)
      }
    }
    //create particles
    for(let i = 1; i < this.numberOfParticle; i++){
    this.particle.push(new Particle(this))
    }
    
  }
  drawGrid(context){
    context.strokeStyle = 'white'
    for(let i = 0; i < this.cols; i++){
      context.beginPath()
      context.moveTo(this.cellSize * i, 0)
      context.lineTo(this.cellSize * i, this.height)
      context.stroke()
    }

    for(let i = 0; i < this.rows; i++){
      context.beginPath()
      context.moveTo(0,this.cellSize * i)
      context.lineTo(this.width, this.cellSize * i)
      context.stroke()
    }
  }
  
  render(context){
    //this.drawGrid(context)
    this.particle.forEach(particle => {
      context.strokeStyle = get_random(this.color)
      particle.draw(context)
      particle.update()
    })
  }

}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  effect.render(ctx)
  requestAnimationFrame(animate)
}

const effect = new Effect(canvas.width, canvas.height)

animate() 
