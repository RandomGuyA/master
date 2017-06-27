<% if $ShowTitle %>
    <h2>$Title</h2>
<% end_if %>
<% if $Photo %>
    <img src="$absoluteBaseURL/assets/SectionBlockImages/_resampled/FitWzgwLDYwXQ/$Photo.Name" pre="$Photo.FileName" style="width:100%; height:auto;"/>
    <img src="$absoluteBaseURL/assets/SectionBlockImages/_resampled/FitWzgwLDYwXQ/$Photo.Name" pre="$Photo.SetSize( 75, 75 ).getAbsoluteURL" style="width:100%; height:auto;"/>
<% end_if %>
