import { AngularStarterKitPage } from './app.po';

describe('angular-starter-kit App', () => {
  let page: AngularStarterKitPage;

  beforeEach(() => {
    page = new AngularStarterKitPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
