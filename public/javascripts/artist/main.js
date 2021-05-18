import {generateElements} from '../main.js'
import handleError from '../alerts.js'

window.onload = () => {
    const params = new URLSearchParams(window.location.search)

    if (!params.has('id'))
        return handleError('Wrong url!')
    if (params.get('id').length === 0)
        return handleError('Wrong url!')

    
    fetch(`${window.location.origin}/api/artist/${params.get('id')}`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if (res.error)
                throw new Error(res.error.message)
            return res
        })
        .then(res => generateElements(res.items, 'albums'))
        .catch(err => handleError(err))
}