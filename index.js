const canvas=document.querySelector('canvas')
const c= canvas.getContext('2d')


canvas.width = 1521
canvas.height = 750

let PlayerJumpCount = 0
let Player2JumpCount = 0 


let playercanjump = false
let player2canjump = false

let alertno = 0

const gravity = 0.5

class Sprite{
	constructor({position , imageSrc , framerate = 1 , scale = 1}){
		this.position = position
		this.scale = scale
		this.loaded = false
		this.image = new Image()
		this.image.onload = () => {
			this.width = (this.image.width / this.framerate) * this.scale
			this.height = this.image.height * this.scale
			this.loaded = true
		}
		this.image.src = imageSrc
		this.framerate = framerate
		this.currentframe = 0
		this.framebuffer = 3
		this.elapsedframes = 0
	}

	draw(){
		if(!this.image)return {}

		const cropbox ={
			position:{
				x:this.currentframe * (this.image.width / this.framerate),
				y:0,
			},
			width: this.image.width / this.framerate,
			height: this.image.height,
		}

		c.drawImage(
			this.image,
			cropbox.position.x,
			cropbox.position.y,
			cropbox.width,
			cropbox.height,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
	}

	update(){
		this.draw()
		this.updateframes()
	}

	updateframes(){
		this.elapsedframes++

		if (this.elapsedframes % this.framebuffer === 0 ) {
			if (this.currentframe < this.framerate - 1)this.currentframe++
				else this.currentframe = 0
		}
	}
}

class Player extends Sprite{
	constructor({position , CollissionBlocks , imageSrc , framerate , scale = 1.75 , animations}){
		super({imageSrc , framerate , scale})
		this.position = position
		this.velocity = {
			x:0,
			y:1,
		}
		this.CollissionBlocks = CollissionBlocks

		this.hitbox = {
			position:{
				x:this.position.x,
				y:this.position.y,
			},
			width:10,
			height:10,
		}
		
		this.animations = animations

		this.lastdirection = 'right'

		for (let key in this.animations){
			const image = new Image()
			image.src = this.animations[key].imageSrc

			this.animations[key].image = image

		}

	}

	switchsprite(key)
	{

		if (this.image === this.animations[key] || !this.loaded )return

		this.image = this.animations[key].image

		this.framebuffer = this.animations[key].framebuffer
		this.framerate = this.animations[key].framerate

	}


	update(){

		this.updateframes()

		this.updatehitbox()


		//draws out the image 
		c.fillStyle = 'rgba(0,0,255,0)'
		c.fillRect(this.position.x,this.position.y,this.width,this.height)

		c.fillStyle = 'rgba(255,0,0,0)'
		c.fillRect(this.hitbox.position.x,this.hitbox.position.y,this.hitbox.width,this.hitbox.height)

		this.draw()

		this.position.x += this.velocity.x

		this.updatehitbox()

		this.CheckForHorizontalCollisions()

		this.applygravity()

		this.updatehitbox()

		this.CheckForVerticalCollisions()

	}

	updatehitbox(){
		this.hitbox = {
			position:{
				x:this.position.x+12,
				y:this.position.y+10,
			},
			width:33,
			height:45,
		}
	}

	CheckForHorizontalCollisions(){
		for(let i=0; i < this.CollissionBlocks.length ; i++ )
		{
			const CollissionBlock = this.CollissionBlocks[i]

			if
				(this.hitbox.position.y + this.hitbox.height >= CollissionBlock.position.y && 
				this.hitbox.position.y <= CollissionBlock.position.y + CollissionBlock.height &&
				this.hitbox.position.x <=CollissionBlock.position.x + CollissionBlock.width &&
				this.hitbox.position.x + this.hitbox.width >= CollissionBlock.position.x)
			{
				if(this.velocity.x > 0)
				{
					//from left
					this.velocity.x = 0

					const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

					this.position.x = CollissionBlock.position.x - offset - 0.01 
					break
				}
				if(this.velocity.x < 0)
				{
					//from right
					this.velocity.x = 0

					const offset = this.hitbox.position.x - this.position.x

					this.position.x = CollissionBlock.position.x + CollissionBlock.height - offset + 0.01
					break
				}
			}
		}
	} 

	applygravity(){
		this.velocity.y  += gravity
		this.position.y += this.velocity.y
	}

