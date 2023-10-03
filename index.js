const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

// Define a function to fetch blog data with error handling
async function fetchData() {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    if (response.status === 200) {
      return response.data.blogs;
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch data from the third-party API');
  }
}
// Memoize the fetchData function with a caching period of 12 minutes 
const memoizedFetchData = _.memoize(fetchData, () => Date.now() - 720000);

// Define a function to clear the cache after a certain (every 12 minutes) period 
setInterval(() => {
  memoizedFetchData.cache.clear();
}, 720000);

app.get('/api/blog-stats', async (req, res) => {
  try {
    const blogData = await memoizedFetchData();

    const totalBlogs = blogData.length;
    const longestTitleBlog = _.maxBy(blogData, (blog) => blog.title.length);

    const blogsContainingPrivacy = _.filter(blogData, (blog) =>
      _.includes(_.toLower(blog.title), 'privacy')
    );
    const numberOfBlogsContainingPrivacy = blogsContainingPrivacy.length;

    const uniqueBlogTitles = _.uniqBy(blogData, 'title');
    const uniqueBlogTitleArray = _.map(uniqueBlogTitles, 'title');

    const responseObject = {
      totalBlogs: totalBlogs,
      longestBlogTitle: longestTitleBlog.title,
      blogsWithPrivacyCount: numberOfBlogsContainingPrivacy,
      uniqueBlogTitles: uniqueBlogTitleArray,
    };

    res.json(responseObject);
  } catch (error) {
    console.error('Error in /api/blog-stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/blog-search', async (req, res) => {
    try {
      const query = req.query.query;
  
      if (!query || query.trim() === '') {
        return res.status(400).json({ error: "Query parameter 'query' is required." });
      }
  
      const blogData = await memoizedFetchData();
  
      const matchingBlogs = blogData.filter((blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
  
      const responseObject = {
        query: query,
        matchingBlogs: matchingBlogs.map((blog) => blog.title),
        matchingBlogCount: matchingBlogs.length,
      };
  
      res.json(responseObject);
    } catch (error) {
      console.error('Error in /api/blog-search:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(port, () => {
  console.log(`Our server is running on port ${port}.`);
});
