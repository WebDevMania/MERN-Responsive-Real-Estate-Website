const BASE_URL = "http://localhost:5000"

export const request = async (url, method, headers = {}, body = {}, isNotStringified = false) => {
    let res
    let data
    switch (method) {
        case 'GET':
            res = await fetch(BASE_URL + url, { headers })
            if(res.status !== 200 && res.status !== 201) throw new Error("ERROR")
            data = await res.json()
            return data

        case 'POST':
            // if we send form data, it is not content-type:application/json,
            // hence the bonus param 
            if (isNotStringified) {
                res = await fetch(BASE_URL + url, { headers, method, body })
                if(res.status !== 200 && res.status !== 201) throw new Error("ERROR")
                data = await res.json()
            } else {
                    res = await fetch(BASE_URL + url, { headers, method, body: JSON.stringify({ ...body }) })
                    if(res.status !== 200 && res.status !== 201) throw new Error("ERROR")
                    data = await res.json()
            }
            return data

        case 'PUT':
            res = await fetch(BASE_URL + url, { headers, method, body: JSON.stringify(body) })
            if(res.status !== 200 && res.status !== 201) throw new Error("ERROR")
            data = await res.json()
            return data

        case 'DELETE':
            res = await fetch(BASE_URL + url, { headers, method })
            if(res.status !== 200 && res.status !== 201) throw new Error("ERROR")
            data = await res.json()
            return data
        default:
            return
    }
}