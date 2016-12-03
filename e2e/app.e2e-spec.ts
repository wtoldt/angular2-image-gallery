import { Angular2ImageGalleryPage } from './app.po';

describe('angular2-image-gallery App', function() {
  let page: Angular2ImageGalleryPage;

  beforeEach(() => {
    page = new Angular2ImageGalleryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
