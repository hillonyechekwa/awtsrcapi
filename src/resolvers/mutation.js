const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const {AuthenticationError, ForbiddeError} = require('apollo-server-express')
require('dotenv').config()




module.exports = {
    newRun: async (parent, args, {models, user}) => {
        //if there is no user on the context use an auth error
        if(!user) {
            throw new AuthenticationError("You must be signed in to create a new note")
        }
        return await models.Run.create({
            content: args.content,
            //reference author's mongo id
            author: mongoose.Types.ObjectId(user.id)
        })
    },

    deleteRun: async (parent, {id}, {models, user}) => {
        //if not a user throw auth error
        if(!user){
            throw new AuthenticationError("You have to be signed in to delete this run.")
        }

        //find the run
        const run = await models.Run.findById(id)
        //if the run owner and current user are not the same throw a forbidden error
        if(run && String(note.author) !== user.id){
            throw new ForbiddeError("You don't have permission to delete this run.")
        }

        try{
            //if everything checks out reove the note
            // await models.Run.findOneAndRemove({_id: id})
            await run.remove()
            return true
        }catch(err){
            return false
        }
    },

    updateRun: async (parent, {content, id}, {models}) => {
        return await models.Run.findOneAndUpdate(
            {_id: id},
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        )
    },
    signUp: async(parent, {username, email, password}, {models}) => {
        //normalize email
        email = email.trim().toLowerCase()
        const hashed = await email.hash(password, 10)
        try{
            const user = await models.User.create({
                username,
                email,
                password: hashed
            })
            //check if role is set to runner.
            //return web token
            return jwt.sign({id: user._id}, process.env.JWT_SECRET)
        }catch(err) {
            console.log(err)
            throw new Error("Error creating account")
        }
    },
    signIn: async(parent, {username, email, password} , {models}) => {
        if(email){
            email = email.trim().toLowerCase()
        }

        const user = await models.User.findOne({
            $or: [{email, username}]
        })
        //check if user role is set to runner.
        //if no user name throw auth error
        if(!user) {
            throw new AuthenticationError('Error signing in, username or password was incorrect.')
        }

        //if passwords don't match throw auth error
        const valid = await bcrypt.compare(password, user.password)
        if(!valid) {
            throw new AuthenticationError('Error signing in ,username or password was incorrecr')
        }

        //create and return json web token
        return jwt.sign({id: user._id}, process.env.JWT_SECRET)
    },
    isRunner: async(parent, {id}, {models}) => {

    }
}




