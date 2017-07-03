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

            <h1>$Title</h1>
            <div class="birds-nest" id="$URLSegment-$ID" style="position:relative;">
            </div>

    <%if $Container %>
            </div>
        </div>
    <% end_if %>
</div>