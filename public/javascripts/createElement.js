export default (element, ...classes) => {
    const elem = document.createElement(element)
    classes.forEach(className => {
        elem.classList.add(className)
    })
    return elem
}