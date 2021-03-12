window.addEventListener('load', function() {

    var splitFootnotesAndCitations = function() {
        var originalContainer = document.body.getElementsByClassName('footnotes')
        if (originalContainer.length == 0) {
            return
        }

        var footnoteContainer = document.createElement('div')
        footnoteContainer.setAttribute('class', 'footnotes')
        var footnoteList = document.createElement('ol')
        footnoteContainer.appendChild(footnoteList)

        var citationContainer = document.createElement('div')
        citationContainer.setAttribute('class', 'citations')
        var citationList = document.createElement('ul')
        citationContainer.appendChild(citationList)

        var appendixContainer = document.createElement('div')
        appendixContainer.setAttribute('class', 'appendix')

        var destinationForItemClassName = function(className) {
            switch (className) {
                case 'citation':
                    return citationList
                default:
                    return footnoteList
            }
        }

        // Separate citations and footnotes.
        var originalListItems = originalContainer[0].getElementsByTagName('ol')[0].getElementsByTagName('li')
        for (var i = 0, l = originalListItems.length; i < l; i++) {
            var item = originalListItems[0]
            destinationForItemClassName(item.className).appendChild(item)
        }

        // Sort citation content.
        var citationListItems = citationList.getElementsByTagName('li')
        var citationContent = []
        for (var i = 0, l = citationListItems.length; i < l; i++) {
            citationContent.push(citationListItems[i].innerHTML)
        }
        citationContent.sort();
        // Apply sorted content to citation elements in place.
        for (var i = 0, l = citationListItems.length; i < l; i++) {
            citationListItems[i].innerHTML = citationContent[i]
        }

        // Add footnotes page(s) and citation page(s) to appendix
        var footnoteListItems = footnoteList.getElementsByTagName('li')
        console.log(footnoteListItems.length)
        if (footnoteListItems.length > 0) {
            footnoteList.insertAdjacentHTML('beforebegin', '<h1 style="page-break-before: always">Notes</h1>')
            appendixContainer.appendChild(footnoteContainer)
        }

        if (citationListItems.length > 0) {
            citationList.insertAdjacentHTML('beforebegin', '<h1 style="page-break-before: always">Works Cited</h1>')
            appendixContainer.appendChild(citationContainer)
        }

        originalContainer[0].parentNode.replaceChild(appendixContainer, originalContainer[0])
    }

    var relabelFootnotes = function() {
        var footnoteMarkerlist = document.body.getElementsByClassName('footnote')
        for (var i = 0, l = footnoteMarkerlist.length; i < l; i++) {
            footnoteMarkerlist[i].innerHTML = i + 1
        }
    }

    var $ = function(selector, context) {
        return (context || document).querySelector(selector)
    }

    var $$ = function(selector, context) {
        return (context || document).querySelectorAll(selector)
    }

    // processHighlight
    hljs.initHighlightingOnLoad()

    function processHighlight() {
        var blocks = $$('pre > code')
        for (var i = 0; i < blocks.length; i++) {
            hljs.highlightBlock(blocks[i])
        }
    }

    var processMath = function() {
        var elements = document.body.getElementsByClassName('math')
        for (var i = 0, l = elements.length; i < l; i++) {
            var element = elements[i]
            var math = element.textContent
            var tex = TeXZilla.filterString(math)
            element.innerHTML = tex
        }
    }

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

    var renderSequenceChart = function(elements, theme) {
        for (var i = 0, l = elements.length; i < l; i++) {
            // only get the first one in the array, because the previous one has been removed or replaced
            var element = elements[0]
            var code = element.innerText
            var chart = Diagram.parse(code)

            // Create a new div for displaying chart
            var div_new = document.createElement('div')
            var div_new_id = 'sequencechart_' + theme + '_' + i
            div_new.setAttribute('id', div_new_id)

            // create a temp div and draw on temp div
            var div_tmp = document.createElement('div')
            div_tmp_id = div_new_id + '_tmp_' + i
            div_tmp.setAttribute('id', div_tmp_id)
            element.parentNode.replaceChild(div_tmp, element)

            chart.drawSVG(div_tmp_id, {
                theme: theme
            })
        }
    }

    var processSequencechart = function() {
        var elements = document.getElementsByClassName('sequence hljs')
        var elements_hand = document.getElementsByClassName('sequence_hand hljs')

        renderSequenceChart(elements, 'simple')
        renderSequenceChart(elements_hand, 'hand')
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

    var processTest = function() {
    }

    var processTOC = function () {
        var element = document.getElementsByClassName('TOC') || []
        
        if (element.length != 0){
            var toc = element[0]
            var test = []
        }
    }

    var refresh = function() {
        splitFootnotesAndCitations()
        relabelFootnotes()
        processHighlight()
        processSequencechart()
        processFlowchart()
        processTags()
        processTest()
        processTOC()
    }
    //refresh()
    document.body.addEventListener('ia-writer-change', refresh)
    refresh()
})