import Users from '/imports/api/collections/Users';

export default function (root, params, context) {
    if(typeof context.userId == 'undefined') {
        return {
            _id: 0,
            email: 'me@anonymous'
        };
    } else {
        return Users.findOne(context.userId)
    }

}
