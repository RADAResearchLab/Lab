/**
 * 🔬 DYNAMIC Research Page Manager
 * 🚀 完全动态生成HTML内容 - 根据JSON数据生成所有项目
 */

class ResearchManager {
    constructor(dataPath = 'data/research.json') {
        this.dataPath = dataPath;
        this.data = null;
        this.categoryNodes = {
            'machine_learning': '.fl-node-5d55c1e3d3a9c',
            'ctrl_games': '.fl-node-5d6c4e0ddbda3',
            'finance': '.fl-node-5d6c53f38b1af', 
            'health': '.fl-node-5d6c549969f71',
            'blockchain': '.fl-node-5d6c56de4208a'
        };
    }

    /**
     * 🎯 根据标题生成项目ID（URL友好）
     */
    generateProjectId(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * 🎯 根据项目ID生成详情页链接
     */
    generateProjectLink(projectId) {
        return `projects/project.html?id=${projectId}`;
    }

    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load research data:', error);
        }
    }

    /**
     * 🎯 获取原图信息 - Meta标签需要原图尺寸，IMG标签需要缩略图尺寸
     */
    getOriginalImageInfo(imagePath) {
        // 🎯 Machine Learning 图片
        if (imagePath.includes('sde-300x181')) {
            return {
                originalPath: imagePath.replace('-300x181', ''),
                originalWidth: 360,
                originalHeight: 217,
                thumbnailWidth: 300,
                thumbnailHeight: 181
            };
        } else if (imagePath.includes('pgdot-300x224')) {
            return {
                originalPath: imagePath.replace('-300x224', ''),
                originalWidth: 800,
                originalHeight: 596,
                thumbnailWidth: 300,
                thumbnailHeight: 224
            };
        } else if (imagePath.includes('learning-mfc-300x171')) {
            return {
                originalPath: imagePath.replace('-300x171', ''),
                originalWidth: 1758,
                originalHeight: 1002,
                thumbnailWidth: 300,
                thumbnailHeight: 171
            };
        } else if (imagePath.includes('Gans-300x179')) {
            return {
                originalPath: imagePath.replace('-300x179', ''),
                originalWidth: 2014,
                originalHeight: 1202,
                thumbnailWidth: 300,
                thumbnailHeight: 179
            };
        } else if (imagePath.includes('hpam-300x169')) {
            return {
                originalPath: imagePath.replace('-300x169', ''),
                originalWidth: 1280,
                originalHeight: 720,
                thumbnailWidth: 300,
                thumbnailHeight: 169
            };
        } else if (imagePath.includes('lmfg_figure-300x143')) {
            return {
                originalPath: imagePath.replace('-300x143', ''),
                originalWidth: 14851,
                originalHeight: 7067,
                thumbnailWidth: 300,
                thumbnailHeight: 143
            };
        } else if (imagePath.includes('mhp_mle_figure-300x117')) {
            return {
                originalPath: imagePath.replace('-300x117', ''),
                originalWidth: 15465,
                originalHeight: 6043,
                thumbnailWidth: 300,
                thumbnailHeight: 117
            };
        } else if (imagePath.includes('nan-rwgan-300x136')) {
            return {
                originalPath: imagePath.replace('-300x136', ''),
                originalWidth: 2279,
                originalHeight: 1036,
                thumbnailWidth: 300,
                thumbnailHeight: 136
            };
        }
        // 🎯 Stochastic Controls 图片
        else if (imagePath.includes('par-inv-300x169')) {
            return {
                originalPath: imagePath.replace('-300x169', ''),
                originalWidth: 800,
                originalHeight: 450,
                thumbnailWidth: 300,
                thumbnailHeight: 169
            };
        } else if (imagePath.includes('imp-grph.jpg')) {
            return {
                originalPath: imagePath,
                originalWidth: 14292,
                originalHeight: 6031,
                thumbnailWidth: 300,
                thumbnailHeight: 127
            };
        }
        // 🎯 Financial Engineering 图片
        else if (imagePath.includes('fintech_book-198x300')) {
            return {
                originalPath: imagePath.replace('-198x300', ''),
                originalWidth: 330,
                originalHeight: 499,
                thumbnailWidth: 198,
                thumbnailHeight: 300
            };
        }
        // 🎯 Healthcare 图片
        else if (imagePath.includes('SVM_lung_cancer-300x225')) {
            return {
                originalPath: imagePath.replace('-300x225', ''),
                originalWidth: 960,
                originalHeight: 720,
                thumbnailWidth: 300,
                thumbnailHeight: 225
            };
        } else if (imagePath.includes('DR-300x225')) {
            return {
                originalPath: imagePath.replace('-300x225', ''),
                originalWidth: 960,
                originalHeight: 720,
                thumbnailWidth: 300,
                thumbnailHeight: 225
            };
        }
        
        // 默认：假设是原图
        return {
            originalPath: imagePath,
            originalWidth: 300,
            originalHeight: 200,
            thumbnailWidth: 300,
            thumbnailHeight: 200
        };
    }

    /**
     * 🎯 生成正确的srcset - 基于WordPress图片命名规则
     */
    generateSrcset(imagePath) {
        if (!imagePath.includes('-300x') && !imagePath.includes('-198x')) return '';
        
        const srcsetParts = [];
        
        // 基于文件名规律添加不同尺寸
        if (imagePath.includes('sde-300x181')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x181', '')} 360w`);
        } else if (imagePath.includes('pgdot-300x224')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x224', '-768x572')} 768w`);
            srcsetParts.push(`${imagePath.replace('-300x224', '')} 800w`);
        } else if (imagePath.includes('learning-mfc-300x171')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x171', '-1024x584')} 1024w`);
            srcsetParts.push(`${imagePath.replace('-300x171', '-768x438')} 768w`);
            srcsetParts.push(`${imagePath.replace('-300x171', '-1536x875')} 1536w`);
            srcsetParts.push(`${imagePath.replace('-300x171', '')} 1758w`);
        } else if (imagePath.includes('Gans-300x179')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x179', '-1024x611')} 1024w`);
            srcsetParts.push(`${imagePath.replace('-300x179', '-768x458')} 768w`);
            srcsetParts.push(`${imagePath.replace('-300x179', '-1536x917')} 1536w`);
            srcsetParts.push(`${imagePath.replace('-300x179', '')} 2014w`);
        } else if (imagePath.includes('nan-rwgan-300x136')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x136', '-768x349')} 768w`);
            srcsetParts.push(`${imagePath.replace('-300x136', '-1024x465')} 1024w`);
        } else if (imagePath.includes('hpam-300x169')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x169', '-1024x576')} 1024w`);
            srcsetParts.push(`${imagePath.replace('-300x169', '-768x432')} 768w`);
            srcsetParts.push(`${imagePath.replace('-300x169', '')} 1280w`);
        } else if (imagePath.includes('SVM_lung_cancer-300x225')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x225', '-768x576')} 768w`);
            srcsetParts.push(`${imagePath.replace('-300x225', '')} 960w`);
        } else if (imagePath.includes('DR-300x225')) {
            srcsetParts.push(`${imagePath} 300w`);
            srcsetParts.push(`${imagePath.replace('-300x225', '-768x576')} 768w`);
            srcsetParts.push(`${imagePath.replace('-300x225', '')} 960w`);
        } else if (imagePath.includes('fintech_book-198x300')) {
            srcsetParts.push(`${imagePath} 198w`);
            srcsetParts.push(`${imagePath.replace('-198x300', '')} 330w`);
        } else if (imagePath.includes('-300x')) {
            // 通用300px宽度处理
            srcsetParts.push(`${imagePath} 300w`);
        }
        
        return srcsetParts.length > 0 ? srcsetParts.join(', ') : '';
    }

    /**
     * 🎯 获取sizes属性值
     */
    getSizesAttribute(imagePath) {
        if (imagePath.includes('fintech_book-198x300')) {
            return 'auto, (max-width: 198px) 100vw, 198px';
        }
        return 'auto, (max-width: 300px) 100vw, 300px';
    }

    /**
     * 🎯 获取第一个作者的姓名（用于schema.org元数据）
     */
    getFirstAuthorName(authorsString) {
        // 移除"Authors: "前缀，然后获取第一个作者
        const cleanAuthors = authorsString.replace(/^Authors:\s*/, '');
        const firstAuthor = cleanAuthors.split(',')[0].trim();
        return firstAuthor;
    }

    /**
     * 🎯 生成真实的post ID - 完全匹配原始系统
     */
    generatePostId(project, categoryId, projectIndex) {
        // 🎯 根据分类和项目索引返回真实的post ID
        const postIdMaps = {
            'machine_learning': [127, 128, 129, 126, 125, 91, 87, 106],
            'ctrl_games': [93, 95],
            'finance': [118], // 来自zc.html的post-118
            'health': [104, 102], // 来自zc.html的post-104, post-102
            'blockchain': []
        };
        
        const categoryIds = postIdMaps[categoryId] || [];
        return categoryIds[projectIndex] || (100 + projectIndex);
    }

    /**
     * 🔧 生成完整的项目HTML结构 - 包含所有必要属性和元数据
     */
    generateProjectHTML(project, categoryId, projectIndex, isFirstProject = false) {
        const display = project.display;
        const postId = this.generatePostId(project, categoryId, projectIndex);
        
        // 🎯 自动生成项目ID和链接
        const projectId = project.id || this.generateProjectId(display.title);
        const projectLink = display.link || this.generateProjectLink(projectId);
        
        const imageInfo = this.getOriginalImageInfo(display.image);
        const srcset = this.generateSrcset(display.image);
        const sizes = this.getSizesAttribute(display.image);
        const firstAuthor = this.getFirstAuthorName(display.authors);
        
        const articleClass = `fl-post-grid-post fl-post-grid-image-above-title fl-post-align-default post-${postId} ${categoryId} type-${categoryId} status-publish has-post-thumbnail hentry masonry-brick`;
        
        const loadingAttr = isFirstProject ? 'fetchpriority="high"' : 'loading="lazy"';
        const decodingAttr = 'decoding="async"';
        
        // 🎯 根据分类决定HTML标签 - Machine Learning用article，其他用div
        const htmlTag = categoryId === 'machine_learning' ? 'article' : 'div';
        
        // 🎯 构建IMG标签属性 - 使用缩略图尺寸
        const imgAttributes = [
            loadingAttr,
            decodingAttr,
            `width="${imageInfo.thumbnailWidth}"`,
            `height="${imageInfo.thumbnailHeight}"`,
            `src="${display.image}"`,
            'class="attachment-medium size-medium wp-post-image"',
            'alt=""'
        ];
        
        if (srcset) {
            imgAttributes.push(`srcset="${srcset}"`);
            imgAttributes.push(`sizes="${sizes}"`);
        }

                 return `<${htmlTag} class="${articleClass}" itemscope itemtype="https://schema.org/CreativeWork">
            <meta itemscope itemprop="mainEntityOfPage" itemtype="https://schema.org/WebPage" 
                  itemid="${projectLink}" content="${display.title}" />
            <meta itemprop="datePublished" content="${project.metadata?.datePublished || display.date}" />
            <meta itemprop="dateModified" content="${project.metadata?.dateModified || display.date}" />
            
            <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
                <meta itemprop="name" content="RADAResearch Lab">
            </div>
            
            <div itemscope itemprop="author" itemtype="https://schema.org/Person">
                <meta itemprop="url" content="${project.metadata?.authorUrl || 'https://coerisklab.wpengine.com/?author=7'}" />
                <meta itemprop="name" content="${firstAuthor}" />
            </div>
            
            <div itemscope itemprop="image" itemtype="https://schema.org/ImageObject">
                <meta itemprop="url" content="${imageInfo.originalPath}" />
                <meta itemprop="width" content="${imageInfo.originalWidth}" />
                <meta itemprop="height" content="${imageInfo.originalHeight}" />
            </div>
            
            <div itemprop="interactionStatistic" itemscope itemtype="https://schema.org/InteractionCounter">
                <meta itemprop="interactionType" content="https://schema.org/CommentAction" />
                <meta itemprop="userInteractionCount" content="0" />
            </div>
            
            <div class="fl-post-grid-image">
                <a href="${projectLink}" rel="bookmark" title="${display.title}">
                    <img ${imgAttributes.join(' ')} />
                </a>
            </div>

            <div class="fl-post-grid-text">
                <h2 class="fl-post-grid-title" itemprop="headline">
                    <a href="${projectLink}" title="${display.title}">${display.title}</a>
                </h2>
                
                <div class="fl-post-grid-meta">
                    <span class="fl-post-grid-date">${display.date}</span>
                </div>
                
                <div class="fl-post-grid-content">
                    <p>${display.authors}</p>
                </div>
                         </div>
         </${htmlTag}>`;
    }

    /**
     * 🎯 动态生成特定分类的所有研究项目
     */
    updateCategoryProjects(category, nodeSelector) {
        const moduleNode = document.querySelector(nodeSelector);
        if (!moduleNode) return;

        const gridContainer = moduleNode.querySelector('.fl-post-grid');
        if (!gridContainer) return;

        // 清空现有内容（保留注释）
        const commentNodes = [];
        for (let node of gridContainer.childNodes) {
            if (node.nodeType === Node.COMMENT_NODE) {
                commentNodes.push(node.cloneNode(true));
            }
        }

        // 🎯 过滤可见的项目 - 支持visible属性控制
        const visibleProjects = category.projects ? 
            category.projects.filter(project => project.visible !== false) : [];

        // 如果分类为空或没有可见项目，显示空消息
        if (visibleProjects.length === 0) {
            gridContainer.innerHTML = '';
            commentNodes.forEach(comment => gridContainer.appendChild(comment));
            gridContainer.insertAdjacentHTML('beforeend', `
                <div class="fl-post-grid-empty">
             
                </div>
                <div class="fl-post-grid-sizer"></div>
            `);
            return;
        }

        // 动态生成所有可见项目HTML
        let projectsHTML = '';
        visibleProjects.forEach((project, index) => {
            projectsHTML += this.generateProjectHTML(project, category.id, index, index === 0);
        });

        // 插入生成的HTML和必要的结构元素
        gridContainer.innerHTML = '';
        commentNodes.forEach(comment => gridContainer.appendChild(comment));
        gridContainer.insertAdjacentHTML('beforeend', projectsHTML);
        gridContainer.insertAdjacentHTML('beforeend', '<div class="fl-post-grid-sizer"></div>');
        gridContainer.insertAdjacentHTML('afterend', '<div class="fl-clear"></div>');
        
                 // 🎯 Machine Learning分类需要手动设置可见性，其他分类让Masonry自然处理
         if (category.id === 'machine_learning') {
             const posts = gridContainer.querySelectorAll('.fl-post-grid-post');
             posts.forEach(post => {
                 post.style.visibility = 'visible';
                 post.style.opacity = '1';
             });
         }
        
        // 内容生成完成
    }


    /**
     * 🎯 更新页面主标题
     */
    updatePageTitle() {
        const titleElement = document.querySelector('.fl-node-5d6c49696d531 .fl-heading-text');
        if (titleElement && this.data.title) {
            titleElement.textContent = this.data.title;
        }
    }

    /**
     * 🎯 更新分类标题
     */
    updateCategoryTitles() {
        const categoryTitleSelectors = {
            'machine_learning': '.fl-node-5d6c492487edc .fl-heading-text',
            'ctrl_games': '.fl-node-5d6c523caa7e0 .fl-heading-text',
            'finance': '.fl-node-5d6c54435012d .fl-heading-text',
            'health': '.fl-node-5d6c54c961eba .fl-heading-text',
            'blockchain': '.fl-node-5d6c571bcad33 .fl-heading-text'
        };

        this.data.categories.forEach(category => {
            const selector = categoryTitleSelectors[category.id];
            if (selector) {
                const titleElement = document.querySelector(selector);
                if (titleElement) {
                    titleElement.textContent = category.name;
                }
            }
        });
    }

    // 🎯 布局交给原始2-layout.js处理 - 我们只负责内容生成


    /**
     * 🚀 主更新方法 - 完全动态生成所有内容
     */
    async updateAll() {
        await this.loadData();
        
        if (!this.data) {
            console.error('❌ 无法加载research数据');
            return;
        }

        console.log('🔄 开始动态生成Research页面内容...');
        
        try {
            // 更新页面主标题
            this.updatePageTitle();
            console.log('✅ 页面标题更新完成');

            // 更新分类标题
            this.updateCategoryTitles();
            console.log('✅ 分类标题更新完成');
            
            // 动态生成各分类的所有项目
            this.data.categories.forEach(category => {
                const nodeSelector = this.categoryNodes[category.id];
                if (nodeSelector) {
                    // 计算可见项目数量
                    const visibleCount = category.projects ? 
                        category.projects.filter(project => project.visible !== false).length : 0;
                    const totalCount = category.projects?.length || 0;
                    
                    this.updateCategoryProjects(category, nodeSelector);
                    console.log(`✅ ${category.name} 分类动态生成完成 (显示${visibleCount}/${totalCount} 个项目)`);
                }
            });
            
            console.log('🎉 Research页面内容生成完成！等待DOM完全更新...');
            
            // 🎯 关键修复：内容生成完成后，再加载包含FLBuilderPostGrid初始化的脚本
            console.log('✅ 内容生成完成，现在加载2-layout.js让原始系统处理布局...');
            this.triggerOriginalLayout();
            
        } catch (error) {
            console.error('❌ 动态生成过程中出错:', error);
        }
    }
    
    /**
     * 🎯 动态加载masonry相关脚本并初始化布局
     */
    triggerOriginalLayout() {
        console.log('🔄 开始动态加载masonry相关脚本...');
        
        // 需要按顺序加载的脚本文件
        const scriptsToLoad = [
            'js/jquery.imagesloaded.min.js',
            'js/masonry.min.js', 
            'js/jquery/jquery.masonry.min.js',
            'js/2-layout.js'
        ];
        
        this.loadScriptsSequentially(scriptsToLoad, 0);
    }
    
    /**
     * 🔄 按顺序加载脚本文件
     */
    loadScriptsSequentially(scripts, index) {
        if (index >= scripts.length) {
            console.log('✅ 所有masonry脚本加载完成！正在触发布局初始化...');
            
            // 🎯 手动触发2-layout.js的初始化逻辑
            setTimeout(() => {
                this.triggerLayoutInitialization();
            }, 100);
            
            return;
        }
        
        const scriptPath = scripts[index];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptPath;
        
        script.onload = () => {
            console.log(`✅ 已加载: ${scriptPath}`);
            // 加载下一个脚本
            this.loadScriptsSequentially(scripts, index + 1);
        };
        
        script.onerror = () => {
            console.error(`❌ 加载失败: ${scriptPath}`);
            // 继续加载下一个脚本
            this.loadScriptsSequentially(scripts, index + 1);
        };
        
        document.head.appendChild(script);
    }
    
    /**
     * 🎯 等待2-layout.js自动初始化 - 完全交给原始系统处理
     */
    triggerLayoutInitialization() {
        console.log('✅ 2-layout.js已加载，FLBuilderPostGrid将自动初始化我们的动态内容');
        // 🎯 不做任何干预，完全让原始系统处理
    }
}

// 🎯 使用方法：立即执行，不等待DOM完全加载
(function() {
    // 确保在原始masonry脚本之前生成内容
    const initResearch = async () => {
        const researchManager = new ResearchManager();
        await researchManager.updateAll();
    };
    
    // 如果DOM已经加载完成，立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResearch);
    } else {
        // DOM已经准备好，立即执行
        setTimeout(initResearch, 0);
    }
})();

