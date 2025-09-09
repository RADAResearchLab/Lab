/**
 * 🎯 News Manager - 新闻动态管理器
 * 功能：动态生成News and Featured Events，采用4列布局（和people页面一致）
 */

class NewsManager {
    constructor(dataPath = 'data/news.json') {
        this.dataPath = dataPath;
        this.data = null;
        this.newsContainerSelector = '.fl-node-5d68615b96237 .fl-post-grid'; // 原来的post-grid容器
    }

    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            console.log('✅ News data loaded successfully:', this.data);
        } catch (error) {
            console.error('❌ Failed to load news data:', error);
            throw error;
        }
    }

    /**
     * 🎯 生成文章ID（URL友好）
     */
    generateArticleId(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * 🎯 生成新闻详情页链接
     */
    generateNewsLink(articleId) {
        return `news/news.html?id=${articleId}`;
    }

    /**
     * 🎯 生成postId
     */
    generatePostId(article, index) {
        return `news-${Date.now()}-${index}`;
    }

    /**
     * 🎯 提取纯文本摘要
     */
    extractExcerpt(content) {
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    }

    /**
     * 🎯 生成新闻文章HTML结构 - 完全按照原HTML结构
     */
    generateArticleHTML(article, articleIndex) {
        const postId = this.generatePostId(article, articleIndex);
        const articleId = this.generateArticleId(article.title);
        const isoDate = this.convertDateFormat(article.date);
        const newsLink = this.generateNewsLink(articleId);
        const excerpt = this.extractExcerpt(article.content);

        // 生成作者信息的HTML - 只有当有作者时才显示
        const authorHTML = article.author ? `
                    <span class="fl-post-grid-author">
                        By <a href="https://coerisklab.wpengine.com/?author=6"><span>${article.author}</span></a>
                    </span>
                    <span class="fl-sep"> | </span>` : '';

        // 生成作者meta信息
        const authorMetaHTML = article.author ? `
            <div itemscope itemprop="author" itemtype="https://schema.org/Person">
                <meta itemprop="url" content="https://coerisklab.wpengine.com/?author=6" />
                <meta itemprop="name" content="${article.author}" />
            </div>` : '';

        return `<div class="fl-post-column">
            <div class="fl-post-grid-post fl-post-align-default post-${postId} post type-post status-publish format-standard hentry category-research"
                 itemscope itemtype="https://schema.org/BlogPosting">

                <meta itemscope itemprop="mainEntityOfPage" itemtype="https://schema.org/WebPage" 
                      itemid="${newsLink}" content="${article.title}" />
                <meta itemprop="datePublished" content="${isoDate}" />
                <meta itemprop="dateModified" content="${isoDate}" />
                <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="RADAResearch Lab">
                </div>
                ${authorMetaHTML}

                <div class="fl-post-grid-text">
                    <h2 class="fl-post-grid-title" itemprop="headline">
                        <a href="${newsLink}" title="${article.title}" rel="bookmark" itemprop="url">${article.title}</a>
                    </h2>
                    <div class="fl-post-grid-meta">${authorHTML}
                        <span class="fl-post-grid-date">
                            ${article.date} </span>
                    </div>
                    <div class="fl-post-grid-content" itemprop="text">
                        <p>${excerpt}</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * 🎯 日期格式转换（ISO格式）
     */
    convertDateFormat(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    /**
     * 🎯 更新新闻部分
     */
    async updateNewsSection() {
        const newsContainer = document.querySelector(this.newsContainerSelector);
        if (!newsContainer) {
            console.error(`❌ News container not found: ${this.newsContainerSelector}`);
            return;
        }

        console.log('🎯 Container found:', newsContainer);

        // 保存现有的注释节点
        const commentNodes = Array.from(newsContainer.childNodes).filter(node => node.nodeType === 8);

        // 🎯 过滤可见的新闻文章 - 和research完全一样的逻辑
        const visibleArticles = this.data.articles ? 
            this.data.articles.filter(article => article.visible !== false) : [];

        // 检查是否有可见的新闻文章
        if (!visibleArticles || visibleArticles.length === 0) {
            console.log('⚠️ No visible news articles to display');
            newsContainer.innerHTML = '';
            commentNodes.forEach(comment => newsContainer.appendChild(comment));
            return;
        }

        // 动态生成所有可见新闻文章HTML - 原post-grid结构
        let articlesHTML = '';
        
        visibleArticles.forEach((article, index) => {
            articlesHTML += this.generateArticleHTML(article, index);
        });

        // 插入生成的HTML - 恢复原来的post-grid结构
        newsContainer.innerHTML = '';
        commentNodes.forEach(comment => newsContainer.appendChild(comment));
        newsContainer.insertAdjacentHTML('beforeend', articlesHTML);

        // 🎯 手动设置可见性和固定高度
        const posts = newsContainer.querySelectorAll('.fl-post-grid-post');
        posts.forEach(post => {
            post.style.visibility = 'visible';
            post.style.opacity = '1';
            post.style.height = '222px';
        });

        const totalCount = this.data.articles?.length || 0;
        console.log(`✅ News section updated with ${visibleArticles.length}/${totalCount} articles using original post-grid structure`);
        console.log(`🎯 Container:`, newsContainer);
        console.log(`🎯 Generated ${posts.length} fl-post-grid-post elements`);
    }

    /**
     * 🎯 更新标题
     */
    updateSectionTitle() {
        // 硬编码标题，因为已从news.json中移除
        const titleElement = document.querySelector('#news-title, .news-section-title');
        if (titleElement) {
            titleElement.textContent = 'News and Featured Events';
        }
    }

    /**
     * 🎯 更新全部内容
     */
    async updateAll() {
        try {
            await this.loadData();
            this.updateSectionTitle();
            await this.updateNewsSection();
            console.log('🎉 News Manager initialization completed successfully');
        } catch (error) {
            console.error('❌ Error during News Manager initialization:', error);
        }
    }
}

// 🎯 页面加载完成后自动执行
(function() {
    const initNews = async () => {
        console.log('🎯 开始初始化News Manager...');
        
        // 🎯 检查容器是否存在
        const container = document.querySelector('.fl-node-5d68615b96237 .fl-post-grid');
        console.log('🎯 容器检查:', container ? '✅ 找到' : '❌ 未找到', container);
        
        const newsManager = new NewsManager();
        await newsManager.updateAll();
        
        console.log('🎯 News Manager初始化完成');
    };
    
    // 如果DOM已经加载完成，立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNews);
    } else {
        // DOM已经准备好，立即执行
        setTimeout(initNews, 0);
    }
})();