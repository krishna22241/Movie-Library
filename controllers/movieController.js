// const axios = require('axios');
// const Movie = require('../models/Movie');
// const MovieList = require('../models/MovieList'); // Add this line

// exports.searchMovies = async (req, res) => {
//     const { title } = req.query;

//     if (!title) {
//         return res.render('movies/search', { movies: [], lists: [] }); 
//     }

//     try {
//         // Fetch all lists
//         const lists = await MovieList.find({}); // Modify this to fetch all lists

//         const response = await axios.get(`http://www.omdbapi.com/?s=${title}&apikey=${process.env.OMDB_API_KEY}`);
//         const data = response.data;
//         if (data.Response === 'False') {
//             return res.render('movies/search', { movies: [], lists: lists }); // Pass fetched lists
//         }
//         res.render('movies/search', { movies: data.Search, lists: lists }); // Pass fetched lists
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server error');
//     }
// };

const axios = require('axios');
const MovieList = require('../models/MovieList');

exports.searchMovies = async (req, res) => {
    const { title } = req.query;
    const userId = req.user.id;

    if (!title) {
        return res.render('movies/search', { movies: [], lists: [] });
    }

    try {
        // Fetch the current user's lists (both public and private)
        const userLists = await MovieList.find({ user: userId });

        // Fetch public lists created by other users
        const publicLists = await MovieList.find({ user: { $ne: userId }, isPublic: true });

        // Combine both lists
        const lists = [...userLists, ...publicLists];

        const response = await axios.get(`http://www.omdbapi.com/?s=${title}&apikey=${process.env.OMDB_API_KEY}`);
        const data = response.data;
        if (data.Response === 'False') {
            return res.render('movies/search', { movies: [], lists });
        }
        res.render('movies/search', { movies: data.Search, lists });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

