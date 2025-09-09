/**
 * 🔬 纯JSON驱动的项目详情页动态内容生成器
 * ✨ 完全动态生成所有内容 - 保持样式100%不变
 */

class ProjectLoader {
    constructor(dataPath = '../data/research.json') {
        this.dataPath = dataPath;
        this.data = null;
        this.contentContainers = {
            'title': '#project-title',
            'date': '#project-date', 
            'authors': '#project-authors',
            'abstract': '#project-abstract',
            'fulltext': '#project-fulltext',
            'image': '#project-image',
            'imageSection': '#project-image-section',
            'pageTitle': '#page-title',
            'loadingState': '#loading-state',
            'errorState': '#error-state',
            'mainContent': '#main-content',
            'errorMessage': '#error-message'
        };
    }

    /**
     * 📋 从URL获取项目ID
     */
    getProjectIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    /**
     * 📊 加载research.json数据
     */
    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            this.data = await response.json();
            console.log('✅ Research data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading research data:', error);
            throw error;
        }
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
     * 🔍 根据ID查找项目
     */
    findProjectById(projectId) {
        if (!this.data || !projectId) return null;

        for (const category of this.data.categories) {
            // 先尝试使用原始ID查找
            let project = category.projects.find(p => p.id === projectId);
            
            // 如果没找到，尝试使用从title生成的ID查找
            if (!project) {
                project = category.projects.find(p => this.generateProjectId(p.display.title) === projectId);
            }
            
            if (project) {
                return project;
            }
        }
        return null;
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
     * 📝 格式化描述文本 - 将\\n转换为HTML
     */
    formatDescription(description) {
        if (!description) return '';
        
        return description
            .split('\\n\\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph)
            .map(paragraph => {
                if (paragraph.includes('•')) {
                    const lines = paragraph.split('\\n');
                    const listItems = lines
                        .filter(line => line.trim().startsWith('•'))
                        .map(line => `<li>${line.trim().substring(1).trim()}</li>`)
                        .join('');
                    const nonListContent = lines
                        .filter(line => !line.trim().startsWith('•'))
                        .join(' ').trim();
                    
                    let result = '';
                    if (nonListContent) {
                        result += `<p>${nonListContent}</p>`;
                    }
                    if (listItems) {
                        result += `<ul>${listItems}</ul>`;
                    }
                    return result;
                } else {
                    return `<p>${paragraph.replace(/\\n/g, '<br>')}</p>`;
                }
            })
            .join('');
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
     * 👤 获取第一作者
     */
    getFirstAuthor(authorsStr) {
        if (!authorsStr) return '';
        const authors = authorsStr.replace('Authors: ', '');
        return authors.split(',')[0].trim();
    }

    /**
     * 🎨 动态生成页面内容
     */
    generatePageContent(project) {
        const display = project.display;
        const details = project.details;

        // 生成页面标题
        const pageTitle = document.querySelector(this.contentContainers.pageTitle);
        if (pageTitle) {
            pageTitle.textContent = `${display.title} - RADAResearch Lab`;
        }
        
        // 生成项目标题
        const projectTitle = document.querySelector(this.contentContainers.title);
        if (projectTitle) {
            projectTitle.textContent = display.title;
        }

        // 生成作者信息
        const projectAuthors = document.querySelector(this.contentContainers.authors);
        if (projectAuthors) {
            const authors = details.authors || display.authors.replace('Authors: ', '');
            projectAuthors.innerHTML = `<strong>Authors: </strong>${authors}`;
        }

        // 生成日期
        const projectDate = document.querySelector(this.contentContainers.date);
        if (projectDate) {
            projectDate.textContent = display.date;
        }

        // 生成和更新meta标签
        this.generateMetaTags(project);

        // 生成图片内容
        if (details.image) {
            this.generateImageContent(details, display.title);
        }

        // 生成摘要
        if (details.abstract) {
            const projectAbstract = document.querySelector(this.contentContainers.abstract);
            if (projectAbstract) {
                projectAbstract.innerHTML = `<strong>Abstract: </strong>${details.abstract}`;
            }
        }

        // 生成Full-text信息
        if (details.paper_text) {
            this.generateFullTextContent(details);
        }
    }

    /**
     * 🏷️ 生成和更新meta标签
     */
    generateMetaTags(project) {
        const display = project.display;
        
        // 更新main entity meta
        const mainEntityMeta = document.getElementById('main-entity-meta');
        if (mainEntityMeta) {
            // 从当前URL获取链接信息
            mainEntityMeta.setAttribute('itemid', window.location.href);
            mainEntityMeta.setAttribute('content', display.title || '');
        }

        // 更新日期meta标签
        const datePublishedMeta = document.getElementById('date-published-meta');
        const dateModifiedMeta = document.getElementById('date-modified-meta');
        const isoDate = this.convertDateFormat(display.date);
        
        if (datePublishedMeta) datePublishedMeta.setAttribute('content', isoDate);
        if (dateModifiedMeta) dateModifiedMeta.setAttribute('content', isoDate);

        // 更新作者meta标签
        const authorMeta = document.getElementById('author-meta');
        if (authorMeta) {
            authorMeta.setAttribute('content', this.getFirstAuthor(display.authors));
        }
    }

    /**
     * 🖼️ 生成图片内容
     */
    generateImageContent(details, title) {
        const imgElement = document.querySelector(this.contentContainers.image);
        const imgSection = document.querySelector(this.contentContainers.imageSection);
        
        if (imgElement && imgSection) {
            imgElement.src = `../${details.image}`;
            imgElement.alt = title || '';
            
            // 更新image meta标签
            const imageUrlMeta = document.getElementById('image-url-meta');
            const imageWidthMeta = document.getElementById('image-width-meta');
            const imageHeightMeta = document.getElementById('image-height-meta');
            
            if (imageUrlMeta) imageUrlMeta.setAttribute('content', `../${details.image}`);
            if (imageWidthMeta) imageWidthMeta.setAttribute('content', '');
            if (imageHeightMeta) imageHeightMeta.setAttribute('content', '');
            
            imgSection.style.display = 'block';
        }
    }

    /**
     * 📄 生成Full-text内容
     */
    generateFullTextContent(details) {
        const projectFulltext = document.querySelector(this.contentContainers.fulltext);
        if (projectFulltext) {
            const label = details.paper_label || 'Full-text';
            
            if (details.paper_url && details.paper_url !== '#') {
                // 如果没有paper_text，就使用URL作为显示文本
                const displayText = details.paper_text || details.paper_url;
                projectFulltext.innerHTML = `<strong>${label}: </strong><a href="${details.paper_url}" target="_blank">${displayText}</a>`;
            } else if (details.paper_text) {
                projectFulltext.innerHTML = `<strong>${label}: </strong>${details.paper_text}`;
            }
        }
    }

    /**
     * 🚀 主加载方法 - 完全动态生成项目详情内容
     */
    async loadProject() {
        try {
            // 获取项目ID
            const projectId = this.getProjectIdFromURL();
            
            if (!projectId) {
                this.showError('No project ID specified in URL');
                return;
            }

            console.log(`🔄 Loading project: ${projectId}`);

            // 加载数据
            await this.loadData();

            // 查找项目
            const project = this.findProjectById(projectId);
            
            if (!project) {
                this.showError(`Project "${projectId}" not found`);
                return;
            }

            // 检查是否有详情数据
            if (!project.details) {
                this.showError(`Project "${projectId}" has no detailed information`);
                return;
            }

            // 动态生成页面内容
            this.generatePageContent(project);

            // 显示主内容
            this.showMainContent();

            console.log(`✅ Project "${projectId}" content generated successfully`);
            
        } catch (error) {
            console.error('❌ Error loading project:', error);
            this.showError('Failed to load project data');
        }
    }
}

// 🎯 页面加载完成后自动生成内容
document.addEventListener('DOMContentLoaded', async function() {
    const loader = new ProjectLoader();
    await loader.loadProject();
});