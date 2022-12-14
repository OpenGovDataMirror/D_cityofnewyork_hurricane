import Content from './Content'
import App from './App'
import hurricane from './hurricane'

if (hurricane.IS_311) {
  $('head').append('<link rel="stylesheet" href="css/311.css">')
}

new Content(content => {new App(content)})
