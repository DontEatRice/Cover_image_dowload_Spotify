const handleError = msg => {
    console.error(msg)
}

const createElementWithClasses = (element, ...classes) => {
    const elem = document.createElement(element)
    classes.forEach(className => {
        elem.classList.add(className)
    })
    return elem
}

const getExtraAlbumData = element => {
    const {release_date, album_type} = element
    let artists = 'none'
    
    const spanWithText = (text) => {
        const span = createElementWithClasses('span', 'extraInfo')
        span.textContent = text
        return span
    }

    const div = createElementWithClasses('div', 'extraInfo')
    div.appendChild(spanWithText(`Type: ${album_type}`))
    if (element.artists.length > 0) {
        artists = ''
        for(artist of element.artists)
            artists += artist.name + ', '
    }
    div.appendChild(spanWithText(`Artist(s): ${artists}`))
    div.appendChild(spanWithText(`Release date: ${release_date}`))
    return div
}

const generateElements = (items, type) => {
    console.log(items)
    const column = createElementWithClasses('div', 'column')
    const title = createElementWithClasses('div', 'title')
    title.textContent = type === 'artists' ? 'Artists' : 'Albums or singles'
    column.appendChild(title)
    items.forEach(element => {
        console.log(element)
        const block = createElementWithClasses('div', 'block')
        const spanName = createElementWithClasses('span', 'name')
        const infoDiv = createElementWithClasses('div', 'info')
        spanName.textContent = element.name
        infoDiv.appendChild(spanName)
        if (element.images.length > 0) {
            const img = document.createElement('img')
            img.src = element.images ? element.images[0].url : ''
            infoDiv.appendChild(img)
            block.appendChild(infoDiv)
            const imgLinks = createElementWithClasses('div', 'imgLinks')
            for(image of element.images) {
                const link = createElementWithClasses('a', 'imageLink')
                link.href = 'api/download?url=' + image.url
                link.download = `${element.name}${image.height}_${image.width}.png`.replaceAll(' ', '_')
                link.textContent = `Download ${image.height} x ${image.width}`
                imgLinks.appendChild(link)
            }
            if (type === 'albums')
                block.appendChild(getExtraAlbumData(element))
            block.appendChild(imgLinks)
        } else {
            infoDiv.textContent += ' No image available'
            block.appendChild(infoDiv)
        }
        column.appendChild(block)
    });
    const dataDiv = document.getElementById('data')
    dataDiv.appendChild(column)
}


const handleData = (err, data) => {
    if (err) return handleError(err)
    console.log(data)

    if (data.artists)
        generateElements(data.artists.items, 'artists')
    if (data.albums)
        generateElements(data.albums.items, 'albums')
}

const search = (q, type) => {
    const uri = encodeURI(`/api/spotify/search?q=${q}&type=${type}`)
    fetch(uri)
        .then(data => {
            if (!data.ok) {
                throw new Error('Api call failed - ' + data)
            } else
                return data.json()
        })
        .then(data => handleData(null, data))
        .catch(err => handleData(err))
}


const checkForErrorMessage = () => {
    const dataDiv = document.querySelector('.data')
    const child = dataDiv.firstChild
    if (child !== undefined && child !== null) {
        if (child.classList.contains('badSearch'))
            return true
    } 
    return false
}

const searchForm = document.getElementById('searchForm')

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchData = new FormData(searchForm)
    const dataDiv = document.querySelector('#data')
    // const errorMsg = checkForErrorMessage()
    let searchInput = null
    let type = null
    for(const data of searchData) {
        if (data[0] === 'searchInput')
            searchInput = data[1]
        else if (data[0] === 'type')
            type = data[1]
    }
    if (searchInput === null || searchInput.replaceAll(' ', '') === '') {
        console.error('Invalid text')
    } else {
        dataDiv.textContent = ''
        search(searchInput, type)
        // dataDiv.innerHTML = '<span>Ładowanie..</span>'
    }

    console.log(searchInput, type)
})