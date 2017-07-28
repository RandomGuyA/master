;

/** AJAX TRANSITION MANAGER PLUGIN
 *
 *  Author: Byron Morley
 *  updated: 13/03/17
 *  VERSION 2.0
 *
 */

/**     HOW TO USE
 *
 *      Create Folder 'Ajax' in templates
 *
 *      each unique page will require an ajax version and a static template version
 *
 *      Insert the following function into each unique page controller
 *
 *      public function index()
 {

     if (Director::is_ajax()) {
         return $this->renderWith("Ajax/" . $this->ClassName);
     } else {
         return $this->render();
     }
 }
 *
 *
 *
 *      Add this wrapper to each of the ajax pge templates and place the content inside the animation layer
 *
 *      <div class="trans-page-info" class="no-display" dec="<% if $Transition_dec %>$Transition_dec<% else %>slide-right<% end_if %>" inc="<% if $Transition_inc %>$Transition_inc<% else %>slide-left<% end_if %>"></div>
 <div class="animation-layer anim-leave" id="ajax-source">
 </div>
 <div class="animation-layer anim-enter" sort="$Sort">

 <!-- CONTENT GOES HERE -->

 </div>
 *
 *
 *
 *      Add this script to the page template, changing the root value accordingly
 *
 *      <script>

 $(document).ready(function () {
                $('#ajax-plugin-area').ajax_plugin({

                    child_list: $('#ajax-child-list'),
                    ajax_container: 'ajax-container',

                    nav_next_frame: 'next-arrow',
                    nav_prev_frame: 'back-arrow',
                    root: 'atebol-interactive',

                    initialise_javascript_dependencies: function () {

                    }
                });
            });
 </script>
 *
 */


