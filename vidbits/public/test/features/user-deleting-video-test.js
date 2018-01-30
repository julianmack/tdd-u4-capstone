const {assert} = require('chai');
const {buildItemObject, setValuesAndSubmit} = require('../test-utils');

describe('User deleting video', () => {
  it('removes video from list', () => {
    const item = buildItemObject();

    browser.url('/videos/create');
    setValuesAndSubmit(item);
    browser.click('#delete');
    browser.url('/videos');

    assert.notInclude(browser.getText('#videos-container'), item.title)
  });
});
