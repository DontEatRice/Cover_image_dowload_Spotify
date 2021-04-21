import createElementWithClasses from './createElement.js'

const ERROR_HEADER = 'Something bad happend 😕'
// https://fontawesome.com/icons/times?style=solid
const CLOSE_BTN = createElementWithClasses('i', 'fas', 'fa-times')

const randomIDGen = (num) => {
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
    let str = ''

    for(let i = 0; i<num; i++)
        str += LETTERS[Math.floor(Math.random()*LETTERS.length)]

    return str
}

export default err => {
    const div = createElementWithClasses('div', 'alert', 'hidden')
    const header = createElementWithClasses('header')
    const spanText = createElementWithClasses('span', 'text')
    const p = createElementWithClasses('p')
    const body = document.querySelector('body')
    const randomID = randomIDGen(6)

    div.id = randomID

    spanText.textContent = ERROR_HEADER
    header.appendChild(spanText)
    header.appendChild(CLOSE_BTN)

    p.textContent = err

    div.appendChild(header)
    div.appendChild(p)
    
    body.appendChild(div)

    div.classList.remove('hidden')
    div.classList.add('active')

    const hideAndRemove = () => {
        const div = document.getElementById(randomID)
        div.classList.add('hidden')
        div.classList.remove('active')

        setTimeout(() => div.remove(), 600)
    }

    setTimeout(() => hideAndRemove(), 3000)
    
    document.querySelector(`div#${randomID} i.fa-times`).addEventListener('click', () => hideAndRemove())
}