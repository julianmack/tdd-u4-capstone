const router = require('express').Router();
const Video = require('../models/video')

router.get('/', async (req, res, next) => {
  res.redirect('/videos')
})

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
})

router.get('/videos/create', async (req, res, next) => {
  res.render('videos/create')
})

router.get('/videos/:id', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('videos/show', {video});
});

router.get('/videos/:id/edit', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('videos/edit', {video});
})
router.post('/videos/:id/updates', async (req, res, next) => {
  const video = await findVideo(req);
  const id = req.params.id;
  createVideoObject(video, req.body); //i think this method creates the original object
  if (req.body.title && req.body.videoUrl) {
    await video.save();
    const newVideo = await findVideo(req)
    res.redirect(`/videos/${id}`)
  } else {
    res.status(400).render('videos/edit', {item: video})
  }
})
router.post('/videos/:id/deletions', async (req, res, next) => {
  await Video.findByIdAndRemove(req.params.id, () => {
    res.redirect('/videos')
  })
});

router.post('/videos', async (req, res, next) => {
  const {title, description, videoUrl} = req.body;
  const video = new Video({title, description, videoUrl});
  video.validateSync()
  if (title && videoUrl) {
    const savedVideo = await video.save();
    res.redirect(`/videos/${savedVideo._id}`)
  } else {
    res.status(400).render('videos/create', {item: video})
  }
})

const findVideo = async (req) => {
  const id = req.params.id;
  return await Video.findOne({_id: id})
}

const createVideoObject = (video, {title, description, videoUrl}) => {
  video.title = title;
  video.description = description;
  video.videoUrl = videoUrl;
  video.validateSync();
}


module.exports = router;
