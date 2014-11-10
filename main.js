define(function (require, exports, module) {
    "use strict";

    var CommandManager       = brackets.getModule("command/CommandManager"),
        Commands             = brackets.getModule("command/Commands"),
        DocumentManager      = brackets.getModule("document/DocumentManager"),
        EditorManager        = brackets.getModule("editor/EditorManager"),
        Menus                = brackets.getModule("command/Menus"),
        KeyBindingManager    = brackets.getModule("command/KeyBindingManager"),
        AppInit              = brackets.getModule("utils/AppInit"),
        ExtensionUtils       = brackets.getModule("utils/ExtensionUtils"),
        PreferencesManager   = brackets.getModule("preferences/PreferencesManager"),
        prefs                = PreferencesManager.getExtensionPrefs("gtTab"),
        stateManager         = PreferencesManager.stateManager.getPrefixedSystem("gtTab"),
        tabsShown            = false;
    
    ExtensionUtils.loadStyleSheet(module, "main.less");
    prefs.definePreference("showTabs", "boolean", false);

    var workingFilesCopy;
    var TOGGLE = "gtTabs.toggle";
    var createDocument = "gtTabs.createDocument";
    
    /*
     * Moves the working files list from the sidebar to the top as 
     * a set of tabs
     */
    function showTabs() {
        prefs.set("showTabs", true);
        CommandManager.get(TOGGLE).setChecked(true);

        var gtTabs = $('<div>', {
            'class': 'gt-tabs'
        }).insertBefore($('#editor-holder'));

        $('#working-set-list-container').appendTo(gtTabs);
        $('.working-set-header').remove();
        $('.sidebar-selection-extension').remove();
        $('.gt-tabs .scroller-shadow').remove();
    }
    
    /**
     * Removes the tabs from the top of the window and restores
     * them to the sidebar
     */
    function hideTabs() {
        prefs.set("showTabs", false);
        CommandManager.get(TOGGLE).setChecked(false);
        $('#working-set-list-container').insertBefore($('#project-files-header'));

        if(!$('#working-set-list-container .working-set-header').length){
            $('<div>', {
                'class': 'working-set-header',
                'html': '<span class="working-set-header-title">Working Files</span>'
            }).prependTo($('#working-set-list-container')).show();
        }

        $('.gt-tabs').remove();
    };
    
    /**
     * Hides/shows tabs based on current preference
     */
    function toggleTabs(){
        if($('.gt-tabs').length){ hideTabs(); }else{ showTabs(); }
    };
    
    /*
     * Creates an empty document in the tab bar
     */
    function createDoc(){
        CommandManager.execute(Commands.FILE_NEW_UNTITLED);
    }
    
    /**
     * Runs when Brackets has finished loading
     */
    AppInit.appReady(function(){
        CommandManager.register("Show Tabs", TOGGLE, toggleTabs);
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(TOGGLE);
        workingFilesCopy = $('#working-set-list-container').clone();
        
        CommandManager.register("Create Document", createDocument, createDoc);
        KeyBindingManager.removeBinding("Ctrl-T");
        KeyBindingManager.removeBinding("Cmd-T");
        KeyBindingManager.addBinding(createDocument, "Ctrl-T");
        
        // Grab preference - show tabs if set
        if(prefs.get('showTabs')){
            showTabs();
        }else{
            hideTabs();
        }
		
		setTimeout(function(){
			if($('#editor-holder').hasClass('split-vertical')){
				$('.gt-tabs').addClass('vertical');
			}
		}, 1000);
    });

});
