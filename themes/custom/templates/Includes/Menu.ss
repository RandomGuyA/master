<% if $Children %>
    <ul>
        <% control $Children %>
            <li link="$Link" title="$MenuTitle" parentID="$ParentID" pageID="$ID" className="$ClassName" nest="$Nest" segment="$URLSegment">$MenuTitle
                <% include Menu %>
            </li>
        <% end_control %>
    </ul>
<% end_if %>