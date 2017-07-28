<div class="you-tube-block $width">
    <% if $ShowTitle %>
        <h2>$Title</h2>
    <% end_if %>
    <div class="videoWrapper  <% if $border %>border<% end_if %>">
        <!-- Copy & Pasted from YouTube -->
        <iframe id="video-$ID" width="560" height="349" src="$link" frameborder="0" allowfullscreen></iframe>
    </div>
    <% if $caption %>
        <div class="caption">$caption</div>
    <% end_if %>
</div>