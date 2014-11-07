define(function (require, exports, module) {
    "use strict";

    var CommandManager       = brackets.getModule("command/CommandManager"),
        Menus                = brackets.getModule("command/Menus"),
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
	
	function toggleTabs(){
		if($('.gt-tabs').length){ hideTabs(); }else{ showTabs(); }
	};
	
	AppInit.appReady(function(){
		CommandManager.register("Show Tabs", TOGGLE, toggleTabs);
		var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
		menu.addMenuItem(TOGGLE);
		workingFilesCopy = $('#working-set-list-container').clone();
		
		if(prefs.get('showTabs')){
			showTabs();
		}else{
			hideTabs();
		}
	});
    
});