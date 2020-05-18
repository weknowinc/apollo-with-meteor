import callMethod from '/imports/utils/callMethod.jsx';
import hashPassword from '/imports/utils/hashPassword.jsx';
import getUserLoginMethod from '/imports/utils/oauth/getUserLoginMethod.jsx';
import {Meteor} from 'meteor/meteor';

export default function (root, {username, email, password, plainPassword}, context) {
    if (!password && !plainPassword) {
        throw new Error('Password is required')
    }
    if (!password) {
        password = hashPassword(plainPassword)
    }

    const methodArguments = {
        user: email ? {email} : {username},
        password: password
    }
    try {
        return callMethod(context, 'login', methodArguments)
    } catch (error) {
        if (error.reason === 'User has no password set') {
            const method = getUserLoginMethod(email || username)
            if (method === 'no-password') {
                throw new Meteor.Error('no-password', 'User has no password set, go to forgot password')
            } else if (method) {
                throw new Error(`User is registered with ${method}.`)
            } else {
                throw new Error('User has no login methods')
            }
        } else {
            throw error
        }
    }
}
