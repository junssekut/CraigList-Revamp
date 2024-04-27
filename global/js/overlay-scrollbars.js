var { 
    OverlayScrollbars, 
    // ScrollbarsHidingPlugin, 
    // SizeObserverPlugin, 
    // ClickScrollPlugin  
} = OverlayScrollbarsGlobal;

const scrollbar = OverlayScrollbars(document.body, {
    scrollbars: {
        theme: 'os-theme-dark'
    }
});