const faker = require('faker');
const Post =  require('./models/post');
const cities = require('cities.json');

async function seedPosts() {
    // remove previous post data
    await Post.deleteMany({});
    console.log('Removed post data')
    // create 40 new posts
    for(const i of new Array(600)) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random5 = Math.floor(Math.random() * 6);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
        const postData = {
            title,
            price: random1000,
            description,
            location: `${cities[random1000].name}, ${cities[random1000].country}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].lng, cities[random1000].lat],
            },  
            avgRating: random5,          
            author: '5ece822ea7c46e263ed13d42',
            type: 'Red'
        }
        let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
        await post.save();    
    }
    console.log('Created 600 new posts');
}

module.exports = seedPosts;