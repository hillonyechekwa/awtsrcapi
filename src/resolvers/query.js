module.exports = {
    runs: async (parent, args, {models}) => {
        return await models.Run.find()
    },
    run: async(parent, args, {models}) => {
        return await  models.Run.findById(args.id)
    },
    user: async (parent, {username}, {models}) => {
        return await models.User.findOne({username})
    },
    users: async(parent, args, {models}) => {
        return await models.User.find({})
    },
    me: async(parent, args, {models, user}) => {
        return await models.User.findById(user.id)
    }
}