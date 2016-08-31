import morph from '../src/morph-svg'

var from = document.querySelector('.from')
var to = document.querySelector('.to')

document.querySelector('.morph').addEventListener('click', function() {
  morph(from, to, {
    duration: 200
  })
})
