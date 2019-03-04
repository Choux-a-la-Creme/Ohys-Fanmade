const BaseURL = 'https://app.seia.io/Ohys-Fanmade/'
const OriginalURL = 'https://torrents.ohys.net/t/'

const ResolutionPattern = /\d{3,4}x\d{3,4}/

let ViewList = 'new'
let ViewPage = 0
let ViewLast = ''

function appendTable(toAppend) {
  const TorrentTable = document.querySelector('#TorrentTable')

  let newRow = TorrentTable.insertRow(TorrentTable.rows.length)
  let newCells = {
    torrent: newRow.insertCell(0),
    resolution: newRow.insertCell(1),
    download: newRow.insertCell(2)
  }

  newCells.torrent.innerHTML = toAppend.torrent
  newCells.resolution.innerHTML = toAppend.resolution
  newCells.download.innerHTML = toAppend.download
}

function clearTable(toShow) {
  const TorrentTable = document.querySelector('#TorrentTable')

  TorrentTable.innerHTML = toShow || ''
}

function requestData(url) {
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest()

    request.open('GET', url, false)
    request.setRequestHeader(
      'Content-Type', 'application/x-www-form-urlencoded; Charset=utf-8'
    )

    request.send(null)
    if (request.readyState === 4  && request.status === 200) {
      resolve(request.responseText)
    } else {
      reject(request.status)
    }
  })
}

function makeList(options) {
  const SearchInput = document.querySelector('#SearchInput')
  const DirSelector = document.querySelector('#DirSelector')

  if (DirSelector.value !== ViewList) ViewPage = 0

  let RequestURL =
    BaseURL + 'json.php?' +
    'dir=' + (DirSelector.value || ViewList) +
    '&p=' + ViewPage
  if (options.includeInput) RequestURL += ('&q=' + SearchInput.value) || ''
  if (options.clearTable) clearTable('Loading...')

  requestData(RequestURL).then(buffer => {
    if (options.clearTable) clearTable('')
    const data = JSON.parse(buffer)

    if (data[0]) {
      if (ViewLast === data[0].t) {
        alert('End of results! There is no more data to append.')
        return
      }
      ViewLast = data[0].t

      data.forEach(torrent => {
        const TorrentName = torrent.t
        const Resolution = TorrentName.match(ResolutionPattern) || 'Not recognized'
        const DownloadLink = '<a href="' + OriginalURL + torrent.a + '">Download</a>'

        appendTable({
          torrent: TorrentName,
          resolution: Resolution,
          download: DownloadLink
        })
      })
    } else {
      if (options.clearTable) clearTable('No results.')
    }
  })
}

function rebuildList(options) {
  ViewList = options.ViewList || ViewList
  ViewPage = options.ViewPage || ViewPage

  makeList({
    includeInput: false,
    clearTable: true
  })
}

document.addEventListener('DOMContentLoaded', function(event) {
  makeList({
    includeInput: false,
    clearTable: false
  })
})
