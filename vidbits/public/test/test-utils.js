const {jsdom} = require('jsdom');
const {mongoose, databaseUrl, options} = require('../database');

const connectDatabaseAndDropData = async () => {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
};


// Create and return a sample Item object
const buildItemObject = (options = {}, paramToDelete = '') => {
  var title = options.title || 'My favorite item';
  var videoUrl = options.videoUrl || 'https://www.youtube.com/embed/m_aCOvsGFG0';
  var description = options.description || 'Just the best video';
  if (paramToDelete == 'title') {
    title = ''
  } else if (paramToDelete == 'videoUrl') {
    videoUrl = ''
  } else if (paramToDelete == 'description') {
    description = ''
  };
  return {title, description, videoUrl};
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};


const setValuesAndSubmit = (item) => {
  browser.setValue('#title-input', item.title);
  browser.setValue('#description-input', item.description);
  browser.setValue('#videoUrl-input', item.videoUrl);
  browser.click('#submit-button')
};


module.exports = {
  connectDatabaseAndDropData,
  disconnectDatabase,
  buildItemObject,
  parseTextFromHTML,
  setValuesAndSubmit,
};
