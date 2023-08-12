const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            next(error)
            // res.send("erorrrrrrrrrr")
        }
    }
}


export default asyncWrapper