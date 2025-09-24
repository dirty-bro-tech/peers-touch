module Jekyll
  module I18nFilter
    def t(key, lang = nil)
      lang ||= @context.registers[:page]['lang'] || @context.registers[:site].config['default_lang'] || 'en'
      
      keys = key.split('.')
      translation = @context.registers[:site].data['i18n'][lang]
      
      keys.each do |k|
        translation = translation[k] if translation
      end
      
      translation || key
    end
    
    def translate(key, lang = nil)
      t(key, lang)
    end
  end
  
  class I18nTag < Liquid::Tag
    def initialize(tag_name, key, tokens)
      super
      @key = key.strip.gsub(/^['"]|['"]$/, '') # Remove surrounding quotes
    end
    
    def render(context)
      lang = context.registers[:page]['lang'] || context.registers[:site].config['default_lang'] || 'en'
      
      keys = @key.split('.')
      translation = context.registers[:site].data['i18n'][lang]
      
      keys.each do |k|
        translation = translation[k] if translation
      end
      
      translation || @key
    end
  end
  
  class LanguageGenerator < Generator
    safe true
    priority :high
    
    def generate(site)
      languages = site.config['languages'] || ['en', 'zh']
      default_lang = site.config['default_lang'] || 'en'
      
      # Collect original pages first to avoid infinite loop
      original_pages = site.pages.dup
      
      # Generate language-specific pages
      languages.each do |lang|
        next if lang == default_lang
        
        original_pages.each do |page|
          next if page.data['exclude_from_i18n']
          next if page.data['lang'] # Skip already processed language pages
          next if page.path.start_with?('assets/') # Skip asset files
          next if page.path.end_with?('.scss', '.css', '.js') # Skip style and script files
          
          # Create language-specific version
          lang_page = page.dup
          lang_page.data['lang'] = lang
          lang_page.data['permalink'] = "/#{lang}#{page.data['permalink'] || page.url}"
          
          site.pages << lang_page
        end
      end
      
      # Set default language for original pages
      original_pages.each do |page|
        page.data['lang'] ||= default_lang unless page.data['exclude_from_i18n']
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::I18nFilter)
Liquid::Template.register_tag('t', Jekyll::I18nTag)