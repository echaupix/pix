'use strict'

const buildMongoQuery = (params) => {
    const mongoQuery = {}
    Object.keys(params).forEach(key => {
        const value = params[key]
        switch(key) {
            case 'release_date':
                const dateQuery = {}
                if (value.lte) {
                  dateQuery.$lte = new Date(value.lte)
                }
                if (value.gte) {
                    dateQuery.$gte = new Date(value.gte)
                }
                mongoQuery.release_date = dateQuery
                break
            case 'director':
            case 'genres':
                mongoQuery[key] = {
                    $in: Array.isArray(value) ? value : [value]
                }
                break
            default:
                throw new Error(
                    `Unknown query param ${key}. Valid query params are release_date[lte], release_date[gte], director, and genres.`
                )
        }
    })
    return mongoQuery
}

module.exports = {
    buildMongoQuery,
}