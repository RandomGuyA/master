<div class="image-block">
    <% if $ShowTitle %>
        <h2>$Title</h2>
    <% end_if %>
    <% if $Photo %>
        <img src="$Photo.FileName" class="$width $align <% if $border %>border<% end_if %>"
             alt="<% if $alt %>$alt<% else %>$Photo.Name<% end_if %>"/>
        <% if $caption %>
            <div class="caption">$caption</div>
        <% end_if %>
    <% end_if %>
</div>