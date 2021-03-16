/* document.addEventListener("DOMContentLoaded", function(){
    document.body.addEventListener('ia-writer-change', function(event) {
        var elements = document.getElementsByClassName('flow')
        for (var i = 0, l = elements.length; i < l; i++) {
            // only get the first one in the array, because the previous one has been removed or replaced
            var element = elements[0]
            var code = element.innerText
            var chart = flowchart.parse(code)

            // Create a new div for displaying chart
            var div_new = document.createElement('div')
            var div_new_id = 'flowchart_' + i
            div_new.setAttribute('id', div_new_id)
            element.parentNode.replaceChild(div_new, element)
            chart.drawSVG(div_new_id,{
                'maxWidth': 10,//ensures the flowcharts fits within a certian width
                //'scale':0.8
            })
        }
    });
}); */

window.addEventListener('load', function() {

    var $ = function(selector, context) {
        return (context || document).querySelector(selector)
    }

    var $$ = function(selector, context) {
        return (context || document).querySelectorAll(selector)
    }

    // processHighlight
    hljs.highlightAll()

/*     function processHighlight() {
        var blocks = $$('pre > code')
        for (var i = 0; i < blocks.length; i++) {
            hljs.highlightBlock(blocks[i])
        }
    } */

    var processFlowchart = function() {
        var elements = document.getElementsByClassName('flow hljs')
        for (var i = 0, l = elements.length; i < l; i++) {
            // only get the first one in the array, because the previous one has been removed or replaced
            var element = elements[0]
            var code = element.innerText
            var chart = flowchart.parse(code)

            // Create a new div for displaying chart
            var div_new = document.createElement('div')
            var div_new_id = 'flowchart_' + i
            div_new.setAttribute('id', div_new_id)
            element.parentNode.replaceChild(div_new, element)
            chart.drawSVG(div_new_id)
        }
    }

    var processTags = function() {
        var element = document.getElementsByTagName('p')[0]
        var title = ''
        var tags = []

        if (element) {
            if (element.innerText.match(/^@\((.*)\)\[.+\]/)) {
                title = element.innerText.match(/\((.*)\)/)
                if (title.length == 2) {
                    title = title[1]
                } else {
                    title = ''
                }

                // Process tags
                tags = element.innerText.match(/\[(.*?)\]/)
                if (tags.length == 2) {
                    tags = tags[1]
                    tags = tags.split('|')
                }

                var p = document.createElement('p')
                p.setAttribute('class', 'note-tags ')

                var code_title = document.createElement('code')
                code_title.setAttribute('class', 'notebook')
                code_title.innerHTML = title
                p.appendChild(code_title)

                for (var i = 0, l = tags.length; i < l; i++) {
                    var code_tag = document.createElement('code')
                    code_tag.innerHTML = tags[i]
                    p.appendChild(document.createTextNode(' '))
                    p.appendChild(code_tag)
                }

                element.parentNode.replaceChild(p, element)
            }
        }
    }

    var refresh = function() {
        //processHighlight()
        processFlowchart()
        processTags()
    }
    //refresh()
    document.body.addEventListener('ia-writer-change', refresh)
    refresh()
})