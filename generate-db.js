

(function() {
  var list = []
  var csv = require('ya-csv')
  var reader = csv.createCsvFileReader('TNK3 song database.csv')

  reader.on('data', function(data) {
    list.push(data)
  })
  reader.on('end', function() {
    function lvl(str) {
      return str ? str : null
    }
    processSongList(list.slice(1)
      .map(function(item) {
        return {
          title: item[0]
        , genre: item[1]
        , artist: item[2]
        , visualizer: item[3]
        , bpm: item[4]
        , patterns: {
            LP: lvl(item[5])
          , NM: lvl(item[6])
          , HD: lvl(item[7])
          , MX: lvl(item[8])
          , EX: lvl(item[9])
          }
        }
      })
    )
  })
})()

function processSongList(list) {
  var map = {}
  list.forEach(function(item) { map[item.title] = item })

  function rnm(f, t) {
    map[f] = map[t]
  }

  rnm('AD 2222', 'AD2222')
  rnm('Ask to Wind', 'Ask to Wind (바람에게 부탁해)')
  rnm('Ask to Wind Live Mix', 'Ask to Wind (바람에게 부탁해) (Live Mix)')
  rnm('Brand New Days', 'Brand NEW Days')
  rnm('Break', 'Break!')
  rnm('Come to Me', 'Come to Me (내게로 와)')
  rnm('Desperado Nu Skool Mix', 'Desperado (Nu skool Mix)')
  rnm('Enemy Storm Dark Jungle Remix', 'Enemy Storm (Dark Jungle Mix)')
  rnm("Fallin' in Luv", "Fallin' in LUV")
  rnm('Forever', 'Forever (영원)')
  rnm('Ghost', '유령 (Ghost)')
  rnm('Give Me Five', 'Give Me 5')
  rnm('Hanz Up', 'Hanz Up!')
  rnm('Heartbeat Pt.2', '설레임 Part 2 (Seoleim Part 2)')
  rnm('In My Dream', 'In my Dream')
  rnm('Keys to the World', 'Keys to the world')
  rnm('Kungfu Rider', 'Kung-Fu Rider')
  rnm('La Campanella', 'La Campanella : Nu Rave')
  rnm('Luv Flow', 'Luv Flow (Funky House Mix)')
  rnm('Luv Is True', 'Luv is True')
  rnm('MASAI', 'MASAI (Electro House Mix)')
  rnm('Monoxide', 'MonoXide')
  rnm('My Heart My Soul', 'My Heart, My Soul')
  rnm('Nova', 'Nova (Mr.Funky Remix)')
  rnm('Now A New Day', 'Now a NEW Day')
  rnm('Outlaw Reborn', 'OUT LAW - Reborn')
  rnm('PFW', "Proposed, Flower, Wolf (고백, 꽃, 늑대)")
  rnm('PFW2', "Proposed, Flower, Wolf (고백, 꽃, 늑대) Part 2")
  rnm('Piano Concerto', 'Piano Concerto No.1')
  rnm('Rockstar', 'RockSTAR')
  rnm('Season', 'Season (Warm Mix)')
  rnm('Signalize', 'SigNalize')
  rnm('Sin', 'SIN')
  rnm('Son of Sun', 'SON OF SUN')
  rnm('Step', 'STEP')
  rnm('Stop', 'STOP')
  rnm('Supernova', 'SuperNova')
  rnm('Supersonic Funky Remix', 'SuperSonic (Mr.Funky Dirty Remix)')
  rnm('Supersonic', 'SuperSonic')
  rnm('To You', 'To You (너에게)')
  rnm('Wanna Be Your Lover', 'Wanna Be Your LOVER')
  rnm('Watch You Step', 'Watch Your Step')
  rnm('White Blue', 'WhiteBlue')
  rnm('Xlasher', 'XLASHER')
  rnm('Zet', 'Zet (Mr.Funky Remix)')
  require('fs').writeFileSync('db.js', 'var db = ' + JSON.stringify(
    require('fs').readdirSync('small-eyecatch')
      .filter(function(filename) { return filename != '.DS_Store' })
      .map(function(filename) {
        function diffi(x) {
          var d = parseInt(x)
          if (isNaN(x)) {
            throw new Error('bad difficulty ' + x + ' for ' + filename)
          }
          return d
        }
        var m
        if (!(m = filename.match(/^(.+) (LP|NM|HD|MX|EX)\.jpg$/))) {
          console.log('invalid filename: ' + filename)
          return null
        }
        var musicName = m[1]
          , patternName = m[2]
        if (!map[musicName]) {
          console.log('music does not exist: ' + musicName)
          return null
        }
        var music = map[musicName]
        if (!music.patterns[patternName]) {
          console.log('pattern ' + musicName + ' ' + patternName + ' does not exist')
          return null
        }
        return {
          eyecatch: filename
        , title: music.title
        , artist: music.artist
        , genre: music.genre
        , pattern: patternName
        , difficulty: diffi(music.patterns[patternName])
        , id: filename
        }
      })
  , null, 2
  ), 'utf-8')
}





