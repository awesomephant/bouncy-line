const config = {
    pointCount: 150,
    debug: true,
    noiseAmplitude: 500,
    noiseFrequency: .001,
    speed: .001,
    slope: 0,
    stackCount: 4,
}
let paused = false;
let points = []
let buttons = []
let path, h;
let offset = 0;
let currentSpeed = config.speed
let targetSpeed = config.speed;
function generatePathString(points) {
    let s = `M${points[0].currentX} ${points[0].currentY} `
    for (let i = 1; i < points.length; i++) {
        s += `L${points[i].currentX} ${points[i].currentY} `
        //s += `c${points[i].currentX + 20} ${points[i].currentY},  `
    }
    return s;
}

function sq(a) {
    return a * a
}

function animate() {
    // Maybe the movement here needs to be done with
    // actual noise so it looks continuous.
    // Movement from linear movement of noise offset
    window.requestAnimationFrame(animate)
    currentSpeed += (targetSpeed - currentSpeed) * .1;
    offset += currentSpeed;


    for (let i = 0; i < points.length - 1; i++) {
        points[i].currentY = (h / 2 + (noise.simplex2(points[i].currentX * config.noiseFrequency + offset, 3) * config.noiseAmplitude) - points[i].currentX * config.slope)

        let adjacent = points[i + 1].currentX - points[i].currentX
        let opposite = points[i + 1].currentY - points[i].currentY
        let d = Math.sqrt(sq(adjacent) + sq(opposite))
        let angle = 180 * Math.asin(opposite / d) / Math.PI
        points[i].currentSlope = angle

    }
    path.setAttribute('d', generatePathString(points))

    for (let i = 0; i < buttons.length; i++) {
        let x = points[buttons[i].x].currentX;
        let y = points[buttons[i].x].currentY;
        let targetAngle = points[buttons[i].x].currentSlope;
        buttons[i].currentAngle = targetAngle
        buttons[i].element.setAttribute('transform', `translate(${x} ${y})`)
        buttons[i].rg.setAttribute('transform', `rotate(${buttons[i].currentAngle}) translate(${buttons[i].offset} ${buttons[i].offset})`)

    }


}
function init() {
    let svgEl = document.querySelector('.line')
    let w = window.innerWidth
    h = window.innerHeight
    engage = document.querySelector('#group-engage')
    listen = document.querySelector('#group-listen')
    read = document.querySelector('#group-read')
    play = document.querySelector('#group-play')

    buttons.push({ x: Math.floor(config.pointCount / 4 * .5), element: play, offset: -100 })
    buttons.push({ x: Math.floor(config.pointCount / 4 * 1.5), element: read, offset: -90 })
    buttons.push({ x: Math.floor(config.pointCount / 4 * 2.5), element: listen, offset: -150 })
    buttons.push({ x: Math.floor(config.pointCount / 4 * 3.5), element: engage, offset: -100 })

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].rg = buttons[i].element.querySelector('.rg')
        buttons[i].element.addEventListener('mouseover', function (e) {
            targetSpeed = 0
        })
        buttons[i].element.addEventListener('mouseout', function (e) {
            targetSpeed = config.speed
        })

        // prepare hover
        for (let j = 0; j < config.stackCount; j++) {
            let clone = buttons[i].rg.cloneNode(true);
            clone.setAttribute('class', `clone`)
            clone.setAttribute('transform', `translate(${j * -10} ${j * -15})`)
            buttons[i].rg.appendChild(clone)
        }

    }

    svgEl.setAttribute('width', w)
    svgEl.setAttribute('height', h)

    noise.seed(Math.random());

    // Init points array
    for (let i = 0; i < config.pointCount + 2; i++) {
        let x = (w / config.pointCount) * i
        points.push({
            currentX: x,
            currentY: (h / 2)
        })
    }

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', generatePathString(points))
    path.setAttribute('class', 'line')
    svgEl.insertAdjacentElement('afterbegin', path)

    animate()
}
window.addEventListener('DOMContentLoaded', function () {
    init();
})