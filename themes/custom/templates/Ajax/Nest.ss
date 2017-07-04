<div class="trans-page-info" class="no-display"
     dec="<% if $Transition_dec %>$Transition_dec<% else %>slide-right<% end_if %>"
     inc="<% if $Transition_inc %>$Transition_inc<% else %>slide-left<% end_if %>"></div>
<div class="animation-layer anim-leave" id="ajax-source">
</div>
<div class="animation-layer anim-enter" sort="$Sort">

    <%if $Container %>
        <div class="typography container">
            <div class="content-container">
    <% end_if %>

            <!-- Persistent Data -->
            <!-- Sub Sections -->

            <% control $Sections %>
                $Me
            <% end_control %>

            <!-- Sudo Menu -->

            <% if $Children %>
                <% loop $Children %>
                    <li><a class="ajax-link $LinkingMode" href="$Link" title="Go to the $Title page">$MenuTitle</a></li>
                <% end_loop %>
            <% end_if %>
            <% loop $Parent.Children %>
                <li><a class="ajax-link $LinkingMode" href="$Link" title="Go to the $Title page">$MenuTitle</a></li>
            <% end_loop %>

            <h1 style="background-color:#069">$Title</h1>
            <div class="birds-nest" id="$URLSegment-$ID" style="position:relative;">
            </div>

    <%if $Container %>
            </div>
        </div>
    <% end_if %>
</div>
<script>
    $(document).ready(function(){
        console.log("birds nest "+ $('.birds-nest').width($('.birds-nest').parent().width()));

    });
</script>