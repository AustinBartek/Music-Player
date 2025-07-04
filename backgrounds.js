//==========================
//COLOR FUNCTIONS
//==========================

function rgbToHex(r, g, b, a = 255) {
	let result = "#";
	for (const num of [r, g, b, a]) {
		let add = new Number(num).toString(16);
		if (add.length == 1) add = "0" + add;
		result += add;
	}
	return result;
}

function hexToRgb(hex) {
	hex = hex.replace("#", "");

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	let a;
	if (hex.length == 6) {
		a = 255;
	} else {
		a = parseInt(hex.substring(6, 8), 16);
	}

	return [r, g, b, a];
}

function mixHex(hex1, hex2, factor) {
	const rgb1 = hexToRgb(hex1);
	const rgb2 = hexToRgb(hex2);
	const newRgb = new Array(4);

	for (let i = 0; i < 4; i++) {
		let newNum = rgb1[i] * (1 - factor) + rgb2[i] * factor;
		newNum = Math.min(Math.max(Math.round(newNum), 0), 255);
		newRgb[i] = newNum;
	}

	return rgbToHex(...newRgb);
}

//==========================
//DRAWING FUNCTIONS
//==========================

const circle = (ctx, x, y, rad) => {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
};

const roundBox = (ctx, x, y, width, height, rad) => {
	ctx.fillRect(x + rad, y, width - rad * 2, height);
	ctx.fillRect(x, y + rad, width, height - rad * 2);
	circle(ctx, x + rad, y + rad, rad);
	circle(ctx, x + width - rad, y + rad, rad);
	circle(ctx, x + rad, y + height - rad, rad);
	circle(ctx, x + width - rad, y + height - rad, rad);
};

//==========================
//BACKGROUND FUNCTION PROVIDERS
//==========================

const SOLID = (col = "black") => {
	return (ctx, width, height, time, playing) => {
		ctx.fillStyle = col;
		ctx.fillRect(0, 0, width, height);
	};
};

const GRID = (col1, col2, sWNum = 8) => {
	return (ctx, width, height, time, playing) => {
		const size = width / sWNum;

		ctx.fillStyle = col1;
		ctx.fillRect(0, 0, width, height);

		const yDiv = height / size;
		const yOffset = -(yDiv - Math.floor(yDiv)) * size / 2;
		ctx.fillStyle = col2;

		for (let x = 0; x < width + size; x += size) {
			for (let y = yOffset; y <= height; y += size * 2) {
				const skew = (x / size) % 2 * size;
				ctx.fillRect(x, y + skew, size, size);
			}
		}
	}
}

const FALLING = (bg = "black", col = "red", numSquares = 10, squareWidth = 5, speed = 5, circ = false, rising = false) => {
	const squares = new Array(numSquares);

	return (ctx, width, height, time, playing) => {
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, width, height);

		if (!squares[0]) {

			for (let i = 0; i < numSquares; i++) {

				const w = Math.floor(Math.random() * (squareWidth * 3 / 2)) + squareWidth / 2 + 1;
				const x = Math.floor(Math.random() * (width - w));
				const y = Math.floor(Math.random() * (height - w));
				const sp = Math.floor(Math.random() * speed * 3 / 2) + speed / 2 + 1;
				squares[i] = {
					x: x,
					y: y,
					sp: sp,
					width: w,
				}
				squares[i].move = function () {
					if (!rising) {
						this.y += this.sp;
						if (this.y >= height * 1.1) this.y = -height * 0.1;
					} else {
						this.y -= this.sp;
						if (this.y <= -height * 0.1) this.y = height * 1.1;
					}
				}
			}

		}

		ctx.fillStyle = col;
		for (const square of squares) {

			if (playing) square.move();

			if (!circ) {
				ctx.fillRect(square.x, square.y, square.width, square.width);
			} else {
				circle(ctx, square.x, square.y, square.width / 2);
			}

		}

	}
}

const ORBITS = (bg = "black", col = "red", numShapes = 10, shapeWidth = 5, speed = 5, circ = false) => {
	const shapes = new Array(numShapes);

	return (ctx, width, height, time, playing) => {
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, width, height);

		if (!shapes[0]) {
			for (let i = 0; i < numShapes; i++) {
				const w = Math.floor(Math.random() * (shapeWidth * 3 / 2)) + shapeWidth / 2 + 1;
				const dist = Math.floor(Math.random() * Math.sqrt(width * width / 4 + height * height / 4));
				const rotOffset = Math.random() * Math.PI * 2;
				const sinOffset = Math.random() * Math.PI * 2;
				const sp = Math.floor(Math.random() * speed * 3 / 2) + speed / 2 + 1;
				const dir = (Math.random() > 0.5) ? -1 : 1;

				shapes[i] = {
					width: w,
					dist: dist,
					rot: rotOffset,
					sin: sinOffset,
					dir: dir,
					speed: sp,
				};
				shapes[i].move = function () {
					const change = speed / 360 / 10 * Math.PI * 2 * dir;
					this.rot += change;
					this.sin += change * 5;
				}

			}

		}


		ctx.fillStyle = col;
		for (const shape of shapes) {
			if (playing) shape.move();

			const useDist = shape.dist * (Math.sin(shape.sin) * 0.1 + 1);
			const x = Math.cos(shape.rot) * useDist + width / 2;
			const y = Math.sin(shape.rot) * useDist + height / 2;

			if (shape.circ) {
				circle(ctx, x, y, shapeWidth / 2);
			} else {
				ctx.fillRect(x - shapeWidth / 2, y - shapeWidth / 2, shapeWidth, shapeWidth);
			}
		}

	}
}

