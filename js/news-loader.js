/**
 * 📰 纯JSON驱动的新闻详情页动态内容生成器
 * ✨ 完全动态生成所有内容 - 保持样式100%不变
 */

class NewsLoader {
    constructor(dataPath = '../data/news.json') {
        this.dataPath = dataPath;
        this.data = null;
        this.contentContainers = {
            'title': '#news-title',
            'date': '#news-date',
            'content': '#news-content',
            'pageTitle': '#page-title',
            'loadingState': '#loading-state',
            'errorState': '#error-state',
            'mainContent': '#main-content',
            'errorMessage': '#error-message'
        };
    }

    /**
     * 📋 从URL获取新闻文章ID
     */
    getNewsIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    /**
     * 📊 加载news.json数据
     */
    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            this.data = await response.json();
            console.log('✅ News data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading news data:', error);
            throw error;
        }
    }

    /**
     * 🔍 根据ID查找新闻文章
     */
    findNewsById(newsId) {
        if (!this.data || !newsId) return null;

        return this.data.articles.find(article => this.generateArticleId(article.title) === newsId);
    }

    /**
     * ❌ 显示错误状态
     */
    showError(message) {
        this.hideLoading();
        const errorState = document.querySelector(this.contentContainers.errorState);
        const mainContent = document.querySelector(this.contentContainers.mainContent);
        const errorMessage = document.querySelector(this.contentContainers.errorMessage);
        
        if (errorState) errorState.style.display = 'block';
        if (mainContent) mainContent.style.display = 'none';
        if (errorMessage) errorMessage.textContent = message;
    }

    /**
     * 🔄 隐藏加载状态
     */
    hideLoading() {
        const loadingState = document.querySelector(this.contentContainers.loadingState);
        if (loadingState) loadingState.style.display = 'none';
    }

    /**
     * 📄 显示主内容
     */
    showMainContent() {
        this.hideLoading();
        const errorState = document.querySelector(this.contentContainers.errorState);
        const mainContent = document.querySelector(this.contentContainers.mainContent);
        
        if (errorState) errorState.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
    }

    /**
     * 📅 转换日期格式为ISO格式
     */
    convertDateFormat(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        } catch (e) {
            return dateStr;
        }
    }

    /**
     * 🆔 根据标题自动生成ID（slug格式）
     */
    generateArticleId(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
            .replace(/\s+/g, '-')         // 空格转为连字符
            .replace(/-+/g, '-')          // 多个连字符合并为一个
            .replace(/^-|-$/g, '');       // 去掉首尾连字符
    }

    /**
     * 🔗 自动生成新闻详情页链接
     */
    generateNewsLink(articleId) {
        return `news/news.html?id=${articleId}`;
    }

    /**
     * 🎨 动态生成页面内容
     */
    generatePageContent(article) {
        // 生成页面标题
        const pageTitle = document.querySelector(this.contentContainers.pageTitle);
        if (pageTitle) {
            pageTitle.textContent = `${article.title} - RADAResearch Lab`;
        }
        
        // 生成新闻标题
        const newsTitle = document.querySelector(this.contentContainers.title);
        if (newsTitle) {
            newsTitle.textContent = article.title;
        }

        // 生成日期
        const newsDate = document.querySelector(this.contentContainers.date);
        if (newsDate) {
            newsDate.textContent = article.date;
        }

        // 生成和更新meta标签
        this.generateMetaTags(article);

        // 生成内容
        const newsContent = document.querySelector(this.contentContainers.content);
        if (newsContent && article.content) {
            newsContent.innerHTML = `<p></p>
<p>${article.content}</p>
<p></p>
<p></p>
<p></p>`;
        }

    }

    /**
     * 🏷️ 生成和更新meta标签
     */
    generateMetaTags(article) {
        const articleId = this.generateArticleId(article.title);
        const newsLink = this.generateNewsLink(articleId);
        
        // 更新main entity meta
        const mainEntityMeta = document.getElementById('main-entity-meta');
        if (mainEntityMeta) {
            mainEntityMeta.setAttribute('itemid', newsLink);
            mainEntityMeta.setAttribute('content', article.title);
        }

        // 更新日期meta标签
        const datePublishedMeta = document.getElementById('date-published-meta');
        const dateModifiedMeta = document.getElementById('date-modified-meta');
        const isoDate = this.convertDateFormat(article.date);
        
        if (datePublishedMeta) datePublishedMeta.setAttribute('content', isoDate);
        if (dateModifiedMeta) dateModifiedMeta.setAttribute('content', isoDate);

        // 更新作者meta标签（只有当有作者时才设置）
        const authorMeta = document.getElementById('author-meta');
        const authorUrlMeta = document.getElementById('author-url-meta');
        if (authorMeta && article.author) {
            authorMeta.setAttribute('content', article.author);
        }
        if (authorUrlMeta && article.author) {
            // 设置默认作者URL，可以根据实际需要调整
            authorUrlMeta.setAttribute('content', 'https://coerisklab.wpengine.com/?author=6');
        }
    }

    /**
     * 🚀 主加载方法 - 完全动态生成新闻详情内容
     */
    async loadNews() {
        try {
            // 获取新闻文章ID
            const newsId = this.getNewsIdFromURL();
            
            if (!newsId) {
                this.showError('No news ID specified in URL');
                return;
            }

            console.log(`🔄 Loading news: ${newsId}`);

            // 加载数据
            await this.loadData();

            // 查找新闻文章
            const article = this.findNewsById(newsId);
            
            if (!article) {
                this.showError(`News article "${newsId}" not found`);
                return;
            }

            // 检查是否有内容数据
            if (!article.content) {
                this.showError(`News article "${newsId}" has no content`);
                return;
            }

            // 动态生成页面内容
            this.generatePageContent(article);

            // 显示主内容
            this.showMainContent();

            console.log(`✅ News "${newsId}" content generated successfully`);
            
        } catch (error) {
            console.error('❌ Error loading news:', error);
            this.showError('Failed to load news data');
        }
    }
}

// 🎯 页面加载完成后自动生成内容
document.addEventListener('DOMContentLoaded', async function() {
    const loader = new NewsLoader();
    await loader.loadNews();
});
