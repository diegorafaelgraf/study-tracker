import i18n from './i18n';

describe('i18n configuration', () => {
  it('loads Spanish and English translation resources', () => {
    expect(i18n.hasResourceBundle('es', 'translation')).toBe(true);
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
  });
});