;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'ajax_plugin_version_3.0';

    $.ajax_plugin = function (element, options) {

        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

            //Div Classes and IDs

            ajax_link_class: 'ajax-link',
            ajax_container: 'ajax-container',
            animation_layer: 'animation-layer',
            source_id: 'ajax-source',
            animation_enter: 'anim-enter',
            animation_leave: 'anim-leave',

            plugin_page_class_name: 'Unit',
            birds_nest_class: 'birds-nest',
            //Callbacks

            initialise_javascript_dependencies: null,
            load_page_callback: null,
            page_loaded_callback: null,
            start_animation_callback: null,
            end_animation_callback: null,

            //navigation divs

            child_list: null,
            nav_next_frame: null, //class of the a tag for next nav
            nav_prev_frame: null,  //class of the a tag for next nav

            url: null,
            abs_link: null,
            root: null,

            freezable_content: []

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"


        var $child_list;
        var child_count;
        var $nav_next_frame;
        var $nav_prev_frame;
        var $container;

        var page_loading = false;
        var animate_transition = false;
        var internal_call = false;

        var url_destination;
        var page_list;

        var current_page;
        var url_object;

        var transition_spool = [];
        var previous_page;
        var destination_page;


        //--------------------------------------//
        //       CUSTOM SETTING SETUP
        //--------------------------------------//


        plugin.settings = {}; //initialise empty settings object

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
            element = element;        // reference to the actual DOM element

        //gather individual plugin defaults from the attr tags in the plugin element
        //example attribute: <div data-{plugin name}-opts='{"custom_variable":"value"}' />*
        var meta = $element.data(name + '-opts');


        //--------------------------------------//
        //              CONSTRUCTOR
        //--------------------------------------//

        plugin.init = function () {

            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, meta);
            console.log("initialised plugin " + name);
            $element.css('position', 'relative');
            add_ajax_links();

            $container = $('.' + plugin.settings.ajax_container);
            if (plugin.settings.child_list) {
                setup_child_list();
            } else {
                console.log('no child list found');
            }

            init_ajax_call();
        };

        plugin.get_current_index = function () {
            return current_page;
        };


        //--------------------------------------//
        //              PUBLIC METHODS
        //--------------------------------------//

        /**
         *  these methods can be called like:
         *  plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
         *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
         *  is the element the plugin is attached to;
         */

        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var init_ajax_call = function () {

            if (internal_call) {
                previous_page = destination_page;
            }
            destination_page = get_destination_page();
            if (internal_call) {
                destination_page.previous_page = destination_page;
            }

            var page = (internal_call) ? destination_page : get_root_nest_page(destination_page);

            evaluate_page(page);
            transition_spool.reverse();
            update_and_check_transition_spool();
        };

        var evaluate_page = function (page) {

            var child_page;
            if (page.navigate_to_child != undefined) {
                child_page = page.navigate_to_child;
                page.navigate_to_child = undefined;
            } else {
                child_page = get_first_child(page);
            }

            if (page.nest == 0 || page.nest == undefined) {
                transition_spool.push(create_transition_object(page, $container.attr('id'), true));
            } else if (page.nest == 1) {

                var parent_page = get_parent_page(page);
                var containerID = parent_page.urlSegment + "-" + parent_page.id;
                transition_spool.push(create_transition_object(page, containerID, true));
            }
            if (child_page != undefined) {
                if (child_page.nest == 1) {
                    evaluate_page(child_page);
                }
            }
        };

        var get_parent_page = function (page) {
            var parent_page;
            for (var a = 0; a < page_list.length; a++) {
                var id = page_list[a].id;
                if (id == page.parentID) {
                    parent_page = page_list[a];
                }
            }
            return parent_page;
        };

        var get_root_nest_page = function (page) {

            if (page.parentID != 0) {
                if (page.nest == 1) {
                    var parent_page = get_parent_page(page);
                    parent_page.navigate_to_child = page;
                    return get_root_nest_page(parent_page);
                } else {
                    return page;
                }
            } else {
                return page;
            }
        };

        var update_and_check_transition_spool = function () {

            if (transition_spool.length > 0) {
                var index = transition_spool.length - 1;
                load_url(transition_spool[index]);
                transition_spool.pop();
            }
        };

        var get_destination_page = function () {

            var destination_page;

            var url = internal_call ? url_destination : window.location.href;
            url_object = create_url_object(url);

            for (var a = 0; a < page_list.length; a++) {

                var page = page_list[a];
                if (url_object.path_url == page.url_object.path_url) {

                    destination_page = page;
                    console.log("Page Found");
                    break;
                }
            }
            return destination_page;
        };

        var get_http_url = function (url_object) {

            var http = window.location.href;
            var baseURL = "";
            var root = plugin.settings.root;
            var components = get_url_components(http);

            for (var a = 0; a < components.length; a++) {

                baseURL += components[a] + "/";
                if (components[a] == root) {
                    break;
                }
            }
            return clean_url(baseURL) + url_object.hash_url;
        };

        var get_path_url = function (url_object, hashtag) {

            var pathURL = "";
            var root = plugin.settings.root;
            var components = url_object.components;
            var passed_root = false;
            for (var a = 0; a < components.length; a++) {

                if (passed_root) {
                    pathURL += components[a] + "/";
                }
                if (components[a] == root) {
                    passed_root = true;
                }
            }
            var tag = (hashtag) ? "#" : "/";
            return tag + clean_url(pathURL);

        };

        var get_base_url = function (url_object) {

            var baseURL = "";
            var root = plugin.settings.root;
            var components = url_object.components;

            for (var a = 0; a < components.length; a++) {

                baseURL += components[a] + "/";
                if (components[a] == root) {
                    break;
                }
            }
            return clean_url(baseURL);

        };

        var get_url_components = function (url) {
            url = url.replace("#", "");
            return url.split('/');
        };

        var get_level_above_root_count = function (url_object) {

            var root = plugin.settings.root;
            var url_components = url_object.tempURL.split('/');
            var count = -1;
            for (var a = url_components.length - 1; a >= 0; a--) {
                count++;
                if (url_components[a] == root) {
                    break;
                }
            }
            return count;
        };

        var get_page_object_by_name = function (name) {

            var page = null;

            for (var a = 0; a < page_list.length; a++) {
                if (name == page_list[a].name) {
                    page = page_list[a];
                }
            }
            return page;
        };

        /**
         * starts the ajax call to a specific url
         * @param url
         * @param animate boolean true if you want the animation to take place, false is instant
         */
        var load_url = function (transition_object) {

            var url = transition_object.page.link;
            var animate = transition_object.animate;
            var $container = $('#' + transition_object.containerID);

            console.log("load url:- " + url);
            console.log("container:- " + $container.attr('class'));
            //console.log("animate: " + animate);

            internal_call = false; //reset switch
            load_page_static_callback();
            check_function_and_call(plugin.settings.load_page_callback);

            var $previous_page = $container.find('.' + plugin.settings.animation_layer);
            $previous_page.removeClass('style');

            $.ajax(url)
                .done(function (response) {

                    //console.log(response);
                    check_function_and_call(plugin.settings.page_loaded_callback);
                    page_loaded_static_callback($container, $previous_page, response, animate, url, transition_object.page);

                })
                .fail(function (xhr) {
                    alert('Error: ' + xhr.responseText);
                });
        };

        var transition = function ($previous_page, animate, $container) {

            //Start Animation
            check_function_and_call(plugin.settings.start_animation_callback);
            start_animation_static_callback();

            var $ng_leave = $container.find('.' + plugin.settings.animation_leave);
            var $ng_enter = $container.find('.' + plugin.settings.animation_enter);

            var $animation_layer = $container.find('.' + plugin.settings.animation_layer);
            $animation_layer.addClass('running');
            //console.log("animation layer " + $animation_layer[0]);
            //console.log("enter " + $ng_enter[0]);
            //console.log("leave " + $ng_leave[0]);


            if (animate) { //checking which direction up or down the current menu system the animation is going

                var previous_sort_value = parseInt($previous_page.attr('sort'));
                var current_sort_value = parseInt($ng_enter.attr('sort'));

                //console.log("leave sort value " + previous_sort_value);
                //console.log("enter sort value " + current_sort_value);

                var incremental_animation = $container.find('.trans-page-info').attr('inc');
                var decremental_animation = $container.find('.trans-page-info').attr('dec');
                //console.log("container " +  $container[0]);
                //console.log("trans " +  $container.find('.trans-page-info')[0]);
                //console.log("incremental_animation " + incremental_animation);
                //console.log("decremental_animation " + decremental_animation);

                console.log("previous_sort_value: " + previous_sort_value);
                console.log("current_sort_value: " + current_sort_value);

                var transition_animation = (previous_sort_value < current_sort_value) ? incremental_animation : decremental_animation;
                //console.log("transition_animation " + transition_animation);
                $animation_layer.addClass(transition_animation);

            } else {
                $animation_layer.addClass('no-animation');
            }

            $ng_leave.attr('style', $previous_page.attr('style'));
            $ng_enter.attr('style', $previous_page.attr('style'));
            $ng_leave.html($previous_page.html());

            //end animation listener
            $ng_leave.css_animation_event_listener($animation_layer);


        };


        var setup_child_list = function () {

            $child_list = plugin.settings.child_list.find('li');
            child_count = $child_list.length;
            var $root = plugin.settings.child_list;
            page_list = [];

            $root.find('li').each(function () {

                var $page = $(this);

                page_list.push(create_page_object(
                    $page.attr('pageID'),
                    ($page.index() + 1),
                    $page.attr('parentID'),
                    $page.attr('className'),
                    $page.attr('title'),
                    clean_url($page.attr('link')),
                    $page.attr('nest'),
                    $page.attr('segment')
                ))
            });
            add_nest_container_IDs();
        };

        var add_nest_container_IDs = function () {

            for (var a = 0; a < page_list.length; a++) {
                var page = page_list[a];
                if (page.parentID != 0) {
                    for (var b = 0; b < page_list.length; b++) {

                        var lookup_page = page_list[b];

                        if (page.parentID == lookup_page.id) {
                            page.container = lookup_page.urlSegment + "-" + lookup_page.id;
                        }
                    }
                }
            }
        };

        var container_size_adjustments = function () {
            //add_ajax_links();
            setTimeout(function () {
                var $container = $('.' + plugin.settings.ajax_container);

                $('.animation-layer').css({
                    width: 100 + '%',
                    height: 'auto',// $container.height(),
                    top: 0,
                    left: 0
                })
            }, 100);
        };

        var setup_navigation = function ($container) {

            var page_number = current_page;

            $nav_next_frame = $container.find('.' + plugin.settings.nav_next_frame);
            $nav_prev_frame = $container.find('.' + plugin.settings.nav_prev_frame);

            $nav_next_frame.add_click_navigation();
            $nav_prev_frame.add_click_navigation();

            reset_buttons();

            if (page_number == 0) {
                $nav_prev_frame.css('display', 'none');
            }
            if (page_number == child_count - 1) {
                $nav_next_frame.css('display', 'none');
            }

            $nav_prev_frame.attr('href', $child_list.eq(page_number - 1).attr('link'));
            $nav_next_frame.attr('href', $child_list.eq(page_number + 1).attr('link'));
        };

        var reset_buttons = function () {

            $nav_prev_frame.css('display', 'block');
            $nav_next_frame.css('display', 'block');

        };

        /**
         * gets the the last folder/page name in the url
         * @param url
         * @returns {string}
         */
        var extract_path_name = function (url) {

            //Remove unwanted slash from end of path
            url = clean_url(url);

            return url.substr(url.lastIndexOf('/') + 1);
        };

        /**
         * Removes unwanted slash from end of url
         * @param url
         * @returns {*}
         */
        var clean_url = function (url) {
            //removes extra '/' at the end of the string
            if (url.substr(-1) == "/") {
                url = url.substr(0, url.length - 1);
            }
            return url;
        };

        var initialise_dependencies = function () {

            console.log("add dependencies");

        };


        //--------------------------------------//
        //      STATIC CALLBACKS
        //--------------------------------------//
        /**
         * static callbacks should not be overridden by the user
         */

        var end_animation_static_callback = function () {
            console.log(name + ' - animation finished');
            update_and_check_transition_spool();
            container_size_adjustments();
        };

        var start_animation_static_callback = function () {
            console.log(name + ' - start animation');
        };

        var load_page_static_callback = function () {
            console.log(name + ' - loading page');
            page_loading = true;
        };

        var page_loaded_static_callback = function ($container, $previous_page, response, animate, url, page) {

            console.log(name + ' - page loaded');
            //console.log(response);
            $container.html(response);
            setup_navigation($container);
            add_ajax_links();
            check_function_and_call(plugin.settings.initialise_javascript_dependencies);
            transition($previous_page, animate, $container);
            window.history.pushState("string", "Title", page.url_object.http_url);
            page_loading = false;
        };

        var get_page_ID_from_url = function (url) {

            url = url.replace('#', '/');
            var path = extract_path_name(url);
            var page = get_page_object_by_name(path);

            return page.id;
        };

        var get_first_child = function (page) {

            var child_page;
            for (var a = 0; a < page_list.length; a++) {
                var parentID = page_list[a].parentID;
                if (parentID == page.id && page_list[a].sort == 1) {
                    //console.log(page_list[a].name);
                    child_page = page_list[a];
                }
            }
            return child_page;
        };

        var check_function_and_call = function (function_name) {
            if (function_name) {
                function_name();
            }
        };

        var add_ajax_links = function () {

            $('a').each(function () {

                var $link = $(this);

                if ($link.hasClass('ajax-link')) {
                    if (!$link.hasClass('ajax-active')) {
                        $link.addClass('ajax-active');
                        $link.add_click_function();
                    }
                }
            });
        };

        var adjust_page_position = function (direction) {

            if (direction == 'back' && current_page != 0) {
                current_page--;
            }
            if (direction == 'next' && current_page < child_count) {
                current_page++;
            }
        };

        var set_internal_call = function (url) {
            url_destination = url;
            animate_transition = true;
            internal_call = true;
        };

        var link_is_current_page = function (origin, destination) {
            return (get_page_ID_from_url(origin) == get_page_ID_from_url(destination));
        };


        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//

        /**
         *    Add custom methods to selectors
         *    These are called by adding the function to the selectors
         *    eg: $('.element).bind_event(args);
         */

        $.fn.add_click_function = function (args) {
            return this.each(function () {

                $(this).on('click', function (e) {
                    e.preventDefault();

                    var url = $(this).attr('href');

                    if (!link_is_current_page(window.location.href, url)) {

                        set_internal_call(url);

                        var scrollTop = $('body').scrollTop();

                        if (scrollTop > 0) {
                            $("body").animate({scrollTop: "0px"}, scrollTop / 2, function () {
                                init_ajax_call();
                            });
                        } else {
                            init_ajax_call();
                        }
                    }
                });
            });
        };

        $.fn.add_click_navigation = function (args) {
            return this.each(function () {

                $(this).on('click', function (e) {

                    //console.log("click");
                    e.preventDefault();
                    adjust_page_position($(this).attr('direction'));
                    set_internal_call($(this).attr('href'));
                    init_ajax_call();
                });
            });
        };

        $.fn.css_animation_event_listener = function ($animation_layer) {
            return this.each(function () {

                $(this).bind('oanimationend animationend webkitAnimationEnd', function () {

                    $animation_layer.removeClass('running');
                    $(this).remove();
                    //Start Animation
                    check_function_and_call(plugin.settings.end_animation_callback);
                    end_animation_static_callback();

                });
            });
        };


        //--------------------------------------//
        //              OBJECTS
        //--------------------------------------//

        var create_page_object = function (id, sort, parentID, className, title, link, nest, urlSegment) {

            var page = {};
            page.id = id;
            page.sort = sort;
            page.parentID = parentID;
            page.className = className;
            page.name = extract_path_name(link);
            page.title = title;
            page.link = link;
            page.nest = nest;
            page.urlSegment = urlSegment;
            page.url_object = create_url_object(link);

            return page;
        };

        var create_url_object = function (url) {

            var url_object = {};

            url_object.tempURL = clean_url(url);
            url_object.name = extract_path_name(url_object.tempURL);
            url_object.components = get_url_components(url_object.tempURL);
            url_object.levelsAboveRoot = get_level_above_root_count(url_object);
            url_object.base_url = get_base_url(url_object);
            url_object.path_url = get_path_url(url_object, false);
            url_object.hash_url = get_path_url(url_object, true);
            url_object.http_url = get_http_url(url_object);
            //console.log("base_url " + url_object.base_url);
            //console.log("path_url " + url_object.path_url);
            //console.log("hash_url " + url_object.hash_url);
            //console.log("http_url " + url_object.http_url);

            return url_object;
        };

        var create_transition_object = function (page, containerID, animate) {

            var trans = {};

            trans.animate = animate;
            trans.page = page;
            trans.containerID = containerID;

            return trans;

        };

        //-----------------------------------------
        //				INITIALISATION
        //-----------------------------------------

        plugin.init();
    };
    String.prototype.replaceAt = function (index, character) {
        return this.substr(0, index) + character + this.substr(index + character.length);
    };

    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    /**
     *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
     *  element.data('pluginName').settings.propertyName
     *
     */

    $.fn.ajax_plugin = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.ajax_plugin(this, options);
                $(this).data(name, plugin);
            }
        });
    }

})(jQuery, document, window);;;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'hades_audio_player';
    var ID = 477171;


    $.hades_audio_player = function (element, options) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

            required: true

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance
        var config;


        /*------------ CONTROLS ---------*/

        var volume;
        var sound_on = true;

        /*------------ BUTTONS ---------*/

        var $volume_button;

        /*---------OTHER ELEMENTS ---------*/

        var $volume_hover_pad;
        var $volume_meter;


        //--------------------------------------//
        //       CUSTOM SETTING SETUP
        //--------------------------------------//


        plugin.settings = {}; //initialise empty settings object

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
            element = element;        // reference to the actual DOM element

        //gather individual plugin defaults from the attr tags in the plugin element
        //example attribute: <div data-{plugin name}-opts='{"custom_variable":"value"}' />*
        var meta = $element.data(name + '-opts');


        //--------------------------------------//
        //              CONSTRUCTOR
        //--------------------------------------//

        plugin.init = function () {

            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, meta);
            config = plugin.settings;
            console.log("initialised plugin " + name + " -- " + id);
            _create();



        };


        //--------------------------------------//
        //              PUBLIC METHODS
        //--------------------------------------//

        /**
         *  these methods can be called like:
         *  plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
         *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
         *  is the element the plugin is attached to;
         */

        plugin.foo_public_method = function () {

            // code goes here

        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var _create = function(){
            _setup_variables();
            _bind_events();

        };

        var _update = function(){

        };

        var _bind_events = function () {
            $volume_hover_pad.volume_hover();
            $volume_meter.volume_hover();
            $volume_button.volume_hover();
            $volume_button.volume_click();
        };


        var _setup_variables = function(){
            $volume_hover_pad = $element.find('.volume-hover-pad');
            $volume_meter = $element.find('.volume-meter');
            $volume_button = $element.find('.volume-button');

        };

        var toggle_volume_on_and_off = function($button){

            var $glyph = $button.find('.glyphicon');

            if(sound_on){
                sound_on = false;
                $glyph
                    .removeClass('glyphicon-volume-up')
                    .addClass('glyphicon-volume-off');
            }else{
                sound_on=true;
                $glyph
                    .removeClass('glyphicon-volume-off')
                    .addClass('glyphicon-volume-up');
            }

        };


        //--------------------------------------//
        //    BASIC CONTROLS
        //--------------------------------------//


        var _play = function(){

        };
        var _stop = function(){

        };
        var _next = function(){

        };
        var _prev = function(){

        };
        var _volume_off  = function(){

        };
        var _volume_on = function(){

        };

        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//

        /**
         *    Add custom methods to selectors
         *    These are called by adding the function to the selectors
         *    eg: $('.element).bind_event(args);
         */


        $.fn.volume_hover = function () {

            $(this).each(function () {
                $(this)
                    .on('mouseover', function () {
                        $('.volume-meter').show();
                    })
                    .on('mouseleave', function () {
                        $('.volume-meter').hide();
                    });
            });
        };

        $.fn.volume_click = function(){

            $(this).on('click', function(){
                toggle_volume_on_and_off($(this));


            });
        };

        //-----------------------------------------
        //				INITIALISATION
        //-----------------------------------------

        plugin.init();


    };


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    /**
     *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
     *  element.data('pluginName').settings.propertyName
     *
     */

    $.fn.hades_audio_player = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.hades_audio_player(this, options);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);;;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'app_name';
    var ID = 678401;

    
    $.app_name = function (element, options) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

			required:true

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance

        //--------------------------------------//
        //       CUSTOM SETTING SETUP
        //--------------------------------------//


        plugin.settings = {}; //initialise empty settings object

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
            element = element;        // reference to the actual DOM element

        //gather individual plugin defaults from the attr tags in the plugin element
        //example attribute: <div data-{plugin name}-opts='{"custom_variable":"value"}' />*
        var meta = $element.data(name + '-opts');


        //--------------------------------------//
        //              CONSTRUCTOR
        //--------------------------------------//

        plugin.init = function () {

            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, meta);

            console.log("initialised plugin " + name + " -- " + id);

      


        };


        //--------------------------------------//
        //              PUBLIC METHODS
        //--------------------------------------//

        /**
         *  these methods can be called like:
         *  plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
         *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
         *  is the element the plugin is attached to;
         */

        plugin.foo_public_method = function () {

            // code goes here

        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var private_method = function () {
			
			// code goes here
            

        };

       


        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//
		
		/**
		*	Add custom methods to selectors
		*	These are called by adding the function to the selectors
		*	eg: $('.element).bind_event(args);
		*/
		
        $.fn.bind_event = function (args) {
            
		
			// code goes here
			
        };

        
   

      


        //-----------------------------------------
        //				INITIALISATION
        //-----------------------------------------

        plugin.init();


    };


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    /**
     *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
     *  element.data('pluginName').settings.propertyName
     *
     */

    $.fn.app_name = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.app_name(this, options);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);;;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'image_pre_loader';
    var ID = 312584;

    
    $.image_pre_loader = function (element, options) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

			required:true

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance

        //--------------------------------------//
        //       CUSTOM SETTING SETUP
        //--------------------------------------//


        plugin.settings = {}; //initialise empty settings object

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
            element = element;        // reference to the actual DOM element

        //gather individual plugin defaults from the attr tags in the plugin element
        //example attribute: <div data-{plugin name}-opts='{"custom_variable":"value"}' />*
        var meta = $element.data(name + '-opts');


        //--------------------------------------//
        //              CONSTRUCTOR
        //--------------------------------------//

        plugin.init = function () {

            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, meta);

            console.log("initialised plugin " + name + " -- " + id);


            $(window).on('load', function(){
                console.log('loaded');
                plugin.swap_images();
            });

        };




        //--------------------------------------//
        //              PUBLIC METHODS
        //--------------------------------------//

        /**
         *  these methods can be called like:
         *  plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
         *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
         *  is the element the plugin is attached to;
         */

        plugin.swap_images = function(){

            var $images = $element.find('img');

            $images.each(function(){
                $(this).attr('src', $(this).attr('pre'));
            });
        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var private_method = function () {
			
			// code goes here
            

        };

       


        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//
		
		/**
		*	Add custom methods to selectors
		*	These are called by adding the function to the selectors
		*	eg: $('.element).bind_event(args);
		*/
		
        $.fn.bind_event = function (args) {
            
		
			// code goes here
			
        };

        
   

      


        //-----------------------------------------
        //				INITIALISATION
        //-----------------------------------------

        plugin.init();


    };


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    /**
     *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
     *  element.data('pluginName').settings.propertyName
     *
     */

    $.fn.image_pre_loader = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.image_pre_loader(this, options);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);;/*---------------- PLUGIN -----------------*/

;(function($, doc, win){
    "use strict";

    /*---------------------- GLOBAL VARIABLES ------------------------*/

    var name = 'plugin name';
    var self, $el, opts;

    /*---------------------- INITIALISATION ------------------------*/

    function App(el, opts){

        console.log(name+" activated");

        this.$el = $(el);
        this.$el.data(name, this);

        this.defaults = {

            required:true

        };

        var meta = this.$el.data(name + '-opts');
        this.opts = $.extend(this.defaults,opts, meta);

        this.init();
    }

    App.prototype.init = function() {

        /*---------------------- VARIABLES ------------------------*/

        self = this;
        $el = self.$el;
        opts = self.defaults;


    };

    /*---------------------- BINDING FUNCTIONS ------------------------*/





    /*---------------------- PRIVATE FUNCTIONS ------------------------*/


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    $.fn.plugin_name = function(opts) {
        return this.each(function() {
            new App(this, opts);
        });
    };

})(jQuery, document, window);




