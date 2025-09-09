/**
 * 🔬 纯JSON驱动的People页面动态内容生成器  
 * ✨ 完全动态生成所有内容 - 完美匹配原版HTML结构和样式
 */

class PeopleManager {
    constructor(dataPath = 'data/people.json') {
        this.dataPath = dataPath;
        this.data = null;
    }

    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            this.data = await response.json();
            console.log('✅ People data loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load people data:', error);
            throw error;
        }
    }

    /**
     * 🖼️ 生成实际存在的srcset - 基于文件名检查存在的响应式图片
     */
    generateSrcset(imagePath) {
        // 只对确认存在响应式图片的文件生成srcset，其他只返回原图
        const srcsetParts = [];
        
        // 根据文件名和已知存在的文件生成srcset
        if (imagePath.includes('anran_avatar.png')) {
            srcsetParts.push(imagePath + ' 922w');
            srcsetParts.push(imagePath.replace('.png', '-768x960.png') + ' 768w');
        } else if (imagePath.includes('joon_avatar.jpg')) {
            srcsetParts.push(imagePath + ' 922w');
            srcsetParts.push(imagePath.replace('.jpg', '-768x960.jpg') + ' 768w');
        } else if (imagePath.includes('renyuan_avatar-1.png')) {
            srcsetParts.push(imagePath + ' 922w');
            srcsetParts.push(imagePath.replace('.png', '-768x957.png') + ' 768w');
        } else if (imagePath.includes('chengju.jpg')) {
            srcsetParts.push(imagePath + ' 922w');
            srcsetParts.push(imagePath.replace('.jpg', '-768x914.jpg') + ' 768w');
        } else if (imagePath.includes('wenpin.jpg')) {
            srcsetParts.push(imagePath + ' 922w');
            srcsetParts.push(imagePath.replace('.jpg', '-768x576.jpg') + ' 768w');
        } else if (imagePath.includes('xiaoli.jpg')) {
            srcsetParts.push(imagePath + ' 922w');
            srcsetParts.push(imagePath.replace('.jpg', '-768x1024.jpg') + ' 768w');
        } else {
            // 对于没有响应式图片的文件，只返回原图
            srcsetParts.push(imagePath);
        }
        
        return srcsetParts;
    }

    /**
     * 🎨 生成Leading Faculty模块HTML（4列网格布局）
     */
    generateLeadingFacultyHTML(faculty) {
        const wpImageId = this.generateWpImageId(faculty.image);
        const linkHTML = faculty.link ? 
            `<a href="${faculty.link}" target="_blank" rel="noopener" itemprop="url">
                <img loading="lazy" decoding="async" width="160" height="210" class="fl-photo-img wp-image-${wpImageId}" src="${faculty.image}" alt="${faculty.name}" itemprop="image" title="${faculty.name}">
            </a>` :
            `<img loading="lazy" decoding="async" width="160" height="210" class="fl-photo-img wp-image-${wpImageId}" src="${faculty.image}" alt="${faculty.name}" itemprop="image" title="${faculty.name}">`;

        return `
        <div class="fl-col fl-node-5ca6426b8362a fl-col-bg-color fl-col-small" data-node="5ca6426b8362a">
            <div class="fl-col-content fl-node-content">
                <div class="fl-module fl-module-photo fl-node-5ca64434113dc" data-node="5ca64434113dc">
                    <div class="fl-module-content fl-node-content">
                        <div class="fl-photo fl-photo-align-center" itemscope="" itemtype="https://schema.org/ImageObject">
                            <div class="fl-photo-content fl-photo-img-png">
                                ${linkHTML}
                            </div>
                            <div class="fl-photo-caption fl-photo-caption-below" itemprop="caption">${faculty.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * 🎯 根据图片路径生成wpImageId
     */
    generateWpImageId(imagePath) {
        // 基于图片路径生成唯一数字ID
        let hash = 0;
        for (let i = 0; i < imagePath.length; i++) {
            const char = imagePath.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash);
    }

    /**
     * 🎓 生成PhD学生列的HTML
     */
    generatePhDColumnHTML(students, startIndex, isFirstColumn = false) {
        return students.map((student, index) => {
            const globalIndex = startIndex + index;
            const loadingAttr = (globalIndex === 0 && isFirstColumn) ? 'fetchpriority="high"' : 'loading="lazy"';
            
            // 生成实际存在的srcset
            const srcsetParts = this.generateSrcset(student.image);
            const srcsetAttr = srcsetParts.length > 1 ? `srcset="${srcsetParts.join(', ')}"` : '';
            const sizesAttr = srcsetParts.length > 1 ? 'sizes="(max-width: 922px) 100vw, 922px"' : '';
            
            const wpImageId = this.generateWpImageId(student.image);
            const linkHTML = student.link ?
                `<a href="${student.link}" target="_blank" rel="noopener" itemprop="url">
                    <img ${loadingAttr} decoding="async" width="922" height="1146" class="fl-photo-img wp-image-${wpImageId}" src="${student.image}" alt="${student.name}" itemprop="image" title="${student.name}" ${srcsetAttr} ${sizesAttr}>
                </a>` :
                `<img ${loadingAttr} decoding="async" width="922" height="1146" class="fl-photo-img wp-image-${wpImageId}" src="${student.image}" alt="${student.name}" itemprop="image" title="${student.name}" ${srcsetAttr} ${sizesAttr}>`;

            return `
            <div class="fl-col fl-node-5ca6426b8362a fl-col-bg-color fl-col-small" data-node="5ca6426b8362a">
                <div class="fl-col-content fl-node-content">
                    <div class="fl-module fl-module-photo fl-node-5ca64434113dc" data-node="5ca64434113dc">
                        <div class="fl-module-content fl-node-content">
                            <div class="fl-photo fl-photo-align-center" itemscope="" itemtype="https://schema.org/ImageObject">
                                <div class="fl-photo-content fl-photo-img-png">
                                    ${linkHTML}
                                </div>
                                <div class="fl-photo-caption fl-photo-caption-below" itemprop="caption">${student.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('') + 
        // 如果少于4列，补充空列
        Array(Math.max(0, 4 - students.length)).fill(0).map((_, i) => `
            <div class="fl-col fl-node-5ca642924006f fl-col-bg-color fl-col-small" data-node="5ca642924006f">
                <div class="fl-col-content fl-node-content"></div>
            </div>`
        ).join('');
    }

    /**
     * 📚 生成Postdocs列HTML
     */
    generatePostdocColumnHTML(postdocs) {
        return postdocs.map(postdoc => {
            // 生成实际存在的srcset
            const srcsetParts = this.generateSrcset(postdoc.image);
            const srcsetAttr = srcsetParts.length > 1 ? `srcset="${srcsetParts.join(', ')}"` : '';
            const sizesAttr = srcsetParts.length > 1 ? 'sizes="auto, (max-width: 2048px) 100vw, 2048px"' : '';
            
            const wpImageId = this.generateWpImageId(postdoc.image);
            const linkHTML = postdoc.link ?
                `<a href="${postdoc.link}" target="_blank" rel="noopener" itemprop="url">
                    <img loading="lazy" decoding="async" width="2048" height="1536" class="fl-photo-img wp-image-${wpImageId}" src="${postdoc.image}" alt="${postdoc.name}" itemprop="image" title="${postdoc.name}" ${srcsetAttr} ${sizesAttr}>
                </a>` :
                `<img loading="lazy" decoding="async" width="3456" height="4608" class="fl-photo-img wp-image-${wpImageId}" src="${postdoc.image}" alt="${postdoc.name}" itemprop="image" title="${postdoc.name}" ${srcsetAttr} ${sizesAttr}>`;

            return `
            <div class="fl-col fl-node-5ca645e27d800 fl-col-bg-color fl-col-small" data-node="5ca645e27d800">
                <div class="fl-col-content fl-node-content">
                    <div class="fl-module fl-module-photo fl-node-5d6d8e1b522f7" data-node="5d6d8e1b522f7">
                        <div class="fl-module-content fl-node-content">
                            <div class="fl-photo fl-photo-align-center" itemscope="" itemtype="https://schema.org/ImageObject">
                                <div class="fl-photo-content fl-photo-img-jpg">
                                    ${linkHTML}
                                </div>
                                <div class="fl-photo-caption fl-photo-caption-below" itemprop="caption">${postdoc.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('') + 
        // 补充空列到4列
        Array(Math.max(0, 4 - postdocs.length)).fill(0).map(() => `
            <div class="fl-col fl-node-5ca645e27d80c fl-col-bg-color fl-col-small" data-node="5ca645e27d80c">
                <div class="fl-col-content fl-node-content"></div>
            </div>`
        ).join('');
    }

    /**
     * 🎓 生成Past PhD Students列HTML
     */
    generatePastPhDColumnHTML(students) {
        return students.map(student => {
            // 生成实际存在的srcset
            const srcsetParts = this.generateSrcset(student.image);
            const srcsetAttr = srcsetParts.length > 1 ? `srcset="${srcsetParts.join(', ')}"` : '';
            const sizesAttr = srcsetParts.length > 1 ? 'sizes="auto, (max-width: 788px) 100vw, 788px"' : '';
            
            const wpImageId = this.generateWpImageId(student.image);
            const linkHTML = student.link ?
                `<a href="${student.link}" target="_blank" rel="noopener" itemprop="url">
                    <img loading="lazy" decoding="async" width="788" height="982" class="fl-photo-img wp-image-${wpImageId}" src="${student.image}" alt="${student.name}" itemprop="image" title="${student.name}" ${srcsetAttr} ${sizesAttr}>
                </a>` :
                `<img loading="lazy" decoding="async" width="160" height="200" class="fl-photo-img wp-image-${wpImageId}" src="${student.image}" alt="${student.name}" itemprop="image" title="${student.name}">`;

            return `
            <div class="fl-col fl-node-5ca646bd7482b fl-col-bg-color fl-col-small" data-node="5ca646bd7482b">
                <div class="fl-col-content fl-node-content">
                    <div class="fl-module fl-module-photo fl-node-5ca646dfded30" data-node="5ca646dfded30">
                        <div class="fl-module-content fl-node-content">
                            <div class="fl-photo fl-photo-align-center" itemscope="" itemtype="https://schema.org/ImageObject">
                                <div class="fl-photo-content fl-photo-img-jpg">
                                    ${linkHTML}
                                </div>
                                <div class="fl-photo-caption fl-photo-caption-below" itemprop="caption">${student.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('') + 
        // 补充空列到4列
        Array(Math.max(0, 4 - students.length)).fill(0).map(() => `
            <div class="fl-col fl-node-5ca648c1e6a9f fl-col-bg-color fl-col-small" data-node="5ca648c1e6a9f">
                <div class="fl-col-content fl-node-content"></div>
            </div>`
        ).join('');
    }

    /**
     * 👨‍🏫 生成Leading Faculty内容（动态4列布局）
     */
    generateLeadingFaculty() {
        if (!this.data.leadingFaculty || this.data.leadingFaculty.length === 0) return;

        const container = document.querySelector('.fl-node-5d6823bfb5bb7 .fl-col-content');
        if (!container) return;

        // 动态生成所有Leading Faculty成员，每行最多4个
        const facultyHTML = this.data.leadingFaculty.map(faculty => 
            this.generateLeadingFacultyHTML(faculty)
        ).join('') + 
        // 补充空列到4的倍数
        Array(Math.max(0, (4 - this.data.leadingFaculty.length % 4) % 4)).fill(0).map(() => `
            <div class="fl-col fl-node-5ca642924006f fl-col-bg-color fl-col-small" data-node="5ca642924006f">
                <div class="fl-col-content fl-node-content"></div>
            </div>`
        ).join('');
        
        container.innerHTML = facultyHTML;
        
        console.log(`✅ Leading Faculty content generated (${this.data.leadingFaculty.length} members)`);
    }

    /**
     * 🎓 生成Current PhD Students内容（真正动态布局）
     */
    generateCurrentPhDStudents() {
        if (!this.data.currentPhDStudents || this.data.currentPhDStudents.length === 0) return;

        const students = this.data.currentPhDStudents;
        
        // 动态生成第一组（前4个或全部）
        const firstRowContainer = document.querySelector('.fl-node-5ca6426b8352a');
        if (firstRowContainer && students.length > 0) {
            const firstGroupStudents = students.slice(0, Math.min(4, students.length));
            firstRowContainer.innerHTML = this.generatePhDColumnHTML(firstGroupStudents, 0, true);
        }

        // 动态生成第二组（如果有超过4个）
        const secondRowContainer = document.querySelector('.fl-node-5d681d93d07fe');
        if (secondRowContainer && students.length > 4) {
            const secondGroupStudents = students.slice(4);
            secondRowContainer.innerHTML = this.generatePhDColumnHTML(secondGroupStudents, 4, false);
        } else if (secondRowContainer) {
            // 如果没有第二组，清空第二个容器
            secondRowContainer.innerHTML = '';
        }

        console.log(`✅ Current PhD Students content generated (${students.length} students)`);
    }

    /**
     * 📚 生成Current Postdocs内容
     */
    generateCurrentPostdocs() {
        if (!this.data.currentPostdocs || this.data.currentPostdocs.length === 0) return;

        const container = document.querySelector('.fl-node-5ca645e27d590');
        if (!container) return;

        container.innerHTML = this.generatePostdocColumnHTML(this.data.currentPostdocs);
        
        console.log(`✅ Current Postdocs content generated (${this.data.currentPostdocs.length} postdocs)`);
    }

    /**
     * 🎓 生成Past PhD Students内容（真正动态布局）
     */
    generatePastPhDStudents() {
        if (!this.data.pastPhDStudents || this.data.pastPhDStudents.length === 0) return;

        const students = this.data.pastPhDStudents;
        
        // 动态生成第一组（前4个或全部）
        const firstRowContainer = document.querySelector('.fl-node-5ca646bd746c5');
        if (firstRowContainer && students.length > 0) {
            const firstGroupStudents = students.slice(0, Math.min(4, students.length));
            firstRowContainer.innerHTML = this.generatePastPhDColumnHTML(firstGroupStudents);
        }

        // 动态生成第二组（如果有超过4个）
        const secondRowContainer = document.querySelector('.fl-node-5ca648c1e6966');
        if (secondRowContainer && students.length > 4) {
            const secondGroupStudents = students.slice(4);
            secondRowContainer.innerHTML = this.generatePastPhDColumnHTML(secondGroupStudents);
        } else if (secondRowContainer) {
            // 如果没有第二组，清空第二个容器
            secondRowContainer.innerHTML = '';
        }

        console.log(`✅ Past PhD Students content generated (${students.length} students)`);
    }

    /**
     * 📚 生成Past Postdocs内容
     */
    generatePastPostdocs() {
        if (!this.data.pastPostdocs || this.data.pastPostdocs.length === 0) return;

        const container = document.querySelector('.fl-node-5da4b42b5aec3');
        if (!container) return;

        const postdocHTML = this.data.pastPostdocs.map(postdoc => {
            const wpImageId = this.generateWpImageId(postdoc.image);
            const linkHTML = postdoc.link ?
                `<a href="${postdoc.link}" target="_blank" rel="noopener" itemprop="url">
                    <img loading="lazy" decoding="async" width="160" height="200" class="fl-photo-img wp-image-${wpImageId}" src="${postdoc.image}" alt="${postdoc.name}" itemprop="image" title="${postdoc.name}">
                </a>` :
                `<img loading="lazy" decoding="async" width="160" height="200" class="fl-photo-img wp-image-${wpImageId}" src="${postdoc.image}" alt="${postdoc.name}" itemprop="image" title="${postdoc.name}">`;

            return `
            <div class="fl-col fl-node-5da4b42b5b089 fl-col-bg-color fl-col-small" data-node="5da4b42b5b089">
                <div class="fl-col-content fl-node-content">
                    <div class="fl-module fl-module-photo fl-node-5da4b436a3688" data-node="5da4b436a3688">
                        <div class="fl-module-content fl-node-content">
                            <div class="fl-photo fl-photo-align-center" itemscope="" itemtype="https://schema.org/ImageObject">
                                <div class="fl-photo-content fl-photo-img-png">
                                    ${linkHTML}
                                </div>
                                <div class="fl-photo-caption fl-photo-caption-below" itemprop="caption">${postdoc.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('') + 
        // 补充空列
        Array(Math.max(0, 4 - this.data.pastPostdocs.length)).fill(0).map(() => `
            <div class="fl-col fl-node-5da4b42b5b08f fl-col-bg-color fl-col-small" data-node="5da4b42b5b08f">
                <div class="fl-col-content fl-node-content"></div>
            </div>`
        ).join('');

        container.innerHTML = postdocHTML;
        
        console.log(`✅ Past Postdocs content generated (${this.data.pastPostdocs.length} postdocs)`);
    }

    /**
     * 👥 生成Past Visitors列表内容
     */
    generatePastVisitors() {
        const listContainer = document.querySelector('.fl-node-5ca64a1d102f1 .fl-rich-text ul');
        if (!listContainer || !this.data.pastVisitors || this.data.pastVisitors.length === 0) return;

        const visitorsHTML = this.data.pastVisitors.map(visitor => {
            if (visitor.link) {
                return `<li><strong><a href="${visitor.link}" target="${visitor.linkTarget || '_new'}" xlink="href">${visitor.name}</a></strong></li>`;
            } else {
                return `<li><strong>${visitor.name}</strong></li>`;
            }
        }).join('');

        listContainer.innerHTML = visitorsHTML;
            
        console.log(`✅ Past Visitors content generated (${this.data.pastVisitors.length} visitors)`);
    }

    /**
     * 🚀 主生成方法 - 完全动态生成所有内容
     */
    async generateAll() {
        try {
        await this.loadData();
        
        if (!this.data) {
                console.error('❌ No people data available');
            return;
        }

            console.log('🔄 开始动态生成People页面内容...');
            
            this.generateLeadingFaculty();
            this.generateCurrentPhDStudents();
            this.generateCurrentPostdocs(); 
            this.generatePastPhDStudents();
            this.generatePastPostdocs();
            this.generatePastVisitors();
            
            console.log('🎉 People页面所有内容动态生成完成！样式完全保持不变！');
            
        } catch (error) {
            console.error('❌ 生成过程中出错:', error);
        }
    }
}

// 🎯 页面加载完成后自动生成内容
document.addEventListener('DOMContentLoaded', async function() {
    const peopleManager = new PeopleManager();
    await peopleManager.generateAll();
});
