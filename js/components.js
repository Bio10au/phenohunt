/* ================================================
   Component Loader - Header and Footer Management
   Dynamically loads header and footer components
================================================ */

class ComponentLoader {
    constructor() {
        this.basePath = this.getBasePath();
        this.componentsPath = `${this.basePath}/components`;
    }
    
    // Determine the base path based on current page location
    getBasePath() {
        const currentPath = window.location.pathname;
        
        // If we're in a subdirectory (like /pages/), go up one level
        if (currentPath.includes('/pages/')) {
            return '..';
        }
        
        // If we're at the root, use current directory
        return '.';
    }
    
    // Load a component from file
    async loadComponent(componentName) {
        try {
            const response = await fetch(`${this.componentsPath}/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            return null;
        }
    }
    
    // Update navigation links based on current page
    updateNavigation(content, componentName) {
        const currentPath = window.location.pathname;
        const isHomePage = currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '';
        const isContactPage = currentPath.includes('contact.html');
        
        if (componentName === 'header') {
            // Update navigation links based on page context
            if (isContactPage) {
                content = content.replace('href="/"', 'href="../index.html"');
                content = content.replace('href="#features"', 'href="../index.html#features"');
                content = content.replace('href="#how-it-works"', 'href="../index.html#how-it-works"');
                content = content.replace('href="#benefits"', 'href="../index.html#benefits"');
                content = content.replace('href="/pages/contact.html"', 'href="contact.html"');
            } else {
                // Home page - use default paths
                content = content.replace('href="/"', 'href="index.html"');
                content = content.replace('href="/pages/contact.html"', 'href="pages/contact.html"');
            }
        }
        
        if (componentName === 'footer') {
            // Update footer links based on page context
            if (isContactPage) {
                content = content.replace('href="/"', 'href="../index.html"');
                content = content.replace('href="#features"', 'href="../index.html#features"');
                content = content.replace('href="#benefits"', 'href="../index.html#benefits"');
                content = content.replace('href="/pages/contact.html"', 'href="contact.html"');
            } else {
                // Home page - use default paths
                content = content.replace('href="/"', 'href="index.html"');
                content = content.replace('href="/pages/contact.html"', 'href="pages/contact.html"');
            }
        }
        
        return content;
    }
    
    // Insert component into placeholder
    insertComponent(content, placeholderId) {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.outerHTML = content;
            return true;
        } else {
            console.warn(`Placeholder ${placeholderId} not found`);
            return false;
        }
    }
    
    // Load and insert header
    async loadHeader() {
        const content = await this.loadComponent('header');
        if (content) {
            const updatedContent = this.updateNavigation(content, 'header');
            const success = this.insertComponent(updatedContent, 'header-placeholder');
            
            if (success) {
                // Initialize mobile menu after header is loaded
                this.initializeMobileMenu();
                console.log('Header loaded successfully');
            }
        }
    }
    
    // Load and insert footer
    async loadFooter() {
        const content = await this.loadComponent('footer');
        if (content) {
            const updatedContent = this.updateNavigation(content, 'footer');
            const success = this.insertComponent(updatedContent, 'footer-placeholder');
            
            if (success) {
                console.log('Footer loaded successfully');
            }
        }
    }
    
    // Initialize mobile menu functionality
    initializeMobileMenu() {
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuButton && navMenu) {
            // Add mobile menu styles if not already present
            this.addMobileMenuStyles();
            
            mobileMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                navMenu.classList.toggle('mobile-active');
                mobileMenuButton.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    navMenu.classList.remove('mobile-active');
                    mobileMenuButton.classList.remove('active');
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuButton.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('mobile-active');
                    mobileMenuButton.classList.remove('active');
                }
            });
        }
    }
    
    // Add mobile menu styles dynamically
    addMobileMenuStyles() {
        const styleId = 'mobile-menu-styles';
        
        // Check if styles already exist
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .mobile-menu-button {
                display: none;
                flex-direction: column;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                gap: 0.25rem;
            }
            
            .mobile-menu-button span {
                width: 25px;
                height: 3px;
                background: var(--soft-white);
                transition: all 0.3s ease;
                border-radius: 2px;
            }
            
            .mobile-menu-button.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            
            .mobile-menu-button.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-button.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }
            
            @media (max-width: 768px) {
                .mobile-menu-button {
                    display: flex;
                }
                
                .nav-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--gradient-primary);
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                
                .nav-menu.mobile-active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-menu li {
                    margin: 0.5rem 0;
                    text-align: center;
                }
                
                .header-content {
                    position: relative;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Load all components
    async loadAllComponents() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    await loader.loadAllComponents();
    
    // Trigger any page-specific initialization after components are loaded
    const event = new CustomEvent('componentsLoaded');
    document.dispatchEvent(event);
});

// Export for use in other scripts if needed
window.ComponentLoader = ComponentLoader;