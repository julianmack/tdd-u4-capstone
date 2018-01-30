const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video')
const {connectDatabaseAndDropData, disconnectDatabase, buildItemObject, parseTextFromHTML} = require('../test-utils');


describe('GET /videos', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  it('renders existing videos', async () => {
    const item = buildItemObject();

    const video = await Video.create(item);
    const response = await request(app)
      .get('/videos')
      .redirects(1);

    assert.include(response.text, item.title);
    assert.include(parseTextFromHTML(response.text,'#videos-container'), item.title);
  });
  describe('/:id', () => {
    it('renders a specific video page', async () => {
      const item = buildItemObject();
      const video = await Video.create(item);
      const response = await request(app)
        .get(`/videos/${video._id}`)

      assert.include(response.text, item.title);
      assert.include(response.text, item.videoUrl);
    });
    describe('/edit', () => {
      it('renders a form for the video', async () => {
        const item = buildItemObject();
        const video = await Video.create(item);
        const response = await request(app)
          .get(`/videos/${video._id}/edit`)
        assert.include(parseTextFromHTML(response.text, 'form'), '')
      });
    });
  });
});
describe('POST', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  describe('/videos/:id/updates', () => {
    it('updates the record', async () => {
      const firstItem = buildItemObject();
      const secondItem = buildItemObject({title: 'New Title', description: 'Description changed', videoUrl: 'https://www.youtube.com/watch?v=6tEgG9qcVEE&t=368s'});

      const video = await Video.create(firstItem);
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(secondItem)
        .redirects(1)

      assert.include(parseTextFromHTML(response.text,'#video-title'), secondItem.title)
      assert.notInclude(parseTextFromHTML(response.text,'#video-title'), firstItem.title)
    });
    it('redirects to videos/show with status 302', async () => {
      const firstItem = buildItemObject();
      const secondItem = buildItemObject({title: 'New Title', description: 'Description changed', videoUrl: 'https://www.youtube.com/watch?v=6tEgG9qcVEE&t=368s'});

      const video = await Video.create(firstItem);
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(secondItem)

      assert.equal(response.status, 302)
      assert.equal(response.headers.location, `/videos/${video._id}`)
    });
    describe('when the input is invalid', () => {
      it('does not save the record', async () => {
        const firstItem = buildItemObject();
        const secondItem = buildItemObject({}, 'title');

        const video = await Video.create(firstItem);
        const response = await request(app)
          .post(`/videos/${video._id}/updates`)
          .type('form')
          .send(secondItem)
          .redirects(1)
        const video2 = await Video.findById(video._id);

        assert.equal(video2.title, firstItem.title);
        assert.equal(video2.description, firstItem.description);
      });
      it('responds with a status of 400', async () => {
        const firstItem = buildItemObject();
        const secondItem = buildItemObject({}, 'title');

        const video = await Video.create(firstItem);
        const response = await request(app)
          .post(`/videos/${video._id}/updates`)
          .type('form')
          .send(secondItem)
          .redirects(1)

        assert.equal(response.status, 400)
      });
      it('renders the edit form', async () => {
        const firstItem = buildItemObject();
        const secondItem = buildItemObject({}, 'title');

        const video = await Video.create(firstItem);
        const response = await request(app)
          .post(`/videos/${video._id}/updates`)
          .type('form')
          .send(secondItem)
          .redirects(1)

        assert.include(parseTextFromHTML(response.text, 'form'), '')
      });
    });
  });
  describe('/videos/:id/deletions', () => {
    it('deletes the record', async () => {
      const item = buildItemObject();

      const video = await Video.create(item);
      const response = await request(app)
        .post(`/videos/${video._id}/deletions`)
        .type('form')
        .redirects(1)

      const returnedItems = await Video.find({_id: video._id});

      assert.equal(returnedItems.length, 0);

    });
  });
});
describe('POST', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  describe('/videos', () => {
    it('gives 302 status', async () => {
      const item = buildItemObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(item)

      assert.equal(response.status, 302);
    });
    describe('video is submitted', () => {
      it('and appears in db with description, title and url', async () => {
        const item = buildItemObject();

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(item);
        const video = await Video.findOne({});

        assert.equal(video.description, item.description);
        assert.equal(video.title, item.title);
        assert.equal(video.videoUrl, item.videoUrl)
      });
      it('and response contains video title & description', async () => {
        const video = buildItemObject();
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video)
          .redirects(1)

        assert.include(response.text, video.title);
        assert.include(response.text, video.videoUrl);
      });
      it('redirects to the new videos page', async () => {
        const video = buildItemObject();
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video);
        const videoQuery = await Video.find({title: video.title});
        assert.equal(response.status, 302);
        assert.equal(response.headers.location, `/videos/${videoQuery[0]._id}`);
      });
      describe('without a title', () => {
        it('it is not saved', async () => {
          const item = buildItemObject({}, 'title'); //the second arg means  item.title == ''
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(item);
          const returnedItems = await Video.find({});

          assert.equal(response.status, 400);
          assert.equal(returnedItems.length, 0);
          assert.include(parseTextFromHTML(response.text, '#error'), 'Must include a title');
        });
        it('it renders the video form', async () => {
          const item = buildItemObject({}, 'title'); //the second arg means  item.title == ''
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(item);
          assert.include(parseTextFromHTML(response.text, 'form'), '') //i.e. this will fail if form is not present on page
        });
        it('but description is preserved in form', async () => {
          const item = buildItemObject({}, 'title'); //the second arg means  item.title == ''
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(item);
          assert.include(parseTextFromHTML(response.text, '#description-input'), item.description)
        });
        it('but URL is preserved in form', async () => {
          const item = buildItemObject({}, 'title'); //the second arg means  item.title == ''
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(item);
          assert.include(response.text, item.videoUrl);
        });
      });
      describe('without a URL', () => {
        it('error message is rendered', async () =>{
          const item = buildItemObject({}, 'videoUrl'); //the second arg means  item.title == ''
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(item);
          assert.equal(parseTextFromHTML(response.text, '.error'), 'URL is required');
        });
        it('but other values are preserved in form', async () => {
          const item = buildItemObject({}, 'videoUrl'); //the second arg means  item.title == ''
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(item);
          assert.include(response.text, item.videoUrl);
          assert.include(response.text, item.title)
        });
      });
    });
  });
});
