const faker = require('faker');
const Post =  require('./models/post');
const Review =  require('./models/review');
const cities = require('cities.json');

async function seedPosts() {
    // remove previous post data
    await Post.deleteMany({});
    console.log('Removed post data')
    await Review.deleteMany({});
    console.log('Removed review data')
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
            author: { 'id': '5eeb42d45a47a3f05ae62d74', 'username': 'Maria'},
            type: 'Red',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
                }
            ]
        }
        let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
        await post.save();    
    }
    console.log('Created 600 new posts');
}

module.exports = seedPosts;