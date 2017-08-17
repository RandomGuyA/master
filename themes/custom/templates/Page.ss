<!-- PAGE -->
<!DOCTYPE html>
<html lang="en">
    <% include Head %>
<body class="$ClassName.LowerCase">

    <% include Header %>
    <% include Banner %>

<div class="main">
    <div id="ajax-plugin-area" class="ajax-container">
        $Layout
    </div>
</div>



    <% include Footer %>


<!-- Ajax Setup -->
<!-- Recursive Site tree - use for mapping the site -->
<ul style="display:none;" id="ajax-child-list">
    <% loop $Menu(1) %>
        <li link="$Link" title="$MenuTitle" parentID="$ParentID" pageID="$ID" className="$ClassName" nest="$Nest" segment="$URLSegment">$MenuTitle
            <% include Menu %>
        </li>
    <% end_loop %>
</ul>
<script>

    $(document).ready(function () {
        $('#ajax-plugin-area').ajax_plugin({

            child_list: $('#ajax-child-list'),
            ajax_container: 'ajax-container',

            nav_next_frame: 'next-arrow',
            nav_prev_frame: 'back-arrow',
            root: 'master',

            initialise_javascript_dependencies: function () {
                var images = $('body').find('img');
                images.each(function(){
                    $(this).attr('src', $(this).attr('pre'));
                });
            }
        });
    });
</script>
</body>
</html>
