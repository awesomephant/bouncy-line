const config = {
    pointCount: 200,
    debug: true,
    noiseAmplitude: 100,
    noiseFrequency: .002,
    speed: .005,
    slope: 0,
}
let points = []
let path, h, engage, listen, read, play;
let offset = 0;
function generatePathString(points) {
    let s = `M${points[0].currentX} ${points[0].currentY} `
    for (let i = 1; i < points.length; i++) {
        s += `L${points[i].currentX} ${points[i].currentY} `
        //s += `c${points[i].currentX + 20} ${points[i].currentY},  `
    }
    return s;
}

function animate() {
    // Maybe the movement here needs to be done with
    // actual noise so it looks continuous.
    // Movement from linear movement of noise offset
    window.requestAnimationFrame(animate)
    offset += config.speed;

    for (let i = 0; i < points.length; i++) {
        points[i].currentY = h / 2 + (noise.simplex2(points[i].currentX * config.noiseFrequency + offset, 3) * config.noiseAmplitude) - points[i].currentX * config.slope
    }

    let interval = config.pointCount / 5;

    play.setAttribute('transform',   `translate(${points[interval * 1].currentX} ${points[20].currentY})  scale(.7)`)
    read.setAttribute('transform',   `translate(${points[interval * 2].currentX} ${points[50].currentY})  scale(.7)`)
    listen.setAttribute('transform', `translate(${points[interval * 3].currentX} ${points[80].currentY})  scale(.7)`)
    engage.setAttribute('transform', `translate(${points[interval * 4].currentX} ${points[120].currentY}) scale(.7)`)

    path.setAttribute('d', generatePathString(points))

}
function init() {
    let svgEl = document.querySelector('.line')
    let w = window.innerWidth
    h = window.innerHeight
    engage = document.querySelector('#group-engage')
    listen = document.querySelector('#group-listen')
    read = document.querySelector('#group-read')
    play = document.querySelector('#group-play')
    
    svgEl.setAttribute('width', w)
    svgEl.setAttribute('height', h)

    noise.seed(Math.random());

    // Init points array
    for (let i = 0; i < config.pointCount; i++) {
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