const faker = require('faker');
const Post =  require('./models/post');

async function seedPosts() {
    // remove previous post data
    await Post.deleteMany({});
    console.log('Removed post data')
    // create 40 new posts
    for(const i of new Array(40)) {
        const post = {
            title: faker.lorem.word(),
            price: faker.random.number(),
            description: faker.lorem.text(),
            coordinates: [-122.0842499, 37.4224764],
            author: {
                '_id' : '5ec68e95557e951b2e6e7ff6',
                'username' : 'bob'
            }
        }
        await Post.create(post);
    }
    console.log('Created 40 new posts');
}

module.exports = seedPosts;