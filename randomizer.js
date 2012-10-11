
function shuffle(array) {
  for (var i = 0; i < array.length; i ++) {
    var j = Math.floor(Math.random() * i)
    if (j < array.length && j != i) {
      var tmp = array[i]
      array[i] = array[j]
      array[j] = tmp
    }
  }
}

function animation(duration, callback, callback2) {
  var start = new Date().getTime()
    , interval = setInterval(
        function() {
          var now = new Date().getTime()
            , elapsed = now - start
            , value = Math.min(1, elapsed / duration)
          callback(value)
          if (value >= 1) {
            clearInterval(interval)
            if (callback2) callback2()
          }
        }
      , 1
      )
}

var songHistory = {
      add: function(id) {
        localStorage.setItem('song-' + id, new Date().getTime())
      }
    , remove: function(id) {
        localStorage.removeItem('song-' + id)
      }
    , contains: function(id) {
        return !isNaN(parseInt(localStorage.getItem('song-' + id), 10))
      }
    }


$(function() {

  shuffle(db)

  db.concat([db[0]]).forEach(function(item) {
    var img = new Image(960, 540);
    img.src = 'small-eyecatch/' + item.eyecatch
    $('#songlist').append(img)
  })
  
  var index = -1
    , listElement = $('#songlist')[0]
    , dimElement = $('#overlay')[0]
    , updating = false

  function ResultItem(el) {
    $(el).text('')
    return {
      set: function(title, pattern) {
        $(el).html(title + ' <b>' + pattern + '</b>')
      }
    , reset: function() {
        $(el).text('')
      }
    }
  }

  var resultManager = (function() {
        var results = $('.result').map(function() { return new ResultItem(this) })
          , count = 0
        return {
          add: function(song) {
            results[count].set(song.title, song.pattern)
            count ++
          }
        , full: function() {
            return count == 3
          }
        , empty: function() {
            return count == 0
          }
        , clear: function() {
            for (var i = 0; i < results.length; i ++) results[i].reset()
            count = 0
          }
        }
      })()

  function setPosition(y) {
    listElement.style.top = -(y % (db.length * 540)) + 'px'
  }

  function setOpacity(o) {
    dimElement.style.opacity = o
  }

  setPosition(-640)

  function setIndex(x, callback) {
    var start = index * 540
      , target = x * 540 + Math.pow(Math.random(), 2 / 3) * 480 * (Math.random() >= 0.5 ? 1 : -1)
    index = x
    updating = true
    updateButton()
    animation(
      300
    , function(value) {
        setOpacity(value)
      }
    )
    animation(
      3600
    , function(value) {
        var ease = 1 - Math.pow(1 - value, 2)
        setPosition(start + (target - start) * ease)
      }
    , function() {
        start = target
        target = x * 540
        animation(
          720
        , function(value) {
            var ease = Math.pow(value, 3)
            setPosition(start + (target - start) * ease)
            setOpacity(1 - ease)
          }
        , function() {
            updating = false
            updateButton()
            callback()
          }
        )
      }
    )
  }

  var checkboxes = []

  function createCheckbox(container, key) {
    var el = $('<div class="checkbox"><div class="checkbox-in"></div><div>').appendTo(container)
    el.click(function() {
      el.toggleClass('checked')
      localStorage.setItem('checkbox-' + key, el.hasClass('checked') ? 'yes' : 'no')
      updateButton()
      return false
    })
    if (localStorage.getItem('checkbox-' + key) == 'yes') el.toggleClass('checked')
    return {
      toggle: function(c) {
        if (c === true) el.addClass('checked')
        else if (c === false) el.removeClass('checked')
        else el.toggleClass('checked')
      }
    , isChecked: function() { return el.hasClass('checked') }
    }
  }

  (function() {
    for (var i = 0; i < 12; i ++) {
      checkboxes.push(createCheckbox('#levelpick', 'lv-' + i))
    }
  })()

  function getItem(idx) {
    return db[idx % db.length]
  }

  function accepts(c) {
    return checkboxes[c.difficulty - 1].isChecked() &&
      !songHistory.contains(c.id)
  }

  function updateButton() {
    function setButtonEnabled(enabled) {
      $('#randomize')[enabled ? 'removeClass' : 'addClass']('disabled')
        .get(0).disabled = !enabled
    }
    var enabled = !updating && !resultManager.full() && db.some(accepts)
    $('#l_clear')[resultManager.empty() ? 'addClass' : 'removeClass']('hidden')
    $('#l_clear')[resultManager.full() ? 'addClass' : 'removeClass']('emph')
    setButtonEnabled(enabled)
  }

  function songChanged() {
    var song = getItem(index)
    $('#song-title').text(song.title)
    $('#song-genre').text(song.genre)
    $('#song-artist').text(song.artist)
    $('#song-pattern').text(song.pattern)
    $('#banner').removeClass('hidden')
    $('#song-stars').html(function() {
      var x = ''
      for (var i = 0; i < song.difficulty; i ++) {
        x += '<span class="star"></span>'
      }
      return x
    }())
    setTimeout(function() {
      $('#banner').addClass('hidden')
    }, 4000)
    songHistory.add(song.id)
    resultManager.add(song)
    updateButton()
  }
  
  updateButton()

  $('#randomize').click(function() {
    closeReport()
    for (var i = index + 20; i < index + db.length; i++) {
      var c = getItem(i)
      if (accepts(c)) {
        setIndex(i, songChanged)
        return
      }
    }
    alert('no song to random!')
  })

  $('#l_clear, #b_clear').click(function() {
    resultManager.clear()
    updateButton()
  })

  function closeReport() {
    $('#report-container').addClass('hidden')
  }

  $('#report-close').click(function() {
    closeReport()
  })


  function displayHistory() {
    var html = '<h1>Randomizer History</h1>'
    html += '<table class="songs">'
    db
      .filter(function(song) {
        return songHistory.contains(song.id)
      }).forEach(function(song) {
        html += '<tr><td>' + song.title + '</td>'
          + '<td>' + song.pattern + '</td>'
          + '<td>' + song.difficulty + '</td>'
          + '<td class="clear"><span data-clear="' + song.id + '">Forget</span></td>'
          + '</tr>'
      })
    html += '</table><button data-clearall="1">Clear All</button>'
    $('#report').html(html)
    $('#report-container').removeClass('hidden')
  }

  $('#report').on('click', '[data-clear]', function() {
    songHistory.remove($(this).data('clear'))
    $(this).closest('tr').remove()
    updateButton()
  })
  $('#report').on('click', '[data-clearall]', function() {
    if (confirm('really clear all?')) {
      db.forEach(function(song) {
        songHistory.remove(song.id)
      })
      displayHistory()
      updateButton()
    }
  })

  $('#b_history').click(function() {
    displayHistory()
  })

})







