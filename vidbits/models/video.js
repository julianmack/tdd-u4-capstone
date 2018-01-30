const {mongoose} = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: 'Must include a title',
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: 'URL is required',
    },
  })
);

module.exports = Video;
