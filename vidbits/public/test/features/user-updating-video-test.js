const {assert} = require('chai');
const {buildItemObject, setValuesAndSubmit} = require('../test-utils');

describe('User updates video', () => {
  it('can change the values', () => {
    const firstItem = buildItemObject();
    const secondItem = buildItemObject({title: 'New Title', description: 'Description changed', videoUrl: 'https://www.youtube.com/watch?v=6tEgG9qcVEE&t=368s'});

    browser.url('/videos/create');
    setValuesAndSubmit(firstItem);
    browser.click('#edit');
    browser.setValue('#title-input', secondItem.title);
    browser.setValue('#description-input', secondItem.description);
    browser.setValue('#videoUrl-input', secondItem.videoUrl);
    browser.click('#submit-button')
    assert.include(browser.getText('#videos-container'), secondItem.title)
  });

  it('does not create an additional video', async () => {
    const firstItem = buildItemObject();
    const secondItem = buildItemObject({title: 'New Title', description: 'Description changed', videoUrl: 'https://www.youtube.com/watch?v=6tEgG9qcVEE&t=368s'});

    browser.url('/videos/create');
    setValuesAndSubmit(firstItem);
    browser.click('#edit');
    setValuesAndSubmit(secondItem);
    browser.url('/videos');
    assert.notInclude(browser.getText('#videos-container'), firstItem.title)
  });
});