	CheckForVerticalCollisions(){
		for(let i=0; i < this.CollissionBlocks.length ; i++ )
		{
			const CollissionBlock = this.CollissionBlocks[i]

			if
				(this.hitbox.position.y + this.hitbox.height >= CollissionBlock.position.y && 
				this.hitbox.position.y <= CollissionBlock.position.y + CollissionBlock.height &&
				this.hitbox.position.x <=CollissionBlock.position.x + CollissionBlock.width &&
				this.hitbox.position.x + this.hitbox.width >= CollissionBlock.position.x)
			{
				if(this.velocity.y > 0)
				{
					this.velocity.y = 0

					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

					this.position.y = CollissionBlock.position.y - offset - 0.01
					break
				}
				if(this.velocity.y < 0){
					this.velocity.y = 0

					const offset = this.hitbox.position.y - this.position.y 


					this.position.y = CollissionBlock.position.y + CollissionBlock.height - offset + 0.01 
					break 
				}
			}
		}
	}


}

class CollissionBlock{
	constructor({position}){
		this.position = position
		this.width = 38.025
		this.height = 38.8
	}

	draw(){
		c.fillStyle = 'rgba(255,0,0,0)'
		c.fillRect(this.position.x ,this.position.y,this.width,this.height)
	}

	update(){
		this.draw()
	}
}

const collission = [43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            43, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 43, 43, 43, 43, 43, 0, 0, 0, 43, 43, 0, 0, 43, 43, 43, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 43, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 43, 43, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 0,
            43, 43, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 43, 43, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 43, 43, 43, 43, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 43, 43, 43, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43]


const collission2D = []

for( let i=0; i < collission.length; i+= 40 ) {
	collission2D.push(collission.slice(i , i+40))
}

const CollissionBlocks = []
collission2D.forEach((row , y)=>{
	row.forEach((symbol,x) => {
		if(symbol === 43){
			CollissionBlocks.push(new CollissionBlock({position:{
				x:x*38.025,
				y:y*38.8,
			}}))
		}
	})
})

const player = new Player({
	position : {
		x:50,
		y:630,
	},
	CollissionBlocks,
	imageSrc:'./Idle (32x32).png.',
	framerate:11,
	animations:{
		idle:{
			imageSrc:'./Idle (32x32).png',
			framerate:11,
			framebuffer: 3,
		},
		idleleft:{
			imageSrc:'./Idle (32x32) - Left.png',
			framerate:11,
			framebuffer: 3,
		},
		run:{
			imageSrc:'./Run (32x32).png',
			framerate:12,
			framebuffer: 3,
		},
		jump:{
			imageSrc:'./Jump (32x32).png',
			framerate:1,
			framebuffer: 1,
		},
		jumpleft:{
			imageSrc:'./Jump (32x32) - Left.png',
			framerate:1,
			framebuffer: 1,
		},
		fall:{
			imageSrc:'./Fall (32x32).png',
			framerate:1,
			framebuffer: 1,
		},
		fallleft:{
			imageSrc:'./Fall (32x32) - left.png',
			framerate:1,
			framebuffer: 1,
		},
		runleft:{
			imageSrc:'./Run (32x32) - Left.png',
			framerate:12,
			framebuffer: 3,
		},
	},
})
const player2 = new Player({
	position : {
		x:1460,
		y:630,
	},
	CollissionBlocks,
	imageSrc:'./Idle (32x32).png',
	framerate:11,
	animations:{
		idle:{
			imageSrc:'./Idle (32x32).png',
			framerate:11,
			framebuffer: 3,
		},
		idleleft:{
			imageSrc:'./Idle (32x32) - Left.png',
			framerate:11,
			framebuffer: 3,
		},
		run:{
			imageSrc:'./Run (32x32).png',
			framerate:12,
			framebuffer: 3,
		},
		jump:{
			imageSrc:'./Jump (32x32).png',
			framerate:1,
			framebuffer: 1,
		},
		jumpleft:{
			imageSrc:'./Jump (32x32) - Left.png',
			framerate:1,
			framebuffer: 1,
		},
		fall:{
			imageSrc:'./Fall (32x32).png',
			framerate:1,
			framebuffer: 1,
		},
		fallleft:{
			imageSrc:'./Fall (32x32) - Left.png',
			framerate:1,
			framebuffer: 1,
		},
		runleft:{
			imageSrc:'./Run (32x32) - Left.png',
			framerate:12,
			framebuffer: 3,
		},
	},
})

const keys = {
		d: {
			pressed : false,
		},
		a: {
			pressed : false,
		},
		ArrowLeft: {
			pressed : false,
		},
		ArrowRight: {
			pressed : false,
		},
		w: {
			pressed : false,
		},
		ArrowUp: {
			pressed : false,
		},

}


const background = new Sprite({
	position: {
		x:0,
		y:0,
	},
	imageSrc:"./background.png"
})

function isCollision(player, player2) {
    return (
      player.hitbox.position.x < player2.hitbox.position.x + player2.hitbox.width &&
      player.hitbox.position.x + player.hitbox.width > player2.hitbox.position.x &&
      player.hitbox.position.y < player2.hitbox.position.y + player2.hitbox.height &&
      player.hitbox.position.y + player.hitbox.height > player2.hitbox.position.y
    )
  }


function animate() {
	window.requestAnimationFrame(animate)

	
	c.fillStyle='white'
	c.fillRect(0,0,canvas.width,canvas.height)


	c.save()
	c.scale(1,1)
	background.update()

	CollissionBlocks.forEach(CollissionBlock =>{
		CollissionBlock.update()
	})

	player.update()
	player2.update()

	player.velocity.x = 0
	player2.velocity.x = 0

	if(keys.d.pressed && player.position.x < 1470){
		player.switchsprite('run')
		player.velocity.x = 5
		player.lastdirection = 'right'
	}
		else if(keys.a.pressed && player.position.x > 0){
			player.switchsprite('runleft')
			player.velocity.x = -5
			player.lastdirection = 'left'
		}
	else if (player.velocity.y === 0){

		if (player.lastdirection === 'right')player.switchsprite('idle')
			else player.switchsprite('idleleft')
	}

	if(keys.ArrowRight.pressed && player2.position.x < 1470){
		player2.switchsprite('run')
	  player2.velocity.x = 5
	  player2.lastdirection = 'right'
	}
		else if(keys.ArrowLeft.pressed && player2.position.x > 0){
			player2.switchsprite('runleft')
			player2.velocity.x = -5
			player2.lastdirection = 'left'
		} 
	else if (player2.velocity.y === 0){
		if (player2.lastdirection === 'right')player2.switchsprite('idle')
			else player2.switchsprite('idleleft')
	}

	if(keys.w.pressed)
		if (PlayerJumpCount == 0 && (player.velocity.y == 0 || player.velocity.y == 0.5))
		{
			player.velocity.y = -13
			PlayerJumpCount = 1
		}
	if(keys.ArrowUp.pressed)
		if (Player2JumpCount == 0 && (player2.velocity.y == 0 || player2.velocity.y == 0.5))
		{
			player2.velocity.y = -13
			Player2JumpCount = 1
		}

	if(player.velocity.y < 0)
	if (player.lastdirection === 'right')player.switchsprite('jump')
		else player.switchsprite('jumpleft')

		else if(player.velocity.y > 0){
			if (player.lastdirection === 'right')player.switchsprite('fall')
				else player.switchsprite('fallleft')
		}


	if(player2.velocity.y < 0){
		if (player2.lastdirection === 'right')player2.switchsprite('jump')
			else player2.switchsprite('jumpleft')
		}
		else if(player2.velocity.y > 0){
			if (player2.lastdirection === 'right')player2.switchsprite('fall')
				else player2.switchsprite('fallleft')
		}

	if(isCollision(player,player2)){
		gameover()
	}

	c.restore()

}

animate()

function gameover()
{
	window.location.href = "./end.html";
}

window.addEventListener('keydown',(event)=>{
	switch(event.key){
	case'd':
		keys.d.pressed = true
		break
	case'a':
		keys.a.pressed = true
		break
	case'w':
		keys.w.pressed = true
		break
	case'ArrowLeft':
		keys.ArrowLeft.pressed = true
		break
	case'ArrowRight':
		keys.ArrowRight.pressed = true
		break
	case'ArrowUp':
		keys.ArrowUp.pressed = true
		break
	}
})

window.addEventListener('keyup',(event)=>{
	switch(event.key){
	case'd':
		keys.d.pressed = false
		break
	case'a':
		keys.a.pressed = false
		break
	case'w':
		keys.w.pressed = false
		PlayerJumpCount = 0
		break
	case'ArrowLeft':
		keys.ArrowLeft.pressed = false
		break
	case'ArrowRight':
		keys.ArrowRight.pressed = false
		break
	case'ArrowUp':
		keys.ArrowUp.pressed = false
		Player2JumpCount = 0
		break
	}
})