const ARGYLE = (col1, col2, dWNum = 5, dHNum = 4, speed = 1 / 20) => {
	return (ctx, width, height, time, playing) => {
		const timeFactor = time / 50 * speed;
		const oscillator = (Math.sin(timeFactor) + 1) / 2;

		const useCol1 = mixHex(col1, col2, oscillator);
		const useCol2 = mixHex(col1, col2, 1 - oscillator);

		ctx.fillStyle = useCol1;
		if (ctx.fillStyle.toString() + "ff" !== useCol1) alert(useCol1 + " " + ctx.fillStyle);
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = useCol2;
		const dWidth = width / dWNum;
		const dHeight = height / dHNum;

		for (let x = 0; x < width + dWidth; x += dWidth) {
			for (let y = 0; y < height + dHeight; y += dHeight) {
				ctx.beginPath();
				ctx.moveTo(x, y + dHeight / 2);
				ctx.lineTo(x + dWidth / 2, y);
				ctx.lineTo(x + dWidth, y + dHeight / 2);
				ctx.lineTo(x + dWidth / 2, y + dHeight);
				ctx.lineTo(x, y + dHeight / 2);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

const CIRCLES = (col1, col2, cWNum, cHNum, speed = 1 / 20) => {
	return (ctx, width, height, time, playing) => {
		ctx.fillStyle = col1;
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = col2;
		const cWidth = width / cWNum;
		const cHeight = height / cHNum;

		for (let x = 0; x < width + cWidth; x += cWidth) {
			for (let y = 0; y < height + cHeight; y += cHeight) {
				ctx.beginPath();

				const progress = ((x + cWidth / 2) / width + (y + cHeight / 2) / height) / 2;
				let timeFactor = time / 200 * speed;
				timeFactor = timeFactor - Math.floor(timeFactor);
				let fullFactor = 1 - Math.min(1 - Math.abs(timeFactor - progress), Math.abs(timeFactor - progress));
				fullFactor = (fullFactor - 0.5) * 2;
				const radiusX = cWidth / 2 * fullFactor;
				const radiusY = cHeight / 2 * fullFactor;
				ctx.ellipse(x + cWidth / 2, y + cHeight / 2, radiusX, radiusY, 0, Math.PI * 2, 0, 0);
				ctx.fill();
				ctx.closePath();
			}
		}

	}
}

const HWAVES = (col1, col2, peakNum, waveNum, lineW, speed = 1 / 20) => {
	return (ctx, width, height, time, playing) => {
		const waveHeight = height / waveNum;
		const amplitude = (waveHeight - lineW) / 2;

		const waveSpan = width / peakNum;
		const waveFreq = Math.PI * 2 / waveSpan;

		ctx.fillStyle = col1;
		ctx.fillRect(0, 0, width, height);

		ctx.strokeStyle = col2;
		ctx.lineWidth = lineW;
		const timeFactor = time / Math.PI / 2 * speed;

		for (let baseY = 0; baseY < height; baseY += waveHeight) {
			ctx.beginPath();
			for (let x = -waveSpan / 2; x <= width + waveSpan / 2; x += 4) {
				const midY = baseY + waveHeight / 2;
				const sinY = midY + Math.sin(x * waveFreq + Math.PI / 2 - timeFactor) * amplitude;
				if (x == -waveSpan / 2) {
					ctx.moveTo(x, sinY);
				} else {
					ctx.lineTo(x, sinY);
				}
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
}

const SPIRAL = (col1, col2, lineW, spiralNum = 5, speed = 1 / 20, outwards = false) => {
	return (ctx, width, height, time, playing) => {
		ctx.fillStyle = col1;
		ctx.fillRect(0, 0, width, height);

		ctx.strokeStyle = col2;
		ctx.lineWidth = lineW;
		ctx.beginPath();
		ctx.moveTo(width / 2, height / 2);

		const step = height / spiralNum / 2;
		let angle = time / Math.PI / 2 * speed;
		if (outwards) angle *= -1;
		let dist = 0;

		while (dist * dist <= width * width / 4 + height * height / 4) {
			const x = width / 2 + Math.cos(angle) * dist;
			const y = height / 2 - Math.sin(angle) * dist;
			ctx.lineTo(x, y);

			dist += step / 360;
			angle += Math.PI * 2 / 360;
		}
		ctx.stroke();
		ctx.closePath();
	}
}

