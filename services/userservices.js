


module.exports.getExpenses = (req, res, where) => {
    return req.user.getExpenses()
}