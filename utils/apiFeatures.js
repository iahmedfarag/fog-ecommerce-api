export class ApiFeatures {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }
    // pagination
    pagination() {
        const { page = 1, limit = 9 } = this.queryData
        this.mongooseQuery.limit(limit).skip((page - 1) * limit)
        return this
    }
    // sort
    sort() {
        const { sort = '' } = this.queryData
        this.mongooseQuery.sort(sort.replaceAll(',', ' '))
        return this
    }
    // select
    select() {
        const { select = '' } = this.queryData
        this.mongooseQuery.select(select.replaceAll(',', ' '))
        return this
    }
    // filters
    filter() {
        const { filter = {} } = this.queryData
        const filterObj = JSON.parse(JSON.stringify(filter).replace(/gt|gte|lt|lte|in|nin|eq|neq|regex/g, (match) => `$${match}`))
        this.mongooseQuery.find({ ...filterObj })
        return this
    }
    // search
    search() {
        const { search = '' } = this.queryData;
        const searchObj = { name: { $regex: search, $options: 'i' } }
        this.mongooseQuery.find({ ...searchObj })
        return this
    }
}