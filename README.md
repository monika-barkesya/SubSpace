# Blog Analytics and Search Tool
This repository contains a blog analytics and search tool developed using Express.js and Lodash. The tool fetches data from a third-party blog API, performs analytics on the data, and provides a search functionality for blog titles.

## Features

Data Retrieval: Fetches blog data from a third-party API via cURL.

Data Analysis: Utilizes Lodash for analytics:
1. Calculates total blogs fetched.
2. Identifies the longest blog title.
3. Counts blogs with "privacy" in the title.
4. Generates an array of unique blog titles.
 Provides clients with a JSON object.

Blog Search Endpoint: Offers a search at /api/blog-search for filtering blogs by query
Download the zip folder from github- and open it in any python IDE

```
https://github.com/monika-barkesya/SubSpace
```
```bash
 npm install
 npm i express axios lodash
 node index.js
```
## Access the tool via the following endpoints:
Blog Analytics: ```http://localhost:3000/api/blog-stats```.

Blog Search: ```http://localhost:3000/api/blog-search?query=your-search-term```.
