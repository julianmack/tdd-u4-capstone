const {assert} = require('chai');
const {buildItemObject, setValuesAndSubmit} = require('../test-utils');

describe('User visits /create page', () => {
  describe('and posts new video ', () => {
    it('can see video hosted', () => {
      const item = buildItemObject();

      browser.url('/videos/create');
      setValuesAndSubmit(item);

      assert.include(browser.getText('#videos-container'), item.title);
      assert.include(browser.getText('#videos-container'), item.description);
    });
  });

});
