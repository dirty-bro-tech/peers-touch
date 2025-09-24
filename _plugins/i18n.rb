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
      @key = key.strip
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
      
      # Generate language-specific pages
      languages.each do |lang|
        next if lang == default_lang
        
        site.pages.each do |page|
          next if page.data['exclude_from_i18n']
          
          # Create language-specific version
          lang_page = page.dup
          lang_page.data['lang'] = lang
          lang_page.data['permalink'] = "/#{lang}#{page.data['permalink'] || page.url}"
          
          site.pages << lang_page
        end
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::I18nFilter)
Liquid::Template.register_tag('t', Jekyll::I18nTag)