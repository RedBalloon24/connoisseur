const faker = require('faker');
const Post =  require('./models/post');
const cities = require('./cities');

async function seedPosts() {
    // remove previous post data
    await Post.deleteMany({});
    console.log('Removed post data')
    // create 40 new posts
    for(const i of new Array(600)) {
        const random1000 = Math.floor(Math.random() * 1000);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
        const postData = {
            title,
            price: faker.random.number(),
            description,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },            
            author: {
                '_id' : '5ec68e95557e951b2e6e7ff6',
                'username' : 'bob'
            }
        }
        let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
        await post.save();    
    }
    console.log('Created 600 new posts');
}

module.exports = seedPosts;