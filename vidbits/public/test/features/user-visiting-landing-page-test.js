const {assert} = require('chai');
const {buildItemObject, setValuesAndSubmit} = require('../test-utils');


describe('User visits landing page', () => {
  describe('and can navigate to', () => {
    it('videos/create', () => {
      browser.url('/videos');
      browser.click('#create-button');
      assert.include(browser.getText('body'), 'Save a video')
    });
  });
  describe('with an existing video', () => {
    it('and renders it in the list', () => {
      const item = buildItemObject();

      browser.url('/videos/create');
      setValuesAndSubmit(item);
      browser.url('/videos');

      assert.include(browser.getText('#videos-container'), item.title)
    });
    it('has iframe present on page', () => {
      const item = buildItemObject();

      browser.url('/videos/create');
      setValuesAndSubmit(item);
      browser.url('/videos');

      assert.include(browser.getText('.video-player'), '');
    });
    it('can navigate to the video', async () => {
      const item = buildItemObject();

      browser.url('/videos/create');
      setValuesAndSubmit(item);
      browser.url('/videos');
      browser.click('#video-title');

      assert.include(browser.getText('#videos-container'), item.title)
    });
  });

  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/videos');
      assert.equal(browser.getText('#videos-container'), '');
    });
  });
});
