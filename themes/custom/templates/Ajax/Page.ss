<div class="trans-page-info" class="no-display"
     dec="<% if $Transition_dec %>$Transition_dec<% else %>slide-right<% end_if %>"
     inc="<% if $Transition_inc %>$Transition_inc<% else %>slide-left<% end_if %>"></div>
<div class="animation-layer anim-leave" id="ajax-source">
</div>
<div class="animation-layer anim-enter" sort="$Sort">
    <div class="typography container">
        <div class="content-container js-content">
            <article>
                <h1>$Title</h1>
                <div class="content">$Content</div>

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
            </article>
            $Form
            $CommentsForm
        </div>
    </div>

</div>