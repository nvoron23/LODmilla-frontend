/**
 * Created by Attila Gyorok on 2014.07.29..
 */

var resetDrawingCounter = 0, blockResetDrawing = false;
var normalNodeSize = true;

function repaintNodes()
{
    jsPlumbInstance.repaintEverything();
//    $('.resourceNodeBox').each(function() {
//        jsPlumbInstance.repaint(this);
//    });
}

function refreshNodeModelPosition(node, dx, dy)
{
    node.left = node.left - dx / Graph.zoomRatio;
    node.top = node.top - dy / Graph.zoomRatio;
}

function refreshNodeVisiblePosition($node, dx, dy)
{
    var position = $node.position();
    $node.css('left', position['left'] - dx);
    $node.css('top', position['top'] - dy);
}

function moveNode(event)
{
    var $node = $(this);
    if ($node.find('.node-highlight').hasClass('opened')) return;
    var node = Graph.getNode(this.getAttribute('uri'));
    refreshNodeModelPosition(node, mousePositionLeft - event.pageX, mousePositionTop - event.pageY);
}

function moveNodes(event)
{
    var dx = mousePositionLeft - event.pageX;
    var dy = mousePositionTop - event.pageY;

    $('.resourceNodeBox').each(function() {
        var $node = $(this);
        var node = Graph.getNode(this.getAttribute('uri'));
        refreshNodeModelPosition(node, dx, dy);
        refreshNodeVisiblePosition($node, dx, dy);
    });
    mousePositionLeft = event.pageX;
    mousePositionTop = event.pageY;
}

function moveNodesExcept(event, selected)
{
    var dx = mousePositionLeft - event.pageX;
    var dy = mousePositionTop - event.pageY;

    $('.resourceNodeBox').each(function() {
        var $node = $(this);
        if (!$node.find('.node-highlight').hasClass('opened')) return;
        var node = Graph.getNode(this.getAttribute('uri'));

        if (node.resource_id == selected) {
            refreshNodeModelPosition(node, dx, dy);
        }
        else
        {
            refreshNodeModelPosition(node, dx, dy);
            refreshNodeVisiblePosition($node, dx, dy);
        }
    });
    mousePositionLeft = event.pageX;
    mousePositionTop = event.pageY;
}

function zoom(ratio, x, y)
{
    if (blockResetDrawing)
        decideZoom(ratio, x, y);
    else
    {
        jsPlumbInstance.setSuspendDrawing(true);
        blockResetDrawing = true;
        decideZoom(ratio, x, y);
        setTimeout(checkDrawing, 500);
    }
}

function decideZoom(ratio, x, y)
{
    resetDrawingCounter++;
    var cx = $(document).scrollLeft() + window.screen.width/ 2,
        cy = $(document).scrollTop() + window.screen.height / 2;
    if (ratio > 0.699)
    {
        if (!normalNodeSize)
        {
            nodeSizeToNormal();
            normalNodeSize = true;
        }
        applyZoom(cx, cy);
    }
    else if (ratio > 0.2)
    {
        if (normalNodeSize)
        {
            nodeSizeToLabel();
            normalNodeSize = false;
        }
        applyZoom(cx, cy);
    }
    resetDrawingCounter--;
}

function checkDrawing()
{
    if (resetDrawingCounter == 0) {
        jsPlumbInstance.setSuspendDrawing(false, true);
        blockResetDrawing = false;
    }
    if (resetDrawingCounter > 0) setTimeout(checkDrawing, 500);
}

function applyZoom(x, y)
{
    console.log('normal: ' + normalNodeSize +  " - " + Graph.zoomRatio);
    $('.resourceNodeBox').each(function() {
        var vis_node = $(this);
        var position = vis_node.position();
        var node = Graph.getNode(this.getAttribute('uri'));
        vis_node.css('left', x + (node.left - x) * Graph.zoomRatio);
        vis_node.css('top', y  + (node.top - y) * Graph.zoomRatio);
        vis_node.css('width', node.width * Graph.zoomRatio);
        vis_node.css('height', node.height * Graph.zoomRatio);
        if (normalNodeSize)
            vis_node.find('.nodeImage img').css('visibility', 'visible').css('max-height', 75 * Graph.zoomRatio - 36); //perfect
    });
}

function nodeSizeToNormal()
{
    $('.resourceNodeBox').each(function() {
        var vis_node = $(this);

        vis_node.find('.resourceLabel').css('font-size', '12px');
        vis_node.find('.endpointLink').css('visibility', 'visible');
        vis_node.find('.node-button.node-highlight').css('visibility', 'visible');
        vis_node.find('.node-button.node-delete').css('visibility', 'visible');
        vis_node.find('.node-button.node-open').css('visibility', 'visible');
        vis_node.find('.node-button.node-hide').css('visibility', 'visible');
        vis_node.find('.node-connection-source').css('visibility', 'visible');
        vis_node.find('.resourceLabel').css('position', 'relative').css('top','0px')
            .css('max-height','30px');
        vis_node.css('padding', '0.5em').css('padding-top', '2em').css('padding-bottom', '1.5em');
        $('.label').css('visibility','visible');
    });
}

function nodeSizeToLabel()
{
    $('.resourceNodeBox').each(function() {
        var vis_node = $(this);
        vis_node.css('padding', '5px');
        vis_node.find('.nodeImage img');
        vis_node.find('.endpointLink').css('visibility', 'hidden');
        vis_node.find('.node-button.node-highlight').css('visibility', 'hidden');
        vis_node.find('.node-button.node-delete').css('visibility', 'hidden');
        vis_node.find('.node-button.node-open').css('visibility', 'hidden');
        vis_node.find('.node-button.node-hide').css('visibility', 'hidden');
        vis_node.find('.node-connection-source').css('visibility', 'hidden');
        vis_node.find('.resourceLabel').css('position', 'absolute').css('top', '10%')
            .css('max-height','90%').css('font-size', '9px');
        vis_node.find('.nodeImage img').css('visibility', 'hidden');
    });
    $('.label').css('visibility','hidden');
}