const {assert} = require('chai');
const {connectDatabaseAndDropData, disconnectDatabase, buildItemObject} = require('../test-utils');
const Video = require('../../models/video')

describe('Model: Video', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);
  describe('title', () => {
    it('is a string', () => {
      const item = buildItemObject({'title': 4});

      const video = new Video(item);

      assert.strictEqual(video.title, item.title.toString());
    });
    it('is required', () => {
      const item = buildItemObject({}, 'title');
      const video = new Video(item);
      video.validateSync()
      assert.equal(video.errors.title.message,'Must include a title')
    });
  });
  describe('URL', () => {
    it('is a string', () => {
      const item = buildItemObject({'videoUrl': 4});

      const video = new Video(item);

      assert.strictEqual(video.videoUrl, item.videoUrl.toString());
    });
    it('is required', () => {
      const item = buildItemObject({}, 'videoUrl');
      const video = new Video(item);
      video.validateSync()
      assert.equal(video.errors.videoUrl.message,'URL is required')
    });
  });
  describe('description', () => {
    it('is a string', () => {
      const item = buildItemObject({'description': 4});

      const video = new Video(item);

      assert.strictEqual(video.videoUrl, item.videoUrl.toString());
    });
  });
});
