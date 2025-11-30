/**
 * Ask Max Widget Loader
 * 
 * This is a simple loader script that can be embedded on external sites.
 * 
 * Usage:
 * <script src="https://your-domain.com/widget-loader.js"></script>
 * 
 * Note: This is a simplified version for demonstration. For production use,
 * you would need to build a standalone bundle that includes React and all
 * dependencies, or use an iframe-based approach.
 */

(function() {
  'use strict';

  // Create the Ask Max Widget namespace
  window.AskMaxWidget = window.AskMaxWidget || {};

  /**
   * Initialize the widget
   */
  AskMaxWidget.init = function(options) {
    options = options || {};
    const theme = options.theme || 'light';
    const position = options.position || 'bottom-right';

    console.log('Ask Max Widget initialized', { theme, position });
    
    // For a full implementation, you would:
    // 1. Create an iframe pointing to your widget page
    // 2. Or load React + your components as a bundle
    // 3. Inject the widget into the DOM
    // 4. Handle cross-origin communication if using iframe
    
    console.warn('This is a placeholder. See README for full embed implementation.');
  };

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const script = document.currentScript || document.querySelector('script[src*="widget-loader.js"]');
    if (script && script.hasAttribute('data-auto-init')) {
      const theme = script.getAttribute('data-theme') || 'light';
      AskMaxWidget.init({ theme });
    }
  });
})();
